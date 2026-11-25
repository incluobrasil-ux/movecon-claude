---
tipo: modelo
atualizado: 2026-11-25
---
# Prompt padrão de postagem no Instagram (parceiros e vendedores, pelo BitBrowser deles)

**Decisões do Samuel (25/11/2026):**
- "a ideia é que poste sozinho sem precisar passar por mim";
- "eu quero que ele poste manual mesmo mexendo pelo bitbrowser delas la que ja ta logado".

**Por que existe:** o robô antigo (`ig-post-next.mjs`) só roda no PC dos bots, porque as pastas, portas e abas dele são fixas. Por isso aparecia "sem conector". O `ig-postar-lote.mjs` usa a mesma lógica, validada em 19/11, mas a conta, o perfil, a pasta dos vídeos e a entrega vêm por parâmetro.

**Antes, uma vez só (feito pela pessoa):**
- o BitBrowser aberto, com o perfil da conta já logado no Instagram;
- o cofre atualizado (`git pull`);
- Node 22 ou mais novo e Python instalados.

**Como usar:** preencha a parte PREENCHA, cole e envie. O Claude confere tudo, faz um teste sem publicar e posta o lote no ritmo da AGENDA.

```
POSTAGEM PELO BITBROWSER (prompt padrão do cofre MOVECON-Claude)

=== PREENCHA ===
CONTA: <@conta>
PERFIL DO BITBROWSER: <nome exato do perfil onde a conta está logada>
PASTA DA ENTREGA NO COFRE: <ex.: entregas/2026-11-25-caminhao-lais>
PASTA DOS VÍDEOS NESTE PC: <ex.: a minha pasta de prontos>
AGENDA: <ex.: 1 por hora, todos de uma vez / 3 hoje, 1 a cada 2 horas>
=== FIM ===

Regras fixas (não altere):
0. Na pasta raiz do cofre: git pull. Leia 01-Regras/Regras de ouro.md, 01-Regras/Contas e navegador.md, 02-Funcoes/Publicador Instagram.md e 05-Operacao/Decisoes.md. Confira que o OK do Samuel para essa lista está em Decisoes.md; se não estiver, PARE.
1. Ache a pasta dos vídeos neste PC. Rode py -3 07-Ferramentas/scripts/bitbrowser.py listar e confirme o PERFIL. Pegue a porta com: py -3 07-Ferramentas/scripts/bitbrowser.py porta "<PERFIL>". Não crie, não apague e não mexa no perfil.
2. Conferência, sem postar:
   node 07-Ferramentas/scripts/instagram/ig-postar-lote.mjs --conta <CONTA> --porta <PORTA> --entrega <PASTA DA ENTREGA> --videos "<PASTA DOS VÍDEOS>" --check
   Ela confere o md5 de cada vídeo, as legendas, a conta logada e o que já está no ar. Se der erro, PARE e me mostre.
3. Teste do 1º vídeo, sem publicar: o mesmo comando com --stop-before-share em vez de --check. Ele vai até a legenda colada e para. Me mostre o print da pasta ig-prints. Depois feche o diálogo sem publicar.
4. Postagem: o mesmo comando sem --check, com --intervalo-min e --max conforme a AGENDA (ex.: 1 por hora = --intervalo-min 60). Rode EM SEGUNDO PLANO (pode levar horas) e me avise a cada RESULT. O BitBrowser e o PC precisam ficar ligados até o último.
5. Se o script sair com código 2 (login, verificação, limite, aviso, termos ou erro): PARE. Não rode de novo. Me mostre o print e o texto. Eu resolvo no BitBrowser e mando continuar; ele pula o que já foi postado.
6. Você nunca digita senha nem código, nunca turbina, nunca usa "Anúncio" e nunca muda legenda ou vídeo.
7. No fim:
   - marque [x] e o link de cada vídeo postado em LEGENDAS.md da entrega;
   - faça commit + push de LEGENDAS.md e postados.json (só esses dois arquivos);
   - se não tiver permissão de push, me dê a lista para eu mandar ao Samuel.

REVISÃO OBRIGATÓRIA (responda em português, frases curtas):
- perfil e conta conferidos, e o resultado do --check;
- quantos vídeos foram postados, com hora e link de cada um;
- quantos foram pulados (já no ar) ou ficaram faltando, e por quê;
- se houve qualquer aviso ou parada;
- se o push foi feito.
```

**Ritmo:** o padrão é 1 por hora (`--intervalo-min 60`), como na @tanan. Conta com menos de 2 semanas: metade do ritmo ([[Publicador Instagram]]).
