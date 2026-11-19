import sys,os,json,re
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from miner import *
import copy as cp
fix = len(sys.argv)>1 and sys.argv[1]=='fix'
s=json.load(open(os.path.join(W,'state.json'))); byf={a['folder']:a for a in s['accepted']}
isrow=lambda l: l.startswith('| ') and not l.startswith('| #') and len(l.split(' | '))>2
def key(name):
    p=name.split('-',1)[0]; return (int(''.join(c for c in p if c.isdigit())), p)
for lv in range(1,8):
    d=os.path.join(ROOT,f'leva-{lv:02d}'); p=os.path.join(d,f'LEVA-{lv:02d}.md'); L=open(p).read().splitlines()
    folders={f for f in os.listdir(d) if re.match(r'^\d{3}[a-z]?-',f) and os.path.isdir(os.path.join(d,f))}
    rows=[l.split(' | ')[1] for l in L if isrow(l)]
    dup=[r for r in set(rows) if rows.count(r)>1]; extra=[r for r in rows if r not in folders]; miss=sorted(folders-set(rows),key=key)
    vdc=[f for f in folders if 'Vitória da Conquista' in open(os.path.join(d,f,'fonte.txt')).read().split('Unidade em')[1][:40]] if folders else []
    print(lv,'folders',len(folders),'rows',len(rows),'dup',dup,'extra',extra,'missing',miss,'VDC',vdc)
    if fix and (extra or miss or dup):
        seen=set(); NL=[]
        for l in L:
            if isrow(l):
                f=l.split(' | ')[1]
                if f not in folders or f in seen: continue
                seen.add(f)
            NL.append(l)
        for f in miss:
            a=byf[f'leva-{lv:02d}/{f}']; t=open(os.path.join(d,f,'titulo.txt')).read().strip()
            r=f"| {a['n'] or a['pre']} | {f} | {t} | R$ {cp.brl(a['price'])} | R$ {cp.brl(a['entrada'],False)} | R$ {cp.brl(a['parcela'])} | {a['nfotos']} |"
            idx=[i for i,l in enumerate(NL) if isrow(l)]; pos=next((i for i in idx if key(NL[i].split(' | ')[1])>key(f)), (idx[-1]+1) if idx else len(NL))
            NL.insert(pos,r)
        t='\n'.join(NL)+'\n'; open(p,'w').write(t); open(os.path.join(ROOT,f'LEVA-{lv:02d}.md'),'w').write(t); print('  fixed')
    elif fix: 
        r=open(os.path.join(ROOT,f'LEVA-{lv:02d}.md')).read()
        if r!=open(p).read(): open(os.path.join(ROOT,f'LEVA-{lv:02d}.md'),'w').write(open(p).read()); print('  root copy synced')
