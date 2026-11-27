---
tipo: funcao
criado: 2026-11-27
skill: responder-comentarios
---
# Respondedor de comentários

**Um trabalho só:** responder, com o WhatsApp do operador, quem comentou nos posts da conta dele e ainda está sem resposta. Roda sozinho a cada 20 minutos.

**Liberado pelo gestor em 27/11/2026** ([[Decisoes]]): *"quero um prompt para enviar pro consultor pra ele mandar o instagram dele responder todos os comentarios com o numero dele pedindo pra chamar [...] o claude entrar no bitbrowser de 20 em 20 minutos pedindo o contato de todo mundo que está sem resposta"*. É a única exceção à regra "o Claude não responde comentário" de [[Contas e navegador]].

## O que responde e o que não responde
| Comentário | O que acontece |
|---|---|
| De outra pessoa, sem resposta da conta, dos últimos 30 dias, nos 12 posts mais novos | recebe a mensagem padrão |
| Já tem resposta da conta (dada pelo celular ou pela ferramenta) | não mexe |
| Negativo ("golpe", "furada", "fraude", "Reclame Aqui", "Procon"...) | **não responde**; vai para a lista "para ver" |
| Propaganda (link, "promote", "DM", "collab", "seguidores"...) | **não responde**; vai para a lista "para ver" |
| "Já te chamei", "mandei mensagem" | **não responde**; vai para a lista "para ver" (confira o WhatsApp) |
| Resposta dentro de uma conversa (não é comentário principal) | não mexe: quem continua a conversa é o operador |

**Mensagem padrão** (8 versões que se revezam, sempre com o @ da pessoa e o número com DDD). Exemplos:
- "@fulano Oi! Me chama no WhatsApp (77) 99999-9999 que eu te explico tudo 😉"
- "@fulano Te passo todos os detalhes no WhatsApp: (77) 99999-9999. É só chamar!"
- "@fulano Me chama no WhatsApp (77) 99999-9999 e fala que veio do Instagram 👊"

Sem valor, sem prazo e sem promessa: segue [[Compliance]] (B, atendimento). Para mudar o texto, mude a lista `MODELOS` no script e registre em [[Decisoes]].

## Ritmo (padrão)
- Uma rodada a cada **20 min**.
- No máximo **8 respostas por rodada** e **60 por dia**, uma a cada **40 a 90 s**, os comentários mais novos primeiro.
- Conta com menos de 2 semanas: use `--max-por-rodada 4 --max-por-dia 30`.

## Ferramenta
`07-Ferramentas/scripts/instagram/ig-responder-comentarios.mjs`. Usa o perfil do BitBrowser já logado: lê os comentários pela própria sessão do navegador, numa aba nova em segundo plano, que fecha no fim. Não abre nem fecha perfil: se o perfil estiver fechado, pula a rodada.

```
node 07-Ferramentas/scripts/instagram/ig-responder-comentarios.mjs --conta @conta --perfil "NOME NO BITBROWSER" --whatsapp 5577999999999 --testar
```
| Opção | O que faz |
|---|---|
| `--testar` | só mostra o que responderia e a lista "para ver". Não escreve nada |
| `--uma-vez --max-por-rodada 1` | responde só 1, para conferir no celular |
| `--agendar` | liga no Agendador de Tarefas do Windows: uma rodada a cada 20 min, sem abrir janela, mesmo com o Claude fechado |
| `--desagendar` | desliga |
| `--liberar` | tira a trava depois de uma parada (só depois de conferir a conta) |
| `--posts 12 --dias 30 --max-por-rodada 8 --max-por-dia 60 --intervalo-min 20` | ajustes |

Para funcionar sozinho, o PC tem que estar ligado, com o usuário do Windows entrado, e o BitBrowser aberto com o perfil da conta aberto.

## Parada (igual às outras funções)
Login, verificação, limite, bloqueio, resposta recusada ou resposta que não aparece no post: o script **para, trava a conta e mostra um aviso na tela**. Não tenta de novo. O operador confere a conta no BitBrowser e no celular. Só depois roda `--liberar`. Três rodadas seguidas com erro também travam.

## Onde fica cada coisa (fora do cofre, na pasta do usuário do Windows)
| Arquivo | O que tem |
|---|---|
| `%USERPROFILE%\.movecon\comentarios-<conta>.json` | só o número (id) dos comentários já respondidos, a contagem do dia e a trava |
| `%USERPROFILE%\.movecon\comentarios-<conta>-para-ver.txt` | comentários negativos, propaganda e "já te chamei", com o link do post, para o operador responder pelo celular |
| `%USERPROFILE%\.movecon\logs\comentarios-<conta>.log` | o que cada rodada fez |

Nome e conversa de cliente não entram no cofre ([[Regras de ouro]]). Quem chamou no WhatsApp entra no CRM pelo atendimento.

## Nunca
Responder com valor, simulação ou conversa; mandar Direct; curtir; seguir; responder comentário negativo; apagar ou esconder comentário; rodar em conta que não seja a do operador; rodar dois scripts no mesmo perfil ao mesmo tempo.

Modelo de pedido para o vendedor: [[Prompt de respostas nos comentarios]].
