import random, re
def brl(v, cents=True):
    s = f"{v:,.2f}" if cents else f"{int(v):,}"
    return s.replace(',', 'X').replace('.', ',').replace('X', '.')

def kind(a):
    m = a['model'].lower(); b = (a.get('body') or '').lower()
    if a['vtype'] == 'TRUCK':
        if any(x in m for x in ['hr','ducato','master','sprinter','daily','boxer','jumper','expert','transit','kombi','bongo','iveco daily','van']) or 'van' in b or 'furg' in b:
            return 'van'
        return 'caminhao'
    if 'van' in b or any(x in m for x in ['ducato','master','sprinter','daily','boxer','jumper','transit','fiorino','kangoo','partner','expert','scudo','doblo','spin']) and 'van' in b:
        return 'van'
    if 'picape' in b or 'pick' in b: return 'picape'
    if 'suv' in b or 'utilit' in b: return 'suv'
    if 'sed' in b: return 'seda'
    if 'van' in b or 'minivan' in b: return 'van'
    return 'hatch'

LABEL = {'caminhao':'CAMINHÃO','van':'VAN / UTILITÁRIO','picape':'PICAPE','suv':'SUV','seda':'SEDÃ','hatch':'VEÍCULO'}
GANCHO = {
 'caminhao':["Caminhão pronto pra rodar e trabalhar.","Pra quem vive de frete e quer o próprio caminhão.","Caminhão pra colocar o serviço em dia.","Ferramenta de trabalho pra estrada e pra cidade.","Hora de ter o seu caminhão rodando."],
 'van':["Utilitário pra entrega, frete ou transporte.","Espaço de sobra pra carga e trabalho.","Van pro seu negócio crescer.","Pra quem trabalha com entrega e precisa de espaço.","Utilitário valente pro dia a dia do trabalho."],
 'picape':["Picape pra trabalho e passeio.","Caçamba pro serviço e conforto pro fim de semana.","Picape forte pra cidade e pra roça.","Pra quem precisa de caçamba no dia a dia.","Picape pronta pra qualquer estrada."],
 'suv':["SUV alto, confortável e econômico.","Espaço pra família e posição de dirigir elevada.","SUV pra cidade e pra viagem.","Conforto de SUV no dia a dia.","Quer um SUV na garagem?"],
 'seda':["Sedã com porta-malas grande pra família.","Conforto pra viajar e pro dia a dia.","Sedã econômico e espaçoso.","Pra quem quer espaço e economia.","Sedã pronto pras viagens em família."],
 'hatch':["Carro econômico pro dia a dia.","Compacto, fácil de estacionar e econômico.","Ideal pra cidade e pra trabalhar.","Primeiro carro ou carro da família?","Econômico e prático pro dia a dia."],
}
PUBLICO = {
 'caminhao':"UM CAMINHÃO PARA O TRABALHO", 'van':"UMA VAN OU UTILITÁRIO PARA O TRABALHO", 'picape':"UMA PICAPE PARA O TRABALHO E O DIA A DIA",
 'suv':"UM SUV NO DIA A DIA", 'seda':"UM SEDÃ PARA A FAMÍLIA", 'hatch':"UM VEÍCULO PARA O DIA A DIA"}
LOCAL = ["Vitória da Conquista e região.","Atendo Vitória da Conquista e região.","📍 Vitória da Conquista e região","Para quem está em Vitória da Conquista e região.","Atendimento em Vitória da Conquista e toda a região."]
CTA = ["Deixe seu contato e saiba mais.","Me chama que eu passo tudo pra você.","Chama no chat que eu te respondo.","Manda um oi pra receber as condições.","Deixa seu contato que eu te procuro.","Me chama aqui e tire suas dúvidas."]
ESCOLHE = ["Você escolhe e compra onde quiser no Brasil.","Você escolhe o veículo e compra onde quiser no Brasil.",""]
TIT = [
 "{Mt} {V} {Y} – entrada de R$ {E}", "{MK} {Mt} {Y}: parcelas de R$ {P}", "{Mt} {Y} parcelado 🚗", "{Mt} {Y} – entrada R$ {E}",
 "{M} {Y} PARCELADO", "{Mt} {Y} parcelado", "{Mt} {V} {Y} no parcelamento", "{Mt} {Y} com entrada de R$ {E}",
 "{Mt} {Y} – parcelas de R$ {P}", "{MK} {Mt} {Y} parcelado", "{Mt} {V} {Y} parcelado", "{M} PARCELADO {Y}",
]
def title_case(s):
    return ' '.join(w if (w.isupper() and len(w)<=4) or any(c.isdigit() for c in w) else w.capitalize() for w in s.split())

def build(a, entrada, parcela, seed):
    r = random.Random(seed)
    k = kind(a); E = brl(entrada, False); P = brl(parcela)
    full = f"{a['make'].upper()} {a['model'].upper()} {a['trim'].strip()} {a['year']}"
    full = re.sub(r'\s+',' ',full)
    Mt = title_case(a['model']); MK = title_case(a['make'])
    V = ' '.join(a['trim'].replace('(',' ').replace(')',' ').split()[:2])
    t = r.choice(TIT).format(M=a['model'].upper(), Mt=Mt, MK=MK, V=V, Y=a['year'], E=E, P=P)
    if k in ('caminhao','van'): t = t.replace(' 🚗','')
    t = re.sub(r'\s+',' ',t).strip()
    if len(t) > 95: t = f"{Mt} {a['year']} parcelado"
    style = r.randint(0,2)
    if style == 0:
        lines = [full, LABEL[k], "", f"ENTRADA DE R$ {E}", f"PARCELAS DE R$ {P}", "",
                 f"PARA QUEM ESTÁ EM VITÓRIA DA CONQUISTA E REGIÃO E QUER {PUBLICO[k]}",
                 "VOCÊ ESCOLHE E COMPRA ONDE QUISER NO BRASIL", r.choice(CTA).upper().rstrip('.')]
    elif style == 1:
        lines = [r.choice(GANCHO[k]), full, "", f"Entrada de R$ {E}", f"PARCELAS DE R$ {P}", "",
                 r.choice([x for x in ESCOLHE if x]), r.choice(LOCAL), r.choice(CTA)]
    else:
        lines = [full, r.choice(GANCHO[k]), f"✅ Entrada de R$ {E}", f"✅ PARCELAS DE R$ {P}",
                 r.choice(LOCAL)] + ([r.choice([x for x in ESCOLHE if x])] if r.random()<.6 else []) + [r.choice(CTA)]
    lines = [l for i,l in enumerate(lines) if not (l=="" and i>0 and lines[i-1]=="")]
    lines = [l for l in lines if l is not None]
    d = '\n'.join(lines).rstrip('\n') + "\nParcelamento. Imagem ilustrativa.\n"
    d = re.sub(r'\n\n+\n', '\n\n', d)
    bad = re.compile(r'cons[oó]rcio|carta|contempla|na hora', re.I)
    assert not bad.search(d) and not bad.search(t), (t,d)
    return t, d, k
