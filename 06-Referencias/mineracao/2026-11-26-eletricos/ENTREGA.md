# Mineração de vídeos brutos — carros elétricos — 26/11/2026
Pedido: Roberto (conta @beto.cred), 26/11/2026, prompt padrão de mineração tipo A, com as palavras "agora comece criar os 12 videos". Nicho: carros 100% elétricos, os mais vendidos (ranking ABVE de outubro de 2026: Dolphin Mini, Dolphin, Ora 5, EX2, Spark EUV, Aion UT, EX5, B10, Yuan Pro). Brasil todo, com prioridade para a Bahia. Faixa de R$ 60 mil a R$ 300 mil. 12 vídeos, no máximo 2 por modelo.
Fontes: Biblioteca de Anúncios da Meta, sem login, com `brutos_meta.py` (15 buscas, contando 1 de controle).
Bloqueios e limites no caminho: nenhum bloqueio. "dolphin mini salvador" veio vazio, e a busca de controle ("byd dolphin", com 1 rolagem) trouxe 48 vídeos, então não era bloqueio.
Resultado em uma linha: **2 aprovados no QA**, os 2 de BYD Dolphin Mini GS, que é o limite por modelo, mais **3 reservas** do mesmo modelo. **Faltaram 10.** **Atualização da rodada 3 (27/11): 4 aprovados (+ Geely EX5 EM-i 0 km e BYD Seal 2025); faltam 8.**

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

## Rodada 3 — 0 km liberado (27/11, madrugada)
Pedido novo do Roberto, nesta ordem: 1) "pode ser novo também, mas sem pessoas, só mostrando o carro"; 2) vale qualquer carro 100% elétrico vendido no Brasil, não só os mais vendidos; 3) "pode ser híbrido também" (HEV, PHEV, DM-i, EM-i, e-Power). A combustão pura continua fora. O critério visual não mudou: sem pessoa nem mãos, nada por cima, sem letreiro nem nome de loja.
Fonte: Biblioteca da Meta, sem login, `brutos_meta.py`, **15 buscas**, sem bloqueio. Peneira `triagem_brutos.py` (de 60 mil a 300 mil). Os híbridos reprovados na rodada 1 só por serem híbridos (os 5 anúncios do Geely EX5 EM-i da Jorlan-ev) foram conferidos de novo no olho.

**Resultado: 2 aprovados novos. Total 4 de 12, faltam 8.**

| # | arquivo | carro | motorização | 0 km/seminovo | loja | valor | entrada | parcela | áudio | trecho | marcar |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 03 | `aprovados/03-carro-geely-ex5-em-i-0km-2027.mp4` | Geely EX5 EM-i | híbrido plug-in (EM-i) | 0 km | Geely Jorlan-ev Brasília | R$ 211.490 (oferta oficial do EX5 EM-i Max, geelybrasil.com.br/ofertas, consultada em 27/11/2026; a versão do vídeo não aparece, usei a de menor preço do EM-i na página de ofertas) | R$ 38.100 | R$ 1.903 | música/ambiente, sem fala | 0–13 s (carro inteiro em 0,5 s e 12 s; de novo aos 18 s) | vinheta azul "JORLAN-ev / GEELY" a partir de ~21 s (fora do corte); placa sem número; trecho de árvores de 14 a 17 s |
| 04 | `aprovados/04-carro-byd-seal-2025.mp4` | BYD Seal (AWD, 531 cv) | 100% elétrico | seminovo, 12 mil km | Motion Motors | R$ 225.900 (preço do anúncio) | R$ 40.700 | R$ 2.033 | **voz do vendedor em off** → trocar por música | 0–15 s (pátio aberto, carro inteiro o tempo todo) | plaqueta da loja na placa (tampar) |

Valores pelo `calc_valores.py <valor> --reel`. Os dois são 720x1280, vertical nativo.

Buscas da rodada 3: página inteira da Elite Car (`pagina:483688041644435`, 110 vídeos) e da JL Car Trade (`pagina:107910295545418`, 20), carro elétrico 0km (81), song pro (87), song plus (43), byd king (61), haval h6 (99), corolla cross hybrid (65), kicks e-power (4), byd seal (66), yuan plus (27), jaecoo 7 (59), tiggo 7 hybrid (24), mg4 (65), kwid e-tech (4). Na peneira, 579 anúncios analisados.

Reprovados na rodada 3 (conferidos no olho; pastas `r3/` e `rever-hibridos/`):
- Geely EX5 EM-i, Jorlan-ev (4 dos 5 vídeos): apresentador com legenda; modelo/influenciadora no carro; só detalhes de interior; carro inteiro quase não aparece.
- BYD Seal AWD, Elite Car (3 anúncios, mesmo vídeo): apresentador andando em volta do carro.
- Toyota Corolla Cross XRX Hybrid, Elite Car: só 10,5 s, giro de imagem e faixas pretas.
- Omoda 5 Luxury 2027 híbrido 0 km, Elite Car (3 vídeos): letreiro "Elite Car" grande ao fundo, mãos abrindo portas, apresentador em um deles.
- Omoda E5 (elétrico), Elite Car: mãos o tempo todo e letreiro.
- Chery Tiggo 7, Elite Car: letreiro e mão no painel.
- BYD King GL híbrido plug-in 2026, Vip Car: letreiro "VIP CAR" na parede do fundo e mão abrindo a porta aos 9 s.
- Haval H6 HEV/PHEV19/PHEV35 (GWM Brasil e GWM Caminho, 7 anúncios): arte animada com preço e texto o vídeo todo (campanha Black GWM).
- Toyota Corolla Cross XRX Hybrid 2024, ADR Premium: adesivo "24 HÍBRIDO" no para-brisa e apresentador falando.
- Chery Tiggo 7 Pro Hybrid 2023, Araca Veículos: logo da loja no tapete e na parede; o trecho limpo só tem interior.
- Porsche Cayenne 2019 (GrandPrix): combustão.
- Os demais que passaram na peneira eram combustão (Toro, Ranger, Scudo, Kicks, Taos, HB20, Creta) ou Dolphin Mini (modelo já com 2).

Lojas atualizadas em `lojas-brutos.json`: boas + Motion Motors e Geely Jorlan-ev Brasília (com nota); ruins + GWM Brasil, GWM Caminho e ADR Premium.

**Próximos termos (não couberam nesta rodada):** página inteira da Motion Motors (`pagina:644982622805736`) e da Geely Jorlan-ev Brasília (`pagina:691189374071371`); song pro seminovo, byd king seminovo, seal u, sealion 7, yuan pro 0km, dolphin gs seminovo, aion y, aion ut, leapmotor, ora 5 0km, ex30, captiva ev, omoda e5, kicks e-power seminovo, corolla hybrid, haval h6 seminovo, tiggo 8 phev; e busca funda (`--inativos`) de song pro, byd king e seal. E links colados de TikTok/Reels (é o caminho que mais rende fora da Meta).

## Onde estão os arquivos
- Clipes, planilha (`planilha-brutos-2026-11-26.csv`) e prancha (`prancha-brutos-2026-11-26.jpg`): esta pasta.
- Cópia para o Roberto: `C:\Users\ro--2\Desktop\beto.cred - Videos eletricos\`.
- Coletas (`meta-*.json`), peneira (`triagem.json`) e vídeos originais conferidos (`conferir/`): esta pasta. Os originais não vão para o GitHub.
- Lojas atualizadas em `07-Ferramentas/referencias/lojas-brutos.json` (rodada 3: +2 boas, +3 ruins). A cópia de antes está em `.bak-20261126-2330`.

## Pendente
- OK do aprovador para usar os clipes (rascunho → aguardando OK).
- Decidir se libera mais de 2 Dolphin Mini (as reservas R1 a R3).
- Faltam 8 para 12: ver "Próximos termos" na rodada 3.
- Nenhum dado pessoal de anunciante neste arquivo.
