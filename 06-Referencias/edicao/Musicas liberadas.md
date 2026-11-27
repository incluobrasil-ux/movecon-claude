---
tipo: referencia
atualizado: 2026-11-26
---
# Músicas liberadas para os Reels

São as 6 faixas usadas nos 15 Reels de caminhão aprovados em 25/11/2026 ("ficou excelente").

**Licença:** todas são da Pixabay (Pixabay Content License): uso grátis, inclusive comercial e em anúncio, sem precisar dar crédito. Pesquisa de 22/10/2026: nenhuma tem o selo de IA nem o de "Content ID".

**Por que os arquivos não estão no GitHub:** a licença proíbe distribuir a faixa sozinha. Cada PC baixa as suas, de graça, pelo link abaixo:
1. Abra o link no navegador.
2. Clique em **Baixar** (Download).
3. Salve na pasta de músicas da pessoa, por exemplo `Documentos\MOVECON-musicas`, com o nome da coluna "Arquivo".

**Quem baixa é a pessoa, com um clique.** O Claude não baixa por robô.

### Jeito fácil (26/11/2026): `musicas.py`
Rode na pasta do cofre:
1. `py -3 07-Ferramentas/scripts/edicao/musicas.py conferir`: mostra as 6 faixas numeradas (1 a 6, na ordem da tabela) e quais faltam.
2. `py -3 07-Ferramentas/scripts/edicao/musicas.py baixar`: abre a página de cada faixa que falta. **Você clica em Baixar.** O script acha o arquivo em Downloads, põe o nome certo e move para `Documentos\MOVECON-musicas`.
3. `py -3 07-Ferramentas/scripts/edicao/musicas.py por <video.mp4> --faixa 4`: põe a faixa no vídeo (só o som; a imagem não muda), no ponto de entrada da tabela, em -14 LUFS. Bom para ouvir antes de editar e para bruto sem som (os de agro de 26/11 vêm sem som).
4. No `lote.json` do `editar_reel.py`, basta `"musica": 4` (o número). O script acha o arquivo e o ponto de entrada sozinho. Se faltar a faixa ou o vídeo não tiver som com `"original"`, ele para com o erro explicado.

| Arquivo | Página na Pixabay | Clima | `musica_in` (onde começa) | Uso |
|---|---|---|---|---|
| `01-kontraa-goldn-uk-drill-music-116392.mp3` | https://pixabay.com/music/beats-goldn-uk-drill-music-116392/ | drill elegante, grave pesado | 6.27 | caminhão, SUV, premium |
| `02-kulakovka-danger-music-620575.mp3` | https://pixabay.com/music/phonk-danger-music-620575/ | phonk escuro, cara de "edit" | 15.81 | caminhão, carro esportivo |
| `03-rockot-experimental-cinematic-hip-hop-315904.mp3` | https://pixabay.com/music/beats-experimental-cinematic-hip-hop-315904/ | hip-hop cinematográfico, épico | 12.35 | caminhão, lançamento |
| `01-folk_tales-country-countryside_19sec-610102.mp3` | https://pixabay.com/music/modern-country-country-countryside-19sec-610102/ | country com violão (19 s, já com final) | 0 | agro, trator, caminhão |
| `02-apalonbeats-country-576328.mp3` | https://pixabay.com/music/modern-country-country-576328/ | country calmo (volume baixo; o loudnorm corrige) | 0.67 | agro, picape |
| `03-kontraa-whip-afro-dancehall-music-110235.mp3` | https://pixabay.com/music/beats-whip-afro-dancehall-music-110235/ | dancehall pra cima (o mais perto de agrofunk) | 17.3 | caminhão, agro |

## Regras
- **Uma música por vídeo**, contínua. Varie entre as faixas no mesmo lote: no caminhão, cada faixa foi usada de 4 a 6 vezes em 33 edições.
- **Vídeo com voz de vendedor ou de outra pessoa:** sempre troque o áudio por uma música.
- **Vídeo só com som ambiente ou motor:** pode manter o som original com `"musica": "original"` no `lote.json` ([[Reel Instagram]]).
- **Música de sucesso ou viral:** só pelo app do Instagram, na hora de postar. **Nunca** baixe para editar.
- **Música nova:** só da Pixabay, sem o selo "AI generated" nem o selo "Content ID Registered". Antes de usar, inclua na tabela com o link (e commit).


## Música viral (trecho de música famosa) — como fazer do jeito certo (26/11/2026)
**Nunca extraia o áudio de outro vídeo** (YouTube, TikTok, Reel de outra pessoa) para pôr dentro do arquivo. O Instagram reconhece a música sozinho (Rights Manager): o Reel fica mudo, sai do alcance ou cai, e a conta pode levar aviso. Em anúncio, a Meta exige licença da música; sem ela, o anúncio é reprovado.

O jeito que funciona e é permitido: **a música entra pelo próprio app do Instagram, na hora de postar.** O Instagram já paga a licença, você escolhe só o pedaço que quer, e o Reel ainda aparece na página daquele áudio (mais alcance).
1. Edite com `"musica": "app"` no `lote.json`. O vídeo sai pronto, só que sem som.
2. Ache o áudio: no Instagram, abra um Reel que está bombando, toque no nome da música (embaixo) e em **Salvar áudio**. Na biblioteca de músicas do app, a setinha ↗ ao lado do nome marca áudio em alta.
3. Poste pelo **celular**: Reel → escolha o vídeo → ícone de música → **Salvos** → escolha a música → arraste a barra para escolher o **trecho** (até o tamanho do vídeo, 12 a 15 s).
4. Volume: música no máximo; som do vídeo em zero.

**Limites:**
- Só para Reel **orgânico** (sem impulsionar). Reel com música da biblioteca licenciada não pode ser impulsionado: para anúncio, use as faixas desta tabela ou a Sound Collection da Meta.
- Conta **comercial** costuma ver só a Sound Collection (músicas livres). Conta de **criador** costuma ver a biblioteca completa. Se a música não aparecer, veja o tipo de conta em Configurações → Tipo de conta (decisão de trocar é do Samuel).
- Postagem por script no computador não põe música: Reel com música viral é postado à mão, no celular.
- Música com palavrão ou letra que prometa algo (dinheiro fácil, aprovação): não use.

**Para variar mais nos anúncios pagos:** ampliar esta tabela com novas faixas da Pixabay (sem selo de IA e sem "Content ID") ou usar a Sound Collection da Meta, que já vem liberada para anúncio no Gerenciador.
