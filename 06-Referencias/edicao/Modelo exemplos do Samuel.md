# Modelo copiado dos exemplos do Samuel (13/11 22h08), exemplos-samuel-2026-11-13/exemplo-01..05
Referência visual: _work/ref/refs.jpg (quadros em 3 s de ex01, ex02, ex04, ex05). ex03 = mesmo conteúdo do ex01.

Filmagem: walkaround real na mão (rua/pátio), 4–5 planos de 2–5 s, cortes secos, sem transição, sem zoom digital; mistura externa lateral/traseira, porta aberta, painel/interior, caçamba. 12–15 s.
Caixa de valores (o tempo todo, desde 0 s, estática): no terço superior (~15–20% da altura), alinhada à esquerda ou centro.
 - Cada linha é uma PÍLULA BRANCA separada (cantos levemente arredondados), texto preto em negrito sans arredondada, caixa mista ("Entrada de ...", "Parcelas de ...").
 - Um COLCHETE "[" colorido grosso à esquerda abraçando as linhas (vermelho em ex01/05, amarelo-laranja degradê em ex02).
 - Variação ex04: linha de cima pílula branca grande, linha de baixo pílula VERMELHA menor com texto branco.
 - Ordem: Entrada em cima, Parcelas embaixo.
Nome do carro (ex04): texto pequeno no terço inferior (~75%), pílula/caixa simples.
Rodapé (ex01/02/05): CTA "CLIQUE NO LINK / E FALE DIRETAMENTE NO WHATSAPP" branco, condensado, caixa alta, sombra preta, sem caixa, ~85% da altura, entra em ~1 s. (Pendente Samuel: em 19h52 ele mandou sem CTA.)
Música: animada (eletrônica ou forró/piseiro), cortes NÃO precisam bater no beat; sem locução.
Sem logo. Nosso @tanan_intermediacoes entra discreto.

Aplicação MOVECON (padrão até o Samuel decidir):
 - Pílulas: "Crédito de R$ X" (opcional, ver pendência), "Entrada de R$ X", "Parcelas de R$ X" — valores do lote-v2.csv, sem meses/%/lance.
 - Nome do bem (ex.: "Hilux SRX") em pílula pequena no terço inferior; @tanan_intermediacoes pequeno no rodapé.
 - Sem CTA por padrão (regra do Samuel 19h52), versão com CTA só se ele mandar.
 - Variar entre peças: cor do colchete (vermelho, amarelo-laranja), variante ex04 (2ª pílula vermelha), alinhamento esquerda/centro, música do acervo (eletrônica e forró sem IA).
 - "Capricho" (22h03): planos bem escolhidos e estáveis o suficiente, cor natural levemente corrigida, cortes limpos em momentos de movimento, áudio normalizado; sem efeitos que fujam do modelo cru.

## DECISÃO DO SAMUEL 22h12 (vale acima de tudo)
"Coloca o CLIQUE NO LINK E FALE NO WHATSAPP igual aos exemplos" + "Só entrada e parcelas".
 - SÓ 2 linhas: Entrada e Parcelas (sem crédito).
 - COM o rodapé "CLIQUE NO LINK / E FALE DIRETAMENTE NO WHATSAPP" igual aos exemplos (substitui o 'sem CTA' das 19h52).

## Regra extra (Editor, 22h25)
O render_v3.py tem um fallback de "fundo desfocado" quando 2× não preenche o 9:16. NÃO usar na entrega (regra do Samuel 01/11: filmagem sempre em tela cheia, nunca fundo desfocado). Se o trecho for horizontal pequeno demais para preencher 9:16 com ≤2×, descarte o trecho e use outro.
Os valores de 04 Strada e C03 Cargo nos overlays vêm do lote-v2.csv; confira contra item.md do Minerador antes de renderizar e, se divergir, mantenha o lote-v2.csv e anote.
