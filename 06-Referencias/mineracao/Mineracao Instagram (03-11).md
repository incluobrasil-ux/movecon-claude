# README — Mineração Instagram de concorrentes (consórcio) — 03/11/2026

## O que é
Mineração em massa de Reels de concorrentes de consórcio por nicho (carro, imóvel, caminhão, trator/agro, lancha/náutico, jet ski, alto padrão, carta de crédito, parcelamento sem juros, carta contemplada), para achar os vídeos de mais engajamento, os padrões e o que replicar.
Planilha: `mineracao-instagram-2026-11-03.xlsx`, com as abas replicar-hoje, Vídeos, Concorrentes, Padrões e README.
Clones em H.264: `/workspace/movecon/mercado/videos/clones-2026-11-03/`, com `LINKS.md`.

## Fontes
- **Apify, Instagram Hashtag/Reel scraper:** coleta inicial por hashtag e palavra-chave de cada nicho, ~507 linhas e 478 Reels únicos. Custo ~US$1,32 do crédito gratuito, que **acabou**. Nada de Apify depois disso.
- **yt-dlp, sem login, em URLs públicas `/reel/<código>/`:** download dos vídeos escolhidos, mais curtidas e comentários.
- **faster-whisper (local):** transcrição, usada para o gancho dos 3 primeiros segundos e a checagem de risco.
- **ffmpeg:** frames e grades para classificar o tipo (ilustrativo/humanizado) e conversão para H.264 (libx264, yuv420p, aac, +faststart).
- **Seguidores:** páginas públicas viralist.ai. Conferidos à mão: olucasbatt 2.538.976 (HypeAuditor público, 29–30/10/2026) e giovannaantonelli 20.761.522 (storyviewerfree, 13/10/2026; ergauge 20.655.493).
- Nenhum login, curtida, follow, comentário ou post. Nenhuma conta do Samuel nem da BM foi usada.

## Definições
- **engaj./seguidores %** = (curtidas + comentários + compartilhamentos) / seguidores × 100.
- **tipo ilustrativo:** o bem em tela cheia, com texto na tela e sem pessoa falando para a câmera.
- **tipo humanizado (base educativos):** pessoa falando para a câmera, mantido como base para vídeos educativos.
- Na aba Vídeos, o tipo vem de duas formas:
  - "verificado nos frames": olhei os frames;
  - "provável … não verificado": heurística por áudio original ou música.
- **RISCO:**
  - promessa de contemplação ou crédito na hora;
  - compra de cota;
  - venda de lead;
  - esconder que é consórcio;
  - "sem entrada";
  - "negativado";
  - venda de carta contemplada.
  Vídeos com RISCO nunca entram como modelo nem como clonável. As frases de atenção não são RISCO, mas também não devem ser copiadas.

## O que está em branco e por quê
- **Frequência de postagem:** exige abrir o perfil completo, o que o Instagram limita sem login. A amostra mostra só o 1º e o último reel coletados.
- **Seguidores:** em branco quando o perfil não está na viralist.ai (404 ou 0). Não inventei números.
- **Views:** em branco quando o Apify não retornou playCount.
- **Texto na tela:** preenchido só nos vídeos que assisti ou cujos frames vi (picks e clones).
- **Gancho 3s (fala):** só existe para os vídeos baixados e transcritos. Vídeos só com música não têm fala.
- **Compartilhamentos:** o Apify retorna esse dado para poucos vídeos.
- **Carro de R$1 milhão:** nenhum Reel com valor ~1M citado. O Racon PR1ME é post de imagem. CbXfv-6u5Hg (superesportivo, "carros de luxo") é candidato, mas o valor não aparece.
- **Carro de 400 mil:** a faixa foi inferida pela marca (Porsche, Audi elétrico). O valor não é citado nos vídeos.

## Aviso sobre clones
Reusar imagens de concorrentes, mesmo removendo @, logo e marca d'água, tem risco de direito autoral e de derrubada do post. Prefira regravar o formato com B-roll próprio ou de origem clara, usando o clone como roteiro e referência de enquadramento.
