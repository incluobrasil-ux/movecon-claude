import os,re,glob,sys
from PIL import Image
bad=re.compile(r'cons[oó]rcio|carta|contempla|na hora',re.I)
lv=sys.argv[1]; tot=0; n=0
for d in sorted([x for x in glob.glob(f'{lv}/*') if os.path.isdir(x)]):
    n+=1
    fs=set(os.listdir(d)); need={'fotos-originais','fonte.txt','calculo.md','preco.txt','titulo.txt','descricao.txt','categoria.txt','localizacao.txt'}
    probs=[]
    if need-fs: probs.append(f'missing {need-fs}'); print(d,probs); continue
    ph=sorted(os.listdir(d+'/fotos-originais'))
    if len(ph)<6 or len(ph)>10: probs.append(f'{len(ph)} fotos')
    if ph!=[f'{i+1:02d}.jpg' for i in range(len(ph))]: probs.append('numeracao')
    for p in ph:
        im=Image.open(f'{d}/fotos-originais/{p}'); sz=os.path.getsize(f'{d}/fotos-originais/{p}'); tot+=sz
        if max(im.size)>1280 or sz>256000: probs.append(f'{p} {im.size} {sz}')
    de=open(d+'/descricao.txt').read(); ti=open(d+'/titulo.txt').read(); pr=open(d+'/preco.txt').read().strip()
    E=f"{int(pr):,}".replace(',','.')
    if f'R$ {E}' not in de: probs.append('entrada ausente')
    if 'PARCELAS DE R$' not in de: probs.append('PARCELAS')
    if de.rstrip('\n').split('\n')[-1]!='Parcelamento. Imagem ilustrativa.': probs.append('ultima linha')
    if bad.search(de) or bad.search(ti): probs.append('proibido')
    if '|' in ti: probs.append('pipe no titulo')
    if 'Vitória da Conquista'.upper() not in de.upper(): probs.append('VdC')
    c=open(d+'/calculo.md').read(); f=open(d+'/fonte.txt').read()
    if 'Campo de preço: '+pr not in c or 'Link de origem: https://www.mobiauto' not in f or 'Valor do bem: R$' not in f or '/x/detalhes' in f: probs.append('calc/fonte')
    if probs: print(d,probs)
print(n,'pastas, MB fotos',round(tot/1e6,1))
