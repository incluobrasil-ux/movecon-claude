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
3. Confira o que já existe para não repetir: filas e levas abertas, `ja_minerado` em entregas anteriores, `_arquivo-grok/movecon/mercado/`.

## Ferramentas
| Para | Ferramenta |
|---|---|
| Bens (Mobiauto) | `07-Ferramentas/scripts/mineracao/miner.py` (ajustar caminhos antes do 1º uso) |
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

## Nunca
- Curtir, seguir, salvar, comentar, mandar mensagem, responder anúncio, logar com conta de alguém.
- Usar cookie para passar bloqueio ou resolver captcha.
- Completar lista com quem não escala. "Não achei nada" só com a lista do que foi testado.
- Gastar com ferramenta paga sem OK.

## Aprendizados
- A Meta bloqueia por IP depois de um número variável de buscas (já foi 10, 17, 45; com 4 coletas em paralelo, cerca de 130 em 1 h). Sinal: "Nenhum anúncio corresponde" em termo que tinha resultado. Esperar de 1 a 14 h.
- YouTube pede "não é robô" e cerca de metade das tentativas falha: desacelerar e pular.
- TikTok: só o Creative Center abre sem login; os dias no ar são estimados pelo id do vídeo e precisam ser marcados como estimativa.
- Webmotors e OLX: erro 403.
