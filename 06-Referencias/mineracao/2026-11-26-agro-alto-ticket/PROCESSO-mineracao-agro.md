---
tipo: referencia
data: 2026-11-26
---
# Como minerar vídeo de máquina agrícola (o processo que funciona)

> Pedido do Samuel (26/11/2026): "encontre o melhor processo de mineração para o nicho".

## O que aprendemos em 26/11 (por que o agro é diferente)
- **Biblioteca de Anúncios da Meta quase não serve.** Revenda de trator e colheitadeira paga pouco anúncio de vídeo, e o pouco que paga vem com legenda, logo ou vendedor falando. Em 61 buscas: 787 vídeos, quase nenhum aproveitável na faixa.
- **YouTube Shorts:** a busca sem login pediu "confirme que você não é um robô" neste PC. Não contornamos. Pode funcionar em outro PC/horário (`shorts_youtube.py` para sozinho se bloquear).
- **Instagram é onde o agro posta.** As revendas postam Reels crus (volta em torno da máquina, sem texto). Duas portas:
  1. **Hashtag do modelo** (#johndeere7230j, #s550, #uniport, #staraimperador, #axialflow, #t7260, #casemagnum...): rende 80 a 90 posts por hashtag. Hashtag genérica (#tratoragricola) rende pouco.
  2. **Perfil inteiro da revenda boa** (aba Reels): 27 posts por perfil, quase tudo da mesma revenda que já filma do jeito certo. É o "página inteira de loja boa" do caminhão e do carro.

## Passo a passo
1. **Antes:** `git pull`; leia `Ja minerado.md`, este arquivo e o `CATALOGO-o-que-postar.md` (o que cabe no ticket); rode `registro_buscas.py trator` (e colheit, pulveriz...).
2. **Achar os links (Instagram):**
   - **Com OK escrito do Samuel** (conta logada, só leitura): `node 07-Ferramentas/scripts/mineracao/ig_tags.mjs --porta <PORTA> --saida <pasta>/ig-links.json --tags <hashtags> --perfis <perfis>`. Abre uma aba própria, para no 1º aviso e se duas hashtags seguidas vierem quase vazias.
   - **Sem login (vendedor):** procure no app do Instagram do jeito normal (só olhando), copie o link dos Reels bons e cole num `links.txt`. Comece pelos perfis da lista abaixo.
3. **Ler os posts sem login:** `py -3 07-Ferramentas/scripts/mineracao/ig_posts.py <links.json ou links.txt> --saida <pasta>/ig.json`. Lê legenda (preço), perfil, data, formato e o link do vídeo. Pula post só de foto e post já visto em qualquer PC.
4. **Peneira:** `py -3 07-Ferramentas/scripts/mineracao/triagem_brutos.py <pasta>/ig.json --pasta <pasta> --sem-preco --min-preco 500000 --max-preco 1000000 --palavras "<palavras da categoria>"`. Depois filtre pelo preço da legenda (ou valor médio estimado do modelo, marcado assim).
5. **Olho:** folha de quadros de 1 em 1 s do vídeo INTEIRO (a peneira só olha 30 s). Reprove apresentador, selfie, legenda da fala, logo por cima, foto parada, máquina vendida. Escolha 11 a 15 s com a máquina inteira no começo.
6. **Baixar só os aprovados:** `py -3 -m yt_dlp -f "bv*+ba/b" --merge-output-format mp4 -o <arquivo> https://www.instagram.com/p/<código>/`; corte o trecho com ffmpeg.
7. **Fim:** ENTREGA + planilha em `06-Referencias/mineracao/`, linha em `Ja minerado.md`, commit e push (buscas-feitas, memória, lojas-brutos).

## Palavras da peneira por categoria
| Categoria | --palavras |
|---|---|
| trator grande | `trator\|7230j\|7200j\|6190j\|t7\|t8\|magnum\|puma\|bh\s?2\|t250\|fendt` |
| colheitadeira | `colheitadeira\|s5[0-9]0\|s6[0-9]0\|axial\|\bcr\s?\d\|9690\|5690` |
| pulverizador | `pulverizador\|uniport\|imperador\|patriot\|m40[0-9]0\|defensor` |
| plantadeira | `plantadeira\|semeadora\|absoluta\|\bdb\s?\d\|maestro` |
| distribuidor | `h[ée]rcules\|distribuidor` |
| café/cana | `colhedora\|coffee\|austoft\|a88\|9900` |
| máquina pesada | `escavadeira\|carregadeira\|motoniveladora\|esteira` |

### Máquina trabalhando (colhendo, pulverizando, plantando)
Post de operador não tem cara de anúncio e a peneira pula. Para pegar: `--sem-venda` + `--palavras` **só com modelos da faixa** (ex.: `uniport\s?(3030|4530)|axial|4150|5150|s5[4-9]0|t7[\.\s]?260|7230`). Valor = médio estimado do modelo (planilha de preços), marcado assim.

## Revendas que filmam do jeito certo (comece por elas)
Lista completa em `07-Ferramentas/referencias/lojas-brutos.json` (chave `instagram:<perfil>`).
| Perfil do Instagram | O que deu em 26/11 |
|---|---|
| **classi.agricola** (Classificados Agrícola, PR) | 6 aprovados nas duas entregas: volta limpa no campo, 1080x1920 ou maior, preço na legenda |
| zanquettaagromaquinas | 2 tratores aprovados |
| agronexus_maquinas | 1 trator aprovado (baixa resolução) |
| tracanmaquinas (concessionária Case, MG) | colheitadeira colhendo; corte antes do cartão final |
| m.a_agronegocios | trator plantando |
| **Evite:** fg_maquinasagricolas, silonio_5smaquinas | texto e tarja por cima |

## Rendimento de 26/11 (para planejar)
- 1.548 links → 1.218 vídeos lidos → 295 analisados na peneira → **8 aprovados** (cerca de 1 a cada 150 links).
- Perfil de revenda boa rende muito mais que hashtag: os 27 posts do classi.agricola deram 5 aprovados.
- Hashtag a evitar: **#s550** (é o Ford Mustang) e **#axialflow** (turbina e bomba d'água).
- Meta: 314 vídeos, 0 aprovado. Shorts: bloqueado neste PC.
