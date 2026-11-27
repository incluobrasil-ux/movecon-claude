---
tipo: referencia
atualizado: 2026-11-26
status: pronto para o 1º teste (falta o token do Samuel)
---
# Música em alta no Reel, postando do PC (API oficial do Instagram)

> Pedido do Samuel (26/11/2026): "essa forma não dá certo de postar no instagram quero outras alternativas [...] faça uma mineração de um repositorio ou de alguma forma [...] do jeito mais simples e leve possivel".

## Em uma frase
Desde **01/06/2026** a Meta tem a **API de áudio do Instagram**: ela lista as músicas e os áudios **em alta** e publica o Reel **do computador** com a música anexada. Quem aplica a música é a Meta, com a licença dela. O Reel sai com o nome da música, igual ao Reel feito no celular, e não fica mudo.

Ferramenta do cofre: `07-Ferramentas/scripts/instagram/ig_musica.py`. Usa só Python e ffprobe, sem programa novo.

## Por que as outras formas não servem
| Forma | Problema |
|---|---|
| Tirar o áudio de vídeo do YouTube, TikTok ou de outro Reel e colar no arquivo | O Instagram reconhece a música (Rights Manager): o Reel fica mudo, cai ou a conta leva aviso. Em anúncio, reprova |
| Botão de música no Instagram pelo computador | Não existe no site. Só no app do celular |
| Prévia de 30 s do Spotify, Deezer ou Apple | Os termos proíbem pôr em vídeo, e o Instagram deixa mudo do mesmo jeito |
| Robô que entra como se fosse o celular (instagrapi e parecidos) | Pede a senha da conta e é fora das regras do Instagram: risco de bloqueio. Proibido no cofre |
| Extensão paga do Chrome (InstaDesk e parecidas) | Não é oficial. Mesmo risco |

## O que achamos no GitHub (26/11/2026)
- **Postiz** (`gitroomhq/postiz-app`, agendador de código aberto): já põe a música no Reel por essa API (`audio_configuration`). Funciona, mas precisa de servidor próprio: pesado para nós.
- **makethevideoandpost** (`AdarshJ173`): publicou Reels com música por essa API. Lições que entraram no nosso script: envio pelo link público é o mais garantido; subcódigo **2207065** = música não liberada para a conta (escolher outra); áudio tem que ser 44,1 ou 48 kHz.
- **kame-space** (`sprmke`, pesquisa de 22/11/2026): confirma que sem palavra de busca a API devolve a lista **em alta**, que **não dá para escolher o trecho** e que a lista pode ser menor que a do app.
- **Metricool** (agendador pronto, desde 18/05/2026): mostra o áudio em alta ao agendar o Reel. Usa a mesma API. Não confirmamos se o plano grátis inclui isso.

## O que precisa (uma vez só, feito pelo Samuel)
1. **Conta profissional.** No app: Configurações → Tipo de conta e ferramentas → Mudar para conta profissional. **Criador** costuma ter mais músicas; **Comercial** costuma ter só as livres. Decisão do Samuel (testar numa conta primeiro).
2. **Página do Facebook ligada à conta.** Na Página: Configurações → Contas vinculadas → Instagram → Conectar. Se as Páginas de todas as contas estiverem no Facebook do Samuel (ou no portfólio da MOVECON), **um token só serve para todas**.
3. **App da Meta (grátis).** Em developers.facebook.com → Meus apps → Criar app → tipo **Empresa (Business)** → adicione **Login do Facebook para Empresas** e **API do Instagram**. Pode ficar em modo de desenvolvimento: para as contas de quem tem papel no app (o Samuel como administrador), não precisa de análise da Meta. Confira na tela do app.
4. **Token de 60 dias.** Em developers.facebook.com/tools/explorer: escolha o app → "Token de acesso do usuário" → marque `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`, `business_management` → Gerar (escolha as Páginas e contas). Depois, em developers.facebook.com/tools/debug/accesstoken → cole → **Estender token de acesso**. Copie o token longo.
5. No PC: `py -3 07-Ferramentas/scripts/instagram/ig_musica.py configurar`. Abre o Bloco de Notas: cole o token, salve e feche. **Nunca cole o token no chat do Claude nem em arquivo do cofre.** Ele fica em `%USERPROFILE%\.movecon\meta-instagram.json`, fora do GitHub.
6. `py -3 07-Ferramentas/scripts/instagram/ig_musica.py contas`: mostra as contas que apareceram e quando o token vence. Renove antes de vencer (passo 4 de novo).

## No dia a dia
1. **Editar sem som:** `"musica": "app"` no `lote.json` do `editar_reel.py`. O vídeo sai pronto, mudo.
2. **Escolher a música:**
   - em alta: `py -3 07-Ferramentas/scripts/instagram/ig_musica.py em-alta --conta @conta`
   - por estilo: `... em-alta --conta @conta --busca "sertanejo"` (ou "piseiro", "agro", "funk", "country")
   - áudio original em alta: `... em-alta --conta @conta --tipo original`
   A lista sai numerada e salva em `10-Trabalho/AAAA-MM-DD-musicas-em-alta/`. Ouça pela prévia antes. Varie a música entre os vídeos.
3. **Teste (não publica):** `... postar <video.mp4> --conta @conta --audio <audio_id> --legenda <legenda.txt>`. Envia, junta a música e para. O rascunho some sozinho em 24 h.
4. **Publicar (só com OK escrito do Samuel):** o mesmo comando com `--publicar`. O script confere se a legenda já está no ar (não repete), publica, mostra o link e se a música entrou (`MUSIC`). Registre em `05-Operacao/registros/publicados-AAAA-MM.md`.
5. Se der erro no envio do arquivo, o script avisa. Aí use `--url <link público do mp4>` (ver "Pendências").

## Limites (para não ter surpresa)
- **Não dá para escolher o trecho:** a música toca a partir do ponto padrão da Meta.
- **Não dá prévia da mistura:** confira o Reel no ar logo depois de publicar.
- **A lista é a liberada para uso por terceiros:** pode ter menos músicas que o app.
- **Não pode impulsionar Reel com música da biblioteca.** A coluna `pode_anuncio` da lista diz quais podem ir para anúncio. Para anúncio pago, use as [[Musicas liberadas]] (Pixabay).
- Vale só para **Reel** (não Stories).
- O token vence em **60 dias**.
- Um post por vez, no ritmo da agenda. Erro de limite, verificação ou conta: **pare e avise**.

## Pendências (dependem do Samuel)
- [ ] OK para usar a API na postagem (hoje a regra é postar pelo BitBrowser, `ig-postar-lote.mjs`).
- [ ] Contas como **criador** ou **comercial**.
- [ ] Ligar as contas a Páginas do Facebook e criar o app e o token (passos 1 a 5).
- [ ] 1º teste numa conta: rodar `em-alta` e um `postar` **sem** `--publicar`, e conferir se a lista tem música brasileira em alta e se o envio direto do arquivo funciona.
- [ ] Quem posta: só o PC do Samuel (um token para todas as contas) ou cada vendedora com o token só da conta dela.

## Fontes
- Meta, Instagram Audio API: https://developers.facebook.com/docs/instagram-platform/content-publishing/audio-api/
- Meta, changelog (01/06/2026): https://developers.facebook.com/documentation/instagram-platform/changelog
- Meta, envio de vídeo do computador: https://developers.facebook.com/documentation/instagram-platform/content-publishing/resumable-uploads
- Metricool, áudio em Reels agendados: https://help.metricool.com/how-to-add-audio-to-your-instagram-reels-from-metricool-2o2ks
