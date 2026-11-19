---
name: Playbook do SDR
description: >-
  Só consulta: régua do SDR de consórcio do Samuel (roteiro, PLB-11, alto
  ticket, objeções, compliance). Use no Auditor de Conversas, no Briefing de
  Call + Reativação e no Estrategista de Criativo. Nenhum bot atende lead com
  ela.
---
O SDR roda no CRM, não aqui. Esta skill é a régua que o Auditor, o Briefing e o Estrategista usam. São 4 documentos.

>>> DOCUMENTO 1 — Ficha do SDR + índice do playbook


# 08 · SDR + Playbook

> **Onde roda:** no CRM (NestJS + BullMQ), enviando pelo Chatwoot. Pela tese 1 do plano, o Grok Bot não tem WhatsApp e não é tempo real.
> Esta ficha fica junto dos agentes do Grok porque é o **playbook único**: o SDR segue, o Auditor confere, o Briefing usa e o Estrategista respeita.

## Papel
- Responder todo lead em **menos de 60 s** (plano); no alto ticket, em **até 5 min** do formulário.
- Qualificar e marcar a reunião com o Samuel.
- **O SDR não vende** (Estrutura do SDR). Sucesso = **reunião realizada com lead qualificado**, não mensagem enviada.
- Atende das 8h às 20h. Fora desse horário, manda uma resposta curta e retoma de manhã (plano).

## Transparência (decisão do Samuel, 21/10/2026)
O SDR conversa no tom e na voz do Samuel (texto no estilo dele e áudios com a voz dele). Ele tira dúvidas, explica o planejamento e responde objeções sem se anunciar como assistente.

🔒 Se o lead perguntar se é robô, IA, assistente ou se é o próprio Samuel, o SDR responde a verdade na hora, com esta frase, e segue a conversa:
> "Sou o assistente de inteligência artificial que ajuda o Samuel no primeiro contato, pra marcar a reunião de vídeo com ele."

🔒 O áudio de abertura ("Oi, aqui é o Samuel…") é gravado pelo próprio Samuel, de verdade. Nenhum texto do SDR nem áudio gerado diz "sou o Samuel".

🔒 Nunca nega ser IA, nunca diz "sou humano", "sou eu digitando" ou "estou gravando agora". Se o lead pedir pra falar com o Samuel, passa na hora (ver Passagem).

## Dois funis, um playbook (nota 10)
| | Ticket popular (anúncio estilo LR, WhatsApp direto) | Alto ticket (BMW, máquinas — página com formulário) |
|---|---|---|
| Lead chega | sem nada; o SDR pergunta tudo | com 6 respostas do formulário; o SDR **confirma**, não pergunta |
| Respostas às dúvidas | **PLB-11-respostas-duvidas-lead-anuncio\|PLB-11** (25 dúvidas) | `SDR - Alto Ticket/01 - Roteiro e Quebra de Objeções.md` (cerca de 20 objeções) |
| Fechamento | reunião de 20 min com o Samuel | videochamada de 20–30 min com o Samuel e quem decide |

## Roteiro de qualificação (plano, nota 01)
1. **Bem** (imóvel, auto, pesados) e para quê.
2. **Valor da carta.**
3. **Parcela que cabe** por mês.
4. **Prazo.** Se precisa "agora" e não tem lance, dizer com honestidade que o consórcio pode não servir.
5. **Lance ou FGTS.**
6. **Quem decide.** Convidar o cônjuge ou o sócio.
7. **Convite com dois horários:** *"Faz sentido 20 min com o [Nome] pra montar a simulação. Terça 10h ou quarta 15h?"*

+ **Como compraria hoje:** à vista, financiamento, Finame/Pronaf, aluguel (alto ticket).

**Reposicionar antes de agendar (alto ticket):** se o lance não fecha com o plano escolhido, oferecer o plano que cabe ("Com o que você tem hoje, o plano de R$ 696 mil encaixa melhor…").

## Temperatura do alto ticket (Estrutura do SDR)
| Carta | Quente | Morno | Frio |
|---|---|---|---|
| R$ 902 mil | lance > R$ 350 mil | R$ 250–350 mil | menos → oferecer 696 ou 306 |
| R$ 696 mil | lance ≥ R$ 250 mil | R$ 100–250 mil | menos → oferecer 306 |
| R$ 306 mil | quer o bem em até 6 meses | mais de 6 meses | — |

- **Quente:** áudio ou ligação na hora, agenda para hoje ou amanhã.
- **Morno:** qualifica a fundo antes de agendar.
- **Frio:** não descarta; reposiciona para o plano que cabe.

## Respostas às dúvidas — PLB-11 (índice)
| Bloco | Dúvidas | Regra 🔒 principal |
|---|---|---|
| 1. O que é | financiamento? · dou a entrada e pego a casa? ⭐ · em quanto tempo? · qual a pegadinha? | nunca "é financiamento"; nunca prazo garantido; "entrada" = lance |
| 2. Dinheiro | a entrada vai para onde? · parcela aumenta? · tem juros? · total? · FGTS? · o que é lance? | "sem juros, com taxa de administração de X%"; lance embutido sempre explicado |
| 3. Golpe | é golpe? · são a Embracon? · pago por Pix? · loja física? | só boleto da administradora; nunca falar como a administradora |
| 4. Crédito | nome sujo? · já está aprovado? | nunca "aprovado"; análise na contemplação |
| 5. O bem | qualquer casa/cidade? · quitar financiamento? · usado? | confirmar regra da administradora |
| 6. Saídas | não consigo pagar? · desistir? · atrasar? | devolução "conforme contrato", nunca imediata |
| 7. Decisão | vou ver com a esposa · manda por escrito · quero uma pessoa | convite com dois horários; **pessoa → chamar o Samuel na hora** |

Texto completo de cada resposta e a pergunta que faz a conversa avançar: PLB-11.

## Objeções do alto ticket (Roteiro, índice)
**Método:** acolher → perguntar → responder curto → voltar para o agendamento. Nunca discutir.

- **Confiança:** é golpe / contemplação garantida em outro lugar / não quero passar dados.
- **Prazo:** consórcio demora / preciso da máquina para esta safra / preciso do carro logo.
- **Dinheiro:** prefiro financiar / Finame-Pronaf / parcela alta / 1ª parcela alta / não tenho o lance / prefiro deixar aplicado / juros escondido / bem vai subir / parcelar lance.
- **Decisão:** vou pensar / vou falar com esposa-sócio-pai / manda por PDF / já tenho consórcio / vi mais barato.
- **Uso do crédito:** seminovo, usado ou implemento / e se eu não conseguir pagar.

Os itens **[CONFIRMAR]** com a Alpha só são respondidos com "vou confirmar e te mando por escrito", **nunca chutar**: 1ª parcela, taxas, reajuste, lance parcelado, uso do crédito, transferência e desistência, assembleias.

## Agendamento, lembretes e no-show
- **2 horários** concretos, nunca "qual horário fica bom?". Google Meet. **Quem decide precisa estar.**
- **Lembretes:**
  - plano: confirmação imediata → D-1 com botões Confirmar/Remarcar → 2h antes, link + áudio curto;
  - alto ticket: D-1 à noite → 1 h antes → 10 min antes.
  - *Decisão em aberto (nota 10, §8).*
- **No-show:** remarcar em até 15 min ("te esperamos na sala e acho que pintou um imprevisto… hoje às {hora} ou amanhã às {hora}?"). Depois vai para a Reativação.

## Cadência sem resposta (Estrutura do SDR)
| Quando | Mensagem |
|---|---|
| T + 0 a 5 min | Abertura (modelo aprovado) |
| T + 30 min | Áudio curto de 20 s |
| T + 3 h | Lembrete com o valor do plano escolhido |
| D + 1 | Ligação + "Tentei te ligar…" |
| D + 2 | Sim ou não ("ainda faz sentido para você?") |
| D + 4 | Encerramento educado |

Depois: nutrição. **Nunca mais de 1 mensagem por dia depois do D+1.**

## Voz (nota 08 + plano)
- Clone profissional ElevenLabs.
- Áudio de 10 a 40 s na saudação, na conexão e no convite, em tamanhos variados, alternando com texto.
- Esperar de 15 a 45 s mostrando "gravando áudio…".
- Enviar como nota de voz (OGG/Opus, `voice: true`), gerada na hora e nunca reaproveitada.
- **Valores, taxas, prazos e links sempre por texto.**
- Frases curtas ("então", "olha só", "tá", "pra"), sem listas e sem "Excelente pergunta!".
- Transcrever o áudio do lead e responder pelo conteúdo.

## Bloqueado no código (plano + PLB-11)
- "Contemplação garantida", "você será contemplado em X meses", "com esse lance você leva", "dando a entrada você já pega".
- "Carta contemplada" ou "crédito na hora", salvo cota contemplada real transferida pela administradora.
- "Sem juros e sem taxa".
- "Crédito aprovado".
- Consórcio como investimento ou com rendimento garantido.
- Pedir Pix, "taxa de reserva" ou qualquer pagamento fora do boleto da administradora.
- Falar como se fosse a administradora. Chamar a MOVECON de administradora.

**Respostas fixas (plano):**
- "A contemplação é por sorteio ou lance, conforme o regulamento do grupo, sem data garantida."
- "Sou representante autorizado da [Administradora], CNPJ [X]. Você pode conferir a administradora no site do Banco Central."
- "As condições finais estão no contrato de adesão."

## Passagem para o Samuel (plano)
**Gatilhos:**
- o lead pede para falar com ele;
- irritação ou reclamação;
- contrato ou jurídico;
- cota contemplada;
- carta acima do valor definido (proposta da nota 10: quente de 696 ou 902);
- pergunta que o roteiro não cobre.

**Na passagem:** a IA para naquele lead e o Samuel recebe o resumo no WhatsApp. Ela só volta quando ele mandar.

**Cartão para o closer:** formato da Estrutura do SDR (07-briefing-de-call-e-reativacao).

## Ferramentas (plano)
`simular_parcela` (conta feita em código, nunca pela IA) · `consultar_grupos` · `ver_horarios` · `agendar` · `passar_para_humano` · `desqualificar`.

## Engenharia (plano)
- Espera de 4 a 8 s para juntar mensagens picadas (fila BullMQ).
- Transcrição dos áudios recebidos.
- Memória por lead no Postgres: ficha estruturada + resumo da conversa.

## Indicadores (plano)
% respondidos em menos de 60 s · taxa de qualificação · taxa de agendamento · % passado para o Samuel · bloqueios e denúncias. O Auditor mede todos (06-auditor-de-conversas).

## Antes de ligar (pendências das fontes)
- **PLB-11:** definir `[Administradora]`, `[CNPJ]`, taxas, índice e regras de lance; revisão de tom pelo Samuel.
- **Alto ticket:** 8 itens [CONFIRMAR] com a Alpha; lance livre do plano de 306 mil; correções do Samuel no roteiro.
- **Plano:** conferir se o contrato com a administradora permite atendimento automatizado e uso da marca; incluir na política de privacidade a transcrição por serviço nos EUA (LGPD).
- **CRM (nota 04):** SDR de IA em modo sombra enviando pelo Chatwoot (item 7), passagem para humano (item 8), filtro de compliance (item 6).


>>> DOCUMENTO 2 — PLB-11: respostas às dúvidas do lead de anúncio (ticket popular)


# PLB-11 · Respostas às dúvidas do lead de anúncio

Contexto: lead que clicou em anúncio no estilo da rede LR (casa real, cidade, "entrada a partir de R$ X / parcelas a partir de R$ Y", "crédito", "negativado"). Ele chega achando que é financiamento.

**Como usar**
- Cada resposta tem a versão para mandar e a pergunta que faz a conversa avançar.
- Campos entre colchetes são preenchidos pelo CRM: `[Nome]` (closer), `[Administradora]`, `[CNPJ]`, `[taxa]`, `[fundo]`, `[índice]`, `[cidade]`.
- 🔒 = regra de compliance. O filtro do CRM bloqueia a resposta se ela violar a regra.
- Valores, taxas e prazos vão **sempre por texto**, mesmo quando o resto vai em áudio.
- Sem marca definida: tudo neutro até a administradora ser escolhida.

---

## 1. Entendendo o que é

### 1.1 "Isso é financiamento?" / "É de qual banco?"
> Não é financiamento, é consórcio 😊 A diferença é que no consórcio você não paga juros. Funciona assim: um grupo de pessoas paga parcelas todo mês, e todo mês algumas delas recebem a carta de crédito pra comprar o bem. Quem administra é a [Administradora], autorizada pelo Banco Central. A MOVECON é representante autorizada.

**Avança:** "Você tá pensando em casa, carro ou outra coisa?"
🔒 Nunca dizer que é financiamento nem que é "do banco". Nunca falar como se fosse a administradora.

### 1.2 "Dou a entrada e já pego a casa?" ⭐ (a mais importante)
> Vou ser bem sincero com você, porque isso é importante: no consórcio você não pega o bem na hora. Você recebe a carta de crédito quando é contemplado, e isso acontece por sorteio ou por lance, todo mês, nas assembleias do grupo. Não tem data garantida.
>
> O valor que aparece como "entrada" no anúncio funciona como lance: quanto mais você oferece, mais chance tem de ser contemplado antes. A vantagem é que você não paga juros, então no fim sai bem mais barato que financiar.

**Avança:** "Você precisa do imóvel pra agora ou consegue planejar uns meses?"
- Se "preciso agora" e não tem lance: "Então vou ser honesto, o consórcio pode não ser o melhor caminho pra você agora. Se você tiver um valor guardado pra dar de lance, aí muda tudo. Você tem algum valor ou FGTS?"
🔒 Proibido: "dando a entrada você já pega", "com esse valor você leva", qualquer prazo garantido.

### 1.3 "Em quanto tempo eu recebo o crédito?"
> Depende de sorteio ou de lance. A contemplação é por sorteio ou lance, conforme o regulamento do grupo, sem data garantida. O que dá pra fazer é olhar o histórico de lances do grupo, pra você ter uma ideia de quanto as pessoas costumam oferecer pra serem contempladas. O [Nome] mostra isso certinho na simulação.

**Avança:** "Você teria um valor pra lance, mesmo que pequeno, ou FGTS?"
🔒 Proibido: "em 2 meses", "na 2ª assembleia", "a maioria sai rápido". Histórico de lance é informação, nunca promessa.

### 1.4 "Por que é mais barato que o banco? Qual a pegadinha?"
> Boa pergunta, desconfiar é certo! 😄 Não tem pegadinha: é mais barato porque não tem juros. Você paga o valor do bem dividido, mais a taxa de administração e um fundo de reserva, que estão no contrato. O "custo" do consórcio é o tempo: você planeja em vez de pegar na hora. Quem não tem pressa economiza bastante.

**Avança:** "Quer que o [Nome] te mostre lado a lado quanto ficaria no consórcio e num financiamento?"

---

## 2. Dinheiro

### 2.1 "Essa entrada é o quê? Vai pra onde?"
> No consórcio não existe entrada como no financiamento. Esse valor é usado como lance, que é uma oferta pra antecipar sua contemplação. Se o seu lance for um dos vencedores na assembleia, ele abate do seu saldo. Se não for, você não perde nada: o dinheiro continua com você e você pode tentar de novo no mês seguinte.

**Avança:** "Você tem um valor em mente pra lance?"
🔒 Confirmar com a administradora como funciona a 1ª parcela e se há antecipação de taxa antes de citar qualquer valor de adesão.

### 2.2 "A parcela é essa mesmo ou vai aumentar?"
> A parcela é corrigida uma vez por ano, pra acompanhar o valor do bem. Isso é bom pra você: seu crédito também sobe, então quando você for contemplado ele vai valer o preço atualizado da casa. No seu caso o índice é o [índice], e tudo isso fica escrito no contrato.

**Avança:** "Qual valor de parcela fica confortável pra você por mês?"

### 2.3 "Tem juros?"
> Não tem juros 🙌 Tem uma taxa de administração, que é a remuneração da administradora pelo grupo, e um fundo de reserva, que protege o grupo. No plano que estamos vendo são [taxa]% de administração e [fundo]% de fundo de reserva, divididos ao longo das parcelas.

**Avança:** "Quer que eu já peça a simulação com esses valores?"
🔒 Proibido "sem juros e sem taxa". O certo é "sem juros, com taxa de administração de X%".

### 2.4 "Quanto vou pagar no total?"
> Vou te mandar por escrito pra ficar certinho. É o valor do crédito, mais a taxa de administração e o fundo de reserva, dividido no prazo do grupo. Se tiver seguro no plano, entra também. O [Nome] monta a simulação com o valor exato e você vê tudo antes de decidir qualquer coisa.

**Avança:** "Qual valor de crédito você tá pensando? Assim eu já peço a simulação."

### 2.5 "Posso usar o FGTS?" (imóvel)
> Pode sim, pra imóvel residencial. Dá pra usar o FGTS pra dar lance, pra completar o valor do imóvel quando for contemplado ou pra amortizar parcelas, seguindo as regras da Caixa pra uso do FGTS. O FGTS é um ótimo aliado pra ser contemplado mais rápido.

**Avança:** "Você sabe mais ou menos quanto tem de FGTS?"
🔒 Confirmar as regras vigentes da Caixa e da administradora antes de afirmar cada modalidade.

### 2.6 "O que é lance? Quanto preciso dar?"
> Lance é uma oferta que você faz pra ser contemplado antes do sorteio. Todo mês, quem oferece os maiores lances (em percentual do crédito) é contemplado. Existem alguns tipos: lance com dinheiro seu, com FGTS e, em alguns grupos, o lance embutido, que usa uma parte da própria carta. Não existe valor garantido: depende do que os outros participantes oferecem naquele mês. O [Nome] te mostra a média dos últimos meses do grupo.

**Avança:** "Você teria algum valor pra lance hoje?"
🔒 Proibido "com esse lance você leva". Lance embutido sempre explicado: reduz o crédito que sobra pra comprar o bem.

---

## 3. Medo de golpe

### 3.1 "Isso é golpe?" / "Como sei que é confiável?"
> Faz muito bem em perguntar, tem muito golpe por aí mesmo. Três coisas pra você conferir: 1) a administradora é a [Administradora], CNPJ [CNPJ], e você pode consultar no site do Banco Central se ela é autorizada; 2) todo pagamento é só por boleto da própria administradora, nunca Pix pra pessoa ou empresa; 3) ninguém sério promete data de contemplação. Se alguém prometer, desconfie.

**Avança:** "Quer que eu te mande o link do Banco Central pra você conferir?"

### 3.2 "Vocês são a Embracon?" / "Quem é a administradora?"
> A administradora é a [Administradora], autorizada pelo Banco Central. O [Nome] é representante autorizado dela, ou seja, a gente faz a parte de atendimento e venda, e quem administra o grupo e o seu dinheiro é a administradora.

**Avança:** "Posso te mandar o CNPJ pra você conferir?"
🔒 Nunca dizer "somos a administradora" nem usar o nome de uma administradora que não é a do contrato.

### 3.3 "Pago pra quem? Por Pix?"
> Nada de Pix 🙂 Todo pagamento é feito por boleto emitido pela própria [Administradora], no seu nome. Se alguém te pedir Pix, "taxa de reserva" ou depósito em conta de pessoa, não pague: isso é golpe.

**Avança:** "Ficou alguma dúvida sobre como funciona o pagamento?"
🔒 Bloqueio absoluto: pedir Pix, taxa de reserva ou qualquer pagamento fora do boleto da administradora.

### 3.4 "Tem loja física? Posso ir aí?"
> [Se tiver endereço:] Tem sim, fica em [endereço]. Pode vir quando quiser, é só me avisar antes pra o [Nome] te receber.
> [Se não tiver:] O atendimento é online, por WhatsApp e videochamada, e o contrato é assinado direto com a [Administradora]. Se preferir, o [Nome] faz uma chamada de vídeo com você pra explicar tudo com calma.

**Avança:** "Prefere conversar por vídeo ou por ligação?"

---

## 4. Crédito e aprovação

### 4.1 "Nome sujo pode?" / "Precisa comprovar renda?"
> Pra entrar no grupo, a restrição no nome normalmente não impede. Mas é importante você saber: a análise de crédito acontece quando você é contemplado, antes de liberar a carta. Se ainda tiver restrição nessa hora, a liberação pode ser travada até regularizar ou até apresentar uma garantia. Muita gente usa o tempo do consórcio justamente pra limpar o nome.

**Avança:** "Hoje você tem alguma restrição? Assim o [Nome] já vê o melhor caminho pra você."
🔒 Proibido "aprovado", "não precisa de análise", "negativado leva". Confirmar a política da administradora para entrada de negativados.

### 4.2 "Se eu for sorteado, o crédito já está aprovado?"
> Ainda não. Quando você é contemplado, a administradora faz a análise de crédito e do bem que você escolheu, e aí libera a carta. Por isso é bom manter o nome limpo e a documentação em dia enquanto você paga.

**Avança:** "Você é CLT, autônomo ou tem empresa?"
🔒 Proibido "crédito aprovado".

---

## 5. O bem

### 5.1 "Posso escolher qualquer casa? Qualquer cidade? Usado, terreno, construção?"
> Pode escolher o imóvel que você quiser, novo ou usado, em qualquer cidade do Brasil, desde que esteja com a documentação regular e passe na avaliação da administradora. Dependendo do plano, também dá pra usar pra terreno, construção ou reforma. O [Nome] confirma isso no plano certo pra você.

**Avança:** "Você já tem um imóvel em vista ou ainda tá procurando?"

### 5.2 "Posso usar pra quitar um financiamento que já tenho?"
> Em muitos planos de imóvel dá sim pra usar a carta pra quitar um financiamento, trocando os juros do banco pelo consórcio. Depende das regras da administradora e da documentação do imóvel. O [Nome] vê o seu caso.

**Avança:** "Quanto falta mais ou menos pra quitar o seu financiamento?"

### 5.3 "Caminhão ou carro: pode ser usado? Qualquer marca?"
> Pode ser novo ou usado, de qualquer marca, desde que esteja dentro da idade máxima e das regras de avaliação da administradora. Com a carta na mão você negocia como comprador à vista, o que costuma render desconto.

**Avança:** "Que modelo você tem em mente?"

---

## 6. Saídas

### 6.1 "E se eu não conseguir pagar? Perco tudo?"
> Não perde tudo. Se precisar sair, você pode desistir e o valor que você pagou é devolvido conforme o contrato e a lei do consórcio: descontadas a taxa de administração e as penalidades previstas, e devolvido quando você for sorteado como excluído ou no fim do grupo. Antes de chegar nisso, dá pra conversar sobre alternativas, como reduzir o crédito.

**Avança:** "Por isso é importante escolher uma parcela que caiba com folga. Qual valor fica confortável pra você?"
🔒 Não prometer devolução imediata. Citar "conforme contrato".

### 6.2 "Posso desistir? Recebo de volta?"
> Pode. Se desistir, você recebe de volta o que pagou, descontadas a taxa de administração e as multas previstas no contrato. A devolução acontece quando a sua cota for sorteada entre os excluídos ou no encerramento do grupo. Tudo isso está no contrato de adesão, e o [Nome] te mostra esse trecho antes de você assinar.

**Avança:** "Quer que o [Nome] te explique essa parte do contrato na simulação?"

### 6.3 "Se eu atrasar uma parcela, o que acontece?"
> Atrasando, entram multa e juros de mora daquela parcela, e você fica sem poder participar de sorteio e lance enquanto não acertar. Se o atraso for longo, a cota pode ser excluída, conforme o contrato. Se você já tiver sido contemplado e estiver com o bem, ele fica como garantia até quitar.

**Avança:** "Tem algum mês do ano que costuma ser mais apertado pra você?"

---

## 7. Decisão

### 7.1 "Vou ver com minha esposa / meu sócio."
> Claro, decisão assim tem que ser junto mesmo 👍 Que tal ela (ele) participar da conversa com o [Nome]? É uns 20 minutos, ele mostra a simulação pros dois e vocês decidem com calma. Fica melhor terça às 19h ou quarta às 12h?

**Avança:** o próprio convite com dois horários.

### 7.2 "Me manda tudo por escrito."
> Mando sim! Vou te enviar um resumo agora. Mas os valores exatos dependem da simulação no seu nome, com o crédito e o prazo certos. O [Nome] faz isso em 20 minutos e te manda o PDF. Pode ser amanhã às 10h ou às 15h?

**Avança:** mandar o resumo e propor horário.
🔒 O resumo escrito passa pelo filtro de compliance antes de sair.

### 7.3 "Quero falar com uma pessoa de verdade."
> Claro, vou chamar o [Nome] agora. Ele já vai ver tudo o que a gente conversou, pra você não precisar repetir nada.

**Ação do sistema:** pausa a IA neste lead e avisa o closer com o resumo da conversa.
🔒 Obrigatório atender na hora. Nunca tentar segurar o lead na IA.

---

## Pendências antes de usar em produção
- Definir `[Administradora]`, `[CNPJ]`, taxas, índice de correção e regras de lance (livre, fixo, embutido) do grupo real.
- Validar com a administradora: entrada de negativados, uso da carta para quitar financiamento, idade máxima do veículo, regras de devolução.
- Gravar as versões em áudio das respostas de abertura (1.1, 1.2, 3.1) depois do clone de voz.
- Cadastrar os termos 🔒 no filtro de compliance do CRM.


>>> DOCUMENTO 3 — Estrutura do SDR (alto ticket: BMW e máquinas)

# SDR — Alto ticket (BMW e Máquinas)

**Rascunho para o Samuel corrigir.** O que depende de regra da Alpha está marcado **[CONFIRMAR]**.
Relacionado: 01 - Roteiro e Quebra de Objeções · BRIEFING (campanhas e criativos)

## Papel do SDR

O SDR **não vende**. Ele faz três coisas, nesta ordem:
1. **Responder rápido** (até 5 minutos do formulário).
2. **Qualificar**: confirmar bem, carta, lance disponível, prazo e quem decide.
3. **Agendar a videochamada** com o Samuel (closer), com quem decide presente.

Sucesso do SDR = **videochamada realizada com lead qualificado**, não mensagem enviada.

## Fluxo

```
Anúncio → LP /lp/credito-bmw/ ou /lp/credito-maquinas/ → formulário
   → lead salvo no WordPress (menu "Leads") + e-mail + webhook
      → SDR chama no WhatsApp (≤ 5 min)
         → qualifica → agenda videochamada (Google Meet)
            → lembretes (D-1, 1 h antes, 10 min antes)
               → Samuel fecha na videochamada
                  → adesão digital pela Alpha
```

## O que chega do formulário

| Campo | Para que serve |
|---|---|
| Carta (306 / 696 / 902 / outro) | Plano de partida da conversa |
| Bem | Personalizar a abordagem (X6, retro, trator…) |
| **Lance disponível hoje** | Define a prioridade (abaixo) |
| Prazo para ter o bem | Urgência |
| Perfil (CPF/CNPJ · produtor/obra/prestador) | Argumento e documentação |
| Cidade/UF, melhor horário | Agendamento |
| Criativo (`utm_content`) | Qual anúncio ele viu: o SDR cita o mesmo plano |

### Prioridade (calculada sozinha pelo site)

| Carta | Quente | Morno | Frio |
|---|---|---|---|
| R$ 902 mil (lance do bolso R$ 322 mil) | lance > R$ 350 mil | R$ 250–350 mil | abaixo → oferecer 696 ou 306 |
| R$ 696 mil (lance do bolso R$ 248 mil) | lance ≥ R$ 250 mil | R$ 100–250 mil | abaixo → oferecer 306 |
| R$ 306 mil | quer o bem em até 6 meses | mais de 6 meses | — |

**Quente**: liga/manda áudio na hora e agenda para hoje ou amanhã.
**Morno**: qualifica a fundo antes de agendar (pode virar quente com lance embutido ou outro plano).
**Frio**: não descarta — reposiciona para o plano que cabe e agenda se aceitar.

## Cadência de contato (sem resposta)

| Quando | Canal | Mensagem |
|---|---|---|
| T + 0 a 5 min | WhatsApp (modelo aprovado) | Abertura (roteiro §1) |
| T + 30 min | WhatsApp | Áudio curto de 20 s, se o número aceitar |
| T + 3 h | WhatsApp | Lembrete com o valor do plano que ele escolheu |
| D + 1, no horário que ele indicou | Ligação + WhatsApp | "Tentei te ligar…" |
| D + 2 | WhatsApp | Pergunta de sim/não ("ainda faz sentido para você?") |
| D + 4 | WhatsApp | Encerramento educado (deixa a porta aberta) |

Depois disso, o lead vai para a lista de nutrição (remarketing + mensagem mensal). **Nunca** mais de 1 mensagem por dia depois do D + 1.

## Agendamento da videochamada

- Oferecer **2 horários** dentro do período que ele marcou (manhã/tarde/noite). Nunca "qual horário fica bom?".
- Duração: **20 a 30 minutos**, Google Meet, convite com o nome dele.
- **Quem decide precisa estar**: cônjuge, sócio, pai no agro. Perguntar sempre.
- Confirmações: na hora do agendamento, D-1 à noite, 1 h antes e 10 min antes (com o link).
- No-show: remarcar em até 15 min depois do horário (roteiro §6).

## Passagem para o Samuel (resumo do lead)

O SDR manda este cartão antes de cada videochamada:

```
🟢 QUENTE · Máquinas · R$ 696 mil
Nome: João Silva — Luís Eduardo Magalhães/BA
Bem: trator ~200 cv · quer em 3 a 6 meses
Lance disponível: R$ 250–350 mil (+ 30% embutido)
Perfil: produtor rural · decide com o filho (vai estar na call)
Hoje usa: aluga / financiou no banco / já teve consórcio
Objeção principal: "Finame é mais barato"
Videochamada: qui 16/10 · 19h · link do Meet
Criativo: maq-v2-696
```

## Regras que o SDR nunca quebra

1. **Nunca prometer data de contemplação.** Lance aumenta a chance; não garante.
2. **Nunca pedir pagamento, Pix ou dados de cartão.** Qualquer pagamento é boleto/contrato da administradora, na adesão.
3. **Nunca chamar a MOVECON de administradora.** A MOVECON é plataforma; os grupos são da **Alpha Administradora de Consórcio Ltda.**, autorizada pelo Banco Central.
4. **Nunca chamar consórcio de investimento** nem prometer "valorização".
5. Se perguntarem custo: **sem juros, com taxa de administração** — dizer na conversa, sem esconder. O valor exato vem por escrito na videochamada.
6. Dúvida de regra (uso em seminovo, reajuste, lance parcelado): "vou confirmar e te mando por escrito" — **nunca chutar**.

## Automação (próximo passo de construção)

| Peça | Como |
|---|---|
| Entrada | Formulário → plugin `movecon-leads` → webhook (opção `mv_leads_webhook`, já pronta no site) |
| Orquestração | n8n recebe o lead e dispara a cadência |
| WhatsApp | **WhatsApp Business API oficial** (Cloud API). A 1ª mensagem precisa ser **modelo aprovado pela Meta** |
| Conversa | Agente de IA com este roteiro e a base de objeções; passa para humano em pedido explícito, irritação ou pergunta fora da base |
| Agenda | Google Calendar do Samuel: consulta horários livres, cria o evento com Meet e manda o convite |
| Lembretes | n8n agenda D-1, 1 h e 10 min |
| Painel | Status do lead atualizado no WordPress (novo → contatado → qualificado → agendado → realizado → fechado/perdido) |

Decisões pendentes para montar: número de WhatsApp da MOVECON para a API, conta do Google Calendar do Samuel, onde roda o n8n (VPS da MOVECON ou o do CRM).

## Métricas da semana

| Métrica | Meta inicial |
|---|---|
| Tempo até o 1º contato | ≤ 5 min |
| Taxa de resposta | ≥ 60% |
| Lead → videochamada agendada | ≥ 30% |
| Agendada → realizada (show) | ≥ 70% |
| Realizada → fechada | medir nas 2 primeiras semanas |


>>> DOCUMENTO 4 — Roteiro e quebra de objeções (alto ticket)

# Roteiro do SDR e quebra de objeções

**Rascunho para o Samuel corrigir.** Tom: WhatsApp, frases curtas, uma pergunta por mensagem, sem textão.
`{nome}`, `{bem}`, `{credito}`, `{parcela}`, `{lance_livre}`, `{horario}` vêm do formulário.
Estrutura e regras: 00 - Estrutura do SDR

## Planos (cola rápida)

| Carta | Crédito | 1ª parcela | Demais | Lance do bolso | Lance livre (referência) |
|---|---|---|---|---|---|
| R$ 437 mil | **R$ 306 mil** | R$ 16.620,70 | 120x R$ 3.478,40 ou 60x R$ 6.956,80 | — | R$ 120.225,34 **[CONFIRMAR]** |
| R$ 994 mil | **R$ 696 mil** | R$ 37.812,18 | 79x R$ 7.704,86 | R$ 248.647,85 | R$ 273.512,64 |
| R$ 1,29 mi | **R$ 902 mil** | R$ 49.031,20 | 79x R$ 9.990,72 | R$ 322.422,49 | R$ 354.664,74 |

Em todos: **30% de lance embutido** (sai da própria carta), **sem juros**, com taxa de administração.

## Metodologia de venda do Samuel (manda sobre a ordem do roteiro)

A conversa segue sempre esta ordem. O SDR não pula etapa e não explica antes da hora.

1. **Abordagem:** cumprimenta, se apresenta pela MOVECON no tom do Samuel e faz uma pergunta fácil (ver Transparência).
   - **Primeiro contato no WhatsApp (ordem do Samuel, 28/10/2026, substitui a de 24/10):**
     - Toda resposta sai uns 40 s depois da mensagem do lead (atraso de propósito, sempre abaixo de 60 s).
     - Etapa 1: quando o lead chega, só texto: "Oi, tudo bem? Qual é o seu nome?"
     - Etapa 2: quando o lead responder com o nome, vai o áudio A1 e, depois dele, a primeira pergunta do funil (entrada) em texto. O texto "Oi, meu nome é Samuel, eu trabalho com crédito..." não é mais usado.
2. **Funil financeiro (ordem do Samuel, 28/10/2026):** uma pergunta por mensagem.
   - Quanto pensa em dar de entrada.
   - Quanto de parcela cabe no mês.
   - Qual bem ele quer comprar com o crédito e de quanto é o crédito.
   - Depois: quanto tem disponível **hoje** (se ainda não respondeu com a entrada) e quanto levanta vendendo algo.
   - Se tem restrição no nome, se é autônomo e se comprova renda. Isso fica só no CRM.
3. **Conexão:** sonda a situação de vida dele. Quem quer comprar um bem tem um problema hoje, e o SDR descobre qual é e o objetivo real do bem. As perguntas também criam vínculo.
4. **Explicação breve:** a MOVECON faz planejamento de curto, médio e longo prazo, e quem define o prazo é a condição financeira do cliente, não a nossa escolha.
5. **Convite pra call com o Samuel**, com dois horários. O cliente sabe que é uma reunião com o especialista: o Samuel avalia o perfil e, se houver perfil, já fecha na call.

## Planejamento por prazo (do Samuel)

O anúncio mostra o crédito, a 1ª parcela e um lance um pouco mais alto. O planejamento se encaixa no que o lead tem hoje, em % do valor do crédito:

- **Longo prazo (cerca de 2% a 3%):** sem lance. Paga as parcelas e concorre por sorteio.
- **Médio prazo (cerca de 10% a 20%):** sorteio mais lance fixo, ou seja, duas formas de contemplação em vez de uma. A parcela fica um pouco mais alta.
- **Curto prazo (acima de 40%):** o Samuel estuda o grupo e oferta um lance acima da média do grupo pra tentar contemplar mais rápido, sem data garantida.

🔒 Em qualquer prazo: contemplação por sorteio ou lance, conforme o regulamento do grupo, sem data garantida. O SDR nunca diz "tira o carro no mesmo mês". Ele diz "com esse valor dá pra montar um lance forte pra tentar contemplar mais rápido, sem data garantida".

---

## 1. Abertura (até 5 min depois do formulário)

**Modelo aprovado (1ª mensagem):**
> Oi, {nome}! Aqui é o {sdr}, da MOVECON. Recebi sua simulação da carta de crédito de **{credito}** para {bem}. Posso te fazer 2 perguntas rápidas para preparar sua simulação?

**Se responder:**
> Perfeito. Você quer o {bem} para quando, mais ou menos?

> E hoje você teria quanto disponível para dar de lance? Pergunto porque é isso que define o quão rápido o crédito pode ser liberado.

*(Se o formulário já trouxe as respostas, o SDR confirma em vez de perguntar: "Vi aqui que você tem entre R$ 250 e 350 mil para lance, certo?")*

## 2. Qualificação (o que o SDR precisa saber antes de agendar)

1. **Bem e uso** — "É para você/empresa? Novo ou seminovo?" *(máquinas: "Para lavoura, obra ou prestar serviço?")*
2. **Lance** — quanto tem hoje e se usaria o embutido de 30%.
3. **Parcela** — "Uma parcela na faixa de {parcela} fica confortável para você?"
4. **Prazo** — quando precisa do bem.
5. **Quem decide** — "Além de você, mais alguém participa dessa decisão?"
6. **Como compraria hoje** — à vista, financiamento, Finame/Pronaf, aluguel de máquina.

Se o lance não fecha com o plano escolhido, reposicionar **antes** de agendar:
> Com o que você tem hoje, o plano de **R$ 696 mil** encaixa melhor: o lance do bolso fica em R$ 248 mil e os outros 30% saem da própria carta. Quer que eu prepare a simulação nesse?

## 3. Convite para a videochamada

> {nome}, o melhor jeito é o especialista te mostrar a simulação na tela, com parcela, lance e regras do grupo — e você recebe tudo por escrito depois. Leva uns 20 minutos.
> Tenho **{dia} às {hora1}** ou **{hora2}**. Qual fica melhor?

> Quem mais decide com você consegue participar? Assim ninguém fica com dúvida depois.

**Confirmação:**
> Fechado! {dia} às {hora}, por videochamada. Te mando o link aqui. Qualquer imprevisto me avisa que eu remarco.

## 4. Lembretes

- **D-1 (noite):** "Oi, {nome}! Amanhã às {hora} é a sua simulação da carta de {credito}. Continua de pé?"
- **1 h antes:** "Daqui a 1 hora a gente conversa 👍 Link: {link}"
- **10 min antes:** "Já estamos na sala te esperando: {link}"

## 5. Sem resposta (cadência)

- **T + 3 h:** "{nome}, sua simulação da carta de {credito} está pronta para te mostrar. Prefere que eu te ligue ou seguimos por aqui?"
- **D + 1:** "Tentei te ligar agora há pouco. Qual o melhor horário para falarmos 5 minutinhos?"
- **D + 2:** "Ainda faz sentido para você planejar o {bem} com carta de crédito? Pode ser só sim ou não 🙂"
- **D + 4 (encerramento):** "Vou pausar por aqui para não te incomodar. Quando quiser retomar a simulação, é só me chamar neste número."

## 6. Não apareceu (no-show)

> {nome}, te esperamos na sala e acho que pintou um imprevisto. Sem problema! Consigo **hoje às {hora}** ou **amanhã às {hora}**. Qual prefere?

---

## 7. Quebra de objeções

Método: **acolher → perguntar → responder curto → voltar para o agendamento**. Nunca discutir.

### Objeções de confiança

**"Isso é golpe? Nunca ouvi falar da MOVECON."**
> Pergunta certa — com valor alto, tem que perguntar mesmo. A MOVECON é plataforma de consórcio e os grupos são administrados pela **Alpha Administradora de Consórcio**, autorizada pelo Banco Central. Você pode conferir sozinho no site do Bacen pelo CNPJ 90.982.679/0001-54. E um detalhe: a gente **nunca** pede Pix nem pagamento por WhatsApp — tudo é por contrato e boleto da administradora. Quer que eu te mande o passo a passo para conferir?

**"Me prometeram contemplação garantida em outro lugar."**
> Desconfia. Ninguém pode garantir data de contemplação — isso é regra do consórcio. O que dá para fazer é montar uma estratégia de lance para aumentar a chance. É isso que o especialista te mostra na videochamada.

**"Não quero passar meus dados."**
> Tranquilo. Até a videochamada não preciso de nada além do que você já mandou. Documentos só entram na adesão, direto no contrato da administradora.

### Objeções de prazo e contemplação

**"Consórcio demora, não sei quando vou ser contemplado."**
> Faz sentido. Por isso existe o lance: além do sorteio, quem oferece lance concorre todo mês. Nesse plano, 30% do lance sai da própria carta e o lance livre de referência é {lance_livre}. Quanto mais forte o lance, maior a chance de liberar o crédito mais cedo — mas sem data garantida, tá? Na videochamada você vê como estão os lances do grupo.

**"Preciso da máquina agora, para esta safra/obra."** *(máquinas)*
> Entendi. Se precisar para os próximos dias, o consórcio sozinho pode não resolver — seria honesto te dizer isso. Agora, se dá para planejar a máquina para a próxima safra/obra, com lance você concorre já na primeira assembleia. Quer ver os dois cenários na videochamada?

**"Preciso do carro logo."** *(BMW)*
> Com lance você concorre desde a primeira assembleia. O especialista te mostra quanto de lance tem sido suficiente no grupo para você decidir com número na mão. Fica bom {dia} às {hora}?

### Objeções de dinheiro

**"Prefiro financiar, pego hoje."**
> Pega hoje, mas paga juros sobre o valor todo pelo prazo inteiro. No consórcio não tem juros — o custo é a taxa de administração. Na videochamada a gente coloca as duas contas lado a lado com o valor do {bem} para você ver a diferença no total pago. Topa?

**"Banco/Finame/Pronaf tem juros subsidiados."** *(máquinas)*
> Se você tem aprovação nessas linhas, às vezes elas são mesmo boas — não vou te dizer que não. O consórcio costuma entrar para quem não quer comprometer o limite no banco, não conseguiu aprovação ou quer planejar a próxima máquina sem dívida. Vale comparar as duas na videochamada?

**"A parcela está alta."**
> Entendi. Qual parcela ficaria confortável? Dá para ir para o plano de R$ 306 mil em 120x de R$ 3.478,40, ou montar outro valor de carta. O especialista ajusta com você.

**"A 1ª parcela é muito alta ({primeira})."**
> Ela é maior porque concentra o início da taxa de administração — no financiamento isso seria a entrada, e lá ainda tem juros. A partir da 2ª, cai para {parcela}. **[CONFIRMAR com a Alpha a composição exata da 1ª parcela]**

**"Não tenho R$ 322 mil / R$ 248 mil de lance."**
> Sem problema, o plano tem que caber em você. Com o que você tem hoje, o de {plano_alternativo} encaixa melhor — e ele também tem 30% embutido. Quer que eu prepare nesse?

**"Prefiro deixar meu dinheiro aplicado."**
> Faz sentido. Por isso existe o lance embutido: 30% do lance sai da própria carta, e você decide quanto do bolso usar. O especialista te mostra os cenários com mais e com menos lance.
*(Nunca dizer que consórcio é investimento ou que "rende".)*

**"Tem juros escondido? Qual o custo real?"**
> Não tem juros. Tem taxa de administração (e, se previsto em contrato, fundo de reserva e seguro), e tudo vem por escrito antes de você assinar qualquer coisa. **[CONFIRMAR percentuais da taxa, fundo de reserva e seguro de cada plano]**

**"E se o valor do bem subir até eu ser contemplado?"**
> A carta é reajustada pelo índice previsto no contrato, para acompanhar o preço. O especialista te mostra qual é. **[CONFIRMAR índice e periodicidade do reajuste]**

**"Posso parcelar o lance?"**
> **[CONFIRMAR com a Alpha]** — se não puder: "O lance é pago à vista quando você é contemplado, mas a parte embutida (30%) sai da própria carta."

### Objeções de decisão

**"Vou pensar."**
> Claro. Para te ajudar a pensar com tudo na mão: o que ainda está pesando mais — o valor da parcela, o lance ou o prazo?
*(Responder a objeção real e voltar para o agendamento.)*

**"Vou falar com minha esposa/meu sócio/meu pai."**
> Ótimo, é bom decidir junto. Que tal fazer a videochamada com ele(a) junto? Assim os dois ouvem a mesma coisa. Tenho {dia} às {hora} ou {hora2}.

**"Me manda por escrito/PDF, não preciso de videochamada."**
> Mando sim, depois da conversa. É que cada plano tem regra de lance e de grupo, e por mensagem fica muita coisa solta. São 20 minutos e você sai com tudo por escrito. Qual horário fica melhor?

**"Já tenho consórcio em outra administradora."**
> Legal, então você já conhece como funciona. Muita gente tem mais de uma cota para usar no lance ou para outro bem. Quer comparar condições na videochamada?

**"Vi mais barato em outro lugar."**
> Pode ser. Para comparar certo, vale olhar taxa total, prazo, 1ª parcela e como estão os lances do grupo. Se quiser, me manda o que te ofereceram e o especialista compara lado a lado com você.

### Objeções de uso do crédito

**"Posso comprar BMW seminova?" / "Posso comprar máquina usada ou implemento?"**
> **[CONFIRMAR regras de uso do crédito: ano, seminovo, implemento, compra de particular]** — resposta padrão até lá: "Depende das regras do grupo; o especialista te passa por escrito na videochamada."

**"E se eu não conseguir pagar no meio do caminho?"**
> Existem regras de transferência da cota e de desistência previstas em contrato, e o especialista explica cada uma antes da adesão. **[CONFIRMAR regras de transferência e desistência]**

---

## Itens para confirmar com a Alpha

- [ ] Lance livre de referência do plano de R$ 306 mil
- [ ] Composição da 1ª parcela
- [ ] Taxa de administração, fundo de reserva e seguro de cada plano
- [ ] Índice e periodicidade de reajuste da carta (veículo e máquina)
- [ ] Lance parcelado: existe?
- [ ] Uso do crédito: seminovo, ano de fabricação, implemento, compra de particular
- [ ] Regras de transferência e desistência
- [ ] Assembleias: dia do mês e prazo para ofertar lance
