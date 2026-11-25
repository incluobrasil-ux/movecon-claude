---
tipo: treinamento
atualizado: 2026-11-20
---
# Conceitos: como a operação funciona

## 1. Do Grok ao Claude
Antes, eram 16 bots no Grok, cada um com uma função (Minerador, Editor, Estrategista, Postador...). Agora, um Claude Code no PC do vendedor faz todas as funções, lendo as regras deste cofre.

| Antes (bot no Grok) | Agora (função no cofre) |
|---|---|
| Minerador, Mapeador de Redes | [[Minerador]] |
| Editor de Vídeo | [[Editor]] |
| Estrategista de Criativo | [[Copywriter]] |
| Postador de Redes | [[Publicador Instagram]] e [[Publicador Marketplace]] |
| Analista, Chefe de Gabinete | [[Analista]] |
| CEO | [[Coordenador]] (ordem do trabalho e trava de aprovação) |

**O que não muda:** as regras. Elas estão escritas em `01-Regras/` e `03-Padroes/`. O Claude lê antes de cada tarefa. Quem decide continua sendo o vendedor (operador) e o gestor.

## 2. A esteira (a mesma para Instagram, TikTok e Marketplace)
```
MINERAR → EDITAR → ESCREVER → APROVAR → PUBLICAR → CONFERIR NO AR → MEDIR
```
| Etapa | O que é | Quem faz | Onde está a regra |
|---|---|---|---|
| Minerar | achar a matéria-prima: bens reais à venda, vídeos brutos, criativos que vendem | Claude | [[Mineracao - o que procurar]] |
| Editar | deixar foto e vídeo com cara de editor profissional, no padrão | Claude | [[Fotos de veiculo]] · [[Reel Instagram]] |
| Escrever | título, descrição, legenda, roteiro | Claude | [[Anuncio Marketplace]] · [[Reel Instagram]] |
| **Aprovar** | o vendedor olha a lista numerada e responde por escrito | **Vendedor** | [[Aprovacao e registro]] |
| Publicar | subir na conta certa, no ritmo combinado | Claude | [[Publicador Instagram]] · [[Publicador Marketplace]] |
| Conferir | abrir o link público e ver se está no ar, igual ao aprovado | Claude | skill `conferir-no-ar` |
| Medir | cliques, mensagens, o que repetir | Claude + vendedor | [[Analista]] |

**Regra que segura tudo:** nada vai ao ar sem OK escrito. O Claude prepara tudo; o vendedor aperta o botão "aprovo".

## 3. Mineração: o que é
Minerar é **procurar, com método, o que já está funcionando no mercado** e trazer a matéria-prima para a nossa operação. É sempre só leitura: nunca curtir, seguir, comentar ou mandar mensagem.

Existem três minerações:

| Mineração | Pergunta que responde | Fonte | Vira o quê |
|---|---|---|---|
| **Bens** | "Qual carro real, com fotos boas, eu posso anunciar hoje?" | Mobiauto (`miner.py`) | anúncio do Marketplace |
| **Criativos e brutos** | "Que vídeo de veículo eu uso de base? Que anúncio está rodando há meses?" | Biblioteca de Anúncios da Meta, Pexels, YouTube, TikTok Creative Center | Reel, estático, educativo |
| **Mercado** | "Quem está escalado no meu nicho? O que eu modelo? Onde tem pouca concorrência?" | Biblioteca da Meta, Central de Transparência do Google | escolha do nicho e do ângulo |

### Como saber se um anúncio "está escalado"
Régua única do cofre (nota de 0 a 10, em `07-Ferramentas/referencias/sinais-escala.md`):
- **muitos anúncios ativos** (20+ é escalado);
- **anúncio antigo ainda no ar** (30+ dias; 90+ é forte). Ninguém paga por meses um anúncio que não vende;
- **a mesma oferta em várias páginas**;
- **variações novas** sendo testadas.

9–10 escalada pesada · 7–8 **modelar** · 5–6 monitorar · 0–4 descartar.

### Modelar não é copiar
Modelar = pegar a **estrutura** (gancho, ordem, formato, oferta) e fazer com o nosso material. Copiar = usar o vídeo, a foto ou o texto do outro. Exemplo real de 19/11: o carrossel "um carro por card, entrada a partir de R$ X + parcelas" estava no ar há 1.485 dias. Modelamos o formato, não as imagens.

**Nunca modelar (risco):** promessa de contemplação ("1 parcela e na garagem"), venda de carta contemplada, revisional ("reduz 70% das parcelas"), consórcio como investimento.

### Limites da mineração
- Uma busca a cada 5 a 10 segundos.
- A Meta bloqueia depois de algumas dezenas de buscas. Sinal: "Nenhum anúncio corresponde" num termo que tinha resultado. Parar e voltar em 1 a 2 horas.
- Webmotors e OLX dão erro 403: não insistir.

## 4. Edição: o que é
Editar é transformar o bruto minerado em peça pronta, **com cara de trabalho humano**, no padrão do cofre.

| Peça | Formato | O que a edição faz |
|---|---|---|
| **Reel de oferta (ilustrativo)** | 9:16, 1080x1920, 12 a 15 s, tela cheia | ~5 cortes secos de filmagem real de **uma unidade**; 2 pílulas fixas "Entrada de R$ X" / "Parcelas de R$ Y"; rodapé "CLIQUE NO LINK / E FALE DIRETAMENTE NO WHATSAPP"; @ da conta no canto; placa tarjada; áudio em −14 LUFS |
| **Estático / carrossel** | 1080x1350 | foto real tratada no alto + texto em Anton/Montserrat (estilo "noturno") |
| **Educativo** | 9:16, 30 s | gancho nos 3 primeiros segundos, título fixo no topo, 8 quadros de texto, fundo de filmagem real, "chama no link da bio" só da metade em diante |
| **Fotos do Marketplace** | até 10 fotos | tarja preta na placa acompanhando a inclinação, sem rosto, sem logo de loja, capa externa |

**Nunca dentro da mídia:** aviso legal, "imagem ilustrativa", MOVECON, nome de pessoa, rosto, placa legível, letreiro de loja. "Ilustrativo" vai **só na legenda**.

**Valores:** nunca de cabeça. Sempre do `calc_valores.py` (entrada ≈ 18% e parcela ≈ 0,9% no Reel; entrada 20% com teto no Marketplace). Ver [[Calculo de entrada e parcela]].

## 5. Por que "volume" funciona e onde ele quebra
- Orgânico é jogo de **quantidade com qualidade mínima**: muitas peças boas, muitas contas, cada uma na sua praça e no seu nicho.
- O que derruba conta: **mesmo arquivo em várias contas**, rajada de posts, várias contas no mesmo navegador, mudar a cidade da conta, ignorar aviso.
- Por isso: cada conta tem perfil próprio no BitBrowser, criativo próprio (mesmo modelo pode, a mesma foto não), ritmo por degrau e **regra de parada**: apareceu aviso, para aquela conta e avisa.

## 6. Duas réguas de compliance
- **Peças** (Reel, legenda, Marketplace): texto livre, dentro de [[Compliance]]. No Marketplace, vender **o veículo com parcelamento**, nunca "consórcio" ou "carta de crédito" (a Meta proíbe serviço financeiro lá).
- **Atendimento** (conversa com o lead): frases bloqueadas. Contemplação é "por sorteio ou lance, conforme o regulamento do grupo, sem data garantida". Nunca prazo, nunca "crédito aprovado", nunca Pix.
