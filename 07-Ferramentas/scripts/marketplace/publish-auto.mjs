import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { connectTab, PAGE_STATE_JS, sleep } from './cdp.mjs';

const ROOT = 'C:\\Users\\Public\\cdp-postador-1811';
const PRINTS = 'C:\\Users\\Public\\prints-marketplace-1811';
const OUT = `${ROOT}\\out`;
mkdirSync(OUT, { recursive: true });
mkdirSync(PRINTS, { recursive: true });

const PROFILES = {
  1:  { n: 1,  bit: '1-face samuel junior',       conta: 'Yasmin Nátally',       port: 56934, tab: '4ECFE63E6847803AEF48A025A3F56BA8' },
  2:  { n: 2,  bit: '2-face pedro brito',         conta: 'Pedro Brito',          port: 56930, tab: '3BCC6B1FEBBD92D17DB95AB8ADAD5F7F' },
  3:  { n: 3,  bit: '3-face joao tanan',          conta: 'Joao Tanan',           port: 56852, tab: '1F699FF09921EEB1E9D0569BC16BE09A' },
  4:  { n: 4,  bit: '4-Dani',                     conta: 'Daniel Santos',        port: 56839, tab: 'FEF8C602AFD928070460530840B92E1E' },
  6:  { n: 6,  bit: '6-face italo',               conta: 'Ítalo Ezequiel',       port: 56784, tab: '6D848E0052F4AD3670CE909296E4DA35' },
  7:  { n: 7,  bit: '7-face joao brito tanan',    conta: 'Joao Brito Tanan',     port: 56782, tab: '267D03697B45145EF6B054000DFC6EB5' },
  9:  { n: 9,  bit: '9-CONTA VIRADINHA CAMINHAO', conta: 'Pedro Silva Teixeira', port: 62275, tab: '85324F95CDC9D2027820552EEAD663FC' },
  10: { n: 10, bit: '10-face leo',                conta: 'Leomarcos S. Porto',   port: 62218, tab: '71C747DE464F833FD368501BCC7F34CF' },
};

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return def;
}
function log(o) { console.log(typeof o === 'string' ? o : JSON.stringify(o)); }
const norm = s => String(s||'').replace(/\s+/g,' ').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

const perfilN = Number(arg('perfil'));
const slug = arg('slug');
const groupsWant = arg('groups') ? arg('groups').split('||').map(s => s.trim()).filter(Boolean) : null;
if (!PROFILES[perfilN] || !slug) {
  console.error('usage: node publish-auto.mjs --perfil N --slug SLUG [--groups "a||b||..."]');
  process.exit(2);
}
const profile = PROFILES[perfilN];
const itemDir = `${ROOT}\\pacote\\${slug}`;
const photoDir = `${itemDir}\\fotos`;
const titulo = readFileSync(`${itemDir}\\titulo.txt`,'utf8').replace(/^\uFEFF/,'').replace(/[\r\n]+$/,'');
const preco = readFileSync(`${itemDir}\\preco.txt`,'utf8').replace(/^\uFEFF/,'').trim();
const descricao = readFileSync(`${itemDir}\\descricao.txt`,'utf8').replace(/^\uFEFF/,'').replace(/\r\n/g,'\n').replace(/\n+$/,'');
const photos = readdirSync(photoDir).filter(f => /\.jpg$/i.test(f)).sort().map(f => `${photoDir}\\${f}`);
const prefix = `p${perfilN}-${slug}`;
const result = { perfil: perfilN, conta: profile.conta, slug, titulo, preco, fotos: photos.length };

async function abortIfDanger(c, when) {
  const st = await c.evaluate(PAGE_STATE_JS);
  writeFileSync(`${OUT}\\${prefix}-${when}.json`, JSON.stringify(st,null,2));
  if (st.flags?.length) {
    const shot = `${PRINTS}\\${prefix}-STOP-${when}.jpg`;
    await c.screenshot(shot);
    throw new Error(`STOP:${when}:${st.flags.join(',')}`);
  }
  return st;
}
async function dismissNotif(c) {
  for (let i=0;i<4;i++) {
    await c.send('Input.dispatchKeyEvent', { type:'keyDown', key:'Escape', code:'Escape', windowsVirtualKeyCode:27, nativeVirtualKeyCode:27 });
    await c.send('Input.dispatchKeyEvent', { type:'keyUp', key:'Escape', code:'Escape', windowsVirtualKeyCode:27, nativeVirtualKeyCode:27 });
    await sleep(250);
  }
}
async function clickExact(c, label) {
  const wantN = norm(label);
  return c.evaluate(`(() => {
    const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
    const nrm = s => clean(s).normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
    const wantN = ${JSON.stringify(wantN)};
    const buttons = [...document.querySelectorAll('button,[role=button],a[role=button]')];
    const el = buttons.find(e => nrm(e.innerText)===wantN || nrm(e.getAttribute('aria-label')||'')===wantN);
    if (!el) throw new Error(${JSON.stringify(label)}+' not found');
    if (el.disabled || el.getAttribute('aria-disabled')==='true') throw new Error(${JSON.stringify(label)}+' disabled');
    el.scrollIntoView({block:'center'});
    el.click();
    return clean(el.innerText||el.getAttribute('aria-label'));
  })()`);
}

let c;
try {
  c = await connectTab(profile.port, profile.tab);
  await c.send('Page.enable');
  await c.send('Runtime.enable');
  await c.send('DOM.enable');
  await abortIfDanger(c, 'start');

  await c.navigate('https://www.facebook.com/marketplace/create/item', 9000);
  await dismissNotif(c);
  await abortIfDanger(c, 'open');
  await c.screenshot(`${PRINTS}\\${prefix}-01-open.jpg`);
  const openState = await c.evaluate(`(() => {
    const files = document.querySelectorAll('input[type=file]').length;
    const hasItem = /Item para venda/i.test(document.body.innerText||'') && files===0;
    return { href: location.href, files, hasItem };
  })()`);
  log({ phase:'open', ...openState });
  if (openState.hasItem) {
    await c.evaluate(`(() => { const a=[...document.querySelectorAll('div[role=button],[role=button],a')].find(e=>/Item para venda/i.test(e.innerText||'')); if(!a) throw new Error('Item para venda missing'); a.click(); })()`);
    await sleep(5000);
    await dismissNotif(c);
  }

  // photos
  const ev = await c.send('Runtime.evaluate', { expression: `document.querySelector('input[type=file][accept*="image"], input[type=file]')`, returnByValue:false });
  const objectId = ev.result?.objectId;
  if (!objectId) throw new Error('file input not found');
  await c.send('DOM.setFileInputFiles', { objectId, files: photos }, 90000);
  await sleep(7000);
  const photoStatus = await c.evaluate(`(() => { const t=document.body.innerText||''; const m=t.match(/Fotos[\\s\\S]{0,80}/); return { status:m?m[0]:'', nExpect:${photos.length} }; })()`);
  log({ phase:'photos', ...photoStatus });
  await c.screenshot(`${PRINTS}\\${prefix}-02-photos.jpg`);
  await abortIfDanger(c, 'photos');

  // title + price
  await c.evaluate(`window.__listingData = ${JSON.stringify({ titulo, preco, descricao })}; 'ok'`);
  const fill = await c.evaluate(readFileSync(`${ROOT}\\fill-text.js`,'utf8'));
  log({ fill });
  await sleep(600);

  // category Diversos — use the category dialog, never the notifications dialog
  await c.evaluate(`(() => {
    const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
    const lab = [...document.querySelectorAll('label')].find(l => /^Categoria\\b/.test(clean(l.innerText)));
    if (!lab) throw new Error('Categoria label missing');
    (lab.querySelector('[role=combobox],input,[aria-haspopup]')||lab).click();
  })()`);
  await sleep(1800);
  const cat = await c.evaluate(`(() => {
    const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
    const dialogs = [...document.querySelectorAll('[role=dialog],[role=listbox]')];
    const catDialog = dialogs.find(d => /\\bDiversos\\b/.test(d.innerText||'') && /Classificados|Ferramentas|Móveis/i.test(d.innerText||''));
    if (!catDialog) throw new Error('category dialog missing');
    const exact = [...catDialog.querySelectorAll('*')].filter(el => clean(el.innerText)==='Diversos');
    exact.sort((a,b)=>(a.getBoundingClientRect().width*a.getBoundingClientRect().height)-(b.getBoundingClientRect().width*b.getBoundingClientRect().height));
    if (!exact.length) throw new Error('Diversos missing');
    exact[0].scrollIntoView({block:'center'}); exact[0].click();
    return 'Diversos';
  })()`);
  log({ cat });
  await sleep(1000);

  // condition Novo
  await c.evaluate(`(() => {
    const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
    const lab = [...document.querySelectorAll('label')].find(l => /^Condi/.test(clean(l.innerText)));
    if (!lab) throw new Error('Condicao label missing');
    lab.click();
  })()`);
  await sleep(1500);
  const cond = await c.evaluate(`(() => {
    const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
    const root = [...document.querySelectorAll('[role=dialog],[role=listbox]')].find(d => /\\bNovo\\b/.test(d.innerText||'') && /Usado|Recondicionado/i.test(d.innerText||'')) || document.body;
    const exact = [...root.querySelectorAll('[role=option], *')].filter(el => clean(el.innerText)==='Novo');
    exact.sort((a,b)=>(a.getBoundingClientRect().width*a.getBoundingClientRect().height)-(b.getBoundingClientRect().width*b.getBoundingClientRect().height));
    if (!exact.length) throw new Error('Novo missing');
    exact[0].click();
    return 'Novo';
  })()`);
  log({ cond });
  await sleep(800);
  await dismissNotif(c);

  // expand Mais detalhes if needed
  const more = await c.evaluate(`(() => {
    const labels = [...document.querySelectorAll('label')].map(l => (l.innerText||'').trim());
    const has = labels.some(t => /^Descri/i.test(t)) && (labels.some(t => /Localiza/i.test(t)) || document.querySelector('input[aria-label*="Localiza" i]'));
    if (has) return 'already-open';
    const m=[...document.querySelectorAll('[role=button],button')].find(e=>/Mais detalhes/i.test(e.innerText||''));
    if (!m) return 'no-button';
    m.click(); return 'clicked';
  })()`);
  log({ more });
  await sleep(1200);

  // description
  const desc = await c.evaluate(`(() => {
    const data = window.__listingData;
    const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
    const lab = [...document.querySelectorAll('label')].find(l => /^Descri/i.test(clean(l.innerText)));
    if (!lab) throw new Error('desc label missing');
    const el = lab.querySelector('textarea,input') || lab.parentElement.querySelector('textarea');
    if (!el) throw new Error('desc field missing');
    el.scrollIntoView({block:'center'}); el.focus();
    const proto = el.tagName==='TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto,'value').set;
    setter.call(el,''); el.dispatchEvent(new Event('input',{bubbles:true}));
    setter.call(el, data.descricao);
    el.dispatchEvent(new InputEvent('input',{bubbles:true,cancelable:true,inputType:'insertText',data:data.descricao}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
    if (el.value !== data.descricao) throw new Error('desc mismatch '+el.value.length+' vs '+data.descricao.length);
    return { ok:true, len: el.value.length };
  })()`);
  log({ desc });

  // Promover off
  const promo = await c.evaluate(`(() => {
    const el = document.querySelector('input[aria-label="Promover classificado após publicar"]') || [...document.querySelectorAll('input[type=checkbox],[role=switch]')].find(e=>/promov|impuls/i.test(e.getAttribute('aria-label')||''));
    if (!el) return { missing:true };
    const before = { checked: !!el.checked, aria: el.getAttribute('aria-checked') };
    if (el.checked || el.getAttribute('aria-checked')==='true') el.click();
    return { before, after: { checked: !!el.checked, aria: el.getAttribute('aria-checked') } };
  })()`);
  log({ promo });

  // location — pick Cidade suggestion
  const locInfo = await c.evaluate(`(() => {
    const i = document.querySelector('input[aria-label*="Localiza" i]');
    if (!i) throw new Error('location input missing');
    i.scrollIntoView({block:'center'}); i.focus(); i.click();
    if (typeof i.select==='function') i.select();
    return i.value;
  })()`);
  log({ locVal: locInfo });
  await sleep(200);
  await c.send('Input.dispatchKeyEvent', { type:'keyDown', modifiers:2, key:'a', code:'KeyA', windowsVirtualKeyCode:65, nativeVirtualKeyCode:65 });
  await c.send('Input.dispatchKeyEvent', { type:'keyUp', modifiers:2, key:'a', code:'KeyA', windowsVirtualKeyCode:65, nativeVirtualKeyCode:65 });
  await sleep(80);
  await c.send('Input.dispatchKeyEvent', { type:'keyDown', key:'Backspace', code:'Backspace', windowsVirtualKeyCode:8, nativeVirtualKeyCode:8 });
  await c.send('Input.dispatchKeyEvent', { type:'keyUp', key:'Backspace', code:'Backspace', windowsVirtualKeyCode:8, nativeVirtualKeyCode:8 });
  await sleep(80);
  await c.send('Input.insertText', { text: 'Vitória da Conquista' });
  await sleep(2500);
  await c.screenshot(`${PRINTS}\\${prefix}-02b-loc.jpg`);
  const locPick = await c.evaluate(`(() => {
    const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
    const nodes = [...document.querySelectorAll('[role=option], li, [role=listbox] *')];
    const exact = nodes.filter(el => /^Vit[oó]ria da Conquista\\s+Cidade$/i.test(clean(el.innerText)));
    exact.sort((a,b)=>(a.getBoundingClientRect().width*a.getBoundingClientRect().height)-(b.getBoundingClientRect().width*b.getBoundingClientRect().height));
    if (!exact.length) {
      const sample = [...document.querySelectorAll('[role=option]')].map(el=>clean(el.innerText)).slice(0,15);
      throw new Error('Cidade option missing: '+sample.join(' || '));
    }
    exact[0].click();
    return clean(exact[0].innerText);
  })()`);
  log({ locPick });
  await sleep(800);
  await c.screenshot(`${PRINTS}\\${prefix}-03-before-avancar.jpg`);
  const preview = await c.evaluate(`(() => {
    const t = document.body.innerText||'';
    const loc = (document.querySelector('input[aria-label*="Localiza" i]')||{}).value;
    const seller = (t.match(/Informações do vendedor[\\s\\S]{0,80}/)||[''])[0];
    const promo = document.querySelector('input[aria-label="Promover classificado após publicar"]');
    return { loc, seller, promoChecked: promo?!!promo.checked:null, titleOk: t.includes(${JSON.stringify(titulo.split(' ').slice(0,3).join(' '))}) };
  })()`);
  log({ preview });
  if (!/conquista/i.test(preview.loc||'')) throw new Error('bad location '+preview.loc);
  if (preview.promoChecked) throw new Error('Promover still on');
  await abortIfDanger(c, 'fill');

  await clickExact(c, 'Avançar');
  await sleep(7000);
  await abortIfDanger(c, 'audience');
  await c.screenshot(`${PRINTS}\\${prefix}-04-audience.jpg`);

  // groups: prefer provided list; else score public general buy/sell, skip off-topic, take 5-7
  const groupsRes = await c.evaluate(`(() => {
    const want = ${JSON.stringify(groupsWant)};
    const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
    const nrm = s => clean(s).normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
    const boxes = [...document.querySelectorAll('[role=checkbox]')];
    const skip = /bitcoin|dolar|euro|peso|disk comida|iphone|game|imoveis|imóveis|brech[oó] (para )?fam|brech[oó] desapega meninas|som automotivo|bicicletas|pneus|provença/;
    const picked=[];
    if (want && want.length) {
      for (const w of want) {
        const nw = nrm(w);
        const el = boxes.find(b => nrm(b.innerText||'').includes(nw) || nrm(b.innerText||'').startsWith(nw));
        if (!el) continue;
        if (el.getAttribute('aria-checked')!=='true') el.click();
        picked.push(clean((el.innerText||'').split('\\n')[0]));
      }
    } else {
      const scored = boxes.map(el => {
        const t = clean(el.innerText);
        const n = nrm(t);
        let s = 0;
        if (/compra|venda|classificados|desapega|mercado|feira|anuncios|anúncios/.test(n)) s += 3;
        if (/\\(ba\\)| bahia| conquista/.test(n)) s += 2;
        if (skip.test(n)) s -= 10;
        if (/privado/.test(n)) s -= 1;
        return { el, t, s };
      }).filter(x => x.s > 0).sort((a,b)=>b.s-a.s);
      for (const x of scored) {
        if (picked.length>=7) break;
        if (x.el.getAttribute('aria-checked')!=='true') x.el.click();
        picked.push(x.t.split('\\n')[0].slice(0,120));
      }
    }
    return { picked, totalBoxes: boxes.length };
  })()`);
  log({ groupsClick: groupsRes });
  await sleep(800);
  const checked = await c.evaluate(`(() => {
    const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
    return [...document.querySelectorAll('[role=checkbox]')].filter(b => b.getAttribute('aria-checked')==='true').map(b => clean(b.innerText).slice(0,160));
  })()`);
  log({ checkedN: checked.length, checked });
  result.grupos = checked;
  if (checked.length === 0 && groupsRes.totalBoxes > 0) throw new Error('no groups checked although boxes exist');
  if (checked.length > 7) throw new Error('more than 7 groups checked');
  // 1-7 ok; 0 only if account has no groups
  await c.screenshot(`${PRINTS}\\${prefix}-05-grupos.jpg`);

  const post = await clickExact(c, 'Postar');
  log({ postar: post });
  result.horaTentativa = new Date().toISOString();
  await sleep(8000);
  await abortIfDanger(c, 'depois');
  await c.screenshot(`${PRINTS}\\${prefix}-06-depois.jpg`);

  await c.navigate('https://www.facebook.com/marketplace/you/selling', 10000);
  await abortIfDanger(c, 'lista');
  await c.screenshot(`${PRINTS}\\${prefix}-07-lista.jpg`);
  const lista = await c.evaluate(`(() => {
    const t = document.body.innerText||'';
    const want = ${JSON.stringify(titulo)};
    const promo = [...document.querySelectorAll('a,[role=button]')].filter(el => /promover agora/i.test((el.getAttribute('aria-label')||el.innerText||'')));
    const items = promo.map(el => {
      const href = el.href || el.closest('a')?.href || '';
      const m = href.match(/target_id=(\\d+)/);
      return { id: m&&m[1], href, aria: (el.getAttribute('aria-label')||'').slice(0,160) };
    });
    const match = items.find(it => (it.aria||'').toLowerCase().includes(want.slice(0,18).toLowerCase())) || items[0];
    const idx = t.indexOf(want.slice(0,20));
    return {
      match, ids: items.slice(0,8),
      analisado: /sendo analisado/i.test(t),
      slice: idx>=0 ? t.slice(Math.max(0,idx-80), idx+350) : t.slice(0,800)
    };
  })()`);
  writeFileSync(`${OUT}\\${prefix}-07-lista.json`, JSON.stringify(lista,null,2));
  result.lista = lista;
  result.link = lista.match?.id ? `https://www.facebook.com/marketplace/item/${lista.match.id}` : null;
  result.analisado = lista.analisado;
  log({ phase:'done', link: result.link, analisado: result.analisado, grupos: (result.grupos||[]).length });
  writeFileSync(`${OUT}\\${prefix}-result.json`, JSON.stringify(result,null,2));
} catch (e) {
  result.error = String(e && e.stack || e);
  try { if (c) await c.screenshot(`${PRINTS}\\${prefix}-ERROR.jpg`); } catch {}
  writeFileSync(`${OUT}\\${prefix}-result.json`, JSON.stringify(result,null,2));
  console.error('FAIL', result.error);
  process.exit(1);
} finally {
  if (c) c.close();
}
