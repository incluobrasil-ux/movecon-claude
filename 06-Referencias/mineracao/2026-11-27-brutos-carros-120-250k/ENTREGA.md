# Mineração de vídeos brutos: carros de R$ 120 mil a R$ 250 mil, um vídeo por lugar (27/11/2026)

**Pedido do Samuel (27/11, ~17h35):** "quero fazer mais minerações pro meu perfil, agora nessa mineração nova não quero nada do mesmo lugar, só um video de um lugar depois vai atras de outro pra n ficar tao repetivivo o local, se for um insta que tem videos variados no mesmo lçugar pode pegar mas se for em uma conscecionaria por exemplo melhor pegar poucos, quero carros de 120.000 até 250.000".

**Para quem:** @tananconsorcio, o perfil do Samuel.

**Quantidade:** o pedido não dizia. A meta foi 20 e saíram **12**. O motivo está mais abaixo.

**Regra nova aplicada:** **1 vídeo por lugar** (loja, concessionária ou pátio).
- Está registrada em [[Decisoes]] e em [[Mineracao - o que procurar]].
- Substitui o "no máximo 2 da mesma loja" das 04h50.
- A Avantgarde e a GrandPrix ficaram de fora, porque já deram quase todas as ofertas que estão no perfil.

## Como foi feito
- **Biblioteca da Meta, sem login:** 80 buscas em 3 rodadas com o `brutos_meta.py`, uma por vez.
- **Shorts do YouTube:** 25 buscas com o `shorts_youtube.py`.
- **Peneira:** `triagem_brutos.py`, com preço de R$ 120 mil a R$ 250 mil e nome de modelo de carro.
- **Conferência no olho:** quadro a quadro, com foco nos pontos de corte.
- **Download em HD (720x1280):** direto do link da coleta. Só a 11 veio menor, em 576x1024.
- **Bloqueios:** nenhum. "trailblazer seminova" e "peugeot 3008 seminovo" vieram vazios, mas a busca seguinte trouxe resultado. Então era falta de anúncio, não bloqueio.

## Resultado em uma linha
- **Coletados:** 3.656 vídeos na Meta (420, 1.621 e 1.615 nas 3 rodadas) e 15 Shorts em pé.
- **Peneira:** analisou 414 e **67 passaram** (8, 28 e 31).
- **No olho:** conferi 59, 1 por loja. Saíram **12 aprovados, cada um de um lugar diferente**, e mais 6 reservas.

## Aprovados (pasta `aprovados/`, 9:16, com `md5.txt`)
| # | Veículo | Ano | Valor do anúncio | Entrada (Reel) | Parcela (Reel) | Lugar | Observação |
|---|---|---|---|---|---|---|---|
| 01 | Chevrolet S10 LTZ 2.8 4x4 Diesel | 2026/2026 | R$ 249.990 | R$ 45.000 | R$ 2.250 | RH Motors (Cuiabá/MT), showroom | tampar plaqueta RH MOTORS |
| 02 | Fiat Toro Volcano 1.3 Turbo Flex | 2023 | R$ 129.900 | R$ 23.400 | R$ 1.169 | Motion Motors, ao ar livre entre árvores | tampar plaqueta da loja |
| 03 | Jeep Commander Overland 2.0 Turbo Diesel 4x4 | 2022 | R$ 154.900 | R$ 27.900 | R$ 1.394 | Bacana Veículos, casa com gramado | 13 clarões de transição da loja cortados (ficam cortes rápidos); tampar plaqueta BACANA |
| 04 | Nissan Frontier Platinum 2.3 Diesel 4x4 | 2024 | R$ 212.900 | R$ 38.300 | R$ 1.916 | Espindola Carros, estúdio escuro | tampar plaqueta EC Espindola |
| 05 | Volvo XC40 R-Design AWD 2.0 Turbo | 2020 | R$ 159.990 | R$ 28.800 | R$ 1.440 | Royal Motors, showroom com teto de LED | tampar plaqueta da loja |
| 06 | Hyundai Creta Ultimate 1.6 Turbo | 2025 | R$ 154.900 | R$ 27.900 | R$ 1.394 | NM5 Select Car, galpão | abre pela traseira inteira; tampar plaqueta NM5 |
| 07 | Fiat Pulse Abarth 1.3 Turbo | 2026 | R$ 124.990 | R$ 22.500 | R$ 1.125 | Prime Veículos (Alfenas), showroom com LED roxo | abre pela traseira inteira; conferir plaqueta |
| 08 | Toyota Hilux SW4 3.0 SRV 4x4 Diesel | 2014 | R$ 152.900 | R$ 27.500 | R$ 1.376 | Sul Repasses, estrada com montanhas | **ressalva de ano** (abaixo); tomadas reordenadas para abrir com o carro inteiro; tampar plaqueta Sul Repasses |
| 09 | Toyota Hilux SRV 2.8 Diesel 4x4 Automática | 2022 | R$ 209.900 | R$ 37.800 | R$ 1.889 | Wilsinho Veículos, estacionamento aberto | abre pela traseira inteira; tampar plaqueta da loja |
| 10 | Jeep Compass Série S T270 1.3 Turbo | 2025 | R$ 169.800 | R$ 30.600 | R$ 1.528 | Brasil Car Multimarcas (Blumenau/SC), showroom | abre pela traseira inteira; tampar plaqueta grande BRASILCAR |
| 11 | Fiat Fastback Abarth 1.3 Turbo | sem dado | R$ 149.900 | R$ 27.000 | R$ 1.349 | Inaudio Schossler Júnior, showroom branco | **576x1024**; o anúncio não diz o ano; tampar plaqueta da loja |
| 12 | Caoa Chery Tiggo 7 Pro 1.6 Turbo | 2023 | R$ 130.000 | R$ 23.400 | R$ 1.170 | Mil Milhas Automóveis, showroom com bandeirinhas | tampar plaqueta da loja |

- **Mix:** 8 SUVs e 4 picapes, de R$ 124.990 a R$ 249.990, de 12 lojas diferentes.
- **Valores:**
  - O preço é o que está escrito no anúncio.
  - Entrada e parcela vêm do `calc_valores.py --reel` (18% e 0,9%), que é a regra do perfil para carro abaixo de R$ 400 mil (decisão de 27/11, 04h10).
- **Trecho usado:**
  - É a parte sem texto, sem pessoa e sem letreiro.
  - Quando havia mais de um trecho limpo, eles foram juntados em ordem.
  - O detalhe por vídeo está na `planilha.csv`. O vídeo inteiro de cada um está em `hd/`.
- **Áudio:** todos têm som. Ouça na edição: se tiver voz, troque por música ([[Musicas liberadas]]).

### Ressalvas
- **08, SW4 2014 com 189 mil km:** a idade máxima de carro que a Alpha aceita ainda está em aberto em [[Pendencias]] ("Uso do crédito: seminovo, ano de fabricação"). Confirme antes de postar.
- **11, Fastback:** está em 576x1024, abaixo dos 720p do padrão. Esse tamanho já foi aceito antes, no caminhão e no agro. O ano não está no anúncio.
- **Modelos repetidos:** não há. Pulse e Fastback são da mesma família da Fiat. A Hilux SRV e a SW4 são modelos diferentes da Toyota.

## Reservas (pasta `reserva/`)
| # | Veículo | Valor | Lugar | Por que ficou na reserva |
|---|---|---|---|---|
| R1 | VW Virtus Comfortline TSI 2026 | R$ 122.900 | Motion Motors | mesma loja do 02 (outro lugar ao ar livre) |
| R2 | Toyota Hilux SRV 2.8 Diesel 2019 | R$ 188.800 | Egon Schweigert (Blumenau) | já tem Hilux (09); trecho do carro inteiro curto |
| R3 | Toyota Hilux SRV 4x4 2012 | R$ 127.900 | MCar Veículos, estrada com palmeiras | carro de 2012 (idade máxima em aberto) |
| R4 | Jeep Commander Overland Diesel 2023 | R$ 162.990 | Alpha Car | já tem Commander (03); lente grande-angular distorce |
| R5 | Fiat Toro Ultra 2.0 Diesel 2022 | R$ 125.900 | RS Automóveis Bauru | já tem Toro (02); vendedor no resto do vídeo |
| R6 | Nissan Kicks Turbo Platinum 2026 | R$ 144.900 | levelcaroficial | trecho limpo de só 6 s |

## Reprovados no olho, e por quê
- **Texto, legenda ou preço por cima o vídeo todo** (a maior parte):
  - Commander (Mandrik, George, FC7, Camila/Astra);
  - Creta (JL Motors, barra_auto, Slz, Re9ve, Isidoro);
  - HR-V (Toni Motors), Corolla (Lucas Multimarcas), L200 (PH Motors);
  - Ranger (V11), Sentra (Roçado, Garage 09), Taos (New Motors), Tracker (Londero).
- **Apresentador ou vendedor:**
  - Frontier (Auto Confiança), Toro (Moderna), SW4 (Pelegrinelli, que também tem etiquetas pequenas);
  - Sentra (Placidino), Taos (Planetcar, Ravena);
  - Audi A3 (CF Motors, direção e selfie), Fastback (M5).
- **Letreiro grande da loja:**
  - Ranger (Guerreiros), Polo GTS (Mega, com laço gigante), BMW X1 (GO! CARS);
  - Hilux (Junqueira, Willian Camionetas), Tiggo 7 Pro (Bernardino).
- **Outros motivos:**
  - **Arte animada:** Taos (Berke).
  - **Vídeo deitado com faixa preta:** Hilux 2014 (V3).
  - **Sem o carro inteiro no trecho limpo:** Amarok V6 (Taubaté), BMW X1 (Autogrif), Sentra (Davanti, com adesivo no para-brisa).
  - **Pessoa dentro do carro:** Corolla Cross (ShoppingCar).
- **Preço real fora da faixa:** Fastback da M5. O anúncio diz "FIPE R$ 121.700 **POR R$ 114.990**", e a peneira leu o valor da FIPE.

## Por que 12, e não 20
Com 1 vídeo por lugar, cada rodada de 25 buscas rendeu de 4 a 6 aprovados. Este PC já fez 131 buscas na Meta hoje, e a Meta bloqueia por IP depois de um número variável de buscas ([[Minerador]]). Por isso parei em 12. Faltam 8 para chegar a 20, e dá para fazer amanhã com os termos da lista abaixo.

## Termos usados
- **Rodada 1:**
  - páginas inteiras de 12 lojas boas: Wcar BH, Rio Doce, Ohcarro, Motion, Plaza, Victor, RH Motors, Carmax Santos, ShoppingCar, ConnectMotors, Araguaia, Londero;
  - termos: tiguan allspace, hyundai tucson, kia sportage, outlander, pajero sport, jetta gli, civic touring, t-cross highline, nissan sentra, cruze premier, equinox, trailblazer, audi q3, mercedes gla, bmw x1, peugeot 3008, zr-v, ford territory (+ "seminovo").
- **Rodada 2:**
  - termos gerais: seminovo único dono, suv seminovo único dono, picape seminova único dono, sedan seminovo, acabou de chegar seminovo, seminovo baixa quilometragem, seminovo garantia de fábrica, carro de garagem à venda;
  - versões: toro ultra, ranger limited, s10 high country, frontier platinum, l200 triton sport, amarok v6, hilux srx, compass limited, commander overland, corolla xei, hr-v exl, tracker premier, creta ultimate, pulse abarth, bmw 320i, mercedes c200, volvo xc40;
  - 15 Shorts.
- **Rodada 3:**
  - termos gerais: seminovo revisado concessionária, seminovo laudo cautelar aprovado, carro seminovo aceita troca, suv 7 lugares seminovo, picape 4x4 diesel seminova, sedan automático seminovo, seminovo top de linha, carro blindado seminovo, seminovo pronta entrega, estoque novo seminovos, seminovo abaixo da tabela, carro de procedência;
  - versões: compass série s, civic exl, kicks platinum, sentra exclusive, taos highline, jetta comfortline, polo gts, fastback abarth, ranger xlt, hilux srv, bmw x1 sdrive, audi a3 sedan, tiggo 7 pro;
  - 10 Shorts.
- **O que mais rendeu:**
  - **Termos gerais que puxam muitas lojas diferentes.** A rodada 3 deu 31 que passaram na peneira, de 27 lojas.
  - **Páginas de lojas boas renderam pouco.** O PC do Roberto passou por elas à tarde e os anúncios já tinham sido vistos.
  - **Shorts:** 15 vídeos em pé em 25 buscas, nenhum aprovado.
- **Para a próxima rodada:**
  - termos gerais novos: "seminovo impecável", "seminovo com garantia", "carro revisado à venda", "suv automático seminovo", "picape cabine dupla seminova";
  - versões: "corolla cross xre", "hr-v touring", "tiggo 8", "song plus" (fora da lista de elétricos do Roberto), "renegade trailhawk".

## Arquivos
- `aprovados/`: os 12 vídeos e o `md5.txt`. `reserva/`: os 6 vídeos e o `md5.txt`.
- `planilha.csv` e `planilha-reserva.csv`. Colunas: arquivo, veículo, ano, tipo, valor, entrada, parcela, loja, página, link do anúncio, duração, resolução, proporção, áudio, trecho usado e observação.
- `prancha.jpg` e `prancha-reserva.jpg`.
- Coleta e peneira: `meta.json`, `meta-2.json`, `meta-3.json`, `shorts*.json` e `triagem-*.json`.
- Conferência: `folhas/` com os quadros. Vídeos inteiros: `cand/` (360p) e `hd/` (720p).

## Depois da edição (27/11, noite)
- **12, Tiggo 7 Pro (Mil Milhas): saiu.** Na conferência da edição apareceram o reflexo de quem filmava na lataria e as bandeirinhas do banco Safra no teto da loja.
- **No lugar entrou a reserva R2:** Hilux SRV 2.8 Diesel 2019 (Egon Schweigert, Blumenau), R$ 188.800, entrada R$ 34.000 e parcelas de R$ 1.699.
- **A leva editada ficou com 7 SUVs e 5 picapes.** Os vídeos prontos estão em `10-Trabalho/2026-11-27-edicao-carros-120-250k/editados/`, com `LEIA-ME.md`, `LEGENDAS.md` e `md5.txt`.
- **Ajustes de corte na edição:**
  - 03: tirados as tomadas com a faixa de cerveja ao fundo e um trecho em que a plaqueta entrava pela borda;
  - 05: a 2ª tomada começa depois que a plaqueta sai;
  - 06: tomadas reordenadas para abrir com a traseira inteira;
  - 08: tiradas a caixa de preço que sobrava no 1º corte e as transições de efeito;
  - 12: tirado o escurecimento até o preto.

## Próximo passo
1. Edição no modelo A (entrada e parcela da tabela acima), com o [[Padrao minimo de edicao]]. **Feita em 27/11 à noite** (ver acima).
2. Ao postar, a oferta fica **só na aba Reels**, fora da grade do perfil (decisão de 27/11, ~17h).
3. Antes do 08, confirme a idade máxima do carro.
