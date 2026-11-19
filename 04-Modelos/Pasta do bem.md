---
tipo: modelo
---
# Pasta do bem (Marketplace)

Uma pasta por bem dentro da leva: `10-Trabalho/AAAA-MM-DD-leva-NN/NNN-marca-modelo-ano-idOrigem/`
Substituto de um bem excluído: mesmo número com sufixo `b`, depois `c` (ex.: `017b-fiat-toro-2022-33152997`).

```
NNN-marca-modelo-ano-idOrigem/
├── fotos-originais/      ← como baixou; nunca mexer
├── fotos-v1/             ← tratadas, na ordem de postagem (01 = capa externa)
├── _descartadas/         ← fotos que saíram, com o motivo em mudancas.md
├── fonte.txt
├── calculo.md
├── preco.txt             ← só o número da entrada (ex.: 13380)
├── titulo.txt
├── descricao.txt
├── mudancas.md           ← o que o Editor fez em cada foto
└── status.txt            ← rascunho | aguardando-OK | aprovado | publicado | segurado | excluido
```

## fonte.txt
```
Link de origem: <url do anúncio>
Valor do bem: R$ <valor> (preço anunciado no anúncio de origem, <site> <id>)
Unidade em <cidade - UF>, <km> km. Ano: <fabricação>/<modelo>. Versão: <versão>. Anunciante: <loja ou particular>. Coletado em <dd/mm/aaaa>.
Unidade diferente das que já estão na fila (conferido por id, km + preço e placa).
Fotos: <n> baixadas para fotos-originais/.
```

## calculo.md
```
Valor do bem: R$ <valor>
Entrada (20%, para cima, sem centavos): R$ <entrada>
Dobro do valor: R$ <2x>
Tabela 4076, linha <n>: crédito R$ <crédito>, parcela 9ª–150ª R$ <parcela>
Comando: py -3 07-Ferramentas/scripts/calc_valores.py <valor>
```
