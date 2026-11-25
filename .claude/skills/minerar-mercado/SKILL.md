---
name: minerar-mercado
description: Minera concorrentes e anunciantes de consórcio escalados (Biblioteca da Meta, Google Transparência, Marketplace) e dá nota de escala de 0 a 10. Use quando pedirem "minerar ofertas", "concorrentes", "quem está escalando", "espionar", "mercado de consórcio", "parceiros em outras praças".
---

# minerar-mercado

**Passo zero (decisão de 25/11/2026, para não refazer trabalho):**
- rode `git pull`;
- leia `06-Referencias/mineracao/Ja minerado.md`;
- rode `py -3 07-Ferramentas/scripts/mineracao/registro_buscas.py <palavra do tema>`.

Sem login e sem robô novo: use só as ferramentas do `02-Funcoes/Minerador.md`. No fim, registre a mineração em `Ja minerado.md` e faça commit e push.

As regras desta função ficam nas notas do cofre (fonte única). Leia, nesta ordem, antes de começar:

1. `01-Regras/Regras de ouro.md`
2. `02-Funcoes/Minerador.md`
3. `03-Padroes/Mineracao - o que procurar.md (seção 3)`
4. `07-Ferramentas/referencias/sinais-escala.md`
5. `07-Ferramentas/referencias/palavras-chave.md`
6. `04-Modelos/Entrega de mineracao.md`

Antes de tudo: leia as pesquisas de `06-Referencias/mineracao/` e use a skill `minerador-ofertas` para dar a nota de 0 a 10.

Só leitura. Uma busca por vez, 5 a 10 s entre buscas. Bloqueou: parar e anotar.

Se uma nota contradiz um pedido, a nota vence: avise o operador e registre em `05-Operacao/Pendencias.md`. Decisão nova: `05-Operacao/Decisoes.md`.
