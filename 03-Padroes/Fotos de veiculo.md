---
tipo: padrao
atualizado: 2026-11-19
---
# Fotos de veículo (Marketplace e carrossel)

## O que entra
- **Somente o veículo**: sem pessoa e sem loja, fachada, letreiro ou cartaz em evidência (13/11, 19h52).
- Todas as fotos da **mesma unidade**, do anúncio real registrado na `fonte.txt`.
- De **6 a 10 fotos** boas por bem (padrão das levas de 18–19/11; antes a meta era 8).
- **Foto 01 = capa externa** (frente ou traseira 3/4). Anúncio sem foto externa não vai ao ar.
- Nunca usar foto de anúncio da praça proibida ([[Perfil-do-operador]]; 18/11, 22h40).

## Placa
- **Tarja preta sólida só do tamanho da placa**, centralizada, acompanhando a inclinação da placa (13/11 13h30; 14/11 11h30).
- Método: polígono nos 4 cantos da placa, com margem de 1 a 3 px. Sem desfoque, sem filtro, sem cortar, sem redimensionar, sem IA. JPEG qualidade 95, mesma resolução. Foto sem placa visível sai como cópia idêntica.
- Ferramenta: `07-Ferramentas/scripts/edicao/render_v1.py` (tarjas a partir de um arquivo de coordenadas).

## O que remove ou descarta
| Achou | Faz |
|---|---|
| Rosto identificável | descarta a foto (`_descartadas/`) |
| Pessoa em destaque | descarta a foto |
| Fachada ou letreiro grande de loja | descarta a foto |
| Telefone, WhatsApp, QR, site ou nome de loja pequeno | tarja pequena só no texto |
| Bandeira ou cartaz político | cobre com tarja (14/11, 19h46: "Tira isso que pode recusar") |
| Letreiro pintado no veículo (ex.: nome de empresa no baú) | cobre com tarja ou troca a foto |
| Cartaz de banco ao fundo | pode ficar (14/11, 18h01) |
| Marca d'água | sem regra do gestor; na dúvida, troca a foto |

## Versões e conferência
- Pasta do bem: `fotos-originais/` (não mexer), `fotos-v1/` (tratadas, na ordem de postagem), `_descartadas/`. Nova versão = nova pasta (`fotos-v2/`), nunca sobrescrever.
- `mudancas.md` na pasta do bem: o que foi tarjado ou descartado em cada foto.
- Folha de contato da leva (`CONTACT-SHEET-leva-NN.jpg`) para o aprovador.
- Trocou foto depois do OK: md5 novo e **OK novo** ([[Aprovacao e registro]]).
- Conferir com `07-Ferramentas/scripts/edicao/validate.py` (6 a 10 fotos, entrada no texto, "PARCELAS DE R$", última linha, palavras proibidas, origem da praça, cálculo e fonte).
