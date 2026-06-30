// ============================================================
// GRINGA — LP Revendedor — Apps Script v2
// ============================================================
// O que faz:
//   1. Recebe submit da LP (doPost) e grava na planilha (como antes).
//   2. Empurra cada lead pro CRM Sheraos via webhook /sheets/:slug.
//   3. Detecta a fonte automaticamente (Instagram Pago, Orgânico, Google Ads, etc).
//   4. Marca a coluna "CRM Enviado" com timestamp pra nao duplicar no backfill.
//   5. Menu personalizado na planilha com botoes de sincronizacao manual.
// ============================================================

// ============= CONFIG =============
const SHEET_NAME = 'LANDING PAGE REVENDEDORES';

// CRM Sheraos
const CRM_BASE_URL    = 'https://drosagencia.com.br/crm';
const CRM_ACCOUNT_SLUG = 'gringa-cosm-ticos';
const CRM_WEBHOOK_URL  = CRM_BASE_URL + '/api/webhooks/sheets/' + CRM_ACCOUNT_SLUG;

// Coluna extra que marca quando lead foi enviado pro CRM (criada automaticamente)
const CRM_STATUS_LABEL = 'CRM Enviado';

// Tag fixa que todo lead da LP Revendedor recebe no CRM
const TAG_FIXA = 'lp-revendedor';

// Stage inicial no funil (ajuste se o nome no CRM for outro)
const STAGE_INICIAL = 'Novo';

// ============= COLUNAS DA PLANILHA =============
const COLUMNS = [
  // === DADOS DO FORM ===
  { key: 'timestamp',         label: 'Data/Hora' },
  { key: 'nome',              label: 'Nome' },
  { key: 'whatsapp',          label: 'WhatsApp' },
  { key: 'empresa',           label: 'Empresa' },
  { key: 'cidade',            label: 'Cidade' },
  { key: 'tem_negocio',       label: 'Tem Negocio?' },
  { key: 'pedido_minimo_ok',  label: 'R$1.500 OK?' },
  { key: 'status',            label: 'Status' },
  { key: 'origem',            label: 'Origem' },
  // === ATRIBUICAO UTM ===
  { key: 'utm_source',        label: 'UTM Source' },
  { key: 'utm_medium',        label: 'UTM Medium' },
  { key: 'utm_campaign',      label: 'UTM Campaign' },
  { key: 'utm_content',       label: 'UTM Content' },
  { key: 'utm_term',          label: 'UTM Term' },
  { key: 'utm_id',            label: 'UTM ID' },
  // === CLICK IDs (anuncios) ===
  { key: 'fbclid',            label: 'Facebook (fbclid)' },
  { key: 'gclid',             label: 'Google Ads (gclid)' },
  { key: 'gbraid',            label: 'Google (gbraid)' },
  { key: 'wbraid',            label: 'Google (wbraid)' },
  { key: 'ttclid',            label: 'TikTok (ttclid)' },
  { key: 'msclkid',           label: 'Microsoft (msclkid)' },
  { key: 'li_fat_id',         label: 'LinkedIn (li_fat_id)' },
  { key: 'twclid',            label: 'Twitter/X (twclid)' },
  // === COOKIES DE TRACKING ===
  { key: 'fbp',               label: 'Facebook _fbp' },
  { key: 'fbc',               label: 'Facebook _fbc' },
  { key: 'ga_cid',            label: 'GA Client (_ga)' },
  { key: 'gcl_au',            label: 'Google _gcl_au' },
  // === META PIXEL ===
  { key: 'fb_event_id',       label: 'Meta Event ID' },
  // === ATRIBUICAO DE PAGINA ===
  { key: 'first_referrer',    label: 'First Referrer' },
  { key: 'first_landing_url', label: 'First Landing URL' },
  { key: 'first_visit_at',    label: 'First Visit At' },
  { key: 'current_url',       label: 'Current URL' },
  { key: 'current_referrer',  label: 'Current Referrer' },
  // === BROWSER ===
  { key: 'user_agent',        label: 'User Agent' },
  { key: 'language',          label: 'Language' },
  { key: 'screen',            label: 'Screen Resolution' },
  { key: 'timezone',          label: 'Timezone' },
  { key: 'submit_at',         label: 'Submit At (Cliente)' }
];

// ============= ENDPOINT POST (recebe form do site) =============
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Header — cria se a aba estiver vazia
    if (sheet.getLastRow() === 0) {
      const headers = COLUMNS.map(c => c.label).concat([CRM_STATUS_LABEL]);
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#ff5e4a');
      headerRange.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, headers.length, 140);
    }

    // Garante que a coluna "CRM Enviado" existe (caso planilha antiga)
    garantirColunaCrmStatus_(sheet);

    // Timestamp servidor (horario BR)
    data.timestamp = Utilities.formatDate(
      new Date(),
      'America/Sao_Paulo',
      'dd/MM/yyyy HH:mm:ss'
    );

    // Monta row na ordem das colunas
    const row = COLUMNS.map(c => {
      const v = data[c.key];
      return (v === null || v === undefined) ? '' : String(v);
    });
    row.push(''); // celula vazia da coluna CRM Enviado

    sheet.appendRow(row);
    const rowIndex = sheet.getLastRow();

    // Push pro CRM em try/catch isolado (NUNCA quebra o recebimento da LP)
    try {
      const result = enviarParaCrm_(data);
      const statusCol = colunaCrmStatus_(sheet);
      if (result.ok) {
        const marcador = 'OK ' + result.leadId + ' ' + nowBr_();
        sheet.getRange(rowIndex, statusCol).setValue(marcador);
      } else {
        sheet.getRange(rowIndex, statusCol).setValue('ERRO ' + result.error);
      }
    } catch (crmErr) {
      const statusCol = colunaCrmStatus_(sheet);
      sheet.getRange(rowIndex, statusCol).setValue('ERRO ' + crmErr.toString());
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============= GET (teste pelo browser) =============
function doGet() {
  return ContentService
    .createTextOutput('Gringa LP Revendedor v2 ativo. CRM: ' + CRM_WEBHOOK_URL)
    .setMimeType(ContentService.MimeType.TEXT);
}

// ============= ENVIO PRO CRM =============
function enviarParaCrm_(data) {
  const fonte = detectarFonte_(data);

  // tags = fixa + fonte normalizada pra slug
  const tagFonte = String(fonte).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const tags = [TAG_FIXA, tagFonte].filter(Boolean).join(',');

  // Notas: junta o que nao tem campo direto no CRM
  const linhasNota = [];
  if (data.tem_negocio)      linhasNota.push('Tem negocio: ' + data.tem_negocio);
  if (data.pedido_minimo_ok) linhasNota.push('R$1.500 OK: ' + data.pedido_minimo_ok);
  if (data.status)           linhasNota.push('Status LP: ' + data.status);
  if (data.origem)           linhasNota.push('Origem LP: ' + data.origem);
  if (data.first_referrer)   linhasNota.push('First referrer: ' + data.first_referrer);
  if (data.first_landing_url)linhasNota.push('First landing: ' + data.first_landing_url);
  if (data.first_visit_at)   linhasNota.push('First visit: ' + data.first_visit_at);
  if (data.current_referrer) linhasNota.push('Current referrer: ' + data.current_referrer);
  if (data.fb_event_id)      linhasNota.push('fb_event_id: ' + data.fb_event_id);
  if (data.ga_cid)           linhasNota.push('GA client: ' + data.ga_cid);
  if (data.gcl_au)           linhasNota.push('_gcl_au: ' + data.gcl_au);
  if (data.language)         linhasNota.push('Idioma: ' + data.language);
  if (data.screen)           linhasNota.push('Tela: ' + data.screen);
  if (data.timezone)         linhasNota.push('Timezone: ' + data.timezone);
  if (data.submit_at)        linhasNota.push('Submit (cliente): ' + data.submit_at);

  // Tracking adicionais que nao sao campos diretos do CRM viram nota
  if (data.gbraid)   linhasNota.push('gbraid: '   + data.gbraid);
  if (data.wbraid)   linhasNota.push('wbraid: '   + data.wbraid);
  if (data.ttclid)   linhasNota.push('ttclid: '   + data.ttclid);
  if (data.msclkid)  linhasNota.push('msclkid: '  + data.msclkid);
  if (data.li_fat_id)linhasNota.push('li_fat_id: ' + data.li_fat_id);
  if (data.twclid)   linhasNota.push('twclid: '   + data.twclid);
  if (data.utm_id)   linhasNota.push('utm_id: '   + data.utm_id);

  const payload = {
    // Identificacao
    name:    data.nome     || '',
    phone:   data.whatsapp || '',
    city:    data.cidade   || '',
    empresa: data.empresa  || '',

    // Fonte/Origem
    source:        fonte,
    form_name:     'LP Revendedor',
    source_detail: 'Landing page revendedor — captura via Apps Script',

    // UTM
    utm_source:   data.utm_source   || '',
    utm_medium:   data.utm_medium   || '',
    utm_campaign: data.utm_campaign || '',
    utm_content:  data.utm_content  || '',
    utm_term:     data.utm_term     || '',

    // Click IDs principais (CRM reconhece direto)
    fbclid: data.fbclid || '',
    gclid:  data.gclid  || '',

    // Cookies Meta
    fbp: data.fbp || '',
    fbc: data.fbc || '',

    // Browser/page
    user_agent: data.user_agent || '',
    page_url:   data.current_url || data.first_landing_url || '',

    // Funil
    stage_name: STAGE_INICIAL,
    tags:       tags,

    // Notas (CRM vai concatenar com qualquer campo custom nao mapeado)
    notes: linhasNota.join('\n')
  };

  const response = UrlFetchApp.fetch(CRM_WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    followRedirects: true
  });

  const code = response.getResponseCode();
  const body = response.getContentText();

  if (code >= 200 && code < 300) {
    try {
      const j = JSON.parse(body);
      return { ok: true, leadId: j.leadId, isNew: j.isNew };
    } catch (e) {
      return { ok: true, leadId: '?', isNew: null };
    }
  }
  return { ok: false, error: 'HTTP ' + code + ' ' + body.substring(0, 200) };
}

// ============= DETECTAR FONTE =============
function detectarFonte_(d) {
  const utmMedium = String(d.utm_medium || '').toLowerCase();
  const utmSource = String(d.utm_source || '').toLowerCase();
  const referrer  = String(d.first_referrer || d.current_referrer || '').toLowerCase();

  // Click IDs = anuncio pago (forte sinal)
  if (d.fbclid)                       return 'Instagram/Facebook Pago';
  if (d.gclid || d.gbraid || d.wbraid) return 'Google Ads';
  if (d.ttclid)                       return 'TikTok Pago';
  if (d.msclkid)                      return 'Microsoft Ads';
  if (d.li_fat_id)                    return 'LinkedIn Pago';
  if (d.twclid)                       return 'Twitter/X Pago';

  // UTM medium = pago
  if (utmMedium === 'cpc' || utmMedium === 'paid' || utmMedium.indexOf('paid') >= 0 || utmMedium === 'ppc') {
    if (utmSource.indexOf('insta') >= 0 || utmSource.indexOf('facebook') >= 0 || utmSource.indexOf('meta') >= 0 || utmSource === 'fb' || utmSource === 'ig') {
      return 'Instagram/Facebook Pago';
    }
    if (utmSource.indexOf('google') >= 0) return 'Google Ads';
    if (utmSource.indexOf('tiktok') >= 0) return 'TikTok Pago';
    return 'Pago (' + (utmSource || 'origem desconhecida') + ')';
  }

  // UTM medium = organico
  if (utmMedium === 'organic' || utmMedium === 'social') {
    if (utmSource.indexOf('insta') >= 0)    return 'Instagram Organico';
    if (utmSource.indexOf('facebook') >= 0) return 'Facebook Organico';
    if (utmSource.indexOf('google') >= 0)   return 'Google Organico';
    if (utmSource.indexOf('youtube') >= 0)  return 'YouTube Organico';
    if (utmSource.indexOf('tiktok') >= 0)   return 'TikTok Organico';
    return 'Organico (' + (utmSource || 'origem desconhecida') + ')';
  }

  // Sem UTM, olha o referrer
  if (referrer.indexOf('instagram.com') >= 0) return 'Instagram Organico';
  if (referrer.indexOf('facebook.com') >= 0)  return 'Facebook Organico';
  if (referrer.indexOf('google.') >= 0)       return 'Google Organico';
  if (referrer.indexOf('youtube.com') >= 0)   return 'YouTube';
  if (referrer.indexOf('tiktok.com') >= 0)    return 'TikTok Organico';
  if (referrer.indexOf('linkedin.com') >= 0)  return 'LinkedIn Organico';
  if (referrer.indexOf('whatsapp') >= 0 || referrer.indexOf('wa.me') >= 0) return 'WhatsApp';
  if (referrer.indexOf('bing.com') >= 0)      return 'Bing Organico';

  // Sem referrer = trafego direto
  if (!referrer || referrer === 'direct') return 'Direto';

  return 'Outro';
}

// ============= BACKFILL =============
function sincronizarPendentes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) { SpreadsheetApp.getUi().alert('Aba ' + SHEET_NAME + ' nao encontrada.'); return; }

  garantirColunaCrmStatus_(sheet);
  const statusCol = colunaCrmStatus_(sheet);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) { SpreadsheetApp.getUi().alert('Planilha vazia. Nada a sincronizar.'); return; }

  let enviados = 0, erros = 0, pulados = 0;
  for (let r = 2; r <= lastRow; r++) {
    const statusAtual = String(sheet.getRange(r, statusCol).getValue() || '');
    if (statusAtual.indexOf('OK ') === 0) { pulados++; continue; }

    const data = linhaParaData_(sheet, headers, r);
    if (!data.nome && !data.whatsapp) { pulados++; continue; }

    const result = enviarParaCrm_(data);
    if (result.ok) {
      sheet.getRange(r, statusCol).setValue('OK ' + result.leadId + ' ' + nowBr_());
      enviados++;
    } else {
      sheet.getRange(r, statusCol).setValue('ERRO ' + result.error);
      erros++;
    }
    Utilities.sleep(300); // gentil com o CRM
  }

  SpreadsheetApp.getUi().alert(
    'Sincronizacao concluida\n\n' +
    'Enviados agora: ' + enviados + '\n' +
    'Ja estavam OK (pulados): ' + pulados + '\n' +
    'Erros: ' + erros
  );
}

function reenviarTodos() {
  const ui = SpreadsheetApp.getUi();
  const resp = ui.alert(
    'Reenviar TODOS os leads pro CRM?',
    'Vai limpar a coluna "' + CRM_STATUS_LABEL + '" e tentar reenviar tudo.\nUse so se precisar duplicar/recriar.',
    ui.ButtonSet.YES_NO
  );
  if (resp !== ui.Button.YES) return;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  garantirColunaCrmStatus_(sheet);
  const statusCol = colunaCrmStatus_(sheet);
  const lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    sheet.getRange(2, statusCol, lastRow - 1, 1).clearContent();
  }
  sincronizarPendentes();
}

// ============= MENU PERSONALIZADO =============
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('CRM Sheraos')
    .addItem('Sincronizar leads pendentes', 'sincronizarPendentes')
    .addItem('Reenviar TODOS os leads', 'reenviarTodos')
    .addSeparator()
    .addItem('Testar conexao com o CRM', 'testarConexaoCrm')
    .addToUi();
}

function testarConexaoCrm() {
  const teste = {
    nome: 'Teste Apps Script',
    whatsapp: '+5511999999999',
    cidade: 'Sao Paulo',
    utm_source: 'apps-script-test',
    utm_medium: 'manual',
    timestamp: nowBr_()
  };
  const r = enviarParaCrm_(teste);
  SpreadsheetApp.getUi().alert(
    r.ok
      ? 'Conexao OK\nLead ID: ' + r.leadId
      : 'ERRO\n' + r.error
  );
}

// ============= HELPERS =============
function garantirColunaCrmStatus_(sheet) {
  const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  if (headers.indexOf(CRM_STATUS_LABEL) === -1) {
    const novaCol = sheet.getLastColumn() + 1;
    sheet.getRange(1, novaCol).setValue(CRM_STATUS_LABEL);
    sheet.getRange(1, novaCol).setFontWeight('bold').setBackground('#0a7d39').setFontColor('#ffffff');
    sheet.setColumnWidth(novaCol, 220);
  }
}

function colunaCrmStatus_(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idx = headers.indexOf(CRM_STATUS_LABEL);
  return idx + 1; // 1-based
}

function linhaParaData_(sheet, headers, row) {
  const values = sheet.getRange(row, 1, 1, headers.length).getValues()[0];
  const data = {};
  COLUMNS.forEach(function(c) {
    const idx = headers.indexOf(c.label);
    if (idx >= 0) {
      const v = values[idx];
      data[c.key] = (v === null || v === undefined) ? '' : String(v);
    }
  });
  return data;
}

function nowBr_() {
  return Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM HH:mm');
}
