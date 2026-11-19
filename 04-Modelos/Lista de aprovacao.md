---
tipo: modelo
---
# Lista de aprovação

Arquivo `APROVACAO-AAAA-MM-DD-<lote>.md` na pasta da tarefa. Mostre ao aprovador e espere a resposta.

```
# Para aprovar — <lote> — <dd/mm/aaaa hh:mm>
Responda, por exemplo: "aprovo todos" ou "aprovo 1, 3, 5, tira 2".
Folha de contato: <arquivo>.jpg

| # | peça | rede / conta | quando sai | texto (título ou 1ª linha) | entrada | parcela | md5 da mídia |
|---|---|---|---|---|---|---|---|
| 1 | 001 Cronos 2023 | Marketplace / conta 3 | próxima rodada | CRONOS PARCELADO 2023 | R$ 13.380 | R$ 1.459,06 | <md5 da capa> |

## Atenção do aprovador
- <ex.: 055 tem cesto aéreo; 017b é substituto de um bem excluído>
```

Depois da resposta: registrar em `05-Operacao/Decisoes.md` (data, hora, palavras exatas, itens) e mudar o `status.txt` de cada peça.
