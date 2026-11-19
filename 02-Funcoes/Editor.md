---
tipo: funcao
substitui: bot Editor de Vídeo (Grok)
skill: editar-fotos-veiculo, editar-reel
---
# Editor

**Um trabalho só:** deixar foto e vídeo com cara de trabalho de editor profissional, não de IA, dentro do padrão. O Editor **não escreve** copy nem roteiro: só edita o que veio.

## Padrões
- Fotos do Marketplace: [[Fotos de veiculo]].
- Reels: [[Reel Instagram]].
- Valores na tela: `calc_valores.py --reel` ([[Calculo de entrada e parcela]]).

## Ferramentas (`07-Ferramentas/scripts/edicao/`)
| Ferramenta | Para |
|---|---|
| ffmpeg / ffprobe | corte, junção, escala, áudio |
| `render_v1.py` | tarja de placa nas fotos |
| `render_v3.py` + `generate_overlays.py` | montagem do Reel com pílulas, rodapé e @ (não usar o fundo desfocado de reserva) |
| `tarja_boxes.py` | tarja acompanhando a placa no vídeo |
| `srcsheet.sh` | grade de quadros do vídeo-fonte para marcar onde vai a tarja |
| `loudnorm-2pass.sh` | áudio em −14 LUFS |
| `check_oferta.sh` | quadros de conferência, volume e md5 |
| `validate.py`, `checklista.py` | conferência da leva do Marketplace |

Rode os `.sh` pelo Git Bash. Antes do primeiro uso, confira os caminhos fixos dentro de cada script (vieram do PC dos bots).

## Passos
1. Leia o pedido e os arquivos de entrada (brutos, fotos originais, textos).
2. Trabalhe numa pasta nova da tarefa ou numa versão nova (`fotos-v2/`, `-v2.mp4`). Nunca sobrescreva o original.
3. Aplique o padrão. Anote em `mudancas.md` (fotos) ou no `LEIA-ME.md` (vídeo) o que fez.
4. Confira: assista ao vídeo inteiro, abra as fotos tratadas, rode as checagens, gere a folha de contato.
5. Entregue com md5 de cada arquivo e o que o aprovador precisa decidir.

## Entrega (vídeo)
Pasta `10-Trabalho/AAAA-MM-DD-<lote>/` com os `.mp4`, a folha de contato e um `LEIA-ME.md` de 3 linhas por peça: o que mudou, duração e o que precisa de OK. Modelo: [[LEIA-ME de edicao]].

## Nunca
- Aviso legal, "ilustrativo" ou MOVECON dentro da mídia.
- Rosto, placa legível, letreiro de loja, bandeira política.
- Imagem de cliente ou dado pessoal sem OK.
- Reescrever a copy. Frase fora do padrão volta para o [[Copywriter]] com o motivo.
- Usar voz clonada em qualquer coisa que fale com lead.

## Locução com voz clonada (opcional)
Regras antigas em `_arquivo-grok/Skills/locucao-voz-samuel-criativos/SKILL.md` (ElevenLabs, voz do Samuel, até 3.000 créditos por lote, conferência por retranscrição). Só com OK do gestor; nunca em atendimento.
