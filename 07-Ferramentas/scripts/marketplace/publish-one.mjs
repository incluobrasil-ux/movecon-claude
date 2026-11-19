import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { connectTab, PAGE_STATE_JS, sleep } from './cdp.mjs';

const ROOT = 'C:\\Users\\Public\\cdp-postador-1811';
const PRINTS = 'C:\\Users\\Public\\prints-marketplace-1811';
const OUT = `${ROOT}\\out`;
mkdirSync(OUT, { recursive: true });
mkdirSync(PRINTS, { recursive: true });

const PROFILES = {
  1:  { n: 1,  bit: '1-face samuel junior',       conta: 'Yasmin Nátally',        port: 56934, tab: '4ECFE63E6847803AEF48A025A3F56BA8' },
  2:  { n: 2,  bit: '2-face pedro brito',         conta: 'Pedro Brito',           port: 56930, tab: '3BCC6B1FEBBD92D17DB95AB8ADAD5F7F' },
  3:  { n: 3,  bit: '3-face joao tanan',          conta: 'Joao Tanan',            port: 56852, tab: '1F699FF09921EEB1E9D0569BC16BE09A' },
  4:  { n: 4,  bit: '4-Dani',                     conta: 'Daniel Santos',         port: 56839, tab: 'FEF8C602AFD928070460530840B92E1E' },
  6:  { n: 6,  bit: '6-face italo',               conta: 'Ítalo Ezequiel',        port: 56784, tab: '6D848E0052F4AD3670CE909296E4DA35' },
  7:  { n: 7,  bit: '7-face joao brito tanan',    conta: 'Joao Brito Tanan',      port: 56782, tab: '267D03697B45145EF6B054000DFC6EB5' },
  9:  { n: 9,  bit: '9-CONTA VIRADINHA CAMINHAO', conta: 'Pedro Silva Teixeira',  port: 62275, tab: '85324F95CDC9D2027820552EEAD663FC' },
  10: { n: 10, bit: '10-face leo',                conta: 'Leomarcos S. Porto',    port: 62218, tab: '71C747DE464F833FD368501BCC7F34CF' },
};

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return def;
}
function readUtf8(p) {
  let t = readFileSync(p, 'utf8');
  if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1);
  return t;
}
function jsFile(name) {
  return readUtf8(`${ROOT}\\${name}`);
}

const perfilN = Number(arg('perfil'));
const slug = arg('slug');
const stopAfter = arg('stopAfter', 'postar'); // precheck|open|photos|fill|avancar|groups|postar
if (!PROFILES[perfilN] || !slug) {
  console.error('usage: node publish-one.mjs --perfil N --slug SLUG [--stopAfter phase]');
  process.exit(2);
}
const profile = PROFILES[perfilN];
const itemDir = `${ROOT}\\pacote\\${slug}`;
const photoDir = `${itemDir}\\fotos`;
const titulo = readUtf8(`${itemDir}\\titulo.txt`).replace(/[\r\n]+$/, '');
const preco = readUtf8(`${itemDir}\\preco.txt`).trim();
const descricao = readUtf8(`${itemDir}\\descricao.txt`).replace(/\r\n/g, '\n').replace(/\n+$/, '\n');
const photos = readdirSync(photoDir).filter(f => /\.jpg$/i.test(f)).sort().map(f => `${photoDir}\\${f}`);
if (!photos.length) throw new Error('no photos in ' + photoDir);
const prefix = `p${perfilN}-${slug}`;

function log(obj) {
  console.log(typeof obj === 'string' ? obj : JSON.stringify(obj));
}

async function abortIfDanger(c, when) {
  const st = await c.evaluate(PAGE_STATE_JS);
  writeFileSync(`${OUT}\\${prefix}-${when}.json`, JSON.stringify(st, null, 2), 'utf8');
  if (st.flags && st.flags.length) {
    const shot = `${PRINTS}\\${prefix}-STOP-${when}.jpg`;
    await c.screenshot(shot);
    const err = new Error(`STOP:${when}:${st.flags.join(',')}`);
    err.stop = { when, flags: st.flags, shot, url: st.url };
    throw err;
  }
  return st;
}

async function clickNamed(c, want) {
  await c.evaluate(`window.__wantClick = ${JSON.stringify(want)}; 'ok'`);
  return c.evaluate(jsFile('click-named.js'));
}

async function fillInsert(c, text) {
  // assume field is already focused
  await c.send('Input.dispatchKeyEvent', { type: 'keyDown', modifiers: 2, key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, nativeVirtualKeyCode: 65 });
  await c.send('Input.dispatchKeyEvent', { type: 'keyUp', modifiers: 2, key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, nativeVirtualKeyCode: 65 });
  await sleep(80);
  await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8, nativeVirtualKeyCode: 8 });
  await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8, nativeVirtualKeyCode: 8 });
  await sleep(80);
  // insert in chunks to be safe with long descriptions
  const chunk = 80;
  for (let i = 0; i < text.length; i += chunk) {
    await c.send('Input.insertText', { text: text.slice(i, i + chunk) });
  }
}

const phases = ['precheck', 'open', 'photos', 'fill', 'avancar', 'groups', 'postar'];
function shouldStop(phase) {
  return phases.indexOf(stopAfter) <= phases.indexOf(phase);
}

let c;
const result = { perfil: perfilN, conta: profile.conta, slug, titulo, preco, fotos: photos.length, phaseDone: null };
try {
  c = await connectTab(profile.port, profile.tab);
  await c.send('Page.enable');
  await c.send('Runtime.enable');
  await c.send('DOM.enable');
  await abortIfDanger(c, 'start');

  // precheck: existing listings text, no navigation yet if already on facebook
  const pre = await c.evaluate(`(() => {
    const t = document.body.innerText || '';
    return {
      href: location.href,
      hasTitle: t.includes(${JSON.stringify(titulo)}),
      sample: t.slice(0, 2500)
    };
  })()`);
  writeFileSync(`${OUT}\\${prefix}-precheck.json`, JSON.stringify(pre, null, 2));
  result.precheckDuplicate = !!pre.hasTitle;
  log({ phase: 'precheck', href: pre.href, duplicate: pre.hasTitle });
  if (pre.hasTitle) throw new Error('POSSIVEL DUPLICADO: titulo ja aparece na pagina atual: ' + titulo);
  result.phaseDone = 'precheck';
  if (shouldStop('precheck')) { log(result); process.exit(0); }

  await c.navigate('https://www.facebook.com/marketplace/create/item', 9000);
  await abortIfDanger(c, 'open');
  await c.screenshot(`${PRINTS}\\${prefix}-01-open.jpg`);
  const openState = await c.evaluate(`(() => {
    const labels = [...document.querySelectorAll('label,input,textarea')].map(e => (e.getAttribute('aria-label')||e.innerText||'').slice(0,60)).filter(Boolean).slice(0,40);
    const files = document.querySelectorAll('input[type=file]').length;
    // if we landed on chooser "Item para venda"
    const hasItem = /Item para venda/i.test(document.body.innerText||'');
    return { href: location.href, files, hasItem, labels, text: (document.body.innerText||'').slice(0,2000) };
  })()`);
  writeFileSync(`${OUT}\\${prefix}-open.json`, JSON.stringify(openState, null, 2));
  log({ phase: 'open', href: openState.href, files: openState.files, hasItem: openState.hasItem });
  if (openState.hasItem && !openState.files) {
    const clicked = await c.evaluate(`(() => {
      const a = [...document.querySelectorAll('div[role=button], [role=button], a')].find(e => /Item para venda/i.test(e.innerText||''));
      if (!a) return 'notfound';
      a.click();
      return 'clicked';
    })()`);
    log({ clickedItem: clicked });
    await sleep(5000);
    await abortIfDanger(c, 'open-item');
    await c.screenshot(`${PRINTS}\\${prefix}-01b-item.jpg`);
  }
  result.phaseDone = 'open';
  if (shouldStop('open')) { log(result); process.exit(0); }

  // photos
  const ev = await c.send('Runtime.evaluate', {
    expression: `document.querySelector('input[type=file][accept*="image"], input[type=file]')`,
    returnByValue: false
  });
  const objectId = ev.result && ev.result.objectId;
  if (!objectId) throw new Error('file input not found');
  await c.send('DOM.setFileInputFiles', { objectId, files: photos }, 90000);
  await sleep(7000);
  const photoStatus = await c.evaluate(`(() => {
    const t = document.body.innerText || '';
    const m = t.match(/Fotos[\\s\\S]{0,80}/);
    const blobs = document.querySelectorAll('img[src^="blob"]').length;
    return { status: m ? m[0] : '', blobs };
  })()`);
  log({ phase: 'photos', ...photoStatus, n: photos.length });
  await c.screenshot(`${PRINTS}\\${prefix}-02-photos.jpg`);
  await abortIfDanger(c, 'photos');
  result.photoStatus = photoStatus;
  result.phaseDone = 'photos';
  if (shouldStop('photos')) { log(result); process.exit(0); }

  // fill title, price, more details, category, condition, description, location
  await c.evaluate(`window.__listingData = ${JSON.stringify({ titulo, preco, descricao })}; 'ok'`);
  const fill = await c.evaluate(jsFile('fill-text.js'));
  log({ fill });
  await sleep(800);
  try {
    log({ catClick: await c.evaluate(jsFile('click-category.js')) });
    await sleep(1500);
    log({ catPick: await c.evaluate(jsFile('pick-diversos.js')) });
    await sleep(800);
  } catch (e) {
    log({ catError: String(e) });
    // retry with jc-style
    await c.evaluate(`(() => { const l=[...document.querySelectorAll('label')].find(e=>/^Categoria/.test((e.innerText||'').trim())); if(l) l.click(); })()`);
    await sleep(1500);
    await c.evaluate(`(() => { const o=[...document.querySelectorAll('[role=button],[role=option]')].find(e=>(e.innerText||'').trim()==='Diversos'); if(!o) throw new Error('Diversos not found'); o.click(); })()`);
    await sleep(800);
  }
  try {
    log({ condClick: await c.evaluate(jsFile('click-condition.js')) });
    await sleep(1500);
    await c.evaluate(`window.__wantOption = 'Novo'; 'ok'`);
    log({ condPick: await c.evaluate(jsFile('pick-option.js')) });
    await sleep(800);
  } catch (e) {
    log({ condError: String(e) });
    await c.evaluate(`(() => { const l=[...document.querySelectorAll('label')].find(e=>/^Condi/.test((e.innerText||'').trim())); if(l) l.click(); })()`);
    await sleep(1500);
    await c.evaluate(`(() => { const o=[...document.querySelectorAll('[role=option]')].find(e=>(e.innerText||'').trim()==='Novo'); if(!o) throw new Error('Novo not found'); o.click(); })()`);
    await sleep(800);
  }
  try {
    const more = await c.evaluate(`(() => {
      const m=[...document.querySelectorAll('[role=button],button')].find(e=>/^Mais detalhes/i.test((e.innerText||'').trim()));
      if (m) { m.click(); return 'clicked'; }
      return 'none';
    })()`);
    log({ more });
    await sleep(1000);
    const desc = await c.evaluate(jsFile('fill-descricao.js'));
    log({ desc });
  } catch (e) {
    log({ descError: String(e) });
    // fallback insertText
    const focused = await c.evaluate(`(() => {
      const lab=[...document.querySelectorAll('label')].find(l=>/descri/i.test(l.innerText||''));
      const el = lab && lab.querySelector('textarea,input,[contenteditable=true]');
      if (!el) throw new Error('desc field missing');
      el.scrollIntoView({block:'center'}); el.focus(); el.click();
      return el.tagName;
    })()`);
    log({ descFocus: focused });
    await fillInsert(c, descricao.replace(/\n+$/, ''));
  }

  // location
  const locFocus = await c.evaluate(`(() => {
    const i = document.querySelector('input[aria-label="Localização"]') || [...document.querySelectorAll('input')].find(e=>/Localiza/.test(e.getAttribute('aria-label')||''));
    if (!i) throw new Error('location input missing');
    i.scrollIntoView({block:'center'});
    i.focus(); i.click();
    if (typeof i.select === 'function') i.select();
    return i.getAttribute('aria-label')+'='+i.value;
  })()`);
  log({ locFocus });
  await sleep(200);
  await fillInsert(c, 'Vitória da Conquista');
  await sleep(2500);
  await c.screenshot(`${PRINTS}\\${prefix}-02b-loc.jpg`);
  try {
    const locPick = await c.evaluate(jsFile('pick-location-cidade.js'));
    log({ locPick });
  } catch (e) {
    log({ locPickError: String(e) });
    const fallback = await c.evaluate(`(() => {
      const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
      const nodes = [...document.querySelectorAll('[role=option], [role=listbox] *, li')];
      const cands = nodes.filter(el => /vit[oó]ria da conquista/i.test(el.innerText||'') && !/minas|, mg/i.test(el.innerText||''));
      if (!cands.length) {
        const sample = [...document.querySelectorAll('[role=option]')].map(el=>clean(el.innerText)).slice(0,15);
        throw new Error('no city option: '+sample.join(' || '));
      }
      // prefer Cidade / Bahia
      cands.sort((a,b) => {
        const sa = /cidade|bahia|, ba/i.test(a.innerText) ? 0 : 1;
        const sb = /cidade|bahia|, ba/i.test(b.innerText) ? 0 : 1;
        if (sa!==sb) return sa-sb;
        return a.innerText.length - b.innerText.length;
      });
      cands[0].click();
      return clean(cands[0].innerText).slice(0,200);
    })()`);
    log({ locFallback: fallback });
  }
  await sleep(800);
  const locNow = await c.evaluate(`(() => {
    const i = document.querySelector('input[aria-label="Localização"]') || [...document.querySelectorAll('input')].find(e=>/Localiza/.test(e.getAttribute('aria-label')||''));
    return i ? i.value : '';
  })()`);
  log({ locNow });
  if (!/conquista/i.test(locNow)) throw new Error('Localizacao nao ficou em Vitoria da Conquista: ' + locNow);

  const values = await c.evaluate(`(() => {
    const tit = ([...document.querySelectorAll('label')].find(l=>/^T[ií]tulo/i.test((l.innerText||'').trim()))||{}).querySelector?.('input,textarea');
    const pr = ([...document.querySelectorAll('label')].find(l=>/^Pre/i.test((l.innerText||'').trim()))||{}).querySelector?.('input,textarea');
    const ds = ([...document.querySelectorAll('label')].find(l=>/^Descri/i.test((l.innerText||'').trim()))||{}).querySelector?.('textarea,input');
    const promo = [...document.querySelectorAll('[role=switch], input[type=checkbox], [aria-checked]')].map(el => ({
      text: (el.getAttribute('aria-label')||el.innerText||'').slice(0,80),
      checked: el.getAttribute('aria-checked') || (el.checked!=null ? String(el.checked) : null)
    })).filter(x=>/promov|impuls|destacar|boost/i.test(x.text));
    return {
      title: tit ? tit.value : null,
      price: pr ? pr.value : null,
      descLen: ds ? (ds.value||'').length : null,
      descStart: ds ? (ds.value||'').slice(0,80) : null,
      promo
    };
  })()`);
  log({ values });
  result.values = values;
  await c.screenshot(`${PRINTS}\\${prefix}-03-before-avancar.jpg`);
  await abortIfDanger(c, 'fill');
  result.phaseDone = 'fill';
  if (shouldStop('fill')) { log(result); process.exit(0); }

  // Avancar — never click Promover
  const av = await clickNamed(c, 'Avançar');
  log({ avancar: av });
  await sleep(6000);
  await abortIfDanger(c, 'audience');
  await c.screenshot(`${PRINTS}\\${prefix}-04-audience.jpg`);
  const audience = await c.evaluate(`(() => {
    const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
    const t = document.body.innerText || '';
    const buttons = [...document.querySelectorAll('button,[role=button], [role=switch], [role=checkbox], input[type=checkbox], label')].map(el => ({
      tag: el.tagName,
      role: el.getAttribute('role'),
      aria: el.getAttribute('aria-label'),
      checked: el.getAttribute('aria-checked') || (el.checked!=null?String(el.checked):null),
      text: clean(el.innerText||'').slice(0,120)
    })).filter(b => (b.text||b.aria) && (b.text||'').length < 200);
    const groups = buttons.filter(b => /grupo|group|anunciar em mais|mais locais/i.test((b.text||'')+' '+(b.aria||'')));
    const promo = buttons.filter(b => /promov|impuls|destacar|boost/i.test((b.text||'')+' '+(b.aria||'')));
    const seller = (t.match(/[Vv]endedor[^\\n]{0,80}/)||[''])[0];
    return { href: location.href, seller, promo, groups: groups.slice(0,30), buttons: buttons.slice(0,80), text: t.slice(0,4500) };
  })()`);
  writeFileSync(`${OUT}\\${prefix}-04-audience.json`, JSON.stringify(audience, null, 2));
  log({ phase: 'audience', seller: audience.seller, promo: audience.promo, groupsN: audience.groups.length, href: audience.href });
  result.audience = { seller: audience.seller, promo: audience.promo, groups: audience.groups };
  result.phaseDone = 'avancar';
  if (shouldStop('avancar')) { log(result); process.exit(0); }

  // groups: click "Anunciar em mais locais" if needed, tick 5-7 already-joined groups
  const groupsRes = await c.evaluate(`(async () => {
    const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
    const clickTxt = (re) => {
      const el = [...document.querySelectorAll('button,[role=button],a,div[role=button], [role=switch]')].find(e => re.test((e.innerText||'')+' '+(e.getAttribute('aria-label')||'')));
      if (!el) return null;
      el.click();
      return clean((el.innerText||el.getAttribute('aria-label')||'')).slice(0,120);
    };
    const opened = clickTxt(/anunciar em mais locais|mais locais|grupos/i);
    await new Promise(r => setTimeout(r, 1500));
    // collect checkboxes / rows that look like groups the account is in
    const rows = [...document.querySelectorAll('[role=checkbox], [role=switch], input[type=checkbox], [aria-checked]')];
    const info = rows.map(el => ({
      text: clean((el.getAttribute('aria-label')||el.innerText||el.parentElement?.innerText||'')).slice(0,160),
      checked: el.getAttribute('aria-checked') || (el.checked!=null?String(el.checked):null),
      disabled: !!(el.disabled || el.getAttribute('aria-disabled')==='true')
    })).filter(x => x.text && !/promov|impuls/i.test(x.text));
    return { opened, info: info.slice(0, 40), text: (document.body.innerText||'').slice(0,4000) };
  })()`, true);
  writeFileSync(`${OUT}\\${prefix}-05-groups-probe.json`, JSON.stringify(groupsRes, null, 2));
  log({ phase: 'groups-probe', opened: groupsRes.opened, n: (groupsRes.info||[]).length });
  result.groupsProbe = groupsRes;
  await c.screenshot(`${PRINTS}\\${prefix}-05-groups.jpg`);
  result.phaseDone = 'groups';
  if (shouldStop('groups')) { log(result); process.exit(0); }

  // postar is only run when stopAfter=postar AND groups already handled by operator or later logic
  // Safety: do not click Postar unless --confirmPost=yes
  const confirmPost = arg('confirmPost', 'no');
  if (confirmPost !== 'yes') {
    log({ phase: 'hold-before-postar', reason: 'confirmPost!=yes', hint: 're-run with --stopAfter postar --confirmPost yes after groups are selected' });
    result.phaseDone = 'groups';
    writeFileSync(`${OUT}\\${prefix}-result.json`, JSON.stringify(result, null, 2));
    process.exit(0);
  }

  // Ensure Promover is off
  const promoOff = await c.evaluate(`(() => {
    const els = [...document.querySelectorAll('[role=switch], [role=checkbox], input[type=checkbox]')].filter(el => /promov|impuls|destacar|boost/i.test((el.getAttribute('aria-label')||el.innerText||'')+' '+(el.parentElement?.innerText||'')));
    const done = [];
    for (const el of els) {
      const ch = el.getAttribute('aria-checked') || (el.checked!=null?String(el.checked):'');
      if (ch === 'true' || ch === 'mixed') { el.click(); done.push('turned-off:'+(el.getAttribute('aria-label')||'').slice(0,60)); }
      else done.push('already-off');
    }
    return done;
  })()`);
  log({ promoOff });
  await sleep(500);

  const post = await clickNamed(c, 'Postar');
  log({ postar: post });
  await sleep(6000);
  await abortIfDanger(c, 'depois-postar');
  await c.screenshot(`${PRINTS}\\${prefix}-06-depois.jpg`);
  const after = await c.evaluate(`(() => {
    const t = document.body.innerText || '';
    const btns = [...document.querySelectorAll('a,[role=button]')].map(el => ({
      text: (el.innerText||el.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim().slice(0,80),
      href: el.href || el.closest('a')?.href || ''
    }));
    const promo = btns.filter(b => /promover/i.test(b.text) || /promover/i.test(b.href));
    const item = (t.match(/marketplace\\/item\\/(\\d+)/) || []);
    const links = [...document.querySelectorAll('a[href*="/marketplace/item/"]')].map(a => a.href);
    return { href: location.href, promo, links: links.slice(0,8), toast: (t.match(/Classificado publicado[\\s\\S]{0,80}|publicado[\\s\\S]{0,40}/i)||[''])[0], text: t.slice(0,3000) };
  })()`);
  writeFileSync(`${OUT}\\${prefix}-06-depois.json`, JSON.stringify(after, null, 2));
  result.after = after;
  // go to selling list
  await c.navigate('https://www.facebook.com/marketplace/you/selling', 8000);
  await abortIfDanger(c, 'lista');
  await c.screenshot(`${PRINTS}\\${prefix}-07-lista.jpg`);
  const lista = await c.evaluate(`(() => {
    const want = ${JSON.stringify(titulo)}.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
    const links = [...document.querySelectorAll('a[href*="/marketplace/item/"]')].map(a => {
      const m = a.href.match(/marketplace\\/item\\/(\\d+)/);
      return { id: m&&m[1], href: a.href.split('?')[0], text: (a.innerText||a.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim().slice(0,200) };
    });
    const match = links.find(it => it.text.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().includes(want.slice(0,30)));
    const t = document.body.innerText||'';
    return { match, first: links.slice(0,12), analisado: /sendo analisado/i.test(t), textSlice: t.slice(0,2500) };
  })()`);
  writeFileSync(`${OUT}\\${prefix}-07-lista.json`, JSON.stringify(lista, null, 2));
  result.lista = lista;
  result.link = lista.match?.href || (after.links||[])[0] || null;
  result.phaseDone = 'postar';
  log({ phase: 'postar', link: result.link, match: lista.match, analisado: lista.analisado });
  writeFileSync(`${OUT}\\${prefix}-result.json`, JSON.stringify(result, null, 2));
} catch (e) {
  result.error = String(e && e.stack || e);
  if (e.stop) result.stop = e.stop;
  try { if (c) await c.screenshot(`${PRINTS}\\${prefix}-ERROR.jpg`); } catch {}
  writeFileSync(`${OUT}\\${prefix}-result.json`, JSON.stringify(result, null, 2));
  console.error('FAIL', result.error);
  process.exit(1);
} finally {
  if (c) c.close();
}
