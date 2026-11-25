---
tipo: funcao
substitui: bot Minerador + Mapeador de Redes (Grok)
skill: minerar-bens, minerar-criativos, minerar-mercado
---
# Minerador

**Um trabalho só:** achar o que o mercado comprova, só lendo. Três pedidos possíveis: bens para o Marketplace, criativos e vídeos de referência, mercado e concorrentes. O que procurar em cada um: [[Mineracao - o que procurar]].

## Quando o pedido chega
1. Identifique o tipo (bens, criativos ou mercado), a quantidade e o prazo. Se faltar só o tipo, pergunte. O resto, assuma e declare.
2. Crie `10-Trabalho/AAAA-MM-DD-<tipo>-<tema>/`.
3. **Antes de buscar, confira o que já existe** (decisão de 25/11/2026: nada de retrabalho):
   - rode `git pull`;
   - leia [[Ja minerado]];
   - rode `py -3 07-Ferramentas/scripts/mineracao/registro_buscas.py <palavra>` para ver os termos já buscados em qualquer PC;
   - confira as filas e levas abertas.
   Reaproveite o que existe e só busque o que falta. O gancho do Claude Code mostra isso sozinho quando o pedido fala de mineração.

## Ferramentas
| Para | Ferramenta |
|---|---|
| Bens (Mobiauto) | `07-Ferramentas/scripts/mineracao/miner.py` (ajustar caminhos antes do 1º uso) |
| Vídeos brutos (Meta), passo 1: coleta | `07-Ferramentas/scripts/mineracao/brutos_meta.py --lojas-boas --rolagens 8 --saida <pasta>/meta.json`, e depois termos: `brutos_meta.py "termo1" "termo2" --rolagens 5 --saida <pasta>/meta2.json`. Lê os dados do JSON da página com o Chrome sem imagem nem vídeo (cerca de 250 MB de RAM, cerca de 25 s por página) |
| Vídeos brutos (Meta), passo 2: peneira | `07-Ferramentas/scripts/mineracao/triagem_brutos.py <pasta>/meta.json [meta2.json] --pasta <pasta>`. **Um processo só.** Pula loja ruim e anúncio já visto ([[lojas-brutos]] e `10-Trabalho/_memoria-mineracao.json`), reprova rosto na capa sem baixar e lê só os primeiros 30 s (cerca de 7 s por vídeo). Resultado em `<pasta>/triagem.json` |
| Lojas boas e ruins | `07-Ferramentas/referencias/lojas-brutos.json`: atualize no fim de cada mineração |
| Vídeos brutos (YouTube) | listar: `py -3 -m yt_dlp --flat-playlist --print "%(id)s\|%(duration)s\|%(title)s" "ytsearch25:<termo>"`; baixar: `-f "bv*[height<=1920][ext=mp4]+ba[ext=m4a]/b"` |
| Biblioteca da Meta | `07-Ferramentas/scripts/biblioteca_meta.py "termo" --pais BR --rolagens 8 --saida <pasta>/x.json` |
| Google | `07-Ferramentas/scripts/transparencia_google.py dominios.txt saida.json --regiao BR` |
| Marketplace dos concorrentes | contas do BitBrowser, só leitura ([[Contas e navegador]]) |
| Valores dos bens | `07-Ferramentas/scripts/calc_valores.py` |

## Passos (bens)
1. Coletar candidatos na faixa, um por vez, de 5 a 10 s entre requisições.
2. Para cada bem aprovado nos critérios, montar a [[Pasta do bem]] com fotos originais, `fonte.txt` e `calculo.md`.
3. Passar a leva para o [[Editor]] (fotos) e o [[Copywriter]] (textos).
4. Índice `LEVA-NN.md` + folha de contato.

## Passos (criativos e mercado)
1. Termos: até 15 buscas sobre o tema, os mais importantes primeiro (o bloqueio pode chegar cedo).
2. Para os 5 a 10 mais fortes: buscar pela página, com print.
3. Nota de escala ([[Mineracao - o que procurar]]); marcar RISCO.
4. Entregar no modelo [[Entrega de mineracao]] e avisar o [[Copywriter]] dos ângulos que valem modelar.

## Fim de toda mineração (obrigatório)
1. Copie o `ENTREGA.md` e a planilha para `06-Referencias/mineracao/AAAA-MM-DD-<tema>/`. Não leve foto nem vídeo de terceiro, porque o repositório é público.
2. Ponha uma linha no topo de [[Ja minerado]].
3. Faça commit e push, junto com `07-Ferramentas/referencias/buscas-feitas.csv` e `memoria-mineracao.jsonl`. Os scripts gravam esses dois arquivos sozinhos.
4. Se o PC não tiver permissão de push, mande o `ENTREGA.md` e a planilha para o Samuel.

## Nunca
- Curtir, seguir, salvar, comentar, mandar mensagem, responder anúncio, logar com conta de alguém.
- Usar cookie para passar bloqueio ou resolver captcha.
- Completar lista com quem não escala. "Não achei nada" só com a lista do que foi testado.
- Gastar com ferramenta paga sem OK.
- **Minerar com conta logada** (perfil do BitBrowser, Facebook pessoal). A Biblioteca abre sem login pelos scripts. O BitBrowser só serve para ler o Marketplace, nas contas listadas no [[Perfil-do-operador]].
- **Criar robô ou processo novo** quando já existe ferramenta no cofre. A `biblioteca_meta.py` já guarda anunciante, texto, dias no ar, cópias do criativo e print. Falta alguma coisa? Proponha ao gestor antes de fazer.
- Disfarçar o robô para não ser detectado. Vale o ritmo do padrão. Se bloquear, pare.

## Aprendizados
- A Meta bloqueia por IP depois de um número variável de buscas (já foi 10, 17, 45; com 4 coletas em paralelo, cerca de 130 em 1 h). Sinal: "Nenhum anúncio corresponde" em termo que tinha resultado. Esperar de 1 a 14 h.
- YouTube pede "não é robô" e cerca de metade das tentativas falha: desacelerar e pular.
- TikTok: só o Creative Center abre sem login; os dias no ar são estimados pelo id do vídeo e precisam ser marcados como estimativa.
- Webmotors e OLX: erro 403.
- Brutos de caminhão (25/11/2026), primeiro teste no Claude:
  - Na Meta, o player entrega 360p. O link em 720p vem nos dados da página, e o `brutos_meta.py` já pega esse link.
  - Quase todo anúncio de loja tem legenda, preço ou logo queimados no vídeo inteiro. Os do portal Venda Truck sempre têm. De 26 baixados, 2 passaram.
  - No YouTube, procure título com o preço de **uma unidade só** ("R$ 325.000,00"). Canais de loja como o da 5001 Caminhões têm vídeo 1080p limpo depois que o apresentador sai. Resultado: 3 aprovados de 9.
  - ~~Vídeo horizontal só serve em 1080p ou mais.~~ **Substituído em 25/11:** o Samuel reprovou os horizontais recortados ("o formato do vídeo 3 4 5 estão incorretos"). Bruto só **vertical nativo**. Ver [[Mineracao - o que procurar]].
  - Em vídeo antigo, o preço pode não valer mais: marque na planilha.
- Mineração de 20 brutos de caminhão (25/11/2026). De onde vieram os 13 primeiros aprovados (cerca de 2.000 anúncios coletados):
  - **Página inteira de loja boa** (`--lojas-boas`): 3 (Russo Motors x2, Pátio 201). Foi o que mais rendeu por anúncio analisado.
  - **Palavra genérica do nicho** ("cavalo mecânico", "caminhão 3/4 seminovo", "caminhão truck seminovo", "ford cargo seminovo", "basculante seminovo valor"): 5.
  - **Termo de anúncio de unidade única** ("caminhão único dono cautelar", "caminhão km original valor", "caminhão pronto para trabalhar valor"): 3.
  - **Busca funda com anúncios antigos** (`--inativos --rolagens 20`, palavra do modelo, ex.: "constellation"): 1, e trouxe 5 vezes mais matéria-prima. É o método do Samuel: "procuramos pelas palavras-chave de cada nicho e descemos até encontrar algo no padrão".
  - **Busca pelo nome da loja:** 1 (Anderson Veículos).
- O que mais reprovou, em ordem: apresentador ou vendedor no vídeo; legenda, preço ou logo por cima; letreiro grande da loja ao fundo; vídeo que não é 9:16; tela final ou vinheta.
- A busca funda com anúncios antigos traz muito anúncio que não é de venda (perfume, impermeabilizante, suspensão). Por isso a peneira exige palavra de caminhão **e** sinal de venda.
- **Limite do servidor de vídeo da Meta:** com mais de 6 downloads ao mesmo tempo, ele passa a recusar conexão ("vídeo não abriu") por cerca de 20 minutos. Em PC forte, no máximo 4 a 6 processos de peneira. O link do vídeo expira em algumas horas: peneire no mesmo dia da coleta.
- A detecção de texto (OCR) não enxerga toda faixa de texto (ex.: branco sobre azul na parte de baixo da tela), e a conferência no olho continua obrigatória. Ela também não lê logo.
- Tomadas curtas valem (Samuel, 25/11: "pode ser take dos vídeos, uma quantidade curta de tempo dá pra aproveitar"): a peneira aceita vídeo com 10 s ou mais somando trechos limpos de 3 s ou mais.
