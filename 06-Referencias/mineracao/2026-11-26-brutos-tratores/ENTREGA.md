# Mineração de vídeos brutos: tratores de R$ 500 mil a R$ 1 milhão (26/11/2026)

**Pedido do Samuel (26/11/2026):** "quero fazer agora uma mineração para tratores e maquinas agricolas, quero minerar só tratores acima de 500.000 e no maximo 1.000.000" + "usa as mesmas regras de mineração o tipo de video é o mesmo so muda o nicho".

**Regras usadas:** as mesmas do caminhão e do carro: vídeo em pé de loja, só o trator, trecho limpo de 11 a 15 s, sem texto, sem pessoa e sem logo por cima. Sem preço no anúncio: valor médio de mercado (decisão de 25/11). Entrada e parcela de trator continuam pendentes ([[Pendencias]]).

**Fontes:**
- Biblioteca de Anúncios da Meta, sem login, com `brutos_meta.py`: 37 buscas em 4 rodadas (termos gerais, modelos grandes um por um, busca funda com anúncios encerrados e página inteira da Sul Máquinas);
- peneira com `triagem_brutos.py --sem-preco`, filtrando pelos modelos;
- conferência no olho do vídeo inteiro de todos os tratores grandes, mesmo os que a peneira reprovou.

**Bloqueios:** nenhum. Termos vazios ("massey ferguson 7700", "6195j", "valtra bh 224", "case puma 185", "7215r") são falta de anúncio: a busca seguinte trouxe resultado.

## Resultado na Biblioteca da Meta: nenhum aprovado
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

## Rodada no Instagram (26/11/2026, exceção autorizada pelo Samuel: conta logada, só leitura)
- Perfil do BitBrowser "halvveny insta (91)", aba nova, só leitura: 12 hashtags (#tratorseminovo, #tratoravenda, #tratoresusados, #johndeere7230j, #johndeere7200j, #tratorjohndeere, #casepuma, #newhollandt7, #valtrabh, #tratoragricola, #johndeere7215j, #tratorcabinado). 425 posts. Nenhum aviso. As últimas 6 hashtags trouxeram só 3 posts cada: parei de navegar logado e fechei o perfil.
- Texto e vídeo de cada post lidos **sem login** com `yt-dlp -j` (3 s entre cada). Foram lidos 102 vídeos até o Samuel encerrar; o resto ficou em `ig-urls.txt` / `ig-meta.jsonl`.
- Peneira (`triagem_brutos.py --sem-preco`): 16 passaram; só 1 na faixa.

### Aprovado
| # | Arquivo | Trator | Valor do anúncio | Trecho | Anunciante |
|---|---|---|---|---|---|
| 01 | `01-trator-new-holland-t7-260-2023.mp4` | New Holland T7.260 2023, 234 cv, 1.711 h | R$ 580.000 | 0,5 a 15 s (vídeo de 90 s, volta limpa até ~55 s) | Zanquetta Agromáquinas (Instagram) |

- Reprovado: New Holland T7.205 2021, R$ 550.000 (Sucatão Soluções Agrícolas): apresentador e logo.
- **O que funcionou para trator:** hashtag do Instagram de modelo grande (#johndeere7230j trouxe 87 posts). Vai para o representante em `entregas/2026-11-26-brutos-tratores/`.

### Leitura completa (terminou depois): mais 3 aprovados
| # | Trator | Valor | Anunciante |
|---|---|---|---|
| 02 | John Deere 7230J 2020, 2.881 h (1080x1920) | R$ 680.000 | Classificados Agrícola (#johndeere7230j) |
| 03 | John Deere 7230J (576x1024) | R$ 680.000 | AGRONEXUS (#johndeere7230j) |
| 04 | John Deere 7230J 2018, 5.500 h | R$ 500.000 | Zanquetta Agromáquinas (#tratorjohndeere) |

Reprovado: John Deere 7200J 2022, R$ 680.000 (Naiara Rodio): selfie com legenda. Total: 222 vídeos lidos, 6 na faixa com preço, **4 aprovados**. #johndeere7230j deu 2 dos 4: a hashtag de modelo é a que mais rende.
