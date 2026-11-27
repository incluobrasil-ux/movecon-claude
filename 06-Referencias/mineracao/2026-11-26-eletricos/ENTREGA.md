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
- 12 de 12 completos em 27/11 (rodadas 4 e 4B). Pendente só o OK do Roberto e a edição.
- Nenhum dado pessoal de anunciante neste arquivo.

## Rodada 4B — fora da Meta (27/11, madrugada)
Agente paralelo ao da Meta. Pedido do Roberto: urgência para chegar aos 12; elétrico OU híbrido, 0 km ou seminovo, R$ 60–300 mil, Dolphin/Dolphin Mini sem limite, só o carro (sem pessoa), nada por cima. Sem login, sem captcha, sem script novo (yt-dlp sem cookies, ffmpeg, faster-whisper para conferir fala).

**Resultado: 2 aprovados (21, 22) + 2 reservas (R21, R22).**

| # | arquivo | carro | motorização | 0 km/seminovo | loja / link | valor (fonte) | entrada | parcela | áudio | trecho | marcar |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 21 | aprovados/21-carro-byd-dolphin-gs-seminovo.mp4 | BYD Dolphin GS (4.000 km) | 100% elétrico | seminovo | Naxter Veículos — https://www.youtube.com/shorts/GhFwmrH_1ts | R$ 126.530 — **valor médio estimado** (média de 3 anúncios reais de Dolphin GS seminovo coletados na Meta: 4F Motors 2023/24 R$ 115.800; Global Motors 2026 R$ 135.900; Careca Motors 2026 R$ 127.890) | R$ 22.800 | R$ 1.139 | sem fala (transcrição vazia) — manter | 2–29 s do original (37 s) | mão no 1º segundo e letreiro "NAXTER" na parede a partir de ~30 s: fora do corte; plaqueta "Naxter" na placa dianteira e traseira (tampar); folha de papel pequena no para-brisa |
| 22 | aprovados/22-carro-gwm-haval-h6-phev19-2025.mp4 | GWM Haval H6 PHEV19 2025 | híbrido plug-in | seminovo | Veicar Multimarcas, Curitiba/PR — https://www.youtube.com/shorts/VqORaIUDwG4 | R$ 189.990 — **valor médio estimado** (anúncio real do mesmo modelo/ano: Carrera Seminovos, H6 PHEV19 2025, 29.250 km, R$ 189.990, https://www.youtube.com/shorts/RqLoz2iFieA) | R$ 34.200 | R$ 1.710 | **voz do vendedor em off** (narração; ninguém aparece) → trocar por música | 2–5 s + 13–27 s do original (30,7 s) | plaqueta "VEICAR" na frente e atrás (tampar); letreiro "VEICAR" no alto do galpão em 0–1 s, 6–8 s, 11–12 s (cortar ou tampar) |

Reservas (baixa resolução — só se faltar):
- R21 — GWM Haval H6 HEV Premium (Carflix, https://www.youtube.com/shorts/Ezgvja0QQjs): volta limpa no carro de 0 a 26 s (mão na porta aos 28 s); **480x848** (ampliação 2,26x); plaqueta "carflix" na frente e atrás. Sem preço → sem dado. Segundo H6 (limite 2 por modelo).
- R22 — GWM Haval H6 GT PHEV (Carflix, https://www.youtube.com/shorts/Huhkk5CT3xI): 478x850, câmera tremida, mão aos 14 s, placa grande "carflix" e letreiro no fim. Sem preço → sem dado.

Reprovados (principais motivos; ~100 Shorts olhados no total, folhas em r4b/):
- Naxter Veículos (Song Pro, Song Plus, Seal, Yuan Pro, King, Haval H6 HEV/GT, EX2, EX30, Ora GT, Jaecoo): apresentador e/ou legenda + logo verde "X" por cima e vinheta. Fiat 500e (Naxter): letreiro na parede e logo "X" por cima no interior; trecho limpo só ~6 s.
- Concessionárias BYD (Unic Moema, Dahruj, Grupo AB, Servopa): apresentador falando, legenda, arte de oferta.
- Esquina Motors (Dolphin GS 2024 preto, Dolphin Mini 2024 branco): **marca d'água "ESQUINA" por cima do vídeo inteiro** (logo) + letreiro; carro limpo, mas reprovado pela regra.
- Mixcar (Haval H6 Premium, Tiggo 7 Pro Hybrid, Corolla Cross Hybrid, Corolla Altis Hybrid, XC60 T8): colagem com logo e nome do carro por cima, mão.
- Carrera Seminovos (H6 PHEV19, Ora 03 GT, Song Plus Premium): logo e preço por cima o vídeo todo.
- 4F Motors (Dolphin GS 2025): texto "APENAS 2.940KM" o vídeo todo. Buscar Veículos (Song Plus): moldura de anúncio. Nikel One (H6 GT): logo no canto + shopping.
- Esquina/Star Motors/Santa Paula/automovelpe (Leaf 2022, H6, Ora 03, Dolphin Mini 2027, EX30): apresentador ou arte animada.
- Horizontais (não são 9:16): Aky Veículos (Yuan Pro, Song Plus GS, King GL, Corolla Cross Hybrid), Sena Motors, Via Mondo, Phipasa (500e, Corolla Cross), Podio Cars (EX30), automovelpe (XC40 Recharge), Brazilian Car (Song Pro), Guaíra Car, Volvo EX30 Naxter etc.
- Baixa resolução demais: Carflix Dolphin Mini (360x640), Song Pro DM-i, King DM-i (horizontais 640x356/848x480).

O que funcionou e o que bloqueou:
- **YouTube**: busca do yt-dlp (`ytsearch`) para descobrir canais + **aba Shorts dos canais de loja** (`<canal>/shorts`, `--flat-playlist`) → vertical nativo. Funciona sem login. Rende pouco: a maioria das lojas grava com apresentador/legenda.
- **Instagram Reels**: listar perfil/reels pede login (yt-dlp: URL não suportada sem login); busca na web só devolve páginas de perfil. Bloqueado.
- **TikTok / Kwai**: busca na web não indexa vídeos; sem login dá captcha. Não tentado além disso.
- Consultas registradas em buscas-feitas.csv (ferramentas `ytsearch_ytdlp` e `yt_canal_shorts`); vídeos olhados gravados em memoria-mineracao.jsonl (ids `yt…`).

## Rodada 4 — Meta, limite de buscas ampliado (27/11)
Pedido: completar 12 (faltavam 8). Decisões do Roberto valendo nesta rodada: elétrico **ou híbrido**, 0 km ou seminovo, qualquer modelo; **limite de 2 por modelo liberado para Dolphin/Dolphin Mini** (evitando repetir unidade/loja); limite de buscas ampliado de ~15 para ~40 (uma coleta por vez, 8–12 s entre buscas).
Resultado: **+6 aprovados (05–10) nesta rodada + 2 da rodada 4B fora da Meta (21–22) = 12 de 12.**

### Aprovados (rodada 4)
| # | Arquivo | Veículo | Motorização | 0 km / seminovo | Loja | Valor (fonte) | Entrada | Parcela | Áudio | Trecho | Marcar na edição |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 05 | aprovados/05-carro-byd-dolphin-mini-gs-2025.mp4 | BYD Dolphin Mini GS 2024/2025 (44 mil km) | 100% elétrico | seminovo | Victor Seminovos (ex-reserva R1) | R$ 109.654 — valor médio estimado (média de 7 anúncios reais de Dolphin Mini GS 2024/25 e 2025) | R$ 19.700 | R$ 987 | sem fala — manter | 32,5–45,8 s (13,3 s) | plaqueta colorida na placa (tampar); 2 flashes vermelhos de transição do próprio vídeo |
| 06 | aprovados/06-carro-volvo-ex30-ultra-2024.mp4 | Volvo EX30 Ultra 2024 (20 mil km) | 100% elétrico | seminovo | Motion Motors | R$ 207.900 (preço do anúncio) | R$ 37.400 | R$ 1.871 | sem fala — manter | 0–15 s | plaqueta "Motion Motors" na placa (tampar) |
| 07 | aprovados/07-carro-byd-dolphin-mini-gs-0km-2027.mp4 | BYD Dolphin Mini GS 2027 | 100% elétrico | 0 km | Plaza Veiculos | R$ 128.990 (preço do anúncio) | R$ 23.200 | R$ 1.161 | sem fala — manter | 10–25 s | sem placa; reflexo espelhado de letreiro no vidro só antes de 9 s (fora do corte) |
| 08 | aprovados/08-carro-byd-king-dm-i-2026.mp4 | BYD King DM-i 2026 | híbrido plug-in (DM-i) | seminovo | Pague Menos Veículos (Manaus/AM) | R$ 149.900 (preço do anúncio, "POR 149.900") | R$ 27.000 | R$ 1.349 | voz do vendedor em off → trocar por música | 21–30 s + 39,6–44,9 s (14,3 s) | pula arte com preço e "CLICK NO LINK"; pessoas pequenas ao fundo pelo para-brisa (não em destaque) |
| 09 | aprovados/09-carro-omoda-5-hev-0km-2027.mp4 | Omoda 5 1.5 TGDI HEV Luxury 2027 | híbrido (HEV) | 0 km | Carmax Santos | R$ 159.990 — anúncio sem preço; preço "a partir de" da concessionária oficial Omoda Jaecoo ADTSA (Biblioteca da Meta, 27/11) = preço de lançamento da versão Luxury | R$ 28.800 | R$ 1.440 | voz do vendedor → trocar por música | 16,9–25,8 s + 42,5–45,6 s (12,0 s) | letreiro "carmax", mão na maçaneta e bancos com plástico ficam fora do corte |
| 10 | aprovados/10-carro-byd-dolphin-mini-gs-2025.mp4 | BYD Dolphin Mini GS 2024/2025 | 100% elétrico | seminovo | RH Motors Cuiabá/MT (ex-reserva R2) | R$ 109.654 — valor médio estimado (mesma média do 05) | R$ 19.700 | R$ 987 | sem fala — manter | 2,0–11,35 s + 12,2–15,7 s (12,9 s) | plaqueta "RH Motors" na placa traseira (tampar); título inicial e vendedor sentado ao fundo ficaram fora |

Todos conferidos no olho (folhas de quadros a 1–4 qps em `r4/`), sem pessoa em destaque, sem mão, sem texto/legenda/preço por cima. Valores pelo `calc_valores.py --reel`.

### Reprovados (rodada 4)
- Elite Car, Dolphin Mini GS 0 km (1544579934161245): mãos quase o vídeo todo e letreiro "Elite Car" no início e fim; trecho limpo de ~5 s.
- Reserva R3 (Robinho): letreiro no alto, pessoa aos 22 s, mãos; continua reserva só se o Roberto quiser.
- Cezana Motors, Dolphin Mini GS 0 km (2 vídeos): cartaz no para-brisa, balões, vinheta com telefone; o outro só tem detalhes.
- Pague Menos, BYD Song Pro: título e preço por cima; trecho com o carro inteiro tem faixa da loja no teto.
- V12 Motors: vitrine com vários carros, King só em detalhes.
- Elite Car, GWM Ora 5 0 km (3 vídeos): (1) letreiro, mãos e reflexo de quem filma; (2) test drive com motorista; (3) apresentador.
- Leapmotor Brasil, B10 (2 vídeos): arte Black Friday com preço o vídeo todo.
- Blackout Custom, Omoda 5: grafite gigante da loja e mãos; anúncio de PPF, não de venda.
- ZS Autos, Hyundai Kona Hybrid: caixa de texto (modelo/ano/km) em todo o trecho externo.
- Seminovos Felice, Omoda 5 HEV: mão com a chave no início; só ~10 s limpos (reserva fraca).
- Chevrolet Jorlan Goiânia, Captiva EV: vídeo de estilo de vida com modelo atuando.
- RYK Motors, BYD Song Plus DM-i: legenda falada o vídeo todo e mãos.

### Buscas (rodada 4, 39 na Meta, uma coleta por vez, sem bloqueio)
pagina:644982622805736 (Motion Motors, 9), pagina:691189374071371 (Jorlan-ev, 60), dolphin mini 0km (78), dolphin mini pronta entrega (55), dolphin gs 0km (48), byd dolphin seminovo (27), song pro seminovo (20), byd king seminovo (12), seal u (45), sealion 7 (39), haval h6 seminovo (11), yuan pro 0km (3), yuan plus seminovo (1), ora 5 0km (18), ex30 (39), captiva ev (72), omoda e5 (69), aion y (38), leapmotor (66), kona elétrico (19), nissan leaf (9), peugeot e-2008, fiat 500e, corolla hybrid, kicks e-power seminovo (vazio — termo novo, não bloqueio), tiggo 8 phev (14), carro híbrido seminovo, elétrico pronta entrega, byd seminovo (tempo esgotado ao carregar; os 8 termos anteriores foram recoletados), controle "ex30" com 1 rolagem (29 → sem bloqueio), byd seminovo (41), dolphin mini usado (57), carro híbrido seminovo (36), elétrico pronta entrega (62), corolla hybrid (57), fiat 500e (49), peugeot e-2008 (63), pagina:109961088856166 (Plaza, 27), pagina:565704573285556 (Pague Menos, 100).
Peneira com `--sem-preco` (0 km de concessionária raramente põe preço; valor vem do preço oficial/anúncio da marca). A peneira dos lotes 3 e 4 (meta-21/22/23) foi interrompida quando chegamos a 12; o que ficou sem analisar não entrou na memória e pode ser peneirado depois.
Lojas: +4 boas (Plaza, Victor Seminovos, RH Motors, Carmax Santos) e +5 ruins (Leapmotor Brasil, Blackout Custom, Cezana Motors, V12 Motors, RYK Motors) em `07-Ferramentas/referencias/lojas-brutos.json`.

### Para a edição
- Tapar placa/plaqueta em 05, 06, 10 (e conferir 07–09); trocar a voz por música em 08 e 09 (e no 04, já anotado).
- Nos textos da @beto.cred, falar "carta de crédito" (não usar a outra palavra).
