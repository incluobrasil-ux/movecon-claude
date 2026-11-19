---
tipo: regra
atualizado: 2026-11-19
---
# Aprovação e registro

## Quem aprova
- O aprovador está em [[Perfil-do-operador]]. Para o gestor (Samuel), ele mesmo. Para um vendedor, o que estiver escrito lá.
- Só vale OK **escrito** pelo aprovador. "Fulano disse que pode" não vale, a menos que esteja registrado em [[Decisoes]] com as palavras exatas.

## Como pedir o OK
1. Monte a lista numerada das peças: prévia (contact sheet ou print), texto, conta, rede e horário previsto.
2. Guarde o md5 de cada arquivo de mídia na lista. O OK vale para aquele arquivo.
3. O aprovador responde, por exemplo, "aprovo todos" ou "aprovo 1, 3, 5, tira 2". Sem resposta, nada sai.
4. Anote o OK em [[Decisoes]]: data, hora, palavras exatas, quais peças.

Aprovação em lote: o gestor aprova uma vez por dia, em lote, numa lista só (decisão de 14/11/2026, 15h33). Liberação de uma leva inteira ("libera a leva 02") vale para todos os itens da leva, menos os que ele tirar.

## Status de cada peça
`rascunho → aguardando-OK → aprovado → publicado`. Saídas: `recusado`, `segurado`, `excluido`, `removido`.
- Mudou texto ou foto depois do OK: volta para `aguardando-OK`.
- `segurado` = parado esperando decisão. Não publica e não apaga nada.
- `excluido` = o aprovador tirou de vez. Fotos e textos ficam guardados.

## O que se registra (fora do chat, sempre)
| O quê | Onde |
|---|---|
| Decisão ou regra nova | `05-Operacao/Decisoes.md` |
| Pendência que depende de alguém | `05-Operacao/Pendencias.md` |
| Cada publicação | `05-Operacao/registros/publicados-AAAA-MM.md` (data/hora, rede, conta, título, link, OK que liberou) |
| Contagem diária do Marketplace | `05-Operacao/registros/contagem-AAAA-MM-DD.md` |
| Entrega de tarefa | `10-Trabalho/AAAA-MM-DD-<tarefa>/ENTREGA.md` |

Use os modelos de `04-Modelos/`.
