# Relatório Marketplace por região

**Estes dados são da mineração de 24/10/2026, não de uma busca ao vivo.** Este texto é referência para modelar formato (título, preço, foto e descrição). Não é para copiar anúncio de concorrente.

**Fontes (só o que já estava salvo):** `BANCO-MARKETPLACE.csv` (895 anúncios únicos nas 4 regiões), `MANIFESTO.csv` (75 selecionados), os quatro `RESUMO-*.md`, a checagem visual `CHECAGEM.md` (24/10/2026) e as pastas de fotos em `/workspace/movecon/criativos/brutos/marketplace-2026-10-24/`. Não há outra região nesse banco.

**Como li os “melhores”:** entre os 75 selecionados, montei 5 a 10 por região com foto real do bem, no estilo Kebrina (várias fotos do mesmo carro, caminhão ou imóvel — não arte, não render, não uma foto só). Usei o status da checagem visual (**USAR** ou **USAR com ressalva**) e a nota já gravada no manifesto (40% dias no ar + 30% o mesmo vendedor repetindo o modelo + 20% texto/foto igual entre vendedores + 10% qualidade). Motos já tinham sido excluídas na mineração (158 anúncios, motivo `FORA: moto`). Anúncio com risco explícito (promessa de contemplação, “crédito na hora”, compra ou venda de cota/contemplada, “sem entrada”, “negativado”, esconder que é consórcio) entra só na parte de riscos — **RISK, nunca modelo**. Quando um campo não estava no arquivo, está escrito “não informado”.

**Como ler o preço:** o “preço no anúncio” é o que o Marketplace gravou. Em muitos casos esse número é a entrada ou a parcela, não o valor do bem. “Fotos salvas” é a coluna `fotos` do manifesto (as fotos baixadas em 24/10). “Fotos na checagem” é o que passou para a pasta `final/` na revisão visual do mesmo dia.

---

## 1. Vitória da Conquista (BA)

Coletados em 24/10: **213**. Aprovados no filtro: **90** (consórcio/carta: 38). Selecionados: **30** (15 na conta Kebrina e 15 na conta Nicole). Aprovados por tipo: carro 36, imóvel 32, caminhão 20, conferir 2. A checagem visual liberou foto real em 14 anúncios Kebrina e 12 Nicole. O par Kebrina/14 e Nicole/12 é o mesmo caminhão (mesmas 10 fotos) — abaixo entra só uma vez.

### Melhores com foto real do bem (10, por nota)

1. **ENTRADA + PARCELAS | Classic 1.0 2015** — [abrir anúncio](https://www.facebook.com/marketplace/item/1387189466619062/)
   - id `1387189466619062` · Chevrolet Classic preto · carro · **não é consórcio** (venda parcelada; serve só de modelo de formato) · nota 82 · 169 dias no ar
   - Preço no anúncio: R$6,000 · Entrada: R$6.000 · Parcela: não informado no manifesto
   - Vendedor: (nome omitido)
   - Texto salvo: “Entrada a partir de R$6.000 + Parcelas flexíveis”, “no boleto, sem juros”. O anúncio escreve “IMAGEM ILUSTRATIVA”; a checagem classificou as 5 fotos como foto real desse Classic preto.

2. **ENTRADA + PARCELAS | Classic 1.0 2011** — [abrir anúncio](https://www.facebook.com/marketplace/item/1063139013557519/)
   - id `1063139013557519` · Chevrolet Classic cinza · carro · **não é consórcio** (formato) · nota 82 · 169 dias no ar
   - Preço no anúncio: R$5,000 · Entrada: R$5.000 · Parcela: não informado no manifesto
   - Vendedor: (nome omitido)
   - Mesma fórmula de texto do item 1, com entrada R$5.000. Bem diferente (Classic 2011 cinza), coletado pela conta Nicole.

3. **Esse caminhão pode ser seu com parcelamento facilitado!!** — [abrir anúncio](https://www.facebook.com/marketplace/item/2102389820489651/)
   - id `2102389820489651` · VW Accelo/815 carroceria azul · caminhão · **não é consórcio** (formato) · nota 74 · 88 dias no ar
   - Preço no anúncio: R$17,500 · Entrada: R$ 17.500,00 · Parcela: não informado no manifesto (na descrição salva: “PARCELAS NEGOCIÁVEIS A PARTIR DE 600,00”)
   - Vendedor: (nome omitido)
   - Descrição: modelo e ano, alguns opcionais, entrada e parcelas, “não faço trocas”, “Img ilustrativa”. A checagem aponta o mesmo jogo de fotos no anúncio Nicole/12, marcado NAO USAR para não repetir o bem.

4. **Citroen FEEL 1.6 16V FLEX 2019 | PARCELAMENTO** — [abrir anúncio](https://www.facebook.com/marketplace/item/983010550903913/)
   - id `983010550903913` · Citroën C4 Cactus · carro · **consórcio/carta** · nota 72 · 169 dias no ar
   - Preço no anúncio: R$8,500 · Entrada: R$ 8.500 · Parcela: não informado no manifesto
   - Vendedor: (nome omitido)
   - Título fala só em “PARCELAMENTO”; a descrição salva diz “Consórcio com parcelas que cabem no seu bolso e sem juros” e “Entrada a partir de R$ 8.500”.

5. **ENTRADA + PARCELAS | classic 2014** — [abrir anúncio](https://www.facebook.com/marketplace/item/1383994139757866/)
   - id `1383994139757866` · Chevrolet Classic prata · carro · **não é consórcio** (formato) · nota 69 · 61 dias no ar
   - Preço no anúncio: R$6,500 · Entrada no manifesto: R$ 6.500 (texto: "R$6.50") · Parcela: não informado no manifesto
   - Vendedor: (nome omitido)
   - Mesma fórmula dos Classics acima. No texto salvo a entrada aparece como “R$6.50””.

6. **Classic 2009 COM ENTRADA + PARCELAS** — [abrir anúncio](https://www.facebook.com/marketplace/item/1357220729732144/)
   - id `1357220729732144` · Chevrolet Classic 2009 · carro · **não é consórcio** (formato) · nota 69 · 61 dias no ar
   - Preço no anúncio: R$9,000 · Entrada: R$9.000 · Parcela: não informado no manifesto
   - Vendedor: (nome omitido)
   - Mesma fórmula; “Dispenso curiosos” e “IMAGEM ILUSTRATIVA”.

7. **ENTRADA + PARCELAS | Gol 1.6 2011** — [abrir anúncio](https://www.facebook.com/marketplace/item/4328482907413179/)
   - id `4328482907413179` · VW Gol vermelho · carro · **não é consórcio** (formato) · nota 69 · 61 dias no ar
   - Preço no anúncio: R$6,000 · Entrada: R$6.000 · Parcela: não informado no manifesto
   - Vendedor: (nome omitido)
   - Mesma fórmula, trocando o bem para Gol.

8. **Caçamba 24.250!** — [abrir anúncio](https://www.facebook.com/marketplace/item/1235712842109164/)
   - id `1235712842109164` · VW Constellation 24.250 caçamba · caminhão · **não é consórcio** (formato) · nota 65 · 178 dias no ar (o mais antigo deste bloco)
   - Preço no anúncio: R$150,000 · Entrada no manifesto: não informado · Parcela no manifesto: R$ 15.000,00. **Atenção:** a descrição salva trata esse R$ 15.000,00 como entrada (“Entrada apartir de R$ 15.000,00 / Parcelas a combinar”). Os dois estão assim no arquivo; não dá para afirmar qual campo está certo.
   - Vendedor: (nome omitido)

9. **O carro dos seus sonhos está aqui — e com parcelamento que cabe no seu bolso!** — [abrir anúncio](https://www.facebook.com/marketplace/item/1843111339992444/)
   - id `1843111339992444` · Nissan Frontier · carro · **não é consórcio** (formato) · nota 65 · 94 dias no ar
   - Preço no anúncio: R$11,158 · Entrada: R$ 11.158,00 · Parcela: R$ 500,00
   - Vendedor: (nome omitido)
   - Descrição salva começa com “EM BUSCA DA OPORTUNIDADE…” e lista opcionais (ar, couro, 4x4, sensor de ré).

10. **Esse carro pode ser seu de forma parcelada - Vitória da Conquista** — [abrir anúncio](https://www.facebook.com/marketplace/item/1073715015174083/)
    - id `1073715015174083` · Fiat Uno · carro · **não é consórcio** (formato) · nota 64 · 88 dias no ar
    - Preço no anúncio: R$6,000 · Entrada no manifesto: não informado · Parcela no manifesto: R$6.000,00. A descrição salva inverte: “Entrada a partir de: R$6.000,00 / Parcelas negociáveis no boleto”.
    - Vendedor: (nome omitido)
    - Texto: modelo e ano, “parcelamento ideal para quem não está conseguindo financiar”, “Img ilustrativas”.

Dois consórcios com foto real que ficaram logo abaixo da nota destes 10, só para completar o padrão (não entram como “top”): Mercedes-Benz 1518 caçamba, nota 59, id [`28308564782080959`](https://www.facebook.com/marketplace/item/28308564782080959/), título com parcelas e entrada e descrição pedindo para “consultar as opções de consórcio”; e Mercedes-Benz 710 baú, nota 58, id [`1796952704796134`](https://www.facebook.com/marketplace/item/1796952704796134/), título só com o modelo e o ano e descrição “Consórcio sem juros”, parcelas a partir de R$800,00 e entrada a partir de R$18.000,00.

### Padrão comum nesta região

- **Título:** a fórmula que mais se repete e mais pontua é `ENTRADA + PARCELAS | [modelo e ano]`. Variações: `[modelo] COM ENTRADA + PARCELAS` e `Esse [bem] pode ser seu com parcelamento…`. Nos consórcios, o título muitas vezes mostra só o carro ou a palavra “PARCELAMENTO”; “consórcio” aparece na descrição.
- **Preço:** o valor grande do anúncio costuma ser a entrada (R$5.000 a R$17.500 nos itens acima). A parcela ou fica “flexível / a combinar / negociável no boleto”, ou aparece na descrição (por exemplo “a partir de R$600,00”).
- **Fotos:** várias fotos do mesmo bem (5 a 10), carro ou caminhão inteiro, vários ângulos. A checagem teve que borrar placa, pessoa, moto ao fundo e adesivo de loja. Vários textos dizem “imagem ilustrativa” mesmo com foto real de um modelo específico — isso está nos dois lados do arquivo; eu não resolvo a contradição.
- **Descrição:** frase de gancho (“compre agora”, “realize o sonho”) + cidade + “boleto, sem juros” + “entrada a partir de” + “parcelas flexíveis” + uma fila de pontos + “dispenso curiosos” ou pedido de WhatsApp. O mesmo vendedor (Luis Gustavo / Luis Gustavo Santos) repete o texto trocando só o bem e a entrada; por isso a nota sobe no critério de repetição.
- **Tipo de bem que manda neste recorte:** carro popular (Classic, Gol, Uno, Cactus) e caminhão (Accelo, Constellation). Imóvel teve 32 aprovados no filtro, mas não ficou entre os 10 de maior nota com foto real nesta seleção.
- **Atenção:** 8 dos 10 acima são venda parcelada, não consórcio. Dão modelo de formato (título curto, entrada no preço, foto do bem). Não são modelo de oferta de consórcio.

### Riscos encontrados (RISK, nunca modelo)

- **Carta/cota contemplada à venda:** 15 anúncios classificados assim no banco. Exemplos no título: “Invista em Imóvel com Carta Contemplada Já Disponível!” (id [`1575626130752069`](https://www.facebook.com/marketplace/item/1575626130752069/), 129 dias); “Vendo cota de consórcio” (id [`1800934874241472`](https://www.facebook.com/marketplace/item/1800934874241472/), 94 dias).
- **Venda/repasse de cota:** 7. Exemplo no título: “Repasso consórcio em andamento 51% pago 13 mil pago” (id [`897736753135325`](https://www.facebook.com/marketplace/item/897736753135325/), 218 dias).
- **Promessa de crédito imediato:** 4 classificados com esse motivo. Títulos gravados: “Dinheiro no pix” (id [`1151093330597528`](https://www.facebook.com/marketplace/item/1151093330597528/)); “2002 Novo Na hora” (id [`1837203800749531`](https://www.facebook.com/marketplace/item/1837203800749531/)); e dois “Byd pela/na carta de crédito” do mesmo vendedor (ids [`2133392887611424`](https://www.facebook.com/marketplace/item/2133392887611424/) e [`1035792736089423`](https://www.facebook.com/marketplace/item/1035792736089423/)). O motivo é o do banco; nos dois da BYD o título não traz a frase “crédito na hora”.
- **Público negativado/score:** 26 classificados com esse motivo (em vários o título não traz a palavra; a descrição dos descartados não está neste CSV). Nos títulos salvos, aparece por exemplo “Empréstimo para negativado sem burocracia” (id [`3532312846929127`](https://www.facebook.com/marketplace/item/3532312846929127/)) e “Consórcio Honda Disponível para negativados” (id [`1628517014878014`](https://www.facebook.com/marketplace/item/1628517014878014/), este último também marcado `FORA: moto`).
- **“Sem entrada”:** o título “Sem juros sem entrada” (id [`1747186829687843`](https://www.facebook.com/marketplace/item/1747186829687843/), aprovado e não selecionado, imóvel, consórcio=sim) está no banco. Nos selecionados com foto real, o anúncio do Virtus (id [`2086652755531656`](https://www.facebook.com/marketplace/item/2086652755531656/), nota 49, USAR com ressalva) traz na descrição “Sem entrada obrigatória” e “Após contemplação: 51x R$ 1.883,40” — **RISK, não usar como modelo**.
- **Esconder que é consórcio:** padrão frequente no título (modelo + “parcelamento”). Em alguns, como o Cactus acima, a descrição corrige e fala “Consórcio”. Não achei no título dos selecionados agência de venda de leads. Motos fora: 37.

---

## 2. Recife (PE)

Coletados: **239**. Aprovados: **80** (consórcio/carta: 31). Selecionados: **15**. Aprovados por tipo: imóvel 53, carro 13, conferir 7, caminhão 7. Na checagem visual, só **6** dos 15 selecionados tinham foto real aproveitável; 9 foram NAO USAR (arte de consórcio, uma foto só, render, ou foto com motorista).

### Melhores com foto real do bem (5)

Aqui não cheguei a 10: só esses 5 reúnem foto real e ficam fora da lista de risco “sem entrada”.

1. **2011 Vw Vw31260** — [abrir anúncio](https://www.facebook.com/marketplace/item/1419850446494021/)
   - id `1419850446494021` · caminhão VW 31.260 munck · **consórcio/carta** · nota 49 · 162 dias no ar
   - Preço no anúncio: R$3,081 · Entrada: não informado · Parcela: não informado no manifesto
   - Vendedor: (nome omitido)
   - Título só com ano e modelo. Descrição salva: “Consórcio de Caminhão VW31260”, “parcelas que cabem no bolso”, “Carta de crédito alta para utilizar em qualquer lugar do Brasil”. O texto também cita “contemplação por lance ou sorteio”. O banco **não** classificou este anúncio como “promete contemplação”; mesmo assim essa frase não deve virar promessa de contemplação.

2. **2018 Hyundai Outro** — [abrir anúncio](https://www.facebook.com/marketplace/item/1423299649741139/)
   - id `1423299649741139` · Hyundai HR baú · o banco marca tipo=carro e consórcio=sim · nota 34 · 54 dias no ar
   - Preço no anúncio: R$15,000 · Entrada: R$ 15.000,00 · Parcela: a combinar
   - Vendedor: (nome omitido)
   - Título genérico (“Hyundai Outro”). A descrição traz o bem, “Valor total: 125.000,00”, e lista “Financiamos / Carta de crédito / Boleto / Consórcio”, entrada R$15.000,00 e “Parcelas mensais a combinar”.

3. **2020 FIAT ARGO REPASSE** — [abrir anúncio](https://www.facebook.com/marketplace/item/1551618586730389/)
   - id `1551618586730389` · Fiat Argo · carro · **não é consórcio** (formato / repasse de financiamento do veículo, não de cota) · nota 15 · 11 dias no ar
   - Preço no anúncio: R$9,750 · Entrada: R$9.750,00 · Parcela: R$1.625,00 (na descrição: 40x) · a descrição também traz “Venda 53.900.00”
   - Vendedor: (nome omitido)
   - Descrição: ficha do carro + entrada + parcela. “Repasse” aqui é assumir o financiamento do bem, não venda de cota.

4. **2020 Renault Kwid Outsider Completo** — [abrir anúncio](https://www.facebook.com/marketplace/item/28814541118240915/)
   - id `28814541118240915` · Renault Kwid Outsider · carro · **não é consórcio** (formato) · nota 8 · 0 dia no ar em 24/10 (recém-publicado na data da mineração)
   - Preço no anúncio: R$44,990 · Entrada: não informado no manifesto · Parcela: R$ 989,00
   - Vendedor: (nome omitido)
   - Texto: “Com entrada+parcelas a partir de 989,00 / Financiamento até 60x / Entrada em até 24x no cartão”.

5. **2019 Jeep Compass** — [abrir anúncio](https://www.facebook.com/marketplace/item/1440843061320611/)
   - id `1440843061320611` · Jeep Compass · carro · **não é consórcio** (formato / repasse) · nota 7 · 1 dia no ar
   - Preço no anúncio: R$35,000 · Entrada: não informado · Parcela: R$ 2.700,00
   - Vendedor: (nome omitido)
   - Texto: “Repasse do Jeemp compass 2019 flex / Resta 29 parcela de 2.700,00 / Vendo ou troco / Tem que assumir”.

### Padrão comum nesta região

- **Título:** nos anúncios com foto real, o Marketplace muitas vezes gravou só ano + modelo (`2011 Vw Vw31260`, `2018 Hyundai Outro`). A oferta (consórcio, carta, entrada, parcela) fica na descrição. Isso é o contrário de Vitória da Conquista, onde a fórmula “ENTRADA + PARCELAS” vai no título.
- **Preço:** ora é a entrada (R$15.000 no HR), ora um valor que não bate com a parcela (R$3,081 no VW 31.260, parcela não informada no manifesto), ora o valor de venda ou de repasse.
- **Fotos:** quando há foto real, o volume é alto (6 a 11 fotos do mesmo bem). O problema desta praça é o outro lado: os selecionados de maior nota no resumo de 24/10 (caminhão “Adquira seu caminhão parcelado entrada a partir de 10%” e “Consórcio para imóvel”) tinham **uma foto só** ou arte — a checagem mandou NAO USAR. Não use esses como modelo de imagem.
- **Descrição:** no consórcio com foto (caminhão e HR), o texto nomeia o bem, fala em carta ou consórcio e deixa a parcela “a combinar” ou nem informa no manifesto. Nos carros, é ficha + “repasse / assumir parcelas”.
- **Tipo de bem:** o filtro aprovou sobretudo imóvel (53), mas o recorte com foto real dos selecionados é caminhão e carro. Os imóveis selecionados caíram na checagem (uma foto, render) ou no risco “sem entrada”.

### Riscos encontrados (RISK, nunca modelo)

- **“Sem entrada” — anúncio selecionado, foto real, não usar como modelo:** “PARCELAS A PARTIR de R$520 | Pode Financiar Mesmo Sem Entrada” (id [`2002492643774678`](https://www.facebook.com/marketplace/item/2002492643774678/), nota 74, 79 dias, João de Deus, Olinda, 4 fotos de apartamento por dentro, USAR com ressalva). Era o de maior nota da praça. **RISK.**
- **Promessa de contemplação no título (arte, NAO USAR):** “Consórcio de Carros + 50 Contemplações Mensais” (id [`1564961171557510`](https://www.facebook.com/marketplace/item/1564961171557510/), selecionado, 1 arte). **RISK.** Há ainda o aprovado e não selecionado “Consórcio Para Contemplação” (id [`2123528578250949`](https://www.facebook.com/marketplace/item/2123528578250949/)).
- **Carta/cota contemplada à venda:** 16. Exemplos no título: “CONSORCIO CONTEMPLADO” (id [`1661506961668307`](https://www.facebook.com/marketplace/item/1661506961668307/), 169 dias); “Carta de crédito contemplada” (id [`850377250868081`](https://www.facebook.com/marketplace/item/850377250868081/), 162 dias); “CARTA CONTEMPLADA CONSÓRCIO” (id [`2516563158778262`](https://www.facebook.com/marketplace/item/2516563158778262/)).
- **Venda/repasse de cota:** 7. Títulos genéricos no banco (“Consórcio ativo”, “Carta de crédito”).
- **Público negativado/score:** 14 classificados. Títulos que trazem a palavra: “Empréstimo Fácil… – Negativado, CLT, Autônomo” (id [`997307296226185`](https://www.facebook.com/marketplace/item/997307296226185/)); “2010 Ford FIESTA - FACILITAMOS PARA NEGATIVADOS” (id [`1137508202117227`](https://www.facebook.com/marketplace/item/1137508202117227/)).
- **Promessa de crédito imediato / agência de leads:** nenhum anúncio desta praça com esses motivos ou com “agência” ou “leads” no título salvo. Motos fora: **61** (o maior volume das 4 regiões). Também saíram 36 por não ter entrada ou parcela no anúncio e 18 por empréstimo/dinheiro.

---

## 3. Sumaré / Campinas (SP)

Coletados: **252**. Aprovados: **100** (consórcio/carta: 52, o maior teor de consórcio das 4 praças). Selecionados: **15**. Aprovados por tipo: imóvel 54, carro 26, caminhão 11, conferir 8, barco-jet 1. Na checagem, só **6** dos 15 tinham foto real do bem. Os 3 caminhões de maior nota do resumo (76, 76 e 55) eram arte, render ou uma foto só — NAO USAR como modelo de imagem.

### Melhores com foto real do bem (6)

Não há 10 com foto real neste selecionado.

1. **ENTRADA MAIS PARCELAS DE R$999** — [abrir anúncio](https://www.facebook.com/marketplace/item/2946422945826373/)
   - id `2946422945826373` · VW Gol · carro · **não é consórcio** (formato) · nota 57 · 74 dias no ar
   - Preço no anúncio: R$999 · Entrada: não informado no manifesto · Parcela: R$999
   - Vendedor: (nome omitido)
   - Descrição salva é de loja (FESTCAR VEÍCULOS, Rio Claro): ficha do Gol 2011/2012 1.0, “consulte condições”, “financiamento facilitado”, “parcelas sujeitas à análise de crédito”.

2. **ENTRADA MAIS PARCELAS DE 899** — [abrir anúncio](https://www.facebook.com/marketplace/item/1440778854546114/)
   - id `1440778854546114` · Ford Ka · carro · **não é consórcio** (formato) · nota 57 · 74 dias no ar
   - Preço no anúncio: R$899 · Entrada: não informado · Parcela: R$ 899
   - Vendedor: (nome omitido)
   - Mesmo texto de loja do item 1, trocando o bem (Ka 2019/2020). É o critério de repetição do mesmo vendedor.

3. **2022 Chevrolet Onix** — [abrir anúncio](https://www.facebook.com/marketplace/item/2485182815303370/)
   - id `2485182815303370` · Chevrolet Onix · carro · **consórcio/carta** · nota 27 · 40 dias no ar
   - Preço no anúncio: R$850 · Entrada: não informado · Parcela no manifesto: R$850 (campo preço do anúncio)
   - Vendedor (nome omitido)
   - Título só com ano e modelo. Descrição: “Consórcio - Fábrica Chevrolet / Sem juros / Aceitamos veículo como troca / taxa isenta”.

4. **2008 Entrada R$5.000 + Parcelas trabalhar registrado/habilitado** — [abrir anúncio](https://www.facebook.com/marketplace/item/1639605590888605/)
   - id `1639605590888605` · VW Gol · carro · **não é consórcio** (formato / financiamento bancário) · nota 17 · 15 dias no ar
   - Preço no anúncio: R$5,000 · Entrada: R$5.000 · Parcela no manifesto: R$25.000 (a descrição salva trata R$25.000 como valor à vista: “Entrada R$5.000 + parcelas / R$25.000 a vista”)
   - Vendedor: (nome omitido)
   - Texto: “Financiamento Bancário / Necessário: Trabalhar Registrado / Ser habilitado”.

5. **ENTRADA + PARCELAS** — [abrir anúncio](https://www.facebook.com/marketplace/item/1775259163964434/)
   - id `1775259163964434` · Chevrolet Montana · carro · **não é consórcio** (formato) · nota 11 · 2 dias no ar
   - Preço no anúncio: R$10,000 · Entrada: não informado · Parcela: não informado no manifesto
   - Vendedor: (nome omitido)
   - Descrição: ficha da Montana 1.8 2005, documentação, “ótima oportunidade”. A parcela não aparece no trecho salvo.

6. **2010 Hyundai i30** — [abrir anúncio](https://www.facebook.com/marketplace/item/1824901808544263/)
   - id `1824901808544263` · Hyundai i30 · carro · **não é consórcio** (formato) · nota 8 · 1 dia no ar
   - Preço no anúncio: R$10,000 · Entrada: não informado · Parcela: R$ 1400
   - Vendedor: (nome omitido)
   - Descrição salva é curta: “Entrada + Parcelas 1400”.

### Padrão comum nesta região

- **Título:** nos carros com foto real, a fórmula que pontua é `ENTRADA MAIS PARCELAS DE R$[valor]` ou `ENTRADA + PARCELAS`, às vezes com o valor da parcela no próprio título (R$999, R$899). O consórcio com foto real (Onix) esconde a palavra no título e a coloca na descrição.
- **Os de maior nota desta praça não têm foto real.** Três selecionados de caminhão, todos com consórcio=sim, ficaram com nota 76, 76 e 55 e **não entram como modelo de imagem**:
  - “ATENÇÃO - Crédito p/ CAMINHÃO (SEM JUROS)” — id [`2260299607711080`](https://www.facebook.com/marketplace/item/2260299607711080/), 158 dias, parcela no manifesto R$ 2.864,68
  - “IMPERDÍVEL - Crédito para seu MAIS NOVO CAMINHÃO” — id [`1680655656537761`](https://www.facebook.com/marketplace/item/1680655656537761/), 103 dias, parcela R$ 3.270,00
  - “ATENÇÃO - Seu NOVO Caminhão agora mais FÁCIL e SEM JUROS” — id [`1408937614719218`](https://www.facebook.com/marketplace/item/1408937614719218/), 43 dias, parcela R$ 2.239,58 (108x)
  A checagem: arte, render ou imagem de imprensa, uma imagem só. O padrão de título (emoji + ATENÇÃO/IMPERDÍVEL + “crédito para caminhão” + “sem juros”) é o que mais durou nesta praça, mas a foto não é o estilo Kebrina.
- **Preço:** nos dois de maior nota com foto, o preço do anúncio é a parcela (R$999 / R$899), não o valor do carro.
- **Fotos reais:** poucas (3 a 7), do carro em pátio ou loja. A checagem achou fundo de revenda e capa de placa.
- **Descrição:** ou ficha de loja com endereço e “análise de crédito”, ou “Consórcio - Fábrica Chevrolet”, ou uma linha só (“Entrada + Parcelas 1400”).
- **Tipo de bem:** o filtro aprovou sobretudo imóvel, mas o selecionado com foto real é 100% carro. Caminhão aparece com força no texto de “crédito”, sem foto real aproveitável neste lote.

### Riscos encontrados (RISK, nunca modelo)

- **“Sem entrada” — anúncio selecionado, não usar:** “Sua Chance de ter seu Caminhão sem entrada.” (id [`4670311183294368`](https://www.facebook.com/marketplace/item/4670311183294368/), nota 48, consórcio=sim). A checagem ainda classificou as imagens como NAO USAR (mesmo VW Meteor repetido + renders, junto com as pastas S10 e S14). **RISK.**
- **Promete contemplação:** 1 classificado com esse motivo: “Cota de Consórcio Embracom” (id [`2371972609875757`](https://www.facebook.com/marketplace/item/2371972609875757/), 10 dias, preço no anúncio R$7,500). **RISK.**
- **Promessa de crédito imediato:** 3. Um título visível: “Dinheiro na hora chama” (id [`2195742157661655`](https://www.facebook.com/marketplace/item/2195742157661655/), 103 dias). Os outros dois títulos gravados com esse motivo são “Entrada + Parcelas Acessiveis” (id [`1056307930108706`](https://www.facebook.com/marketplace/item/1056307930108706/)) e “3 quartos 2 banheiros – Casa” (id [`1486851533130256`](https://www.facebook.com/marketplace/item/1486851533130256/)) — o motivo é do banco; o título não traz a frase “crédito na hora”.
- **Carta/cota contemplada à venda:** **34** (o segundo maior volume das 4 praças). Exemplo no título: “Carta de Consórcio Contemplada” (id [`1958723288087277`](https://www.facebook.com/marketplace/item/1958723288087277/), 172 dias).
- **Venda/repasse de cota:** 6. Exemplo: “Vendo consórcio em andamento Bradesco” (id [`1322427269302566`](https://www.facebook.com/marketplace/item/1322427269302566/), 134 dias).
- **Público negativado/score:** 22 classificados. Títulos que trazem a palavra: “Crédito para negativado” (id [`1512200806733204`](https://www.facebook.com/marketplace/item/1512200806733204/), 94 dias); “AUTÔNOMOS E NEGATIVADOS, COM ENTRADA ACESSÍVEL E PARCELAS SEM JUROS.” (id [`1861162458183034`](https://www.facebook.com/marketplace/item/1861162458183034/), 62 dias).
- **“Sem entrada” em aprovado não selecionado:** “Vende se terreno sem entrada só parcelas…” (id [`1804112167569136`](https://www.facebook.com/marketplace/item/1804112167569136/)). Agência ou leads: nenhum título salvo. Motos fora: 36.

---

## 4. Laguna (SC) — raio: Tubarão, Imbituba, Criciúma

Coletados: **191**. Aprovados: **59** (consórcio/carta: 29). Selecionados: **15**. Aprovados por tipo: imóvel 44, carro 13, conferir 2 (não houve caminhão aprovado nesta praça). A checagem liberou foto real em 11 dos 15. Um desses 11 tem risco explícito (“sem entrada” + linguagem de contemplação) e sai da lista de modelos — fica só em riscos. Sobram **10**.

### Melhores com foto real do bem (10, por nota, sem o item de risco)

1. **Entrada facilitada: apenas R$ 6.000!** — [abrir anúncio](https://www.facebook.com/marketplace/item/1391583326360490/)
   - id `1391583326360490` · imóvel · **não é consórcio** (formato; o texto fala em financiamento Minha Casa Minha Vida) · nota 64 · 120 dias no ar
   - Preço no anúncio: R$6,000 · Entrada: R$6.000 · Parcela: não informado no manifesto (na descrição: “A partir de R$700 reais”)
   - Vendedor: (nome omitido)
   - Texto: “Lote+ Construção com sinal de entrada por apenas R$6.000”, projeto personalizado, casas prontas para morar.

2. **Sua casa por apenas R$5mil de sinal de entrada (Lote+Construção)** — [abrir anúncio](https://www.facebook.com/marketplace/item/1032946989485474/)
   - id `1032946989485474` · casa · **não é consórcio** (formato / MCMV) · nota 60 · 81 dias no ar
   - Preço no anúncio: R$5,000 · Entrada: não informado no manifesto · Parcela: R$600
   - Vendedor: (nome omitido)
   - Texto: lote + construção no bairro São Clemente, Tubarão-SC, “Parcelas a partir de R$600”, lotes a partir de 260 m², projeto incluso. O arquivo alerta nome/CRECI no texto.

3. **Conquiste Seu Imóvel com Consórcio Fácil e Econômico** — [abrir anúncio](https://www.facebook.com/marketplace/item/27055056007515136/)
   - id `27055056007515136` · imóvel · **consórcio/carta** · nota 48 · 165 dias no ar
   - Preço no anúncio: R$980 · Entrada: não informado · Parcela no manifesto: R$980 (campo preço do anúncio)
   - Vendedor: (nome omitido)
   - Título e descrição falam em consórcio de forma aberta: “consórcio imobiliário”, “sem juros abusivos”, “imóvel novo, usado, terreno ou construção”, “simulação sem compromisso”. Este é o melhor exemplo de consórcio com foto real nesta praça.

4. **CASA A VENDA -- ENTRADA + PARCELAS NO BOLETO** — [abrir anúncio](https://www.facebook.com/marketplace/item/999638202603587/)
   - id `999638202603587` · casa · **não é consórcio** (formato) · nota 48 · 148 dias no ar
   - Preço no anúncio: R$2,800 · Entrada: R$ 28MIL · Parcela: R$ 2.800
   - Vendedor: (nome omitido)
   - Texto: “ENTRADA A PARTIR DE 28MIL / PARCELAS A PARTIR DE 2.800 / ACEITAMOS FGTS / PARCELAMENTO BANCÁRIO” e a linha “IMAGEM ILUSTRATIVA”.

5. **ARGO - ENTRADA + ASSUMIR AS PARCELAS** — [abrir anúncio](https://www.facebook.com/marketplace/item/1623388729371897/)
   - id `1623388729371897` · Fiat Argo · carro · **não é consórcio** (formato) · nota 42 · 78 dias no ar
   - Preço no anúncio: R$691 · Entrada: não informado · Parcela: não informado no manifesto
   - Vendedor: (nome omitido)
   - Descrição salva é curta: “Não consegue financiar? / Tem entrada? / Me chame !!”

6. **HB20 BRANCO COM BAIXA ENTRADA E PARCELA DE R$915,00** — [abrir anúncio](https://www.facebook.com/marketplace/item/1606720584492198/)
   - id `1606720584492198` · HB20 branco · carro · **consórcio/carta** · nota 38 · 63 dias no ar
   - Preço no anúncio: R$915 · Entrada: não informado · Parcela: R$915,00
   - Vendedor: (nome omitido)
   - Título coloca a parcela. A descrição salva fala em “PAGAMENTO DA PRIMEIRA PARCELA NA ASSINATURA DO CONTTATO”, “PARCELAS DE R$481 e entrada fica á seu critério” e uma tabela de parcelas por faixa de valor do veículo. O título não usa a palavra “consórcio”; o banco gravou consórcio=sim.

7. **2021 Honda Civic** — [abrir anúncio](https://www.facebook.com/marketplace/item/1580963623485448/)
   - id `1580963623485448` · Honda Civic · carro · **consórcio/carta** · nota 29 · 45 dias no ar
   - Preço no anúncio: R$115,000 · Entrada: não informado · Parcela: não informado no manifesto
   - Vendedor: (nome omitido)
   - Título só com ano e modelo. A descrição explica o caminho: “Eu vou te mostrar uma forma estratégica de conquistar o seu Civic pagando muito menos através do consórcio.”

8. **2012 Renault Outro** — [abrir anúncio](https://www.facebook.com/marketplace/item/933317623182188/)
   - id `933317623182188` · Renault Sandero Stepway · carro · **não é consórcio** (formato / assumir parcelas) · nota 21 · 31 dias no ar
   - Preço no anúncio: R$0 (é o valor gravado no manifesto) · Entrada: R$ 20 mil · Parcela: R$ 940 (21x)
   - Vendedor: (nome omitido)
   - Texto: “Quero 20 mil e assumi 21 parcela de 940.” Mais defeitos declarados (porta e ar).

9. **2018 Renault [hidden information]17940** — [abrir anúncio](https://www.facebook.com/marketplace/item/1414280030159385/)
   - id `1414280030159385` · Renault Kwid · carro · **não é consórcio** (formato / à vista ou assumir dívida) · nota 19 · 21 dias no ar
   - O título acima é o que está no banco; o arquivo já veio com um trecho oculto. A checagem identifica o bem como Renault Kwid.
   - Preço no anúncio: R$38,000 · Entrada: não informado no manifesto · Parcela: não informado no manifesto
   - Vendedor: (nome omitido)
   - Descrição salva: “R$ 38.000 ou Repasse de Dívida”, “Entrada 18,000 + 20 Parcelas: 1,208”, “obrigatório transferir a dívida para o nome”.

10. **2020 Renault Logan** — [abrir anúncio](https://www.facebook.com/marketplace/item/1465893885354049/)
    - id `1465893885354049` · Renault Logan · carro · **não é consórcio** (formato / assumir parcelas) · nota 14 · 14 dias no ar
    - Preço no anúncio: R$15,000 · Entrada: não informado · Parcela: R$ 1.675
    - Vendedor: (nome omitido)
    - Texto: “Carro já financiado / R$ 15 mil e assumir parcelas de 1.675 / Contrato em cartório, não precisa transferir.”

### Padrão comum nesta região

- **Título:** nos imóveis, a entrada vai para o título (“Entrada facilitada: apenas R$ 6.000!”, “Sua casa por apenas R$5mil de sinal de entrada”, “ENTRADA + PARCELAS NO BOLETO”). Nos carros, ou a fórmula “ENTRADA + ASSUMIR AS PARCELAS”, ou a parcela no título (HB20 com “PARCELA DE R$915,00”), ou só o ano e o modelo (Civic, Logan). O consórcio de imóvel que durou 165 dias (item 3) coloca “Consórcio” no título — exceção útil.
- **Os 3 de maior nota desta praça não têm foto suficiente.** Mesmo vendedor (Lucas Alves), todos consórcio=sim, nota 77, entrada R$ 40.000,00 e parcela R$ 2.754,00 no manifesto, e a checagem mandou NAO USAR por ter só 1 ou 2 fotos (uma com marca de imobiliária):
  - “imóvel com carta de crédito” — id [`1652251499320178`](https://www.facebook.com/marketplace/item/1652251499320178/), 156 dias, Laguna
  - “Adquira seu imóvel!” — id [`1382181670677462`](https://www.facebook.com/marketplace/item/1382181670677462/), 122 dias, Cocal do Sul
  - “Imóvel urbano ou rural com carta de credito!” — id [`1712275013157067`](https://www.facebook.com/marketplace/item/1712275013157067/), 122 dias, Treze de Maio
  O padrão de oferta (carta + entrada e parcela repetidas) durou muito; a foto não serve de modelo Kebrina.
- **Preço:** no imóvel, o preço do anúncio é o sinal/entrada (R$5.000, R$6.000) ou a parcela (R$2.800, R$980). No carro, ora a parcela (R$915), ora um valor de venda (R$38.000, R$115,000), ora R$0.
- **Fotos:** casas com 3 a 8 fotos do imóvel; carros com 3 a 11 fotos do veículo. Menos “imagem ilustrativa” no texto do que em Vitória da Conquista, com exceção da casa no boleto (item 4).
- **Descrição:** no imóvel, sinal + parcela + (quando for o caso) FGTS ou Minha Casa Minha Vida, ou texto claro de consórcio. No carro, “assumir as parcelas” com valores fechados (20 mil + 21x 940; 15 mil + 1.675).
- **Tipo de bem:** é a única das 4 praças em que o top com foto real mistura imóvel e carro de forma equilibrada. Não há caminhão aprovado neste banco.

### Riscos encontrados (RISK, nunca modelo)

- **“Sem entrada” + linguagem de contemplação — selecionado, foto real, não usar como modelo:** “2 quartos 1 banheiro – Casa” (id [`1604351451110297`](https://www.facebook.com/marketplace/item/1604351451110297/), nota 71, 89 dias, Gabriel Passos, Laguna, 4 fotos, USAR, consórcio=sim). Era o de maior nota entre os que têm foto real. A descrição salva traz “✅ Sem entrada” e “✅ Possibilidade de contemplação por sorteio ou lance”. **RISK.**
- **Promete contemplação:** 1 classificado com esse motivo: “Cartas de créditos” (id [`995745172793074`](https://www.facebook.com/marketplace/item/995745172793074/), 170 dias, preço no anúncio R$649). **RISK.**
- **Compra de cota:** 1, o único das 4 praças com esse motivo: “Carta de crédito” (id [`1864225974984219`](https://www.facebook.com/marketplace/item/1864225974984219/), 87 dias, preço R$0). **RISK.**
- **Carta/cota contemplada à venda:** **48** — o maior volume das 4 regiões. Exemplos no título: “Carta de crédito contemplada” (id [`997886375994005`](https://www.facebook.com/marketplace/item/997886375994005/), 169 dias, preço no anúncio R$2,000,000); “Cartas de crédito Contempladas” (id [`1144399064566261`](https://www.facebook.com/marketplace/item/1144399064566261/), 158 dias); “VENDO CARTA JA CONTEMPLADA, IMOBILIARIO!” (id [`1671370917434801`](https://www.facebook.com/marketplace/item/1671370917434801/), 152 dias).
- **Venda/repasse de cota:** 4. Exemplo: “Vendo Consórcio Embracon” (id [`1061039383510607`](https://www.facebook.com/marketplace/item/1061039383510607/), 73 dias).
- **Público negativado/score:** 23 classificados, e é a praça em que isso mais aparece no próprio título. Exemplos: “GOL - APROVA SCORE BAIXO - COM ENTRADA - PARCELAS A PARTIR DE 800” (id [`1653943845720926`](https://www.facebook.com/marketplace/item/1653943845720926/), 123 dias); “2018 HB20 da Alegria!! (Aprova fácil  Para autônomos e negativados!!)” (id [`1289421013263762`](https://www.facebook.com/marketplace/item/1289421013263762/), 121 dias); “2019 Ford KA… para negativados e score baixo” (id [`1841801557069397`](https://www.facebook.com/marketplace/item/1841801557069397/), 101 dias); “2023 Chevrolet FINANCIAMENTO FACILITADO SCORE BAIXO SEM ENTRADA” (id [`963564000098767`](https://www.facebook.com/marketplace/item/963564000098767/), 54 dias — este junta negativado e “sem entrada”).
- Promessa de crédito imediato: nenhum com esse motivo nesta praça. Agência ou leads: nenhum título salvo. Motos fora: 24.

---

## Padrão comum às 4 regiões

1. **O preço do anúncio quase nunca é o valor do bem.** Em Vitória da Conquista ele costuma ser a entrada. Em Sumaré, nos dois que mais pontuaram com foto, ele é a parcela (R$999, R$899). Em Laguna, no imóvel, é o sinal ou a parcela. Sempre conferir entrada e parcela no texto, não só no campo de preço.
2. **A fórmula de título que mais se repete nos anúncios com foto real é “ENTRADA + PARCELAS” + o bem** (Classic, Gol, “NO BOLETO”, “DE R$999”). A parcela ou a entrada no título ajuda a nota e a leitura no celular. No consórcio, o título muitas vezes esconde a palavra e mostra só o modelo ou “parcelamento”; a descrição é que fala “consórcio” ou “carta”. Quando o título já diz “Consórcio” com clareza (o imóvel de Tubarão, 165 dias), o anúncio também dura.
3. **A foto que interessa é a foto real do bem, várias ângulos, de um único veículo ou imóvel.** Esse é o estilo Kebrina. Em Recife e em Sumaré, justamente os selecionados de maior nota (caminhão “crédito / entrada a partir de 10%”, “crédito para caminhão sem juros”, imóvel com carta) eram arte, render ou uma foto só — a checagem mandou NAO USAR. Dá para olhar o texto desses anúncios para entender o que ficou muito tempo no ar; não dá para copiar a imagem.
4. **A descrição típica tem gancho, ficha do bem, “entrada a partir de”, parcela flexível ou “a combinar”, às vezes uma fila de pontos e um pedido de WhatsApp.** Em Vitória da Conquista vários textos ainda escrevem “IMAGEM ILUSTRATIVA” mesmo quando a checagem viu foto real do modelo anunciado. “Sem juros” aparece tanto em consórcio quanto em venda parcelada e financiamento de loja — o campo `consorcio` do banco é que separa os dois; venda parcelada serve só de modelo de formato.
5. **Quem manda no recorte com foto real é o carro.** Caminhão aparece com força em Vitória da Conquista (e no texto de Recife e Sumaré, mas lá falta foto real). Imóvel só entra de verdade no top de Laguna. O filtro até aprovou muitos imóveis em Recife e Sumaré, mas eles não passaram na foto ou caíram em risco.
6. **O que mais se repete de risco, nas 4 praças, é venda de carta ou cota contemplada** (15 + 16 + 34 + 48 = **113** no banco). Em seguida, público negativado/score (**85**) e venda/repasse de cota (**24**). “Sem entrada” e promessa de contemplação também aparecem dentro do próprio lote selecionado (Recife id `2002492643774678`, Sumaré id `4670311183294368`, Laguna id `1604351451110297`, Recife “50 Contemplações Mensais”). **Nenhum desses é modelo.** Não achei no título salvo agência de venda de leads. Motos, já fora: 158.
7. **Anúncio que dura não é necessariamente o que tem a melhor foto.** Vários passaram de 150 dias com arte, uma foto ou com oferta de carta contemplada. Para modelar o post da operação, vale o cruzamento: tempo no ar + foto real do bem + texto sem risco.

Relatório montado em 12/11/2026 (horário de Brasília), só com os arquivos da mineração de 24/10/2026.
