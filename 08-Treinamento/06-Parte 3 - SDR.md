---
tipo: treinamento
atualizado: 2026-11-20
---
# Parte 3: SDR, o atendimento do lead

## Como funciona
1. O vendedor **conecta o WhatsApp dele no CRM** (app.crmcrelider.com) pelo QR code.
2. O lead chama, vindo do Reel, do anúncio ou do Marketplace.
3. O CRM recebe e registra a conversa inteira.
4. O SDR responde em cerca de 40 s (sempre abaixo de 60 s), **com as regras daquele vendedor**.
5. O SDR marca a videochamada com dois horários da agenda do vendedor.
6. O vendedor faz a videochamada e fecha.

**O SDR para e chama o vendedor na hora** quando o lead pede uma pessoa, se irrita ou faz pergunta fora da régua.

Antes era o bot "SDR SAMUEL" do Grok, ligado no CRM por webhook. A cópia das instruções dele está em `_arquivo-grok/Bots/SDR SAMUEL.md` (só no cofre do gestor).

## A metodologia (igual para todos)
Está em [[Atendimento]]: primeiro contato → abordagem → funil financeiro → conexão → explicação breve → convite. Mensagens de até 3 linhas, sempre terminando em pergunta.

## As regras de cada vendedor
Cada vendedor preenche o seu [[Regras do meu SDR]] (modelo em `04-Modelos/`) e guarda a cópia preenchida em `05-Operacao/Regras do meu SDR.md`. Lá vai: tom e apresentação, áudios gravados por ele, perguntas de conexão do nicho, respostas às dúvidas e objeções, horários de videochamada e quando ele assume a conversa.

**O que não muda (trava de todos):** a parte B de [[Compliance]]. Nunca prometer prazo ou contemplação, nunca "crédito aprovado", nunca Pix, nunca negar que é IA quando o lead pergunta, CPF e renda só no CRM.

## Como treinar o SDR (toda semana)
| Passo | Pedido ao Claude |
|---|---|
| 1. Escrever | "Me ajuda a preencher as Regras do meu SDR de [nicho], no meu jeito de falar." |
| 2. Simular | "Finge ser um lead de [nicho] que acha que é golpe e testa as minhas regras. Uma mensagem por vez." |
| 3. Auditar | "Lê essa conversa e me diz onde eu perdi o lead e como eu reescreveria a mensagem." (colar sem CPF, renda ou telefone) |
| 4. Ajustar | "Atualiza as minhas regras com isso e anota em Decisoes o que mudou." |

Regra de bolso: toda semana, pegar 3 conversas que não viraram videochamada e passar pelo passo 3.

### O pedido da auditoria completa (o que vai no slide)
> Quero fazer uma análise do meu atendimento e das minhas ligações para entender como melhorar a minha taxa de conversão. Como está o padrão do SDR, os tempos de resposta e os possíveis erros no meu atendimento? Faça uma auditoria e ative as melhores skills de vendas para otimizar os meus atendimentos.

O que o Claude precisa ter para responder bem:
- **Conversas e tempos de resposta:** os leads do vendedor no CRM (a aba "Meu Claude" dá ao Claude acesso de leitura aos leads do próprio vendedor).
- **Ligações:** a gravação ou a transcrição das videochamadas. Sem isso, a auditoria fica só no WhatsApp.
- **Régua:** [[Atendimento]], [[Playbook do SDR (completo)]] e as [[Regras do meu SDR]] do vendedor.

## Exercício em sala (45 min)
1. Conectar o WhatsApp do vendedor no CRM e mandar um "oi" de teste de outro número.
2. Preencher as Regras do meu SDR com o Claude.
3. Simular 5 leads do nicho (um com objeção de golpe, um que quer prazo, um que pede Pix, um que pergunta se é robô, um que pede uma pessoa).
4. Ajustar as regras com o que a simulação mostrou.
