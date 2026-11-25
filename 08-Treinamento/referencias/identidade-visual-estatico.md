# Identidade visual neutra do pacote (Planeje Seu Crédito)
- Cores: grafite #1E2227 (texto/fundo de vídeo), off-white #F3F1EC (painel de carrossel/texto em vídeo), acento único azul-marinho #1F3A5F (número do slide, valores, faixa do alto nos vídeos).
- Tipografia: Montserrat (ExtraBold na capa e nas legendas de vídeo; SemiBold no corpo; Medium no rodapé).
- Carrossel 1080x1350: foto tratada 1080x810 no alto + painel off-white com texto (margem 80 px). Slides educativos: só tipografia sobre off-white com fio azul-marinho.
- REGRA DO SAMUEL (21/10, 22h29): o aviso "Imagem ilustrativa" ou "Vídeo ilustrativo" NUNCA vai na arte nem no vídeo. Ele vai só na legenda de todo post que usa imagem ou vídeo de terceiro.
- @planejeseucredito pequeno no rodapé do último slide dos carrosséis. Nenhuma marca d'água em vídeo. Nenhum nome de pessoa ou empresa.
- Scripts que geram tudo: /workspace/movecon/criativos/_work/pacote/ (carrossel.py, apply_carrossel.py, gen_ass.py, render_videos.py, video.py, fullframe.py).

## ESTILO A, "Noturno/cinema" (carrosséis; escolhido pelo Samuel às 22h29 de 21/10). Padrão dos carrosséis daqui em diante
- **Regra (Samuel, 22h29):** NUNCA colocar "Imagem ilustrativa" nem "Vídeo ilustrativo" na tela (nem selo, nem canto, nem card final), em nenhum carrossel nem capa. O aviso vai só na legenda do post: escrever "Imagem ilustrativa." na seção "Legenda do post" de cada LEIA-ME. O resto do texto legal (sem data garantida, valores de referência) continua no rodapé discreto do slide final (e do slide com valores) e na legenda.
- **Paleta:** fundo grafite-noite #121519 · títulos off-white #F3F1EC · corpo cinza-claro #D6DAE0 · acento único azul-claro #7AA3D6 (o marinho #1F3A5F da marca clareado para o escuro; usado no número da capa, no contador n/8, nos valores em R$, em "me chama no direct", nos marcadores e na seta) · rodapé/@ #8A929C.
- **Fontes:** Anton (títulos, sempre caixa alta) · Montserrat SemiBold (corpo) · Montserrat ExtraBold (destaques no corpo) · Montserrat Bold (contador) · Montserrat Medium (rodapé legal). São Google Fonts, já instaladas.
- **Formato e margens:** 1080x1350, margem de 80 px em todos os lados (texto, seta e rodapé dentro dela).
- **Capa:** foto 1080x760 no topo, com fusão de 300 px para o fundo embaixo. Fio de acento 90x6 px em x80 y120. Título embaixo, bloco terminando em y≈1205: linhas em Anton 112 (encolhe até caber em 920 px). O número da capa vai gigante em azul-claro, com a altura de 2 linhas de Anton 86 ao lado. Seta → azul-claro (70 px, traço 5) no canto inferior direito, em y=1268, x até 1000.
- **Slides internos:** foto 1080x620 no topo, com fusão de 260 px. Contador "n/8" em Montserrat Bold 32 azul-claro, com fio de 60 px, em y≈662. Título em Anton 84 (entrelinha 1,2) a partir de y=704 e corpo em Montserrat SemiBold 50 (entrelinha 1,36); os dois encolhem juntos até caber antes do rodapé ou de y=1200. Vários blocos (ex.: "Financiamento:" / "Consórcio:") ficam empilhados. Resumo em lista com marcador quadrado azul-claro. Seta nos slides 1 a n−1; no último, sem seta.
- **Rodapé legal:** Montserrat Medium 23 #8A929C, alinhado à esquerda, terminando em y≈1272; @planejeseucredito à direita, só no último slide.
- **Foto:** só foto/frame real (nunca IA), em alta (frames 4K/1080p dos brutos, sem ampliar além de ~1,25x). Recorte, Lanczos, contraste +5%, saturação −6%, nitidez leve, grão fino (σ≈4,5). Sem HDR nem filtro. Placa sempre tampada (painel escuro na cor do para-choque), sem letreiro oficial nem legenda do anunciante, sem pessoa, sem logo de concorrente. Não associar modelo a faixa de crédito errada (ex.: X1 não vai com 306 mil).
- **Script:** /workspace/movecon/criativos/_work/estiloA/estiloA.py (sistema) + jobs.py (texto e foto de cada slide). Rodar com `nice -n 19 python3 jobs.py <pasta-saida>/ [01|02|03]`.
- **Estilo A, capa com valores (01 v3, 22h55):**
  - Foto 1080x720 no topo. Embaixo dela, de cima para baixo: linha pequena em Montserrat ExtraBold 36 azul-claro; valor da carta em Anton (até 190, encolhe para caber) em amarelo #F2C94C, com o complemento em Anton 42% off-white na mesma linha de base; card #1C2027 com raio 18, barra amarela de 8 px e linhas em Montserrat SemiBold 40 com números em ExtraBold 56 amarelo; gancho em Montserrat SemiBold 36 off-white; rodapé legal de valores.
  - O bloco nunca cobre o carro.
  - Valores em R$ sempre em amarelo #F2C94C, que contrasta mais no grafite que o azul-claro.
  - Foto coerente com a faixa: 696 mil → X5.
