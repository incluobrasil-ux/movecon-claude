import { writeFileSync, mkdirSync } from 'fs';
import { connectTab, PAGE_STATE_JS, sleep } from './cdp.mjs';

const PROFILES = {
  1:  [56934, '4ECFE63E6847803AEF48A025A3F56BA8', 'Yasmin Nátally'],
  2:  [56930, '3BCC6B1FEBBD92D17DB95AB8ADAD5F7F', 'Pedro Brito'],
  3:  [56852, '1F699FF09921EEB1E9D0569BC16BE09A', 'Joao Tanan'],
  4:  [56839, 'FEF8C602AFD928070460530840B92E1E', 'Daniel Santos'],
  6:  [56784, '6D848E0052F4AD3670CE909296E4DA35', 'Ítalo Ezequiel'],
  7:  [56782, '267D03697B45145EF6B054000DFC6EB5', 'Joao Brito Tanan'],
  8:  [53688, '63E1C1E5B54CD3E0874F6ADAD7E1C8B8', 'Pedro Ryan Rocha Abreu'],
  9:  [62275, '85324F95CDC9D2027820552EEAD663FC', 'Pedro Silva Teixeira'],
  10: [62218, '71C747DE464F833FD368501BCC7F34CF', 'Leomarcos S. Porto'],
};

const n = Number(process.argv[2]);
if (!PROFILES[n]) { console.error('uso: node contagem-conta.mjs N'); process.exit(2); }
const [port, tabId, contaNome] = PROFILES[n];
const outDir = 'C:\\Users\\Public\\cdp-postador-1811\\out';
mkdirSync(outDir, { recursive: true });

const FLAGS_BLOCK = new Set(['checkpoint', 'confirm_identity', 'codigo', 'login', 'bloqueio', 'restricao']);

const COLLECT_JS = `(() => {
  const clean = s => String(s || '').replace(/\\s+/g, ' ').trim();
  const items = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('[aria-label]')) {
    const aria = clean(el.getAttribute('aria-label') || '');
    if (!aria || seen.has(aria)) continue;
    if (!/R\\$/.test(aria)) continue;
    if (!/(Em estoque|Ativo|Em an[aá]lise|Pendente|Vendido|Inativo|Anunciado)/i.test(aria)) continue;
    if (/n[uú]mero de vezes que as pessoas/i.test(aria)) continue;
    if (/^Selecionar|^Gerenciar|^Criar|^Ignorar|^Barra lateral|^Pesquisar|^Promover|^Turbinar|^Marcar como/i.test(aria)) continue;
    seen.add(aria);
    items.push(aria);
  }
  const ids = [];
  for (const a of document.querySelectorAll('a[href]')) {
    const href = a.href || a.getAttribute('href') || '';
    const t = (href.match(/target_id=(\\d{8,})/) || href.match(/\\/marketplace\\/item\\/(\\d{8,})/) || [])[1];
    if (!t) continue;
    let title = '';
    let node = a;
    for (let i=0;i<10 && node;i++) {
      const al = [...(node.querySelectorAll ? node.querySelectorAll('[aria-label]') : [])]
        .map(e => clean(e.getAttribute('aria-label')||''))
        .find(x => /R\\$/.test(x) && /Anunciado|Em estoque|Ativo/i.test(x));
      if (al) { title = al; break; }
      node = node.parentElement;
    }
    ids.push({ id: t, href, title: title.slice(0,300) });
  }
  const raw = document.body ? document.body.innerText : '';
  const gerenciar = /classificados selecionados/i.test(raw);
  return {
    href: location.href,
    gerenciar,
    cliquesMentions: (raw.match(/cliques? no classificado/gi)||[]).length,
    items,
    ids
  };
})()`;

async function ensureSelling(c) {
  const href = await c.evaluate('location.href');
  if (!String(href).includes('marketplace/you/selling')) {
    await c.navigate('https://www.facebook.com/marketplace/you/selling', 10000);
    await sleep(2500);
  }
}

async function openGerenciar(c) {
  const already = await c.evaluate(`(() => /classificados selecionados/i.test(document.body.innerText||''))()`);
  if (already) return 'already';
  const clicked = await c.evaluate(`(() => {
    const btn = [...document.querySelectorAll('[role="button"], [aria-label]')].find(el =>
      (el.getAttribute('aria-label')||'').trim() === 'Gerenciar classificados'
    );
    if (!btn) return 'not-found';
    btn.click();
    return 'clicked';
  })()`);
  await sleep(2200);
  return clicked;
}

async function scrollStep(c) {
  return await c.evaluate(`(() => {
    const cands = [...document.querySelectorAll('div, section, main, [role="main"], [role="grid"]')];
    let best = null, bestExtra = 0;
    for (const el of cands) {
      const t = el.innerText || '';
      if (!/cliques? no classificado/i.test(t) && !/classificados selecionados/i.test(t)) continue;
      if (/detalhes da conversa|escrever para/i.test(t) && !/classificados selecionados/i.test(t)) continue;
      const extra = el.scrollHeight - el.clientHeight;
      if (extra > bestExtra) { best = el; bestExtra = extra; }
    }
    if (best) best.scrollTop = best.scrollTop + Math.max(best.clientHeight, 700);
    else window.scrollBy(0, 900);
    const arias = [...document.querySelectorAll('[aria-label]')]
      .map(e => e.getAttribute('aria-label')||'')
      .filter(a => /R\\$/.test(a) && /Anunciado|Em estoque|Ativo/i.test(a));
    const last = arias[arias.length-1];
    if (last) {
      const el = [...document.querySelectorAll('[aria-label]')].find(e => e.getAttribute('aria-label')===last);
      if (el) el.scrollIntoView({block:'end', behavior:'instant'});
    }
    return { bestExtra, visible: arias.length };
  })()`);
}

async function scrollTop(c) {
  try {
    await c.evaluate(`(() => {
      const cands = [...document.querySelectorAll('div, section, main')];
      for (const el of cands) {
        if (/classificados selecionados/i.test(el.innerText||'') && el.scrollTop) el.scrollTop = 0;
      }
      window.scrollTo(0,0);
      return 'ok';
    })()`);
  } catch {}
}

const result = {
  conta: n, contaNome, port, tabId,
  started: new Date().toISOString(),
  error: null, flags: [], blocked: false, url: '',
  gerenciar: null, items: [], ids: [], scrollLog: []
};

let c;
try {
  c = await connectTab(port, tabId);
  await c.send('Page.enable');
  await c.send('Runtime.enable');
  await ensureSelling(c);

  const st = await c.evaluate(PAGE_STATE_JS);
  result.flags = st.flags || [];
  result.pageTitle = st.title;
  result.url = st.url;

  const blockFlags = (st.flags || []).filter(f => FLAGS_BLOCK.has(f));
  if (blockFlags.length) {
    result.blocked = true;
    const shot = `${outDir}\\contagem-p${n}-BLOQUEIO.jpg`;
    try { await c.screenshot(shot, 85); result.screenshot = shot; } catch (e) { result.screenshotError = String(e).slice(0,200); }
    result.error = 'bloqueio: ' + blockFlags.join(', ');
  } else {
    result.gerenciar = await openGerenciar(c);
    const acc = new Map();
    const idMap = new Map();
    let stable = 0, lastSize = -1;
    for (let i=0; i<25 && stable<8; i++) {
      const col = await c.evaluate(COLLECT_JS);
      for (const aria of (col.items||[])) acc.set(aria, true);
      for (const id of (col.ids||[])) {
        if (id.id) idMap.set(id.id, id);
      }
      result.url = col.href || result.url;
      result.scrollLog.push({ i, unique: acc.size, visible: (col.items||[]).length, cliquesMentions: col.cliquesMentions, gerenciar: col.gerenciar });
      if (acc.size === lastSize) stable++; else { stable = 0; lastSize = acc.size; }
      if (stable>=8) break;
      const step = await scrollStep(c);
      result.scrollLog[result.scrollLog.length-1].bestExtra = step.bestExtra;
      await sleep(700);
    }
    // one more collect after last scroll
    const col = await c.evaluate(COLLECT_JS);
    for (const aria of (col.items||[])) acc.set(aria, true);
    for (const id of (col.ids||[])) if (id.id) idMap.set(id.id, id);
    result.items = [...acc.keys()];
    result.ids = [...idMap.values()];
    result.gerenciarFinal = col.gerenciar;
    await scrollTop(c);
    const endHref = await c.evaluate('location.href');
    if (!String(endHref).includes('marketplace/you/selling')) {
      await c.navigate('https://www.facebook.com/marketplace/you/selling', 8000);
      await sleep(1500);
    }
  }
} catch (e) {
  result.error = String(e).slice(0, 500);
  if (c) {
    try {
      const shot = `${outDir}\\contagem-p${n}-erro.jpg`;
      await c.screenshot(shot, 85);
      result.screenshot = shot;
    } catch {}
  }
} finally {
  if (c) c.close();
}

result.finished = new Date().toISOString();
const outPath = `${outDir}\\contagem-p${n}.json`;
writeFileSync(outPath, JSON.stringify(result, null, 1), 'utf8');
console.log(JSON.stringify({
  conta: n, contaNome, blocked: result.blocked, flags: result.flags,
  error: result.error, url: result.url, gerenciar: result.gerenciar,
  itemCount: (result.items||[]).length, idCount: (result.ids||[]).length,
  scrollLog: result.scrollLog, outPath
}, null, 2));
