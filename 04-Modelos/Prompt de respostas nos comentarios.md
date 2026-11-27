---
tipo: modelo
atualizado: 2026-11-27
---
# Prompt padrão: resposta automática dos comentários (parceiros e vendedores, pelo BitBrowser deles)

**Decisão do Samuel (27/11/2026, 12h20):** "quero um prompt para enviar pro consultor pra ele mandar o instagram dele responder todos os comentarios com o numero dele pedindo pra chamar [...] é basicamente o claude entrar no bitbrowser de 20 em 20 minutos pedindo o contato de todo mundo que está sem resposta".

**Como funciona:** o Claude não fica aberto acordando a cada 20 minutos, porque isso gasta muito token. Ele testa e liga uma tarefa do Windows. A tarefa roda a `ig-responder-comentarios.mjs` a cada 20 minutos, mesmo com o Claude fechado. Regras e limites em [[Respondedor de comentarios]].

**Antes, uma vez só (feito pela pessoa):**
- o BitBrowser aberto, com o perfil da conta já logado no Instagram;
- Node 22 ou mais novo e Python instalados (os mesmos da postagem);
- o PC ligado, com o usuário do Windows entrado, enquanto quiser as respostas.

**Como usar:** preencha a parte PREENCHA, cole no Claude Code aberto na pasta do cofre e envie. O Claude testa sem responder, responde só 1 para você conferir no celular e só depois liga de 20 em 20 minutos. Ele para e espera o seu OK em cada etapa.

```
RESPOSTA AUTOMÁTICA DOS COMENTÁRIOS (prompt padrão do cofre MOVECON-Claude)

=== PREENCHA ===
CONTA: <@meu_instagram>
PERFIL DO BITBROWSER: <nome exato do perfil onde esse Instagram está logado>
WHATSAPP: <55 + DDD + número, só os dígitos. Ex.: 5577999999999>
=== FIM ===

Regras fixas (não altere):
0. Na pasta raiz do cofre: git pull. Se a pasta não for um repositório git, baixe de https://github.com/incluobrasil-ux/movecon-claude (ramo main) estes 4 arquivos para o mesmo caminho no cofre: 07-Ferramentas/scripts/instagram/ig-responder-comentarios.mjs, 02-Funcoes/Respondedor de comentarios.md, 01-Regras/Contas e navegador.md e .claude/skills/responder-comentarios/SKILL.md. Leia 01-Regras/Contas e navegador.md (a exceção de 27/11/2026), 02-Funcoes/Respondedor de comentarios.md e 05-Operacao/Perfil-do-operador.md.
1. Registre em 05-Operacao/Decisoes.md: "27/11/2026: o gestor (Samuel) liberou responder os comentários da CONTA só com a mensagem padrão do meu WhatsApp, pela ig-responder-comentarios.mjs, de 20 em 20 minutos".
2. Rode py -3 07-Ferramentas/scripts/bitbrowser.py listar e confirme o nome exato do PERFIL. Não abra, não feche e não mexa no perfil.
3. Teste, sem responder nada:
   node 07-Ferramentas/scripts/instagram/ig-responder-comentarios.mjs --conta <CONTA> --perfil "<PERFIL>" --whatsapp <WHATSAPP> --testar
   Me mostre a lista VOU RESPONDER, a lista PARA VOCÊ VER e o exemplo de resposta. PARE e espere o meu OK.
4. Com o meu OK, responda só 1 para eu conferir no celular: o mesmo comando sem --testar e com --uma-vez --max-por-rodada 1. Me diga quem foi respondido e em qual post. PARE e espere o meu OK.
5. Com o meu OK, ligue de 20 em 20 minutos: o mesmo comando, sem --testar, com --agendar. Se a conta tiver menos de 2 semanas, acrescente --max-por-rodada 4 --max-por-dia 30. Mostre a tarefa criada com: schtasks /Query /TN "MOVECON comentarios <CONTA sem o @>"
6. Se o script sair com código 2 ou aparecer na tela o aviso "respostas automáticas paradas": PARE. Não rode de novo e não rode --liberar. Me mostre o motivo. Eu confiro a conta e mando liberar.
7. Você só usa a mensagem padrão. Nunca escreve valor ou simulação, nunca continua conversa, nunca manda Direct, nunca curte nem segue, nunca digita senha ou código.

REVISÃO OBRIGATÓRIA (responda em português, frases curtas):
- conta e perfil conferidos;
- resultado do teste: quantos comentários vai responder e quantos ficaram para eu ver;
- a resposta de teste: para quem, em qual post e se apareceu;
- se ficou ligado: de quantos em quantos minutos e o comando para desligar (--desagendar);
- onde ficam o log e a lista "para ver".
```

**Para desligar depois:** peça ao Claude *"desliga a resposta automática dos comentários"*. Ele roda o mesmo script com `--conta <@conta> --desagendar`.

**Comentário que não recebe resposta automática** (negativo, propaganda, "já te chamei"): fica na lista `%USERPROFILE%\.movecon\comentarios-<conta>-para-ver.txt`. Quem responde esses é a pessoa, pelo celular.
