---
tipo: indice
---
# Skills do Claude

As skills ficam em `.claude/skills/` (pasta oculta, por isso o Obsidian não mostra). Cada uma só reconhece o pedido e manda o Claude ler as notas da função. **Para mudar uma regra, edite a nota, não a skill.**

| Skill | Dispara quando pedem | Lê |
|---|---|---|
| minerar-bens | minerar bens, nova leva, carros para anunciar | [[Minerador]], [[Mineracao - o que procurar]], [[Pasta do bem]] |
| minerar-criativos | vídeos brutos, criativos de referência | [[Minerador]], [[Mineracao - o que procurar]] |
| minerar-mercado | concorrentes, quem está escalando | [[Minerador]], [[Mineracao - o que procurar]] |
| editar-fotos-veiculo | tarjar placa, tratar fotos | [[Editor]], [[Fotos de veiculo]] |
| editar-reel | editar vídeo, montar Reel | [[Editor]], [[Reel Instagram]] |
| escrever-copy | texto do anúncio, legenda | [[Copywriter]], [[Anuncio Marketplace]] |
| publicar-marketplace | postar no Marketplace, rodada, grupos | [[Publicador Marketplace]] |
| publicar-instagram | postar Reel | [[Publicador Instagram]] |
| conferir-no-ar | conferir se saiu, repostar erro técnico | regra própria |
| contagem-marketplace | relatório, cliques | [[Analista]], [[Relatorio diario]] |
| atendimento | o que respondo, objeção, briefing | [[Atendimento]] |
| bitbrowser-autonomo | qualquer tarefa no BitBrowser | `07-Ferramentas/scripts/bitbrowser.py` |

## Scripts (`07-Ferramentas/scripts/`)
| Pasta / arquivo | Para |
|---|---|
| `calc_valores.py` | entrada e parcela (Marketplace e Reel) |
| `biblioteca_meta.py`, `transparencia_google.py` | mineração de anúncios (testados no kit de 16/11) |
| `bitbrowser.py` | abrir perfil, navegar, print, fechar |
| `mineracao/miner.py` | bens da Mobiauto (caminhos do PC dos bots: ajustar) |
| `edicao/` | tarja, render de Reel, overlays, áudio, conferência, validação da leva |
| `marketplace/` | publicação e grupos por CDP (portas e abas fixas: ajustar) |
| `instagram/` | postagem de Reel por CDP (ajustar) |
| `checagem/` | checar mídia; checar compliance (lista de outubro, desatualizada) |
