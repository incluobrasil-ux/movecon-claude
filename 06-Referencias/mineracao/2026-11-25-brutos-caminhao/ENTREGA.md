# Entrega: brutos de caminhão (25/11/2026)

Teste do processo de mineração no Claude. Pedido do Samuel: "estou fazendo uma mineração de caminhão, acha pra mim 5 videos para subirmos para eu testar o nosso processo de mineração".
Regras seguidas: [[Mineracao - o que procurar]] (seção 2) + [[Padrao minimo de edicao]]. Só leitura, sem login.

## Os 5 (em `clipes/`)
| # | Arquivo | Veículo | Valor do bem | Entrada / parcela (Reel) | Origem | Observação |
|---|---|---|---|---|---|---|
| 1 | 01-caminhao-ford-cargo-1932.mp4 | Ford Cargo 1932 cavalo | R$ 148.800 | R$ 26.800 / R$ 1.339 | Meta, LC Caminhões (6 dias no ar) | 9:16 nativo, 12,6 s, volta pela frente. Placa da loja no para-choque: tarja |
| 2 | 02-caminhao-mb-accelo-1016-2021.mp4 | MB Accelo 1016 2021 | R$ 299.000 | R$ 53.800 / R$ 2.691 | Meta, João Lima Caminhões (6 dias) | 9:16 nativo, 14 s. "21 3/4" pintado no vidro (físico). Placa da loja: tarja |
| 3 | 03-caminhao-mb-atego-1719-2020-bau.mp4 | MB Atego 1719 2019/20 baú | R$ 325.000 | R$ 58.500 / R$ 2.925 | YouTube, 5001 Caminhões (09/03/2026) | horizontal 1080p: recortar 9:16 (ampliação 1,78x). Voz ao fundo: trocar por música |
| 4 | 04-caminhao-vw-constellation-25360-2022.mp4 | VW Constellation 25.360 2021/22 | R$ 349.000 | R$ 62.800 / R$ 3.141 | YouTube, 5001 Caminhões (16/06/2026) | horizontal 1080p: recortar 9:16. Voz ao fundo: trocar por música |
| 5 | 05-caminhao-vw-31260-2006-chassi.mp4 | VW 31-260 2006 chassi | R$ 145.000 | R$ 26.100 / R$ 1.305 | YouTube, QuartoEixo (26/05/2021) | **preço de 2021: confirmar antes de usar.** Horizontal 1080p |
| R1 | R1-caminhao-ford-cargo-1415-cacamba.mp4 | Ford Cargo 1415 caçamba 1988 | R$ 145.900 | R$ 26.300 / R$ 1.313 | Meta, Anderson Veículos, Gravataí/RS (67 dias) | reserva: só 7,5 s limpos |

Valores: `calc_valores.py <valor> --reel` (18% / 0,9%). Nenhum desses modelos tinha sido postado na @tanan ou na @pedro.
Planilha: `planilha-brutos-caminhao-2026-11-25.csv`. Prancha: `prancha-brutos-caminhao-2026-11-25.jpg`. md5: abaixo.

## Números da mineração
- Meta: 15 buscas, 369 anúncios de vídeo lidos, 34 com preço único na faixa, 26 baixados e conferidos, **2 aprovados**.
- YouTube: 8 buscas, 198 vídeos listados, 11 com preço de uma unidade no título, 9 baixados (3 indisponíveis), **3 aprovados**.
- Motivos de reprova (Meta): legenda/preço/logo queimados no vídeo inteiro (portal Venda Truck e quase todas as lojas), apresentador em todo o vídeo, @ da loja no rodapé. YouTube: resolução baixa (480p/720p horizontal = ampliação acima de 2x), texto queimado.

## O que falta / decidir
- Cidade sem dado nos itens 1 e 2: confirmar que não são de Vitória da Conquista antes de postar.
- Item 5: preço de 2021. Usar mesmo assim ou trocar pela reserva?
- QA feito olhando quadros a cada 1 s (sem OCR nem detector de rosto neste PC).

## md5
```
9d2fb5f25ea67097b03d134aac32dde7  01-caminhao-ford-cargo-1932.mp4
b41e435da1c318ea23458deb8428b2fe  02-caminhao-mb-accelo-1016-2021.mp4
98bdf8eef13b35c2415f19b6089c9820  03-caminhao-mb-atego-1719-2020-bau.mp4
ffed8751ab09600b22a277e3c98b3ceb  04-caminhao-vw-constellation-25360-2022.mp4
8a81cbff50d2c9e5a3f5649401394709  05-caminhao-vw-31260-2006-chassi.mp4
a7c23ffa1bfa32ad73bbe05fd6b2d98b  R1-caminhao-ford-cargo-1415-cacamba.mp4
```
