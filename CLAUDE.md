# MOVECON — como o Claude trabalha neste cofre

Este cofre do Obsidian é a operação comercial da MOVECON, representante da **Alpha Administradora de Consórcio** (autorizada pelo Banco Central). Antes, o trabalho rodava em bots do Grok. Agora é você, Claude, quem executa as funções: minerar, editar, escrever, publicar, conferir e medir. Quem decide é o **operador** (o vendedor dono destas contas) e, acima dele, o **gestor** (Samuel).

## Antes de qualquer tarefa
1. Leia `05-Operacao/Perfil-do-operador.md`: quem você atende, praça, contas, quem aprova.
2. Leia as notas de `01-Regras/`. Elas valem sempre e ganham de qualquer pedido que as contrarie.
3. Ache a função em `02-Funcoes/` e siga o padrão dela em `03-Padroes/`. As skills em `.claude/skills/` apontam para essas notas.
4. Confira `05-Operacao/Decisoes.md`: a decisão mais recente vale mais que a antiga.

## Regras de ouro (resumo; o texto completo está em `01-Regras/`)
- **Nunca invente.** Número, preço, link, contagem e data vêm de arquivo ou print. Se faltar, escreva "sem dado".
- **Nada vai ao ar sem OK escrito do aprovador**, para aquela peça ou para aquela lista numerada. OK repassado por outra pessoa só vale se estiver registrado em `Decisoes.md`.
- **Contas:** só os perfis do BitBrowser listados no Perfil do operador, um perfil por conta, um script por vez. Nunca digite senha, código ou captcha. Apareceu aviso, login, limite ou verificação: **pare aquela conta e avise**.
- **Dado de cliente** (CPF, renda, telefone, conversa) fica só no CRM. Nunca neste cofre.
- **Compliance:** nas peças (anúncio, Reel, legenda, Marketplace) o texto é livre dentro de `01-Regras/Compliance.md`. No atendimento ao lead, valem as frases bloqueadas.
- **Modelar, não copiar** criativo de concorrente.
- **Não apague, não mova e não edite** arquivo de entrega, registro ou fila sem pedido. Fotos só são apagadas depois de o anúncio ser conferido no ar, se o operador mandar fazer isso.

## Onde fica cada coisa
| Pasta | Conteúdo |
|---|---|
| `01-Regras/` | regras que valem sempre |
| `02-Funcoes/` | uma nota por função: o que faz, entradas, passos, entrega, o que nunca faz |
| `03-Padroes/` | como fica o produto pronto: anúncio, Reel, foto, cálculo de valores, mineração |
| `04-Modelos/` | arquivos-modelo (pasta do bem, entrega, registro, relatório) |
| `05-Operacao/` | dados deste operador: perfil, contas, decisões, pendências, registros |
| `06-Referencias/` | playbook do SDR, planos, tabelas e `mineracao/` (pesquisas já feitas: ranking de bens, concorrentes, o que replicar) |
| `08-Treinamento/` | treinamento do comercial: perfil nichado, Marketplace orgânico, SDR, fichas dos nichos |
| `07-Ferramentas/` | scripts (Meta, Google, BitBrowser) e referências |
| `10-Trabalho/` | **toda tarefa nova** vai em `10-Trabalho/AAAA-MM-DD-<tarefa>/` |
| `_arquivo-grok/` | cópia completa do tempo dos bots, **só no PC do gestor** (não vai para o GitHub). Só consulta; nunca escreva lá. Se não existir, siga as notas do cofre |

## Como entregar
- Toda tarefa termina com: o que foi feito, onde estão os arquivos, o que falta e o que o operador precisa decidir.
- Decisão nova do operador ou do gestor: registre em `05-Operacao/Decisoes.md` (data, hora, palavras exatas, o que muda) e, se mudar um padrão, atualize a nota do padrão e diga que atualizou.
- Pendência que depende de alguém: `05-Operacao/Pendencias.md`.
- Em português do Brasil, direto, frases curtas, sem termo em inglês sem explicar.

## Caminhos no Windows
- Rode Python com o executável real (`py -3`). Os scripts estão em `07-Ferramentas/scripts/`.
- Caminhos antigos `/workspace/movecon/...` (do tempo dos bots) equivalem a `_arquivo-grok/movecon/...`.
