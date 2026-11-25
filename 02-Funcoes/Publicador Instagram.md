---
tipo: funcao
substitui: bot Postador de Redes, parte do Instagram e TikTok (Grok)
skill: publicar-instagram
---
# Publicador do Instagram

**Um trabalho só:** postar os Reels aprovados na conta certa, com a legenda exata, sem repetir, e provar que foi ao ar.

## Contas e ritmo
Ver [[Perfil-do-operador]]. Em 19/11:
- @tanan_intermediacoes: 1 Reel por hora.
- @pedroabreu.consultor: 3 por dia (manhã, tarde, noite). Reels **diferentes** das outras contas (a cada 4 da fila, 1 vai para ela). Vídeo próprio sem o selo da Tanan e legenda sem #tananintermediacoes.
- Conta nova de Instagram ou TikTok: metade do ritmo nas 2 primeiras semanas.

## Antes de postar
1. Só peça com OK escrito ([[Aprovacao e registro]]) e com o md5 batendo com o aprovado.
2. A legenda tem os mesmos valores do vídeo ([[Reel Instagram]]).
3. Conferir no perfil que esse criativo ainda não está no ar (em nenhuma das contas).
4. Esperar se houver rodada do Marketplace na mesma conta (`rodada.lock` com menos de 25 min).

## Postar
Pelo navegador do perfil do BitBrowser da conta:
1. Abrir o perfil e conferir "Editar perfil" + o @ certo.
2. Criar > **Postar** (nunca "Anúncio" nem "Vídeo ao vivo"). Enviar o vídeo, proporção **Original**.
3. Colar a legenda e conferir que ficou idêntica.
4. Sem música adicionada, sem local, sem marcação, sem colaboração, sem rótulo de IA, "compartilhar no Facebook" desligado. Nunca Turbinar.
5. Compartilhar. Esperar "Seu reel foi compartilhado", abrir o Reel e conferir legenda e vídeo. Print.

Script do tempo dos bots: `07-Ferramentas/scripts/instagram/ig-post-next.mjs` (`--check` confere sem postar; `--conta pedro`). Ajustar caminhos, portas e ids de aba antes de usar.

## No PC do parceiro (sem BitBrowser), 25/11/2026
O `ig-post-next.mjs` só roda no PC dos bots. No PC do parceiro, use o [[Prompt de postagem]] (04-Modelos):
- o Claude in Chrome controla o Chrome onde o parceiro já entrou no Instagram;
- ele agenda todos os Reels de uma vez no Meta Business Suite, nos horários do parceiro;
- o login é sempre feito pela pessoa.

## Registro
Linha em `05-Operacao/registros/publicados-AAAA-MM.md`: n, arquivo, md5, hora, conta, link, conferência, OK que liberou.

## Buffer (@planejeseucredito e TikTok)
Parados desde 14/11. Quando voltarem: publicar pelo Buffer, nos canais conectados pelo operador; TikTok sempre com "Conteúdo promocional" ligado; no máximo 5 hashtags no Instagram.

## Nunca
Responder comentário ou Direct, curtir, seguir, mudar bio, foto ou configuração, impulsionar. Parar no primeiro aviso, limite ou pedido de verificação (saída 2 do script = parar e avisar).
