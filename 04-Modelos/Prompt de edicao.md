---
tipo: modelo
atualizado: 2026-11-25
---
# Prompt padrão de edição de Reels (para parceiros e vendedores)

**Para quê:** editar no PC da pessoa, mesmo que ela nunca tenha editado, no mesmo padrão dos 15 Reels de caminhão aprovados em 25/11/2026 ("ficou excelente").

**Como usar:**
1. Abra o Claude Code na **pasta raiz do cofre** (`MOVECON-Claude`).
2. Preencha só a parte **PREENCHA**.
3. Cole e envie.

O Claude prepara o PC, edita **um vídeo de teste**, espera o seu OK e só depois edita o resto.

```
EDIÇÃO DE REELS (prompt padrão do cofre MOVECON-Claude)

=== PREENCHA ===
PASTA DOS BRUTOS NESTE PC: <ex.: 10-Trabalho/2026-11-26-brutos-suv/aprovados ou a pasta onde estão os vídeos>
CONTA ONDE VAI POSTAR: <@conta>
PRAÇA DA CONTA: <cidade e região, ex.: Marabá e região>
QUANTIDADE: <ex.: 10 vídeos>
VALOR DE CADA BEM: <"está na planilha da mineração" ou a lista: arquivo = valor>
PASTA DE PRONTOS NESTE PC: <onde salvar os vídeos prontos>
=== FIM ===

Regras fixas (não altere):
0. Na pasta raiz do cofre: git pull. Se chegar commit novo, peça para eu fechar e abrir o Claude Code de novo na pasta raiz, e continue.
1. Leia, nesta ordem, e siga sem inventar:
   - 03-Padroes/Padrao minimo de edicao.md (REGRA ABSOLUTA);
   - 01-Regras/Regras de ouro.md;
   - 02-Funcoes/Editor.md;
   - 03-Padroes/Reel Instagram.md;
   - 03-Padroes/Calculo de entrada e parcela.md;
   - 06-Referencias/edicao/Nota do modelo lote-v3.md;
   - 06-Referencias/edicao/Musicas liberadas.md;
   - 06-Referencias/edicao/exemplos-sementes/LEIA-ME.md;
   - 05-Operacao/Decisoes.md (a decisão mais nova vale).
2. Preparar o PC (só na 1ª vez):
   - confira ffmpeg e ffprobe; se faltar: winget install Gyan.FFmpeg, depois feche e abra o terminal;
   - py -3 -m pip install pillow opencv-python-headless numpy;
   - músicas: veja quais da tabela de Musicas liberadas.md já estão na minha pasta de músicas. As que faltarem, me passe os links para EU baixar com um clique (você não baixa por robô). Sem música, só vale "musica": "original" em vídeo sem voz.
   - Use só as ferramentas do cofre (editar_reel.py, tampa_plaquetas.py, calc_valores.py, checar-midia.py, check_oferta.sh). Nunca crie editor novo. Se uma ferramenta der erro, PARE e me mostre o erro.
3. Trabalhe em 10-Trabalho/AAAA-MM-DD-edicao-<nicho>/. Nunca mexa nos brutos originais.
4. Para cada bruto, nesta ordem:
   a) confira: vertical nativo 9:16, um veículo só, real, inteiro, sem apresentador; se não bater, reprove e diga o motivo;
   b) corte de 11 a 15 s, com cortes secos e o veículo inteiro no quadro 0; sem pessoa, sem letreiro de fachada (corte o trecho), sem texto do vídeo de origem;
   c) placa, plaqueta, adesivo e nome de outra loja: marque as sementes olhando os quadros, rode tampa_plaquetas.py com --debug, confira e rode sem --debug. Nunca tarja preta e nunca borrão no vídeo;
   d) valor: o do anúncio; sem preço, use o valor médio de mercado do modelo e do ano estimado (marque "valor médio estimado"). Entrada e parcela só com py -3 07-Ferramentas/scripts/calc_valores.py <valor> --reel;
   e) monte o lote.json e rode editar_reel.py com --handle <CONTA>. Varie as músicas entre os vídeos (use o "musica_in" da tabela) e use "placas": null, porque a placa já foi tampada no passo c.
5. TESTE: edite só o 1º vídeo e me mostre a folha de contato (quadro 0, quadro de 1,5 s e um quadro a cada 10%) e os valores. ESPERE meu OK antes de editar o resto.
6. Conferência de cada vídeo pronto (A6 do Padrao minimo):
   - checar-midia.py <arquivo> instagram reels;
   - 1080x1920, de 11 a 15 s, cerca de −14 LUFS;
   - folha de contato item por item (pílulas, colchete, modelo, @, rodapé em 1,2 s, nada proibido na tela);
   - recorte da área tampada a cada ~0,2 s.
   Reprove o que não bater; não entregue "quase certo".
7. Legenda de cada vídeo no formato preferido da A5 (gancho, ✔ Entrada, ✔ Parcelas, ✔ Atendimento em <PRAÇA> e região, benefício, CTA, 5 hashtags com a da praça, "Parcelamento. Vídeo ilustrativo."). Os valores da legenda são os mesmos da tela.
8. Entrega:
   - os vídeos prontos na PASTA DE PRONTOS;
   - na pasta da tarefa: LEIA-ME.md (modelo 04-Modelos/LEIA-ME de edicao.md), folhas de contato e md5;
   - crie entregas/AAAA-MM-DD-<nicho>-<conta sem @>/ com LEGENDAS.md (mesmo formato de entregas/2026-11-25-caminhao-lais/LEGENDAS.md) e md5.txt; só texto, sem vídeo. É isso que o Prompt de postagem usa depois;
   - commit + push só dessa pasta entregas/...; se não tiver permissão de push, me diga o que mandar ao Samuel.
9. NADA vai ao ar. A postagem só começa com o OK escrito do Samuel para essa lista, registrado em 05-Operacao/Decisoes.md, e pelo 04-Modelos/Prompt de postagem.md.

REVISÃO OBRIGATÓRIA (responda em português, frases curtas):
- commit puxado e o que foi instalado no PC;
- músicas usadas (e quais faltaram);
- quantos brutos entraram, quantos viraram Reel e quantos foram reprovados, com o motivo;
- para cada vídeo: arquivo, modelo, valor (do anúncio ou médio estimado), entrada, parcela, duração, LUFS, md5;
- onde tampou placa ou loja, e se conferiu no olho;
- caminho da pasta de prontos e da entrega, e se o push foi feito;
- o que o Samuel precisa aprovar.
```

**Ritmo:** só edite o resto do lote depois de o vídeo de teste ser aprovado. Foi assim que o padrão foi acertado no caminhão: v1 e v2 voltaram e a v3 foi aprovada.
