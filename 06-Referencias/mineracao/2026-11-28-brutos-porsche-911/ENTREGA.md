---
tipo: entrega
data: 2026-11-28
funcao: minerador (brutos, seção 2)
perfil: "@tananconsorcio"
---
# Porsche 911 filmados fora de loja (28/11/2026)

**Pedido do Samuel (28/11, ~01h35):** "faz mineração de algumas porshes 911 pa posta n queo nd em conscecionaia" (algumas Porsches 911 para postar, nada em concessionária).

**Como li o pedido:** só vídeo de 911 filmado **fora de loja**: rua, avenida, estrada, beira de lago, campo de aviação. Ficou fora todo vídeo dentro de showroom, na frente da fachada da loja, em estúdio de loja, em oficina, em lava-rápido e em Porsche Center. Faixa do perfil: R$ 200 mil a R$ 1 milhão. Regra de 27/11 mantida: 1 vídeo por lugar.

## Resultado: 3 aprovados (1 com ressalva) e 2 reservas

Valores no modelo "passo a passo" do perfil: tabela 4659, 80 meses, `calc_valores.py --hp1`. As demais parcelas depois do lance seguem [[Calculo de entrada e parcela]].

| # | Arquivo | Carro | Valor (fonte) | 1ª parcela | Lance | Demais depois do lance | Onde foi filmado | Duração |
|---|---|---|---|---|---|---|---|---|
| 01 | `01-porsche-911-carrera-t-2023-850mil.mp4` | 911 Carrera T 2023, 2.679 km | R$ 849.990 (**preço do anúncio**) | R$ 32.410 | R$ 255.752 | R$ 10.329 | avenida e estrada em Valinhos/SP, filmado de outro carro | 14,1 s |
| 02 | `02-porsche-911-carrera-s-992-822mil-fipe.mp4` | 911 Carrera S (992), cinza | R$ 821.999 (**valor médio estimado**: FIPE nov/2026, ano estimado 2022) | R$ 32.410 | R$ 255.752 | R$ 10.329 | estacionamento na beira de um lago | 10,8 s |
| 03 | `03-porsche-911-carrera-992-737mil-fipe.mp4` | 911 Carrera (992), verde-azulado | R$ 736.596 (**valor médio estimado**: FIPE nov/2026, ano estimado 2022) | R$ 28.048 | R$ 221.324 | R$ 8.939 | ruas arborizadas de bairro em São Paulo | 14,7 s |
| R1 | `R1-porsche-911-turbo-992-1066mil-fipe.mp4` | 911 Turbo (992), amarelo | R$ 1.065.521 (valor médio estimado: FIPE nov/2026, ano estimado 2021) | R$ 40.721 | R$ 321.330 | R$ 12.978 | pista e estrada de um campo de aviação | 15,1 s |
| R2 | `R2-porsche-911-992-amarelo-curitiba.mp4` | 911 (992), amarelo, versão sem dado | R$ 736.596 (valor médio estimado, versão não identificada) | R$ 28.048 | R$ 221.324 | R$ 8.939 | ruas do centro de Curitiba, filmado de outro carro | 11,8 s |

- **01 e 02 dão a mesma conta:** os dois fecham com as mesmas 6 cartas de R$ 142.084,49 (R$ 852.507 somados).
- **Valor do 02, 03, R1 e R2:** o vídeo não mostra preço. Segui a decisão de 25/11 ("Sim, usar FIPE... põe uma média"): média FIPE do modelo no ano estimado pelo vídeo, marcada como "valor médio estimado". Códigos FIPE: 911 Carrera S Coupe 3.0 = 035077-0; 911 Carrera Coupe 3.0 = 035076-1; 911 Turbo Coupe = 035014-1. As médias de cada ano (nov/2026) estão em `fipe/valores.json`.
- **Ressalva do 03:** não é anúncio de venda. É o vídeo de um dono divulgando um escapamento. O dono aparece em outras tomadas, que foram cortadas. Entra só se o Samuel aprovar esse tipo de fonte.
- **R1 fica de reserva** porque passa de R$ 1 milhão, o teto da faixa do perfil. **R2 é reserva fraca:** o retrovisor do carro de quem filma aparece de 8 a 12 s.

## Para o Editor
- **Placa:** tampar em todos (`tampa_plaquetas.py`). No 01, a moldura da placa tem as letras "EA", o logo da loja: tampar junto.
- **02 tem só 10,8 s limpos:** desacelerar para 0,9x na edição (fica com 12 s). Saíram do corte as tomadas com o prédio da loja ao fundo e as transições do vídeo original (borrão, faixa preta, ida ao preto).
- **01:** prédio com detalhe vermelho no alto, bem ao longe (9 a 14 s). Não é logo legível.
- Tudo é 9:16 em pé. Os aprovados são 720x1280 e a R2 é 1080x1920. Quadro a quadro, não há tela preta nem quadro borrado nos cortes (conferido por brilho e nitidez).
- Trechos usados e observações de cada vídeo: `planilha.csv` e `planilha-reserva.csv`.

## O que o Samuel precisa decidir
1. **Aprovar o 03** (vídeo de dono, não é anúncio de venda)?
2. **Usar a R1** (911 Turbo de R$ 1,07 milhão, acima da faixa)?
3. **Quer mais 911?** Sem login, a Meta e o YouTube já deram o que tinham hoje. Caminhos que rendem mais:
   - links do TikTok copiados no app (o `tiktok_links.py` baixa sem login);
   - ou o Instagram com a exceção de conta logada só para leitura, como no agro de 26/11. Isso só com OK dele.

## Por que vieram poucos
- **Meta:** quase todo 911 anunciado é filmado dentro de loja. Os vídeos são de showroom, estúdio da loja, apresentador, fachada com letreiro, oficina de película ou estética, ou Porsche Center. Os que são filmados na rua costumam ser GT3, GT3 RS ou Turbo S, de R$ 1,3 a 3,9 milhões, acima da faixa.
- **YouTube:** os Shorts de 911 são de fora do Brasil (EUA, Europa, Ásia), com gente na frente, carro em evento, miniatura, jogo ou lava-rápido. Também não trazem preço.

## Números
- **Meta (Biblioteca de Anúncios, sem login):** 79 buscas, das quais 36 também olharam anúncios já encerrados. Vieram 1.957 vídeos (1.420 diferentes). Não houve bloqueio. Os "nenhum anúncio" saíram no meio de buscas com resultado, então eram termos sem vídeo.
- **YouTube (sem login):** 14 buscas por texto deram só 4 Shorts em pé. As 9 abas Shorts de hashtag (#porsche911, #porsche992, #911carrera etc.) deram 421 Shorts em pé.
- **Peneira** (`triagem_brutos.py`, com `--sem-preco` e uma passada `--sem-venda`): 936 analisados, 221 passaram.
- **Conferidos no olho:** 139 (1 por loja ou canal), em folhas de 10 quadros espalhados pelo vídeo inteiro.
- **Aprovados:** 3 de 3 lugares diferentes. **Reservas:** 2.

## O que rendeu e o que não rendeu
- **Rendeu:** a página da EA Motors (Valinhos/SP), que filma na rua. Também rendeu a passada da peneira sem palavra de venda (`--sem-venda`): o 02, o 03 e a R1 têm texto curto, sem "km", "valor" ou "disponível".
- **Não rendeu:**
  - termos com ano, cor e cidade, e anúncios já encerrados com 20 rolagens (só repetiam o que já tinha sido visto);
  - termos de aluguel, casamento e experiência (track day com gente e capacete);
  - Shorts por texto, porque a busca do YouTube devolve quase só vídeo deitado;
  - Shorts por hashtag (421 vídeos, 0 aprovados).
- **Lojas que filmam fora:** EA Motors e Concred Veículos (beira de lago). A Supernova Automarcas filma em campo de aviação, mas o carro é de mais de R$ 1 milhão.

## Arquivos
- `10-Trabalho/2026-11-28-brutos-porsche-911/`:
  - `aprovados/` e `reserva/`, cada uma com o seu `md5.txt`;
  - `planilha.csv` e `planilha-reserva.csv`;
  - `prancha.jpg` e `prancha-reserva.jpg`;
  - `folhas/` (mosaicos da conferência e `qa-cortes-2.jpg`);
  - `hd/` (originais em HD) e `cand/` (candidatos);
  - `fipe/` (consulta pública da tabela FIPE);
  - `rodada1.sh` a `rodada4.sh`.
- Cópia sem vídeo: `06-Referencias/mineracao/2026-11-28-brutos-porsche-911/`.
- md5 dos aprovados:
  - `e608a538b73db1b0c96997cceae1f9bf  01-porsche-911-carrera-t-2023-850mil.mp4`
  - `c3be0492e7ec252a8b2e4f2a222f525d  02-porsche-911-carrera-s-992-822mil-fipe.mp4`
  - `a696bb6d1cefdf935f5f4a8a1ff8bdf6  03-porsche-911-carrera-992-737mil-fipe.mp4`

Nada foi postado. O próximo passo é a edição no modelo "passo a passo", e só com o pedido do Samuel.
