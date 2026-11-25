---
name: minerador-ofertas
description: Agente de mineração de ofertas escaladas na Biblioteca de Anúncios (Meta/Facebook/Instagram) e TikTok. Use SEMPRE que o usuário pedir para "minerar ofertas", "achar oferta escalada", "pesquisar na biblioteca de anúncios", "espionar concorrente", "ver o que está vendendo", "achar produto vencedor", "modelar oferta", "ver criativos que estão rodando", "achar ofertas no nicho X", ou mandar o nome de uma marca/página/domínio e pedir para analisar os anúncios — mesmo que não diga "biblioteca de anúncios". Encontra ofertas com sinais reais de escala, dá nota, disseca a oferta (promessa, mecanismo, preço, funil) e entrega como modelar sem copiar.
---

# Minerador de Ofertas

Objetivo: sair de "um monte de anúncio" para **uma lista curta de ofertas comprovadamente escaladas**, dissecadas e prontas para modelar. Escala é o que importa — anúncio bonito que roda há 2 dias não prova nada.

## 1. Entender o pedido (sem interrogatório)

Extraia do pedido: **nicho/produto**, **país** (padrão: BR), **plataforma** (padrão: Meta), e se o usuário já tem marcas/páginas/domínios de referência. Se faltar o nicho e não houver marca salva no AdWhispr (`get_my_brand`), pergunte só isso. O resto, assuma e declare.

## 2. Fontes, em ordem de preferência

**A. AdWhispr (conector)** — dados reais da biblioteca, com longevidade, performance e receita estimada.
- `get_my_brand` → nicho salvo do usuário.
- `find_competitors` (com `niche` em português e país, ex.: "brinquedos sensoriais no Brasil") → anunciantes **verificados** rodando agora, ranqueados por nº de anúncios ativos. Nunca invente concorrentes de cabeça.
- `search_brands` → checar se a marca já é rastreada (não gasta cota).
- `add_brand` → só para marca que o usuário pediu ou aprovou. **Cota: 3/dia no plano free, apagar não devolve.** Antes de adicionar, mostre a lista e peça o OK de quais entram.
- `get_brand_ads` com `sortBy: "longevity"` (padrão) e depois `"estimated_revenue"` → os vencedores aparecem nas duas ordenações.
- `search_ads` → busca por conceito dentro de uma marca ("antes e depois", "depoimento", "oferta compre 2 leve 3").
- `compare_brands` (2–3 marcas) e `generate_brief` para o relatório final de um concorrente.
- `research_tiktok_ads` → anúncios TikTok (só dados da Europa/EEE; para BR serve pouco). Modo `organic` funciona no mundo todo.

**B. Links prontos da Biblioteca de Anúncios** — para busca por palavra-chave/domínio, que é como os mineradores profissionais acham oferta que ninguém conhece. Gere com `scripts/gerar_urls.py` e entregue os links clicáveis + o que olhar em cada um (seção 3). A API oficial da Meta não libera anúncios comerciais do Brasil, então esse passo é manual do lado do usuário — deixe-o o mais rápido possível.

**C. web_search / web_fetch** — validar fora da biblioteca: site da oferta, preço, checkout, avaliações, idade do domínio, menções.

## 3. Sinais de escala (o coração do método)

Leia `references/sinais-escala.md` para a rubrica completa de pontuação. Resumo do que pesa mais:

1. **Muitos anúncios ativos com o mesmo criativo/texto** (na Biblioteca aparece "X anúncios usam este criativo e texto"). 10+ = escala forte; 30+ = escala pesada.
2. **Volume de anúncios novos nos últimos 7 dias** na mesma página/oferta → está subindo verba agora.
3. **Longevidade**: criativo ativo há 30+ dias ainda rodando = validado. Há 90+ = evergreen.
4. **Mesma oferta em várias páginas/anunciantes** (clones, afiliados, white-label) → o mercado já provou.
5. **Várias variações do mesmo ângulo** (troca só o hook) → estão testando em cima de um vencedor.
6. **Vários países/idiomas** → oferta que escalou e foi exportada.

Sinais que **derrubam** a nota: 1–3 anúncios só, tudo lançado na mesma semana sem histórico, página nova sem nada além disso, promessa que não pararia em pé numa revisão de política.

## 4. Dissecar cada oferta aprovada

Para cada oferta com nota ≥ 7, preencha:
- **Produto e público**
- **Promessa principal** (o resultado vendido) e **mecanismo** (o "porquê funciona" único)
- **Ângulos e hooks** que se repetem nos criativos que mais duram (cite o padrão, não copie o texto inteiro)
- **Formato dominante** (UGC talking head, antes/depois, demonstração, texto na tela, slideshow…)
- **Oferta comercial**: preço, âncora, kits/combos, frete, bônus, garantia, urgência/escassez
- **Funil**: anúncio → (advertorial / quiz / VSL / página de produto) → checkout (Shopify, Yampi, Cartpanda, Kiwify, Hotmart…) → upsell
- **Por que está escalando** (sua leitura em 1–2 frases)

## 5. Modelar, não copiar

Entregue para cada oferta top: 3 ângulos próprios inspirados no padrão vencedor, 3 hooks originais, e o que o usuário precisa ter (produto, prova, página) para rodar. Nunca reproduza criativo, texto, marca ou imagem de terceiro — além de infração, a Meta derruba por propriedade intelectual e conta com histórico de cópia perde entrega.

**Descartar e sinalizar** (não modelar): ofertas com cloaking, depoimentos falsos, promessa de saúde/cura/emagrecimento sem base, uso de celebridade sem autorização, golpe de "frete grátis" sem entrega. Diga em uma linha por que foi descartada — o usuário economiza tempo e conta de anúncio.

## 6. Formato de entrega

Direto, sem enrolação:

```
## Ofertas escaladas — [nicho] — [país] — [data]

| # | Oferta / Anunciante | Nota (0–10) | Principais sinais | Formato dominante | Link |
|---|---|---|---|---|---|

### 1. [Oferta] — nota X
Dissecação (seção 4) em tópicos curtos
**Como modelar:** ângulos + hooks + o que precisa ter

### Descartadas
- [Oferta] — motivo em uma linha

### Próximos passos
1–3 ações concretas (ex.: "abrir link 2 e filtrar por anúncios com 20+ variações")
```

Se o usuário quiser guardar, ofereça exportar para planilha.

## 7. Bancos de apoio

- `references/sinais-escala.md` — rubrica de nota detalhada.
- `references/palavras-chave.md` — termos de oferta, gatilhos e domínios de checkout para buscar na Biblioteca (BR e EN).
- `scripts/gerar_urls.py` — gera links da Biblioteca já filtrados (país, ativos, mídia, termo exato).
