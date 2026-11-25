---
name: minerar-criativos
description: Minera vídeos brutos de veículos sem texto na tela e criativos prontos de concorrentes (Biblioteca da Meta, TikTok Creative Center, YouTube) para a edição de Reels. Use quando pedirem "minerar vídeos", "brutos", "criativos de referência", "o que está rodando", "modelos de criativo".
---

# minerar-criativos

**Passo zero (decisão de 25/11/2026, para não refazer trabalho):**
- rode `git pull`;
- leia `06-Referencias/mineracao/Ja minerado.md`;
- rode `py -3 07-Ferramentas/scripts/mineracao/registro_buscas.py <palavra do tema>`.

Sem login e sem robô novo: use só as ferramentas do `02-Funcoes/Minerador.md`. No fim, registre a mineração em `Ja minerado.md` e faça commit e push.

As regras desta função ficam nas notas do cofre (fonte única). Leia, nesta ordem, antes de começar:

1. `01-Regras/Regras de ouro.md`
2. `02-Funcoes/Minerador.md`
3. `03-Padroes/Mineracao - o que procurar.md (seção 2)`
4. `04-Modelos/Entrega de mineracao.md`
5. `07-Ferramentas/referencias/sinais-escala.md`

Antes de tudo: leia as pesquisas de `06-Referencias/mineracao/` e use a skill `minerador-ofertas` para dar a nota.

## Brutos de veículo (caminhão, carro): caminho rápido, feito para PC fraco
1. Pasta da tarefa: `10-Trabalho/AAAA-MM-DD-brutos-<tipo>/`.
2. Coleta pelas lojas boas: `py -3 07-Ferramentas/scripts/mineracao/brutos_meta.py --lojas-boas --rolagens 8 --saida <pasta>/meta.json`. Depois, se precisar, 4 a 5 termos de unidade única ("caminhão único dono cautelar", "caminhão aceita troca valor", "caminhão km original valor"). No máximo cerca de 15 buscas por dia: "nenhum anúncio" num termo que tinha resultado = bloqueio, pare.
3. Peneira, **um processo só**: `py -3 07-Ferramentas/scripts/mineracao/triagem_brutos.py <pasta>/meta*.json --pasta <pasta>`.
4. Conferência no olho só dos que passaram. Baixe o `video_hd`, olhe 1 quadro a cada 1,5 s no trecho limpo e confira:
   - caminhão **inteiro** no começo do trecho;
   - sem pessoa nem texto por cima;
   - versão do vídeo igual à do texto do anúncio;
   - 9:16, de preferência 720x1280.
5. Corte 12 a 15 s a partir do caminhão inteiro, `NN-caminhao-modelo-ano.mp4`, e calcule com `calc_valores.py <preço> --reel`.
6. No fim, atualize `07-Ferramentas/referencias/lojas-brutos.json`: loja que deu vídeo aprovado vai para "boas"; loja com 3 ou mais analisados e nenhum aprovado vai para "ruins".

Entrega: clipes NN-tipo-veiculo.mp4 + planilha + prancha + criativos-prontos.csv, com QA quadro a quadro.

Se uma nota contradiz um pedido, a nota vence: avise o operador e registre em `05-Operacao/Pendencias.md`. Decisão nova: `05-Operacao/Decisoes.md`.
