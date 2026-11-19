---
tipo: operacao
atualizado: 2026-11-19
---
# Pendências

O que depende de decisão de alguém. Quando resolver, mova a linha para [[Decisoes]] com as palavras exatas.

## URGENTE: valores errados no ar (achado em 19/11/2026, ao montar este cofre)
- [ ] Os vídeos de Hilux, SW4, Daily e Ducato da pasta "criativos" do PC dos bots são as versões **de antes** do seu ajuste de 14/11, 09h12 (Hilux 35 mil, SW4 40 mil, Daily 35 mil, Ducato 20 mil de entrada). O Reel da **SW4 postado hoje às 09h06 na @tanan_intermediacoes** tem o md5 `b7bf…`, que é da pasta `antes-entrada-0912`.
- [ ] As legendas do `fila.json` desses quatro mostram 62.400, 76.400, 44.600 e 54.400, e não os valores aprovados.
- Decidir: tirar ou corrigir o Reel da SW4 e trocar os arquivos e legendas dos quatro antes de postar.
- [ ] As legendas do `fila.json` têm 6 hashtags (o limite de `specs.md` era 5) e não trazem "Vídeo ilustrativo", que estava na legenda aprovada em 13/11 17h49. Manter assim ou voltar?

## Decisão do Samuel (abertas em 19/11/2026)
- [ ] Liberar as levas 05, 06 e 07 do Marketplace (`_arquivo-grok/movecon/marketplace/rascunhos-2026-11-19/`).
- [ ] OK dos substitutos sem liberação: 016c, 009b e os das levas 05 a 07 (126b, 132b, 136b, 138b, 139b, 167b, 177b, 183b, 185b, 189b).
- [ ] 055 VW 5.140 com cesto aéreo (e qualquer caminhão com cesto aéreo): segurado.
- [ ] Vídeo do Classic: escolher v4 ou v4b (`_arquivo-grok/movecon/criativos/rascunhos/2026-11-18-classic-2016/`).
- [ ] Ano no anúncio: fabricação (como está hoje) ou modelo.
- [ ] @planejeseucredito e TikTok: voltam a postar?
- [ ] Tráfego pago: qual é a situação da campanha (último registro 26/10, conjunto Strada, R$ 40/dia)?
- [ ] Relatório diário de leads (Chefe de Gabinete) está pausado desde 24/10 e o cruzamento de leads por anúncio foi cancelado em 14/11. Volta? Com qual CRM (o atual ou o novo da equipe)?
- [ ] "Sem juros": a regra de 23/10 01h20 libera nas peças; a skill de locução antiga dizia "proibido em tudo". Este cofre segue a de 01h20. Confirmar.
- [ ] Volume do Marketplace: o estudo de 13/11 recomendava 1 anúncio novo por dia por conta; a ordem de 18/11 é 1 por hora por conta. Este cofre segue a ordem de 18/11 nas contas do Samuel e o degrau para vendedor novo. Confirmar para os vendedores.
- [ ] Aprovador de cada vendedor: o próprio vendedor ou o Samuel?

## Confirmar com a Alpha (bloqueiam respostas do atendimento)
- [ ] Lance livre de referência do plano de R$ 306 mil.
- [ ] Composição da 1ª parcela.
- [ ] Taxa de administração, fundo de reserva e seguro de cada plano.
- [ ] Índice e periodicidade de reajuste da carta.
- [ ] Lance parcelado: existe?
- [ ] Uso do crédito: seminovo, ano de fabricação, implemento, compra de particular.
- [ ] Regras de transferência e desistência.
- [ ] Assembleias: dia do mês e prazo para ofertar lance.

## Técnicas
- [ ] Confirmar o nome exato de cada perfil do BitBrowser (lista em [[Perfil-do-operador]]).
- [ ] Os scripts de postagem foram copiados para `07-Ferramentas/scripts/marketplace/` e `instagram/`, mas têm caminhos, portas e ids de aba fixos do PC dos bots (`C:\Users\Public\cdp-postador-1811\`). Antes de usar em outro PC, ajustar `ROOT`, `PRINTS` e a tabela `PROFILES`. O `finish.mjs` (usado na conta 4) não estava no cofre.
- [ ] `07-Ferramentas/scripts/checagem/checar-compliance.sh` é de outubro e ainda bloqueia frases que hoje são livres nas peças. Atualizar com as palavras de risco do Marketplace ([[Compliance]]).
