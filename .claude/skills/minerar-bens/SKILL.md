---
name: minerar-bens
description: Minera veículos reais à venda (Mobiauto) com fotos e preço para virar anúncio do Marketplace da MOVECON. Use quando pedirem "minerar bens", "achar carros para anunciar", "nova leva", "buscar fotos reais", "mais anúncios para o Marketplace" ou substitutos de bens excluídos.
---

# minerar-bens

**Passo zero (decisão de 25/11/2026, para não refazer trabalho):**
- rode `git pull`;
- leia `06-Referencias/mineracao/Ja minerado.md`;
- rode `py -3 07-Ferramentas/scripts/mineracao/registro_buscas.py <palavra do tema>`.

Sem login e sem robô novo: use só as ferramentas do `02-Funcoes/Minerador.md`. No fim, registre a mineração em `Ja minerado.md` e faça commit e push.

As regras desta função ficam nas notas do cofre (fonte única). Leia, nesta ordem, antes de começar:

1. `01-Regras/Regras de ouro.md`
2. `05-Operacao/Perfil-do-operador.md`
3. `02-Funcoes/Minerador.md`
4. `03-Padroes/Mineracao - o que procurar.md (seção 1)`
5. `03-Padroes/Anuncio Marketplace.md (faixa e modelos proibidos)`
6. `03-Padroes/Calculo de entrada e parcela.md`
7. `04-Modelos/Pasta do bem.md`

Entrega: leva em 10-Trabalho/AAAA-MM-DD-leva-NN/ com uma pasta por bem, LEVA-NN.md e folha de contato. Depois passa para editar-fotos-veiculo e escrever-copy.

Se uma nota contradiz um pedido, a nota vence: avise o operador e registre em `05-Operacao/Pendencias.md`. Decisão nova: `05-Operacao/Decisoes.md`.
