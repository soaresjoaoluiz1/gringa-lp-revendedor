# Setup Google Apps Script — Gringa LP Revendedor

## 1. Abrir o Apps Script da planilha

1. Planilha: https://docs.google.com/spreadsheets/d/1kM-_XfF6EHLLkMW69z5AE3VmKNL5QC5ZwDH6jkqXQis/edit
2. Menu **Extensões → Apps Script**
3. Apaga o código que tiver lá

## 2. Cola o código abaixo

```javascript
// ============= CONFIG =============
const SHEET_NAME = 'LANDING PAGE REVENDEDORES';

// Ordem das colunas (key bate com o JSON enviado pelo site)
const COLUMNS = [
  // === DADOS DO FORM ===
  { key: 'timestamp', label: 'Data/Hora' },
  { key: 'nome', label: 'Nome' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'cidade', label: 'Cidade' },
  { key: 'tem_negocio', label: 'Tem Negocio?' },
  { key: 'pedido_minimo_ok', label: 'R$1.500 OK?' },
  { key: 'status', label: 'Status' },
  { key: 'origem', label: 'Origem' },
  // === ATRIBUIÇÃO UTM ===
  { key: 'utm_source', label: 'UTM Source' },
  { key: 'utm_medium', label: 'UTM Medium' },
  { key: 'utm_campaign', label: 'UTM Campaign' },
  { key: 'utm_content', label: 'UTM Content' },
  { key: 'utm_term', label: 'UTM Term' },
  { key: 'utm_id', label: 'UTM ID' },
  // === CLICK IDs (anúncios) ===
  { key: 'fbclid', label: 'Facebook (fbclid)' },
  { key: 'gclid', label: 'Google Ads (gclid)' },
  { key: 'gbraid', label: 'Google (gbraid)' },
  { key: 'wbraid', label: 'Google (wbraid)' },
  { key: 'ttclid', label: 'TikTok (ttclid)' },
  { key: 'msclkid', label: 'Microsoft (msclkid)' },
  { key: 'li_fat_id', label: 'LinkedIn (li_fat_id)' },
  { key: 'twclid', label: 'Twitter/X (twclid)' },
  // === COOKIES DE TRACKING ===
  { key: 'fbp', label: 'Facebook _fbp' },
  { key: 'fbc', label: 'Facebook _fbc' },
  { key: 'ga_cid', label: 'GA Client (_ga)' },
  { key: 'gcl_au', label: 'Google _gcl_au' },
  // === META PIXEL ===
  { key: 'fb_event_id', label: 'Meta Event ID' },
  // === ATRIBUIÇÃO DE PÁGINA ===
  { key: 'first_referrer', label: 'First Referrer' },
  { key: 'first_landing_url', label: 'First Landing URL' },
  { key: 'first_visit_at', label: 'First Visit At' },
  { key: 'current_url', label: 'Current URL' },
  { key: 'current_referrer', label: 'Current Referrer' },
  // === BROWSER ===
  { key: 'user_agent', label: 'User Agent' },
  { key: 'language', label: 'Language' },
  { key: 'screen', label: 'Screen Resolution' },
  { key: 'timezone', label: 'Timezone' },
  { key: 'submit_at', label: 'Submit At (Cliente)' }
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
      const headers = COLUMNS.map(c => c.label);
      sheet.appendRow(headers);
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#ff5e4a'); // coral Gringa
      headerRange.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, headers.length, 140);
    }

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

    sheet.appendRow(row);

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
    .createTextOutput('Gringa LP Revendedor · Form endpoint ativo ✓')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

## 3. Salvar (Ctrl+S)

Nome do projeto: **Gringa Leads Revendedor**

## 4. Deploy como Web App

1. **Implementar → Nova implementação**
2. Engrenagem → **App da Web**
3. Configurações:
   - Descrição: `Gringa LP Revendedor v1`
   - **Executar como:** **Eu**
   - **Quem tem acesso:** **Qualquer pessoa** ⚠️ CRÍTICO
4. **Implementar** → autorizar acesso
5. Copia a URL `/exec` e **me passa** aqui no chat

## 5. Antes do primeiro teste

Se a aba `LANDING PAGE REVENDEDORES` já tem coisa nela:
- Seleciona tudo (Ctrl+A no body) → **DEL**
- Próximo lead recria header com 37 colunas

---

## Colunas da planilha

**Form (8):** Data/Hora, Nome, WhatsApp, Cidade, Tem Negocio?, R$1.500 OK?, Status (Qualificado/Nao qualificado), Origem

**UTM (6):** Source, Medium, Campaign, Content, Term, ID

**Click IDs (8):** fbclid, gclid, gbraid, wbraid, ttclid, msclkid, li_fat_id, twclid

**Cookies (4):** _fbp, _fbc, _ga, _gcl_au

**Meta (1):** fb_event_id (dedup com Conversion API se for usar)

**Página (5):** First Referrer, First Landing URL, First Visit At, Current URL, Current Referrer

**Browser (4):** User Agent, Language, Screen, Timezone

**Cliente (1):** Submit At

**Total: 37 colunas**, header com fundo coral `#ff5e4a` da Gringa.

---

## Meta Pixel 4364319423824322 — eventos

| Página | Evento | Quando |
|---|---|---|
| Todas (index, obrigado-sim, obrigado-nao) | `PageView` | Auto |
| index.html | `Lead` (value 100) | No submit do form |
| obrigado-sim.html | `Lead` + **`Lead-Revendedor`** (qualificado, value 100) | No carregamento, com Advanced Matching |
| obrigado-nao.html | `Lead` + **`Rev-Menos1500`** (nao qualificado, value 10) | No carregamento, com Advanced Matching |

**Advanced Matching** envia: fn (primeiro nome), ln (sobrenome), ph (telefone E.164 com +55), ct (cidade), country (br). Facebook hash automático.

**Dedup via Event ID:** submit gera ID único, salva em sessionStorage, obrigado pages usam o mesmo. Evita contagem dupla.

---

## Atualizar código depois

1. Edita código
2. Salva
3. **Implementar → Gerenciar implementações → ✏️ → Nova versão → Implementar**
4. URL **não muda**
