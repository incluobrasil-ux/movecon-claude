---
name: bitbrowser-autonomo
description: Como o Claude opera sozinho um perfil do BitBrowser (abrir, navegar, clicar, preencher, tirar print, fechar) pela API local + Playwright. Use antes de qualquer tarefa no BitBrowser e antes de responder "não tenho navegador" — você tem. Também cobre o que fazer quando o perfil cai, desloga ou pede verificação.
---

# BitBrowser autônomo

Você **tem navegador**: o BitBrowser, controlado por Python (Playwright) através da API local `http://127.0.0.1:54345`. Cada perfil do BitBrowser é um navegador separado, com sua própria sessão logada.

## Antes de começar
1. O app do BitBrowser precisa estar **aberto e logado** no PC. Teste: `py -3 07-Ferramentas/scripts/bitbrowser.py listar`. Se der erro de conexão, peça ao humano para abrir o BitBrowser.
2. Confira em `05-Operacao/Perfil-do-operador.md` **qual perfil** usar para a tarefa. Perfil fora da lista = não usar.
3. Use o **nome exato** do perfil (ou o id). Nomes parecidos existem; a biblioteca para com erro em vez de chutar.

## Como usar
Escreva um script curto na pasta da tarefa e rode com `python`:
```python
import sys
sys.path.insert(0, r"07-Ferramentas\scripts")   # bitbrowser.py fica no cofre
from bitbrowser import session

with session("NOME-EXATO-DO-PERFIL") as pg:
    pg.goto("https://www.facebook.com/", wait_until="domcontentloaded")
    pg.wait_for_timeout(4000)
    if "login" in pg.url:
        print("DESLOGADO")                   # parar: login é do humano
    else:
        pg.screenshot(path=r"<pasta da tarefa>\01-home.png")
```
No fim, **num comando separado**: `py -3 07-Ferramentas/scripts/bitbrowser.py fechar "NOME-EXATO-DO-PERFIL"`.

## Regras de operação
- **Um perfil aberto por vez** e **um script por vez no mesmo perfil** (scripts em paralelo fecham a aba um do outro).
- `session()` abre **uma aba nova** e fecha só ela. Nunca feche abas que o humano deixou abertas.
- **Print de cada passo** na pasta da tarefa (`01-...png`, `02-...png`). É a prova do trabalho.
- **Seletores:** prefira `pg.get_by_role("button", name="Publicar")` e `pg.get_by_text("...")`. Se o clique não pegar, tire print, leia a tela e tente outro seletor — não repita o mesmo erro em loop (máx. 3 tentativas, depois relate).
- Antes de clicar em algo, tire print e confirme que está na tela/conta certa.
- Ritmo humano: esperas de 1–3 s entre ações, nada de centenas de cliques por minuto.
- Upload de arquivo: `pg.set_input_files('input[type=file]', r"C:\caminho\imagem.jpg")` (às vezes precisa clicar no botão de foto antes para o input aparecer).

## Nunca faça
- Digitar senha, código de 2 fatores, responder "esqueci a senha" ou resolver captcha/selfie/QR. **Pare e chame o humano.**
- Criar, apagar, clonar perfil ou mudar proxy/impressão digital do BitBrowser.
- Usar perfil de outra pessoa ou de conta de anúncios (BM) sem ordem por escrito do gestor.
- Logar uma segunda conta no mesmo perfil.

## Quando der problema
| Sintoma | O que fazer |
|---|---|
| `listar` dá erro de conexão | BitBrowser fechado: pedir ao humano para abrir e clicar Login (credencial salva) |
| "abriu sem ws" 3 vezes | Fechar o perfil, esperar 30 s, tentar 1 vez. Persistiu: relatar |
| Tela de login / "confirme que é você" / código | Parar. Relatar com print. Seguir com o que não depende desse perfil |
| "Sair do site?" (diálogo do Chrome) | `pg.on("dialog", lambda d: d.accept())` antes da ação |
| PC lento / memória acima de 90% | Fechar perfis abertos sem uso antes de abrir outro |
| Conta restrita / bloqueada | Parar tudo nesse perfil e avisar o gestor na hora |
