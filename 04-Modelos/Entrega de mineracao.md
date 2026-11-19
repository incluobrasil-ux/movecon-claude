---
tipo: modelo
---
# Entrega de mineração

Arquivo `ENTREGA.md` na pasta da tarefa. Escolha a seção do tipo de mineração.

## Cabeçalho (sempre)
```
# Mineração <tipo> — <tema> — <dd/mm/aaaa>
Pedido: <quem pediu, quando, palavras do pedido>
Fontes: <ferramenta (nº de buscas)>, ...
Bloqueios e limites no caminho: <ex.: Meta bloqueou na 18ª busca às 14h30; YouTube pediu "não é robô" em ~50%>
Resultado em uma linha: <ex.: 54 brutos aprovados no QA, 4 rejeitados>
```

## Bens (Marketplace)
Índice `LEVA-NN.md`:
```
| # | pasta | título | valor | entrada | parcela | fotos |
|---|---|---|---|---|---|---|
```
+ `CONTACT-SHEET-leva-NN.jpg` + lista dos descartados com o motivo.

## Vídeos brutos
- Clipes `NN-tipo-veiculo.mp4` (tipo = carro, caminhao, carreta, picape).
- Planilha `planilha-brutos-AAAA-MM-DD.csv` (separador `;`):
```
arquivo;veiculo;ano;tipo;origem_link;perfil;duracao;proporcao;audio;marcar_rosto_placa;trecho_usado;obs
```
- Prancha `prancha-brutos-AAAA-MM-DD.jpg`.
- Seções: aprovados no QA · marcados (placa, pessoa ao longe, logo) · baixa resolução (só reserva) · rejeitados e por quê.

## Criativos prontos (modelar)
Planilha `criativos-prontos.csv`:
```
n;plataforma;anunciante;link;pagina;inicio;dias_rodando;formato;cta;mostra_entrada;mostra_parcela;classificacao;motivo_risco_ou_nota;ja_minerado_antes;arquivo;busca;texto_anuncio;variacoes_mesmo_anuncio
```
`classificacao` = modelo ou risco. Depois:
```
### Top 5 para modelar (por dias no ar)
1. <código> <anunciante> — <dias> dias, <formato>, <CTA>. O que tem: ... Por que funciona: ... Como modelar sem copiar: ...
### Riscos (não modelar)
- <código> <anunciante> — <motivo>
### Atenção (modelo, mas não copiar o trecho)
- <código> — "<trecho>"
```

## Mercado e concorrentes
```
| # | Anunciante | Nota (0–10) | Anúncios Meta | Anúncios Google | Mais antigo (dias) | Formato | Link |
|---|---|---|---|---|---|---|---|
```
Para cada nota 7 ou mais: público, promessa, ângulos que se repetem, oferta (entrada, parcela, bônus), funil (anúncio → página → WhatsApp → ligação), por que está escalando, como modelar (3 ângulos e 3 ganchos próprios). Depois: descartadas (motivo em uma linha), nichos com pouca concorrência, 1 a 3 próximos passos.

## Fim (sempre)
- Onde estão os arquivos.
- O que ficou pendente e por quê.
- Nenhum dado pessoal (telefone, CPF, endereço) de anunciante.
