# Mineração de vídeos brutos: tratores de R$ 500 mil a R$ 1 milhão (26/11/2026)

**Pedido do Samuel (26/11/2026):** "quero fazer agora uma mineração para tratores e maquinas agricolas, quero minerar só tratores acima de 500.000 e no maximo 1.000.000" + "usa as mesmas regras de mineração o tipo de video é o mesmo so muda o nicho".

**Regras usadas:** as mesmas do caminhão e do carro: vídeo em pé de loja, só o trator, trecho limpo de 11 a 15 s, sem texto, sem pessoa e sem logo por cima. Sem preço no anúncio: valor médio de mercado (decisão de 25/11). Entrada e parcela de trator continuam pendentes ([[Pendencias]]).

**Fontes:**
- Biblioteca de Anúncios da Meta, sem login, com `brutos_meta.py`: 37 buscas em 4 rodadas (termos gerais, modelos grandes um por um, busca funda com anúncios encerrados e página inteira da Sul Máquinas);
- peneira com `triagem_brutos.py --sem-preco`, filtrando pelos modelos;
- conferência no olho do vídeo inteiro de todos os tratores grandes, mesmo os que a peneira reprovou.

**Bloqueios:** nenhum. Termos vazios ("massey ferguson 7700", "6195j", "valtra bh 224", "case puma 185", "7215r") são falta de anúncio: a busca seguinte trouxe resultado.

## Resultado: nenhum aprovado
- 616 anúncios de vídeo coletados.
- **Só 32 eram de trator grande** (John Deere 6150J a 7230J, Case Puma 200 a 230, New Holland T7 e T8, Valtra BH 205). Trator nessa faixa quase não aparece em anúncio de vídeo.
- **Nenhum serve no nosso padrão:**
  - legenda da fala e logo por cima em todos os quadros: Atacadão Tratores (Case Puma 215 2022, Puma 200 2020, John Deere 6190J 2020) e Consulting Agro (John Deere 7230J 2021);
  - vendedor apresentando: FG Máquinas (New Holland T7.205), GR Máquinas (Case Puma 230), JZ Máquinas (John Deere 6170J);
  - arte com entrada e parcela por cima: Grupo Navi (John Deere 6150J);
  - vídeo da fábrica (New Holland, Case IH), peça ou locação: não é anúncio de trator à venda.
- Os que passaram na peneira eram tratores pequenos (de R$ 36 mil a R$ 355 mil), anúncio de fazenda ou vídeo institucional.

## Reserva (`reserva/`, baixa resolução: 476x846)
| # | Trator | Valor do anúncio | Problema |
|---|---|---|---|
| 01 | John Deere 7230J 2020, 230 cv, 1.236 h | R$ 665.000 | texto por cima em pedaços; os trechos limpos têm de 2 a 6 s e teriam de ser juntados |
| 02 | John Deere 7200J 2022, 200 cv, 137 h | R$ 685.000 | idem |

Os dois são da Sul Máquinas (página 710315245980633), com preço no anúncio.

## O que aprendemos
- Loja de trator edita o vídeo: legenda da fala, logo fixo e vendedor apresentando. O vídeo cru, que deu certo no caminhão e no carro, é raro nesse nicho.
- A busca funda (anúncios encerrados) de trator trouxe lixo: novelas, drones e peças.
- Caminhos para a próxima vez:
  1. links do TikTok com `tiktok_links.py`, que já funcionou para caminhão;
  2. página inteira das revendas de trator grande que filmam sem legenda, se aparecer alguma;
  3. aceitar a faixa de R$ 300 a 500 mil, que tem mais vídeo limpo (John Deere 6100J, 5080).
