---
name: responder-comentarios
description: Responde sozinho, a cada 20 minutos, os comentários sem resposta do Instagram do operador com o WhatsApp dele ("me chama no WhatsApp"), pelo BitBrowser já logado. Use quando pedirem "responder os comentários", "responder todo mundo com meu número", "pedir o contato de quem comentou", "ligar a resposta automática", "desligar a resposta automática".
---

# responder-comentarios

As regras desta função ficam nas notas do cofre (fonte única). Leia, nesta ordem, antes de começar:

1. `01-Regras/Regras de ouro.md`
2. `01-Regras/Contas e navegador.md` (a exceção de 27/11/2026 libera só esta função)
3. `05-Operacao/Perfil-do-operador.md`
4. `02-Funcoes/Respondedor de comentarios.md`

Passo a passo pronto: `04-Modelos/Prompt de respostas nos comentarios.md`. Sempre `--testar` antes, depois 1 resposta conferida no celular, só então `--agendar`.

Só a mensagem padrão com o WhatsApp do operador. Nunca valor, conversa, Direct, curtida ou seguir. Saída 2 = conta travada: pare, avise o operador e não rode `--liberar` sem ele conferir a conta.
