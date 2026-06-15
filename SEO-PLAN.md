# Plano de SEO Completo — Gringa Cosmético · Programa de Revendedor

> **Documento estratégico** · v1.0 · Junho/2026
> Cliente: Gringa Cosmético · Agência: Sheraos Marketing
> Página alvo: https://revendedor.gringa.ind.br/
> Audiência: farmácias, perfumarias, lojas de presentes, distribuidoras, atacadistas

---

## 1. Resumo Executivo

A landing page de revendedor da Gringa foi construída como uma página de conversão B2B — design forte, copy direta sobre margem (R$ 41,90 de lucro bruto/un) e diferencial competitivo claro (apoio com tráfego pago regional). Faltava toda a camada técnica de SEO: zero schema, zero Open Graph, sem canonical, sem sitemap. Esse documento consolida a auditoria, os fixes aplicados e o roadmap de 12 meses pra captar busca orgânica B2B no setor de cosméticos.

**Mercado:** O setor brasileiro de cosméticos cresce acima de dois dígitos ao ano, com perfumaria e fragrâncias liderando a expansão. Body splash em particular ganhou espaço pela combinação de qualidade + preço acessível ([fonte](https://www.cosmeticosatacado.com/collections/perfumaria-body-splash)).

**Oportunidade competitiva:** A maioria dos fornecedores B2B (Bio Cosméticos, EBC, Revenda de Cosméticos, JCF) ranqueia principalmente pra busca transacional ("body splash atacado", "cosméticos para revenda"). Pouca gente posiciona como **marca proprietária com programa estruturado de revenda + apoio de tráfego pago regional** — esse é o gap que a Gringa pode ocupar.

**Diferencial SEO da Gringa:**
> "A única marca de body splash + creme hidratante com **fragrâncias proprietárias** + **programa de revenda com anúncios pagos regionais** pra impulsionar a venda no ponto físico do parceiro."

---

## 2. Auditoria Técnica On-Page (Antes ❌ / Depois ✅)

### 2.1 Meta Tags

| Item | Antes | Depois |
|---|---|---|
| Title | "Gringa Cosmético · Coloque na sua loja e venda mais" | "Seja Revendedor Gringa Cosmético \| Body Splash + Creme Hidratante para sua Loja" |
| Meta description | Genérica focada em "abastecimento" | Otimizada com keywords B2B + valores (R$18/un, R$41,90 lucro, R$1.500 mínimo) |
| Meta keywords | ❌ | ✅ 12 keywords B2B segmentadas |
| Meta robots | ❌ | ✅ `index, follow, max-image-preview:large` |
| Canonical | ❌ | ✅ `https://revendedor.gringa.ind.br/` |
| theme-color | Cream | Coral marca `#ff5e4a` |

### 2.2 Open Graph + Twitter Card

| Item | Antes | Depois |
|---|---|---|
| og:type | ❌ | ✅ website |
| og:title / description | ❌ | ✅ Focado em revenda + margem |
| og:image | ❌ | ✅ hero-desktop.png (1200×630) |
| og:locale | ❌ | ✅ pt_BR |
| twitter:card | ❌ | ✅ summary_large_image |

**Impacto:** quando vendedor da Gringa compartilhar o link no WhatsApp pra prospect (farmácia/perfumaria), vai aparecer preview rico com foto da modelo + título "Seja Revendedor". Maior CTR vs link pelado.

### 2.3 Structured Data (Schema.org JSON-LD)

Aplicados **7 schemas integrados** via `@graph`:

1. **Organization** — Gringa como entidade marca
2. **WebSite** — declaração SEO do site
3. **Service** — Programa de revenda B2B com BusinessAudience definido (farmácias/perfumarias/etc) + offer R$18/un + minOrder R$1.500
4. **Product** (Body Splash) — AggregateOffer com 4 fragrâncias (Bella, Rose, Delírio, Brisa)
5. **Product** (Creme Hidratante) — AggregateOffer com 4 fragrâncias
6. **FAQPage** — 6 perguntas (incluindo as 4 visíveis + "Qual a margem?" e "Quem pode revender?") aptas a virar Rich Results
7. **BreadcrumbList**

**Validar pós-deploy:**
- https://validator.schema.org/
- https://search.google.com/test/rich-results

### 2.4 Arquivos de Indexação

| Arquivo | Status |
|---|---|
| `/robots.txt` | ✅ Criado |
| `/sitemap.xml` | ✅ Criado com image sitemap |

### 2.5 Headings (Hierarquia)

Estrutura semântica:
- 1× **H1** (hero headline) — "Você coloca Gringa na prateleira. A gente ajuda a levar clientes até sua loja ou distribuidora."
- 6× **H2** (seções: Por que colocar, Linha de produtos, Como funciona, Audiência, FAQ, CTA)
- H3 nos cards e steps

✅ Hierarquia limpa.

### 2.6 Imagens

| Item | Antes | Depois |
|---|---|---|
| Logo alt | "Gringa Cosmético" | "Gringa Cosmético · Body Splash e Creme Hidratante para revenda" |
| Logo width/height | ❌ | ✅ 160×56 (CLS prevention) |
| Logo fetchpriority | ❌ | ✅ `high` |
| Hero | `.png` 4.6MB | ⚠️ **Pendente:** comprimir pra WebP <500KB |

**Pendente:** assets/hero-desktop.png e hero-mobile.png tão com 4.6MB cada — péssimo pro LCP. Converter pra WebP comprimido (Squoosh/ImageOptim) baixaria pra ~400-700KB sem perda visual perceptível.

---

## 3. Pesquisa de Palavras-Chave

### 3.1 Head Terms (alta competição, alto valor B2B)

| Keyword | Intenção | Competição |
|---|---|---|
| fornecedor de cosméticos para revenda | Comercial | Alta |
| cosméticos atacado | Comercial | Alta |
| body splash atacado | Comercial | Média |
| distribuidor de cosméticos | Comercial | Alta |
| atacado de perfumes | Comercial | Alta |
| marca de cosméticos para revender | Comercial | Média |

### 3.2 Long-Tail B2B (golden keywords — alta intenção, baixa concorrência)

Essas são as keywords que vão converter:

- `como ser revendedor de cosméticos`
- `quanto se ganha revendendo body splash`
- `margem de lucro revendendo cosméticos`
- `fornecedor de body splash com fragrância própria`
- `body splash atacado pedido mínimo`
- `cosméticos para revenda em farmácia`
- `cosméticos para perfumaria com margem alta`
- `body splash 200ml atacado preço`
- `creme hidratante perfumado atacado`
- `kit body splash e creme hidratante atacado`
- `marca de cosméticos com apoio de marketing`
- `revender body splash em loja física`
- `fragrância proprietária atacado`
- `indústria de cosméticos para distribuidor`
- `programa de revenda cosméticos`

### 3.3 Keywords de Dor / Problema (informacional)

Pessoas que estão pesquisando porque querem MELHORAR algo — entram no funil em "topo":

- `como escolher fornecedor de cosméticos`
- `como aumentar ticket médio farmácia`
- `produtos com giro alto para perfumaria`
- `o que vende muito em perfumaria pequena`
- `como diferenciar farmácia da concorrência`

### 3.4 Keywords Regionais (depende da área de atendimento)

Quando confirmar área (capital de SP/MG/PR, etc.):
- `fornecedor cosméticos atacado [CIDADE]`
- `distribuidor body splash [REGIÃO]`
- `cosméticos para revenda em [CIDADE]`

---

## 4. Análise de Concorrentes

### 4.1 Concorrentes Diretos (marcas B2B)

| Concorrente | Pontos fortes | Gaps (oportunidade Gringa) |
|---|---|---|
| **Bio Cosméticos Distribuidora** | Catálogo gigante, e-commerce B2B, multimarca | Sem marca proprietária forte, sem apoio de marketing |
| **EBC Cosméticos** | B2B online, descontos progressivos, multimarca | Foco em volume, marca não emocional |
| **Revenda de Cosméticos** | SEO forte, ranqueia "atacado" | Marketplace, não tem marca própria |
| **Distribuidora JCF** | Especialista em maquiagem + perfumaria | Sem programa estruturado de revenda |
| **SBB Distribuidora** | Forte no Insta (B2B social) | Sem landing dedicada, conversão por DM |

### 4.2 Posicionamento competitivo da Gringa

| Atributo | Concorrentes | **Gringa** |
|---|---|---|
| Indústria/marca própria | Maioria revende | ✅ Marca proprietária com fragrância exclusiva |
| Apoio de marketing | ❌ Nenhum | ✅ Investe em anúncios pagos regionais |
| Programa estruturado | ❌ Informal | ✅ Pedido mín R$1.500, margem clara R$41,90 |
| Linha enxuta + focada | ❌ Catálogo gigante | ✅ Body Splash + Creme + Kit |
| Identidade brasileira | ❌ Neutra | ✅ "Feito para o Brasil. Pensado para vender." |

**Conclusão:** Gringa não compete em "catálogo amplo" (perderia) — compete em **marca + suporte + previsibilidade de margem**.

---

## 5. Plano de Conteúdo (Roadmap 12 meses)

A landing atual é forte como conversão. Pra escalar SEO orgânico, precisamos de uma seção `/blog/` ou `/recursos/` com conteúdo que ranqueia pras long-tails da seção 3.2 e 3.3.

### Trimestre 1 (mês 1-3) — Foundation + 6 artigos pilares

- ✅ Auditoria + on-page (este documento)
- ✅ Comprimir imagens (PNG 4.6MB → WebP 400-700KB)
- 📝 **Artigo 1:** "Quanto se ganha revendendo body splash em 2026: cálculo real com margens"
- 📝 **Artigo 2:** "Como escolher fornecedor de cosméticos para sua farmácia/perfumaria (10 critérios)"
- 📝 **Artigo 3:** "Body splash vs perfume: o que vende mais na sua região"
- 📝 **Artigo 4:** "5 produtos com giro alto pra perfumaria pequena vender mais"
- 📝 **Artigo 5:** "Fragrância proprietária vs revenda de marca conhecida: prós e contras"
- 📝 **Artigo 6:** "Como aumentar o ticket médio em farmácia vendendo cosméticos perfumados"
- 🔗 Submeter sitemap no Google Search Console + Bing Webmaster Tools
- 📱 Implementar Google Analytics 4 + Microsoft Clarity

### Trimestre 2 (mês 4-6) — Conteúdo segmentado por nicho + landings verticais

Criar uma landing por tipo de revendedor (cada uma briga por keyword nichada):

- 📄 `/farmacia` — "Cosméticos para revender em farmácia"
- 📄 `/perfumaria` — "Linha exclusiva para perfumaria independente"
- 📄 `/loja-de-presentes` — "Kits perfumados para loja de presentes"
- 📄 `/distribuidor` — "Programa para distribuidoras e atacadistas"

Cada uma com:
- H1 nicho-específico
- Cases reais (depois que tiver depoimentos)
- Faixa de margem específica
- CTA pra orçamento

- 📝 **Artigo 7:** "Pedido mínimo de cosméticos atacado: como funciona e por que existe"
- 📝 **Artigo 8:** "Tráfego pago regional pra ponto físico: o que esperar de retorno"
- 📝 **Artigo 9:** "Fragrâncias mais vendidas no Brasil em 2026 (ranking real)"
- 📝 **Artigo 10:** "Body splash 200ml: como precificar pra vender muito"

### Trimestre 3 (mês 7-9) — Link building + autoridade

- 🔗 Cadastro em diretórios B2B de cosméticos (Beauty Fair, Negócios de Beleza, ABIHPEC)
- 🤝 Guest posts em blogs do nicho:
  - Negócios de Beleza (Beauty Fair)
  - Tray (e-commerce na prática)
  - Sebrae (lojistas pequenos)
- 🎥 Vídeos institucionais curtos (40s cada): "Como funciona ser revendedor Gringa", "Tour pela linha", "Caso real revendedor X"
- ⭐ Coletar depoimentos de 5+ primeiros revendedores
- 📊 Primeiro relatório de progresso

### Trimestre 4 (mês 10-12) — Escala + automação

- 🤖 Calculadora interativa: "Quanto sua loja pode lucrar com Gringa?" (input quantidade → output lucro mensal projetado)
- 📰 Newsletter mensal pra base capturada
- 📝 **Artigos 11-15:** segmentados por dor específica
- 📊 Auditoria de meio termo + ajustes

---

## 6. Estratégia Específica de Tráfego Pago (vincular ao SEO)

A Gringa promete **apoio com anúncios pagos regionais** pros revendedores. Isso pode também trazer ganho SEO indireto:

- Ads no Google e Meta direcionados pra "perto da loja [nome do revendedor]" → quando consumidor pesquisa "body splash perto de mim" + clica no anúncio + vai na loja física → **mais buscas pelo nome da marca** → autoridade de marca aumenta → SEO melhora.

**Ação:** Cada novo revendedor onboarded vira um nó na rede de buscas geo-localizadas. Em 6-12 meses, "gringa cosmético" como busca direta deve crescer significativamente, melhorando organicamente o ranking de outras keywords.

---

## 7. Performance + Monitoramento

### 7.1 Ferramentas a configurar (mês 1)

| Ferramenta | Pra quê | Custo |
|---|---|---|
| Google Search Console | Indexação, queries, posições | Grátis |
| Google Analytics 4 | Tráfego, conversões | Grátis |
| Microsoft Clarity | Heatmaps + session replay | Grátis |
| Bing Webmaster Tools | Indexação Bing | Grátis |
| PageSpeed Insights | Core Web Vitals contínuo | Grátis |
| Meta Pixel (Facebook) | Retargeting + conversion tracking | Grátis |

### 7.2 KPIs B2B

| KPI | Meta 6 meses | Meta 12 meses |
|---|---|---|
| Impressões orgânicas (Search Console) | 8.000/mês | 40.000/mês |
| Cliques orgânicos | 250/mês | 1.800/mês |
| Posição média | <22 | <10 |
| Pedidos de orçamento (form/WhatsApp) | 30/mês | 120/mês |
| Pedidos efetivados (revendedores onboarded) | 8/mês | 30/mês |
| LTV médio por revendedor | R$ 5.000+ | R$ 12.000+ |
| Core Web Vitals (% URLs verdes) | 80% | 100% |
| Buscas branded ("gringa cosmético") | 200/mês | 1.500/mês |

### 7.3 Reuniões + reports

- **Semanal:** check rápido (15min) com vendas — quantos leads/orçamentos
- **Mensal:** report executivo (impressões, cliques, posições, conversões)
- **Trimestral:** revisão estratégica + ajustes
- **Anual:** auditoria completa nova

---

## 8. Fixes Aplicados Agora (Resumo do Commit)

1. ✅ `<title>` reescrito com foco em revendedor + categoria de produto
2. ✅ `meta description` com keywords B2B + valores reais (R$18, R$41,90, R$1.500)
3. ✅ `meta keywords` (12 termos segmentados)
4. ✅ `meta robots` + `googlebot`
5. ✅ Canonical URL
6. ✅ Open Graph completo (8 tags)
7. ✅ Twitter Card (3 tags)
8. ✅ `apple-touch-icon`
9. ✅ `theme-color` coral marca
10. ✅ **JSON-LD com 7 schemas:** Organization, WebSite, Service (com BusinessAudience), Product Body Splash, Product Creme, FAQPage (6 perguntas), BreadcrumbList
11. ✅ Logo alt descritivo + width/height + fetchpriority
12. ✅ `/robots.txt`
13. ✅ `/sitemap.xml` com image sitemap

---

## 9. Pendências do Cliente

### 9.1 Pra atualizar no schema (`Organization.sameAs`)

Adicionar URLs de redes sociais oficiais:
```json
"sameAs": [
  "https://www.instagram.com/gringacosmetico/",
  "https://www.facebook.com/gringacosmetico/",
  "https://www.linkedin.com/company/gringa-cosmetico/",
  "https://www.tiktok.com/@gringacosmetico"
]
```

### 9.2 Pra hospedagem

Confirmar URL final — esse plano assume `https://revendedor.gringa.ind.br/`. Se for outra (ex: `/revendedor/` como subpath em `gringa.ind.br`), preciso ajustar todos os schemas + canonical + sitemap.

### 9.3 Pra otimização imediata

- **Comprimir hero-desktop.png e hero-mobile.png** (4.6MB cada → ideal 400-700KB em WebP)
- **Endereço da indústria** pra adicionar LocalBusiness schema (se aplicável) + Google Business Profile
- **Telefone comercial** pro schema
- **Razão social + CNPJ** pra adicionar em `Organization.legalName` + `Organization.taxID`

---

## 10. Próximas Sprints

### Sprint 1 (esta semana)
- [x] On-page fixes
- [x] robots + sitemap
- [ ] Comprimir imagens
- [ ] Preencher sameAs no Organization
- [ ] Submeter sitemap no Search Console
- [ ] Configurar GA4 + Clarity

### Sprint 2 (próximas 2 semanas)
- [ ] Form de orçamento funcional (Formspree/Web3Forms ou backend próprio)
- [ ] Artigo 1 publicado ("Quanto se ganha revendendo body splash")
- [ ] Validar todos os schemas

### Sprint 3 (mês 1)
- [ ] Artigos 2-3 publicados
- [ ] Landing `/farmacia` ou outro nicho
- [ ] Primeiro relatório baseline

---

## Anexos

### A. Fontes consultadas
- [Fornecedores de cosméticos para revenda — Beauty Fair](https://negociosdebeleza.beautyfair.com.br/fornecedores-de-cosmeticos-para-revenda/)
- [25 melhores fornecedores de cosméticos — Ecommerce na Prática](https://ecommercenapratica.com/blog/fornecedores-de-cosmeticos/)
- [Body Splash atacado — Cosméticos Atacado](https://www.cosmeticosatacado.com/collections/perfumaria-body-splash)
- [15 opções de fornecedor de cosméticos — JivoChat](https://www.jivochat.com.br/blog/vendas/fornecedor-de-cosmeticos-para-revenda.html)

### B. Checklist final pré-publicação
- [ ] Testar Open Graph: https://developers.facebook.com/tools/debug/
- [ ] Testar Twitter Card: https://cards-dev.twitter.com/validator
- [ ] Testar Schema: https://validator.schema.org/
- [ ] Testar Rich Results: https://search.google.com/test/rich-results
- [ ] Testar Mobile-Friendly: https://search.google.com/test/mobile-friendly
- [ ] Testar PageSpeed: https://pagespeed.web.dev/
- [ ] Confirmar `/robots.txt` retorna 200
- [ ] Confirmar `/sitemap.xml` retorna 200
- [ ] Submeter sitemap.xml no Google Search Console
- [ ] Cadastrar no Bing Webmaster Tools

---

**Próxima revisão deste documento:** Setembro/2026 (revisão trimestral)
**Autor original:** Sheraos Marketing
