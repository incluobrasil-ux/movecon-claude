# Mineração de vídeos brutos — carros elétricos — 26/11/2026
Pedido: Roberto (conta @beto.cred), 26/11/2026, prompt padrão de mineração tipo A, com as palavras "agora comece criar os 12 videos". Nicho: carros 100% elétricos, os mais vendidos (ranking ABVE de outubro de 2026: Dolphin Mini, Dolphin, Ora 5, EX2, Spark EUV, Aion UT, EX5, B10, Yuan Pro). Brasil todo, com prioridade para a Bahia. Faixa de R$ 60 mil a R$ 300 mil. 12 vídeos, no máximo 2 por modelo.
Fontes: Biblioteca de Anúncios da Meta, sem login, com `brutos_meta.py` (15 buscas, contando 1 de controle).
Bloqueios e limites no caminho: nenhum bloqueio. "dolphin mini salvador" veio vazio, e a busca de controle ("byd dolphin", com 1 rolagem) trouxe 48 vídeos, então não era bloqueio.
Resultado em uma linha: **2 aprovados no QA**, os 2 de BYD Dolphin Mini GS, que é o limite por modelo, mais **3 reservas** do mesmo modelo. **Faltaram 10.**

## Números
- 1.271 anúncios de vídeo únicos coletados em 15 buscas.
- 445 baixados e lidos pela peneira (`triagem_brutos.py`); 43 passaram.
- Desses 43, 25 vídeos de elétrico foram conferidos no olho, quadro a quadro, a cada 1,5 s. Os demais eram carro a combustão, híbrido, anúncio de shopping ou de outra loja, ou duplicados.
- Aprovados: 2. Reservas: 3.

## Aprovados no QA
| # | arquivo | carro | ano | loja | valor | entrada | parcela |
|---|---|---|---|---|---|---|---|
| 01 | `aprovados/01-carro-byd-dolphin-mini-gs-2025.mp4` | BYD Dolphin Mini GS | 2024/2025 | Elite Car | R$ 114.900 (preço do anúncio) | R$ 20.700 | R$ 1.034 |
| 02 | `aprovados/02-carro-byd-dolphin-mini-gs-2025.mp4` | BYD Dolphin Mini GS | 2025 | JL Car Trade | R$ 110.990 (preço do anúncio) | R$ 20.000 | R$ 999 |

Valores pelo `calc_valores.py <valor> --reel`. Os dois clipes têm 15 s, são verticais nativos em 720x1280, mostram o carro inteiro no começo e não têm pessoa nem texto.

## Marcados (para o Editor tratar)
- 01: plaqueta "Elite Car" na placa (tampar).
- 02: plaqueta "JL Car Trade" na placa (tampar). Entre 2 e 3 s aparece o laço vermelho de outro carro.
- Áudio: os dois têm som. Confira se é música ou voz antes de editar.

## Reservas (terceiro Dolphin Mini; só usar se o Samuel liberar mais de 2 por modelo)
| # | arquivo | loja | valor | entrada | parcela | atenção |
|---|---|---|---|---|---|---|
| R1 | `reservas/R1-...mp4` | Victor Seminovos | R$ 109.654 (valor médio estimado) | R$ 19.700 | R$ 987 | o corte só tem interior; o carro inteiro aparece de 39 a 46 s do original |
| R2 | `reservas/R2-...mp4` | RH Motors (Cuiabá) | R$ 109.654 (valor médio estimado) | R$ 19.700 | R$ 987 | o carro inteiro só aparece no fim |
| R3 | `reservas/R3-...mp4` | Robinho Consultor de Vendas | R$ 116.900 (preço do anúncio) | R$ 21.000 | R$ 1.052 | carro parado com a câmera quase sem mexer; o áudio deve ser a voz do vendedor |

**Valor médio estimado:** média de 7 anúncios de Dolphin Mini GS 2024/2025 e 2025 com preço, coletados nesta mineração. São eles R$ 105.900, 113.990, 99.990, 110.999, 104.900, 114.900 e 116.900, o que dá R$ 109.654.

## Rejeitados e por quê
| Loja | Modelo | Motivo |
|---|---|---|
| São Paulo Veículos (2 vídeos) | Dolphin GS / Dolphin Mini GS 2027 | legenda o vídeo todo e mão do vendedor |
| Tomaz Veículos | Dolphin Mini 2025 | apresentador e título com preço |
| AutoHaus Selection | Dolphin Mini 2027 | apresentadora e legenda |
| Studio F Motors | Ora 03 Skin | carro inteiro só com texto por cima; depois, só detalhes |
| GWM Jorlan-ev | Ora 5 (acessórios) | legenda e vinheta; o carro inteiro não aparece |
| Fenômenos Car | Ora 03 | texto e grafismo o vídeo todo |
| Paraíba Auto | Ora 05 0 km | vendedora no vídeo e laço |
| Exclusiva Automóveis | Ora 03 Skin | letreiro grande da loja e vídeo escuro; carro inteiro por menos de 3 s |
| Geely Jorlan-ev | EX5 MAX | só interior e vinheta |
| Geely Jorlan-ev | EX5 EM-i | híbrido |
| GAC Lider (4 anúncios, mesmo vídeo) | Aion V | influenciadora no vídeo |
| Cezana Motors | Dolphin Mini GS 2027 | cartaz com telefone no para-brisa |
| Josae Multimarcas | Dolphin Mini 2027 | letreiro grande da loja e vídeo escuro |
| BYD Disbrava | vários | apresentador e preço por cima |
| Elite Car (3 anúncios, mesmo vídeo) | Dolphin GS 2026/2027 | apresentador e letreiro grande |
| RT Car | Dolphin | apresentador, texto e "Comenta" |
| Bali BYD (2 anúncios) | Dolphin GS / Song Plus | arte animada com preço; o Song Plus é híbrido |
| Bucar, VISE Motors, Tradição Autos | Corolla híbrido, Versa, Polo, Compass | não são elétricos (o texto falava de "teto solar elétrico" e "direção elétrica") |
| São Bernardo Plaza, GV Shopping, Empório Mineiro, Pollyana Rodas | — | não é anúncio de venda de carro |

## Buscas feitas (15)
1. carro elétrico seminovo (74)
2. carro elétrico à venda (93)
3. elétrico único dono (57)
4. dolphin mini seminovo (16)
5. byd dolphin (77)
6. gwm ora (67)
7. geely ex2 (85)
8. spark euv (66)
9. gac aion (77)
10. dolphin mini salvador (0)
11. controle: byd dolphin, 1 rolagem (48)
12. dolphin mini, com anúncios antigos e 20 rolagens (222)
13. dolphin gs, com anúncios antigos (216)
14. ora 03, com anúncios antigos (204)
15. yuan pro, com anúncios antigos (144)

A busca funda com anúncios antigos deu 3 dos 5 vídeos aproveitados.

## Por que faltaram 10
- Anúncio de elétrico na Meta é quase todo de **concessionária de carro 0 km**, com apresentador, legenda, vinheta ou arte com preço. Das concessionárias BYD, GWM, Geely, GAC e Chevrolet analisadas, nenhum vídeo passou.
- Seminovo elétrico filmado só o carro existe, mas é raro e quase sempre Dolphin Mini. Para **Ora 5, EX2, Spark EUV, Aion UT, EX5, B10 e Yuan Pro**, não apareceu nenhum vídeo aprovável.
- O limite de 15 buscas por dia foi atingido. Na próxima, os caminhos são:
  1. links do TikTok que você colar (`tiktok_links.py`);
  2. página inteira das lojas boas novas (Elite Car e JL Car Trade);
  3. buscas funda de "spark euv", "geely ex2" e "ora 5" em outro dia.

## Rodada 2 — fora da Meta (26/11, noite)
Pedido do Roberto: "pode pesquisar tiktok, reels, kwai, shorts youtube". Tudo sem login, sem script novo.

**Resultado: 0 aprovados novos.** Continua em 2 aprovados + 3 reservas (todos Dolphin Mini).

| Plataforma | Como | O que deu |
|---|---|---|
| YouTube Shorts | `shorts_youtube.py`, 12 termos ("byd dolphin seminovo à venda", "gwm ora 03 seminovo", "chevrolet spark euv à venda", "geely ex2 à venda", "byd yuan pro seminovo", "byd seal seminovo", "volvo ex30 seminovo", "gac aion y seminovo", "byd dolphin chegou na loja", "dolphin gs estoque seminovos", "gwm ora estoque loja", "spark euv chegou na loja") | 0 em pé. A busca do YouTube devolve review longo; o curto de loja que apareceu (KD Automóveis, Dolphin GS 2024) é horizontal 1908x1080 |
| YouTube (yt-dlp, páginas públicas) | hashtags #byddolphin, #dolphinmini, #carroeletrico; aba Shorts dos canais KD Automóveis e Maia Cars Oficial | 8 vídeos baixados e conferidos no olho, **todos reprovados** (abaixo) |
| TikTok | busca na web por links (`site:tiktok.com`) | o buscador não indexa vídeo do TikTok; sem login a busca/perfil do TikTok dá captcha. **Só funciona com links colados** (`tiktok_links.py`) |
| Kwai | página pública `kwai.com/discover/dolphin` | abre sem login, mas mostra 1 vídeo por vez e só carrega mais rolando (precisaria de robô: proibido). Sem resultado |
| Instagram Reels | — | descobrir Reels sem login não dá (perfil e hashtag pedem login). **Só com links colados** |

Reprovados na rodada 2 (pasta `rodada2-shorts/`, prancha `_prancha-r2a.jpg`):
- yt40X7Wlx9ka8 — Volvo XC40 Recharge 2022 (KD Automóveis): logo "KD" por cima o vídeo todo; quase só detalhes, carro inteiro não aparece.
- yt6MaV0KMrSX8, yteQzlV3Qgv-4 — BYD Seal (Maia Cars): pessoa abrindo o porta-malas.
- ytCJCorvNWvSM — BYD Seal: mãos e interior, pessoa no fim.
- ytLElKUtjsdpo — BYD Seal: carro de test-drive adesivado "SEAL BYD Original", mão na câmera; não é unidade à venda.
- ytPZ90Q5Io82c — texto por cima o vídeo todo (e não é elétrico do nicho).
- ytohRi1mZdafE, ytonLn8l_exJ8 — apresentador falando (Dolphin / Seal), legenda.

**Para chegar aos 12:** o caminho que funciona sem login é **link colado**. O Roberto (ou alguém) procura no app do TikTok/Instagram/Kwai, só olhando, copia os links de vídeos de loja mostrando o carro sem pessoa e sem texto, e cola num .txt; o cofre baixa com `tiktok_links.py` (TikTok) ou yt-dlp (Reels/Kwai públicos) e passa pela peneira e pelo olho.

## Onde estão os arquivos
- Clipes, planilha (`planilha-brutos-2026-11-26.csv`) e prancha (`prancha-brutos-2026-11-26.jpg`): esta pasta.
- Cópia para o Roberto: `C:\Users\ro--2\Desktop\beto.cred - Videos eletricos\`.
- Coletas (`meta-*.json`), peneira (`triagem.json`) e vídeos originais conferidos (`conferir/`): esta pasta. Os originais não vão para o GitHub.
- Lojas atualizadas em `07-Ferramentas/referencias/lojas-brutos.json`: 2 boas e 24 ruins. A cópia de antes está em `.bak-20261126-2330`.

## Pendente
- OK do aprovador para usar os clipes (rascunho → aguardando OK).
- Decidir se libera mais de 2 Dolphin Mini (as reservas R1 a R3).
- Nenhum dado pessoal de anunciante neste arquivo.
