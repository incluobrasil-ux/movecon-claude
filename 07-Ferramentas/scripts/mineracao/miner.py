import json, os, re, sys, time, random, subprocess, io, shutil, unicodedata, datetime
from PIL import Image
W = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(W)
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
STATE = os.path.join(W, 'state.json')
CAP = 91.7
_last = [0.0]
class Blocked(Exception): pass

def log(*a):
    s = time.strftime('%H:%M:%S ') + ' '.join(str(x) for x in a)
    print(s, flush=True); open(os.path.join(W,'miner.log'),'a').write(s+'\n')

def disk():
    st = os.statvfs('/'); used = (st.f_blocks - st.f_bfree) * st.f_frsize; avail = st.f_bavail * st.f_frsize
    return 100.0 * used / (used + avail)

import fcntl
def pace():
    # shared across processes: one request to mobiauto every 5-10 s
    with open(os.path.join(W,'pace.lock'),'a+') as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        f.seek(0); txt = f.read().strip()
        last = float(txt) if txt else 0.0
        wait = last + random.uniform(5, 10) - time.time()
        if wait > 0: time.sleep(wait)
        f.seek(0); f.truncate(); f.write(str(time.time())); f.flush()
        fcntl.flock(f, fcntl.LOCK_UN)

def get(url, binary=False):
    pace()
    p = subprocess.run(['curl','-s','-L','--max-time','40','-A',UA,'-H','Accept-Language: pt-BR,pt;q=0.9','-w','\n%{http_code}',url], capture_output=True)
    body, _, code = p.stdout.rpartition(b'\n')
    code = code.decode().strip()
    if code in ('403','429','503') : raise Blocked(f'{code} {url}')
    if code != '200': return None
    if binary: return body
    t = body.decode('utf-8','ignore')
    if 'captcha' in t.lower()[:5000] and '__NEXT_DATA__' not in t: raise Blocked('captcha '+url)
    return t

def nextdata(t):
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', t, re.S)
    if not m: raise Blocked('no NEXT_DATA')
    return json.loads(m.group(1))['props']['pageProps']

def load():
    if os.path.exists(STATE): return json.load(open(STATE))
    return {'cands':{}, 'harvested':[], 'rejected':{}, 'pend':[], 'accepted':[], 'plates':[]}
def save(s):
    json.dump(s, open(STATE+'.tmp','w'), ensure_ascii=False, indent=0); os.replace(STATE+'.tmp', STATE)

def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')

def harvest(s, path, pages):
    for pg in pages:
        key = f'{path}/pagina-{pg}'
        if key in s['harvested']: continue
        t = get(f'https://www.mobiauto.com.br/comprar/{path}' + (f'/pagina-{pg}' if pg>1 else ''))
        if not t: log('harvest fail', key); continue
        pp = nextdata(t); res = pp['deals']['results']
        n=0
        for r in res:
            if 'price' not in r or not r.get('price'): continue
            i = str(r['id'])
            if i in s['cands']: continue
            tr = r['trim']
            s['cands'][i] = {'id':i,'vtype':tr.get('vehicleType'),'make':tr['make']['name'],'model':tr['model']['name'],
                'price':r['price'],'km':r.get('km'),'zero':r.get('deal0km'),'nimg':len(r.get('images',[])),
                'body':(tr.get('bodystyle') or {}).get('name',''),'city':r['dealer']['location'].get('city'),'uf':r['dealer']['location'].get('state'),'src':path}
            n+=1
        s['harvested'].append(key); save(s); log('harvest', key, 'new', n, 'total', len(s['cands']))
        if not res: break

import math
EX = json.load(open(os.path.join(W,'existing.json')))
EX_IDS = set(EX['ids']); EX_SUF = set(EX['suffixes']); EX_KP = set(tuple(x) for x in EX['kmprice'])
TAB = json.load(open(os.path.join(W,'tabela4076.json')))['linhas']
BADMODEL = re.compile(r'accelo|maverick|lancha|barco|jet ?ski', re.I)
BADCOMM = re.compile(r'cons[oó]rcio|carta de cr[eé]dito|contempla', re.I)

def mkey(c): return slug(c['make'])+'/'+slug(c['model'])

def prefilter(c):
    if BADMODEL.search(c['model']+' '+c['make']): return 'modelo excluido'
    if c.get('zero'): return '0km'
    p = c['price']
    if c['vtype']=='TRUCK':
        if not (70000 <= p <= 300000): return 'preco fora'
    else:
        if not (50000 <= p <= 200000): return 'preco fora'
    if c['id'] in EX_IDS or c['id'][-6:] in EX_SUF: return 'ja na fila (id)'
    if (c.get('km'), p) in EX_KP: return 'ja na fila (km+preco)'
    return None

def calc(price):
    dbl = 2*price; line = None
    for i,l in enumerate(TAB):
        if l['credito'] >= dbl: line = (i+1, l); break
    teto = False
    if line is None: line = (26, TAB[25]); teto = True
    return {'linha':line[0], 'credito':line[1]['credito'], 'primeira':line[1]['primeira'], 'parcela':line[1]['parcela_tabela'],
            'entrada': int(math.ceil(price*0.2 - 1e-9)), 'dobro': dbl, 'teto': teto}

def fetch_detail(s, c):
    seg = 'caminhoes' if c['vtype']=='TRUCK' else 'carros'
    url = f"https://www.mobiauto.com.br/comprar/{seg}/{c['uf'].lower()}-{slug(c['city'] or '')}/{slug(c['make'])}/{slug(c['model'])}/2020/x/detalhes/{c['id']}"
    t = get(url)
    if not t: return None, 'detalhe indisponivel'
    pp = nextdata(t); d = pp.get('deal')
    if not d: return None, 'sem deal'
    can = re.search(r'<link rel="canonical" href="([^"?]+)', t)
    d['_url'] = can.group(1) if can else url
    return d, None

def save_img(data, dst):
    im = Image.open(io.BytesIO(data)); im = im.convert('RGB')
    im.thumbnail((1280,1280), Image.LANCZOS)
    for q in (82, 76, 70, 64, 58):
        buf = io.BytesIO(); im.save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
        if buf.tell() <= 250*1024: break
    open(dst,'wb').write(buf.getvalue())
    return im.size, buf.tell()

def process(s, c):
    """download a candidate into pend/<id>. returns reason or None"""
    d, err = fetch_detail(s, c)
    if err: return err
    price = d.get('price')
    c2 = dict(c); c2['price']=price; c2['km']=d.get('km'); c2['zero']=d.get('deal0km'); c2['model']=d.get('modelName',c['model'])
    why = prefilter(c2)
    if why: return why
    if re.search(r'f[uú]nebre|funer[aá]ri|ambul[aâ]ncia|rabec[aã]o|uti m[oó]vel|transporte de (corpos|pacientes)|blindad', ' '.join([d.get('trimName') or '', d.get('modelName') or '', d.get('comments') or '']), re.I): return 'carroceria adaptada/uso especial'
    if (d.get('productionYear') or 0) < 2008: return 'ano anterior a 2008'
    import unicodedata as _u
    _c=_u.normalize('NFKD',(d.get('dealerCity') or '')).encode('ascii','ignore').decode().lower()
    if 'vitoria da conquista' in _c: return 'anuncio em Vitoria da Conquista (regra Samuel 22h40)'
    if BADCOMM.search(d.get('comments') or ''): return 'texto do anuncio fala de consorcio/carta'
    bad = [x.strip().upper() for x in open(os.path.join(W,'dealers_bad.txt')).read().splitlines() if x.strip()] if os.path.exists(os.path.join(W,'dealers_bad.txt')) else []
    if any(b in (d.get('dealerName') or '').strip().upper() for b in bad): return 'loja com logotipo grande em todas as fotos (lista)'
    plate = (d.get('plate') or '').upper().replace('-','')
    if plate and plate in s['plates']: return 'placa repetida'
    imgs = sorted(d.get('images') or [], key=lambda x: x.get('position',0))
    if len(imgs) < 6: return f'so {len(imgs)} fotos'
    pd = os.path.join(W,'pend',c['id'],'fotos'); os.makedirs(pd, exist_ok=True)
    got = 0
    for im in imgs[:12]:
        if got >= 10: break
        data = get(f"https://image1.mobiauto.com.br/images/api/images/v1.0/{im['imageId']}/transform/fl_progressive,f_jpg,q_82,w_1280", binary=True)
        if not data or len(data) < 5000: continue
        try: save_img(data, os.path.join(pd, f'{got+1:02d}.jpg')); got += 1
        except Exception as e: log('img err', e)
    import hashlib
    seen = {}
    for fn in sorted(os.listdir(pd)):
        h = hashlib.md5(open(os.path.join(pd,fn),'rb').read()).hexdigest()
        if h in seen or len(seen)==0 and False: pass
        seen.setdefault(h, []).append(fn)
    for h, fns in seen.items():
        if len(fns) > 1:
            for fn in fns: os.remove(os.path.join(pd, fn))   # placeholder / duplicated image
    rest = sorted(os.listdir(pd))
    for k, fn in enumerate(rest): os.rename(os.path.join(pd,fn), os.path.join(pd, f'{k+1:02d}.tmp'))
    for fn in os.listdir(pd): os.rename(os.path.join(pd,fn), os.path.join(pd, fn.replace('.tmp','.jpg')))
    got = len(rest)
    if got < 6:
        shutil.rmtree(os.path.dirname(pd)); return f'so {got} fotos baixadas'
    meta = {'id':c['id'],'vtype':c['vtype'],'make':d.get('makeName'),'model':d.get('modelName'),'trim':(d.get('trimName') or '').strip(),
            'year':d.get('productionYear'),'modelYear':d.get('modelYear'),'price':price,'km':d.get('km'),'body':d.get('bodystyleName',''),
            'city':d.get('dealerCity'),'uf':d.get('dealerState'),'dealer':(d.get('dealerName') or '').strip(),'plate':plate,'url':d['_url'],
            'nfotos':got,'coleta':datetime.datetime.now().strftime('%d/%m/%Y')}
    json.dump(meta, open(os.path.join(W,'pend',c['id'],'meta.json'),'w'), ensure_ascii=False, indent=1)
    if plate: s['plates'].append(plate)
    s['pend'].append(c['id']); save(s)
    return None
