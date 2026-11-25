---
tipo: indice
atualizado: 2026-11-19
---
# MOVECON com Claude: comece aqui

Este cofre substitui os bots do Grok. As mesmas funções (minerar, editar, escrever, publicar, contar) agora são feitas pelo **Claude Code**, aberto nesta pasta, seguindo as regras escritas aqui.

## Como usar (vendedor ou gestor)
1. Instale o **Claude Code** (terminal, VS Code ou app desktop), o **Python 3.10+**, o **Node.js**, o **ffmpeg** e o **Google Chrome**. O BitBrowser precisa estar aberto e logado.
2. Abra o Claude Code **nesta pasta**. Ele lê o `CLAUDE.md` sozinho.
3. Na primeira vez, peça: *"Lê o CLAUDE.md e o Perfil do operador e me diz o que falta preencher."*
4. Peça o trabalho em português, do jeito que você pedia ao bot.

## Exemplos de pedido
| Você pede | O Claude usa |
|---|---|
| "Minera 30 carros de 50 a 200 mil para a próxima leva" | [[Minerador]] + [[Mineracao - o que procurar]] |
| "Trata as fotos da leva 05 e me manda a folha de contato" | [[Editor]] + [[Fotos de veiculo]] |
| "Escreve os textos da leva 05" | [[Copywriter]] + [[Anuncio Marketplace]] |
| "Monta a lista para eu aprovar" | [[Lista de aprovacao]] |
| "Aprovo todos menos o 3. Pode publicar 1 por hora" | [[Publicador Marketplace]] |
| "Minera 50 vídeos brutos de caminhão e carro" | [[Minerador]] (criativos) |
| "Edita esses brutos no padrão dos Reels" | [[Editor]] + [[Reel Instagram]] |
| "Posta o próximo Reel na @minha_conta" | [[Publicador Instagram]] |
| "Faz o relatório do Marketplace de hoje" | [[Analista]] + [[Relatorio diario]] |
| "O lead disse que vai pensar, o que respondo?" | [[Atendimento]] |
| "O que está pendente?" | [[Pendencias]] |

## Mapa do cofre
- **Regras que valem sempre:** [[Regras de ouro]] · [[Compliance]] · [[Aprovacao e registro]] · [[Contas e navegador]]
- **Funções:** [[Coordenador]] · [[Minerador]] · [[Editor]] · [[Copywriter]] · [[Publicador Marketplace]] · [[Publicador Instagram]] · [[Analista]] · [[Atendimento]]
- **Padrões:** [[Anuncio Marketplace]] · [[Reel Instagram]] · [[Fotos de veiculo]] · [[Calculo de entrada e parcela]] · [[Mineracao - o que procurar]]
- **Modelos:** [[Pasta do bem]] · [[Entrega de mineracao]] · [[LEIA-ME de edicao]] · [[Lista de aprovacao]] · [[Registro de publicacao]] · [[Relatorio diario]]
- **Operação deste operador:** [[Perfil-do-operador]] · [[Decisoes]] · [[Pendencias]] · pasta `05-Operacao/registros/`
- **Referências:** [[Playbook do SDR (completo)]] · `06-Referencias/edicao/` · `07-Ferramentas/`
- **Skills do Claude:** [[Skills do Claude]]
- **Treinamento do comercial:** [[00-Roteiro do treinamento]] (perfil nichado + Marketplace orgânico)
- **Arquivo do tempo dos bots:** `_arquivo-grok/` (cópia completa de 19/11/2026; só consulta; o Obsidian não indexa)

## Como um bot virou uma função
| Bot no Grok | Aqui |
|---|---|
| CEO | [[Coordenador]] (ordem do trabalho e trava de aprovação) |
| Minerador, Mapeador de Redes | [[Minerador]] |
| Editor de Vídeo | [[Editor]] |
| Estrategista de Criativo | [[Copywriter]] |
| Postador de Redes | [[Publicador Marketplace]] e [[Publicador Instagram]] |
| Analista de Redes, Chefe de Gabinete | [[Analista]] |
| SDR, Auditor de Conversas, Briefing de Call | [[Atendimento]] (o SDR automático continua no CRM) |
| Monitor do WhatsApp, Desenvolvedor, Lembrete de Call, Transcritor, Sócio Provocador, Gestor de Tráfego | ficam fora deste cofre por enquanto (ver `_arquivo-grok/Bots/`) |

## Para criar o cofre de um vendedor novo
Rode no PowerShell, nesta pasta:
```
powershell -ExecutionPolicy Bypass -File 07-Ferramentas\preparar-kit-vendedor.ps1 -Destino "C:\MOVECON-<nome>" -Nome "<nome do vendedor>"
```
O script copia regras, funções, padrões, modelos, ferramentas e skills, **sem** o arquivo dos bots, sem os seus registros e com o Perfil do operador em branco. Depois, preencha com o vendedor o `05-Operacao/Perfil-do-operador.md` dele.
