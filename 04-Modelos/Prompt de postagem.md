---
tipo: modelo
atualizado: 2026-11-25
---
# Prompt padrão de postagem no Instagram (parceiros e vendedores, no PC deles)

**Por que existe:** o robô de postagem do cofre (`07-Ferramentas/scripts/instagram/ig-post-next.mjs`) só roda no PC dos bots, porque depende do BitBrowser, de portas e de pastas fixas de lá. No PC do parceiro aparece "sem conector".
**Decisão do Samuel (25/11/2026):** "a ideia é que poste sozinho sem precisar passar por mim [...] o prompt é pra soltar lá e ele entrar e já postar tudo de vez conforme elas programaram lá".

**Uma vez só, antes do primeiro uso (feito pela pessoa, não pelo Claude):**
1. Instalar no Google Chrome a extensão **Claude in Chrome** (oficial da Anthropic) e entrar com a mesma conta do Claude.
2. No Chrome, entrar no **Instagram** e no **Meta Business Suite** (business.facebook.com) da conta. O login é feito pela própria pessoa: o Claude nunca digita senha nem código.
3. Abrir o Claude Code na **pasta raiz do cofre** e ligar o Chrome: digitar `/chrome` ou iniciar com `claude --chrome`.

**Como usar:** preencha a parte PREENCHA, cole e envie. O Claude agenda todos os Reels de uma vez e devolve a lista com os horários.

```
POSTAGEM (prompt padrão do cofre MOVECON-Claude)

=== PREENCHA ===
CONTA: <@conta>
PASTA DA ENTREGA NO COFRE: <ex.: entregas/2026-11-25-caminhao-lais>
PASTA DOS VÍDEOS NESTE PC: <ex.: a minha pasta de prontos>
AGENDA: <ex.: 3 por dia, às 9h, 14h e 20h, começando amanhã, na ordem 01, 02, 03...>
=== FIM ===

Regras fixas (não altere):
0. Rode git pull na pasta do cofre. Leia CLAUDE.md, 01-Regras/Regras de ouro.md, 02-Funcoes/Publicador Instagram.md, 05-Operacao/Decisoes.md e, na pasta da entrega, LEGENDAS.md e COMO-POSTAR.md.
1. Confira que o OK do Samuel para essa lista está em 05-Operacao/Decisoes.md. Se não estiver, PARE e me avise.
2. Confira o md5 de cada vídeo da minha pasta com o md5.txt da entrega. Vídeo com md5 diferente não é postado.
3. Use o Chrome pela extensão Claude in Chrome. Se ela não estiver conectada, PARE e me diga os passos de instalação. Não use outro robô e não crie script.
4. Abra o Meta Business Suite da CONTA e confira que é a conta certa. Para cada vídeo, na ordem:
   - Criar Reel;
   - envie o vídeo;
   - cole a legenda de LEGENDAS.md inteira e sem mudar nada;
   - confira se os valores da legenda são os mesmos da tela;
   - publique só no Instagram;
   - sem música, sem local, sem colaboração;
   - Agendar no horário da AGENDA.
   Nunca Turbinar ou Impulsionar. Nunca "Anúncio".
5. Se o Business Suite não estiver ligado a essa conta, ou não oferecer agendamento de Reel: poste pelo instagram.com só o vídeo do horário atual da AGENDA e me diga que os outros ficam para cada horário.
6. Se aparecer login, código, captcha, aviso, limite ou verificação: PARE na hora. Eu resolvo e mando continuar. Você nunca digita senha nem código.
7. Depois de agendar todos: abra a lista de agendados e confira um por um (vídeo, legenda e horário). Tire um print.
8. Marque [x] e o horário de cada um em LEGENDAS.md.
9. Registro: crie ou complete 05-Operacao/registros/publicados-AAAA-MM.md com uma linha por vídeo:
   - n;
   - arquivo;
   - md5;
   - data e hora agendada;
   - conta;
   - "agendado no Business Suite";
   - o OK que liberou.
   Faça commit + push só desses dois arquivos. Se não tiver permissão de push, me dê a lista para eu mandar ao Samuel.

REVISÃO OBRIGATÓRIA (responda em português, frases curtas):
- conta conferida;
- quantos vídeos foram agendados, com data e hora de cada um;
- algum vídeo pulado, e por quê (md5, erro, aviso);
- confirme que nenhuma legenda foi alterada e que nada foi impulsionado;
- se o push foi feito.
```

**Ritmo:** vale o de [[Publicador Instagram]], no máximo 3 por dia. Conta com menos de 2 semanas: metade.
**Exceção registrada (25/11/2026):** a regra do BitBrowser ([[Contas e navegador]]) vale para as contas da operação. A conta do próprio parceiro pode ser usada no Chrome dele, onde ele já entra todo dia, sempre com o login feito por ele.
