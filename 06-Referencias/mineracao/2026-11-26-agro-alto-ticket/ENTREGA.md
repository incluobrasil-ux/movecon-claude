---
tipo: referencia
data: 2026-11-26
---
# Mineração pesada do agro: máquinas de R$ 500 mil a R$ 1 milhão (26/11/2026)

**Pedido do Samuel (26/11/2026):** "quero que você faça uma mineração pesada de trator/maquina agricola/maquinarios que eu nao vou conhecer [...] atue como agronomo e liste tudo que podemos postar dentro do ticket [...] usa algo disso [mineração do Grok de Cuiabá] [...] otimize [...] deixar mastigado la para o vendedor" + "pode procurar pelo instagram, pelo meta ads, pelo google shorts, onde vc achar melhor vc tem autonomia total".

## O que ficou pronto
| Arquivo | Para quê |
|---|---|
| `CATALOGO-o-que-postar.md` | as 8 categorias de máquina que cabem no ticket: o que é, quem compra, quando procura, preço real, ganchos; calendário; o que usar e não usar do concorrente de Cuiabá |
| `PROCESSO-mineracao-agro.md` | o processo que funcionou, passo a passo, com as palavras da peneira e as revendas boas |
| `precos-mfrural-2026-11-26.md` | preços reais por modelo, com link (base do "valor médio estimado") |
| `planilha-agro-2026-11-26.csv` | os 8 vídeos aprovados + 2 de reserva |
| `entregas/2026-11-26-agro-alto-ticket/` | os vídeos cortados, trancados (senha só no prompt do Samuel) |

## Vídeos aprovados (8) + reserva (2)
| # | Máquina | Valor | Origem do valor |
|---|---|---|---|
| 01 | Colheitadeira Case Axial-Flow 5150 2023 | R$ 990.000 | anúncio |
| 02 | Colheitadeira Case Axial-Flow 4150 colhendo milho | R$ 690 a 850 mil | estimado (MF Rural) |
| 03 | Pulverizador Jacto Uniport 3030 aplicando | R$ 700.000 | estimado (MF Rural) |
| 04 | Trator John Deere 7215J 2021 | R$ 590.000 | anúncio |
| 05 | Trator John Deere 6190M 2021 | R$ 545.000 | anúncio |
| 06 | Trator John Deere 7230J 2022 | R$ 620.000 | estimado (MF Rural) |
| 07 | Trator New Holland T8 325 2023 | sem dado (R$ 635 a 945 mil) | confirmar com o Samuel |
| 08 | Trator New Holland T7.260 plantando | R$ 580.000 (só o trator) | estimado (MF Rural) |
| R1 | Colheitadeira Case Axial-Flow (modelo sem dado) colhendo | sem dado | — |
| R2 | Uniport 3030 só detalhes | R$ 700.000 | estimado |

Faltou vídeo limpo na faixa de: plantadeira grande, distribuidor Hércules, colhedora de café, colhedora de cana (só vídeo noturno ou de longe), forrageira e máquina pesada (aguarda confirmação da Alpha).

## Números da mineração
| Fonte | Coletado | Aproveitado |
|---|---|---|
| Biblioteca da Meta, sem login (2 rodadas, 24 termos de modelo e categoria) | 314 vídeos | 0. Colheitadeira S550 da Santi Máquinas, R$ 1,03 milhão: acima do teto. O resto tinha legenda, vendedor ou foto parada |
| YouTube Shorts sem login (`shorts_youtube.py`) | bloqueado ("confirme que não é robô") | parou sozinho, sem contornar |
| Instagram, conta logada só leitura (exceção do Samuel): 18 hashtags de modelo + 10 perfis de revenda | 1.548 links, nenhum aviso | — |
| Leitura pública dos posts sem login (`ig_posts.py`, um processo só, 1,5 s entre posts) | 1.218 vídeos (1.154 em pé), nenhum bloqueio | — |
| Peneira 1 (anúncio de venda) | 104 analisados, 32 passaram | 6 aprovados |
| Peneira 2 (`--sem-venda`: máquina trabalhando, só modelos da faixa) | 191 analisados, 85 passaram | 2 aprovados + 2 de reserva |

## Aprendizados
- **Classificados Agrícola (instagram classi.agricola) deu 5 dos 8.** Perfil de revenda que filma volta limpa no campo vale mais que qualquer hashtag. Comece pelos perfis.
- **Máquina trabalhando** (colhendo, pulverizando, plantando) só aparece em post de operador, sem preço. Use `--sem-venda` e o valor médio estimado do modelo.
- **Hashtag poluída:** #s550 é dominada pelo Ford Mustang S550; #axialflow mistura turbina e bomba d'água. Use a hashtag com o nome da máquina (#colheitadeiras550, #caseaxialflow) ou o perfil da revenda.
- Colhedora de cana: quase só vídeo noturno de dentro da cabine. Não serve.
