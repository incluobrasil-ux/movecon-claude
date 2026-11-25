---
tipo: treinamento
atualizado: 2026-11-20
---
# Parte 2: Marketplace orgânico em volume

## A ideia
O Marketplace do Facebook é o maior classificado do Brasil e é **de graça**. **Aqui não tem nicho:** todo vendedor anuncia qualquer veículo da faixa do padrão, em todas as contas dele (decisão de 20/11/2026). Quem procura carro parcelado está lá todo dia. Cada conta publica na sua cidade, vários anúncios por dia, e cada anúncio vai para até 20 grupos de classificados da região. O Claude faz o trabalho braçal (minerar, tratar fotos, escrever, publicar, conferir, contar); o vendedor aprova e atende.

## O anúncio vende o veículo, não o consórcio
A Meta proíbe vender serviço financeiro no Marketplace. Por isso:
- **Preço do anúncio = a entrada.** Descrição com entrada, parcelas, praça e convite para mensagem.
- Última linha sempre: **"Parcelamento. Imagem ilustrativa."**
- **Nunca:** carta de crédito, consórcio, cota, contemplação, "sem entrada", "nome sujo", "aprovado", número de parcelas ("150x"), MOVECON, nome de pessoa, WhatsApp ou QR de loja.
- Categoria Itens > Diversos, condição Novo, Promover sempre desligado.

Padrão completo, com títulos e descrições aprovados: [[Anuncio Marketplace]].

## A esteira do Marketplace
| # | Etapa | O Claude faz | Ferramenta |
|---|---|---|---|
| 1 | **Minerar bens** | acha unidades reais à venda, de R$ 50 a 200 mil (caminhão R$ 70 a 300 mil), baixa de 6 a 10 fotos da mesma unidade, descarta foto da própria praça, com rosto ou logo de loja | `miner.py` (Mobiauto) |
| 2 | **Tratar fotos** | tarja preta na placa, capa externa, folha de contato | `render_v1.py` · [[Fotos de veiculo]] |
| 3 | **Calcular valores** | entrada e parcela pela tabela | `calc_valores.py` |
| 4 | **Escrever** | título diferente em cada anúncio, descrição no padrão | [[Anuncio Marketplace]] |
| 5 | **Lista de aprovação** | leva numerada com foto, título, entrada, parcela | [[Lista de aprovacao]] |
| 6 | **Vendedor aprova** | "Aprovo todos menos o 3" | — |
| 7 | **Publicar** | abre a conta no BitBrowser, preenche, confere a prévia, marca até 20 grupos, publica | `publish-auto.mjs` / `bitbrowser.py` |
| 8 | **Conferir no ar** | 12 a 15 min depois abre o link público e confere | skill `conferir-no-ar` |
| 9 | **Registrar** | linha no registro: bem, conta, hora, link, grupos | [[Registro de publicacao]] |
| 10 | **Medir** | lê os cliques de cada anúncio | `contagem-conta.mjs` · [[Relatorio diario]] |

## Como a automação funciona por dentro (para explicar sem tela técnica)
1. Cada conta do Facebook mora num **perfil do BitBrowser**: um navegador separado, com impressão digital própria. Para o Facebook, cada conta é um computador diferente.
2. O vendedor abre os perfis e deixa logados. **O Claude nunca digita senha, código ou captcha.**
3. O Claude se conecta à aba aberta (pelo canal de depuração do navegador, o CDP) e faz o que uma pessoa faria: clicar, preencher, subir foto, conferir, tirar print.
4. Ele trabalha **uma conta por vez**, com pausas de 1 a 3 s entre ações, e grava tudo em registro.
5. Antes de cada rodada, confere se a mesma foto já está no ar (pelo md5) e se a conta já publicou na última hora.

## Ritmo e segurança das contas
| Situação | Ritmo |
|---|---|
| Conta nova, 1ª semana | 1 anúncio por dia |
| 2ª semana | 2 por dia |
| Depois | 3 por dia, até o gestor liberar mais |
| Contas do gestor (desde 18/11) | 1 por hora por conta |
| Entrar em grupos | até 5 pedidos por hora e 30 por dia por conta, só da região |

**Regras que não se negociam:**
- Uma conta = um perfil do BitBrowser. Nunca no Chrome comum.
- **Uma cidade por conta, para sempre.** Conta nova recebe uma praça que ainda não tem conta.
- Mesmo modelo pode repetir; **a mesma foto não.** Nenhuma unidade repetida no mesmo dia.
- Grupos: só de veículos e classificados da região, onde a conta já é membro.
- **Regra de parada:** recusa, remoção, aviso, limite, verificação ou pedido de login → para tudo naquela conta, print, avisa. As outras contas continuam.
- Nunca: Turbinar, Promover, Messenger, responder comprador pelo Claude, trocar cidade.

## O que o vendedor faz
- Abre os perfis do BitBrowser e deixa logados de manhã.
- Aprova a leva por escrito.
- **Atende as mensagens** que chegam (Messenger e WhatsApp) com o [[Playbook do SDR (completo)]]. O anúncio só gera a conversa; quem fecha é o atendimento.
- Lê o relatório do fim do dia.

## Pedidos prontos para o Claude
> Minera 30 [carros de 50 a 200 mil / picapes / caminhões de 70 a 300 mil] para a próxima leva, fora de [minha praça].

> Trata as fotos da leva [05], calcula os valores e escreve os textos. Me manda a lista de aprovação.

> Aprovo todos menos o [3 e o 7]. Publica no ritmo das minhas contas, com até 20 grupos, e confere cada um no ar.

> Entra em grupos de classificados de veículos de [região] nas minhas contas, no limite combinado.

> Faz a contagem de cliques de hoje em todas as contas e me diz quais anúncios repetir.

## Antes de usar no PC do vendedor (técnico)
Os scripts `07-Ferramentas/scripts/marketplace/` vieram do PC dos bots e têm caminhos (`ROOT`, `PRINTS`) e a tabela `PROFILES` (porta e aba de cada perfil) fixos. No primeiro uso em outro PC:
1. `py -3 07-Ferramentas/scripts/bitbrowser.py listar` para ver os perfis e as portas.
2. Pedir ao Claude: *"Ajusta os scripts do Marketplace para este PC e roda o publish-one em modo de conferência, sem publicar."*
3. Só depois publicar o 1º anúncio real, acompanhando na tela.
