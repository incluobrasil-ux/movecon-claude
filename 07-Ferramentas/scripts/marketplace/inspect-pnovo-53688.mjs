import { writeFileSync, mkdirSync } from 'fs';
import { connectTab, PAGE_STATE_JS, sleep } from './cdp.mjs';

const PORT = 53688;
const TAB = '63E1C1E5B54CD3E0874F6ADAD7E1C8B8';
const PRINTS = 'C:\\Users\\Public\\prints-marketplace-1811';
const OUT = 'C:\\Users\\Public\\cdp-postador-1811\\out';
mkdirSync(PRINTS, { recursive: true });
mkdirSync(OUT, { recursive: true });

const EXTRACT_JS = `(() => {
  const clean = s => String(s || '').replace(/\\s+/g, ' ').trim();
  const raw = (document.body && document.body.innerText) ? document.body.innerText : '';
  const aria = Array.from(document.querySelectorAll('[aria-label]'))
    .map(el => el.getAttribute('aria-label'))
    .filter(Boolean);

  const names = [];
  for (const t of aria) {
    let m = t.match(/^(?:perfil de|profile of|conta de|account of)\\s+(.+)$/i);
    if (m) names.push(clean(m[1]));
    m = t.match(/^(.+?)(?:'s)?\\s+(?:perfil|profile)$/i);
    if (m && !/menu|config|defini|notifica|pesquisa|busca|messenger|chat|in[ií]cio|home|marketplace/i.test(m[1])) {
      names.push(clean(m[1]));
    }
  }
  const imgAlts = Array.from(document.querySelectorAll('image[aria-label], img[aria-label], svg[aria-label], [role="img"][aria-label]'))
    .map(el => clean(el.getAttribute('aria-label') || ''))
    .filter(t => t && !/facebook|logo|imagem|foto de capa|cover/i.test(t));

  const locCands = [];
  const locEls = Array.from(document.querySelectorAll('button, [role="button"], a, [aria-label], span'));
  for (const el of locEls) {
    const t = clean((el.getAttribute('aria-label') || '') + ' ' + (el.innerText || ''));
    if (!t || t.length > 180) continue;
    if (/vit[oó]ria da conquista|conquista,?\\s*ba|localiza[cç][aã]o atual|sua localiza|location/i.test(t)) {
      locCands.push(t);
    }
  }
  const locFromText = (raw.match(/Vit[oó]ria da Conquista[^\\n]{0,40}/i) || [''])[0];
  const locOther = (raw.match(/([A-ZÁÉÍÓÚÂÊÔÃÕ][\\wÀ-ÿ' ]{2,40},\\s*(?:BA|Bahia|SP|RJ|MG|ES|PR|SC|RS|GO|DF|PE|CE|PB|RN|AL|SE|MA|PI|TO|MT|MS|PA|AM|RO|AC|RR|AP))/) || [''])[0];

  const warningBits = [];
  const checks = [
    ['nao_pode_vender', /voc[eê] n[aã]o pode vender/i],
    ['community_standards', /padr[oõ]es da comunidade|community standards/i],
    ['checkpoint', /checkpoint/i],
    ['confirm_identity', /confirma que [eé] voc[eê]|confirme sua identidade|ajuda a confirmar/i],
    ['codigo', /digite o c[oó]digo|enviar c[oó]digo|c[oó]digo de verifica/i],
    ['recusado', /an[uú]ncio recusado|listing (was )?rejected|n[aã]o foi aprovado/i],
    ['login', /entrar no facebook|log in to facebook|inserir senha/i],
    ['bloqueio', /sua conta foi bloqueada|account (is )?disabled|conta desativada/i],
    ['restricao', /restringimos|sua conta est[aá] com restri|limitamos alguns recursos|aviso da conta/i],
    ['limite', /atingiu o limite|voc[eê] atingiu um limite|limit reached|n[aã]o [eé] poss[ií]vel criar mais/i],
    ['verificacao', /verifica[cç][aã]o de identidade|verificar sua conta|identity verification/i]
  ];
  for (const [name, re] of checks) { if (re.test(raw)) warningBits.push(name); }

  const toasts = Array.from(document.querySelectorAll('[role="alert"], [role="status"], div[aria-live]'))
    .map(el => clean(el.innerText || ''))
    .filter(Boolean)
    .slice(0, 10);

  return {
    href: location.href,
    title: document.title,
    names: Array.from(new Set(names)).slice(0, 15),
    imgAlts: Array.from(new Set(imgAlts)).slice(0, 15),
    locCands: Array.from(new Set(locCands)).slice(0, 20),
    locFromText: clean(locFromText),
    locOther: clean(locOther),
    warningBits,
    toasts,
    textHead: clean(raw).slice(0, 2500)
  };
})()`;

const SELLING_JS = `(() => {
  const clean = s => String(s || '').replace(/\\s+/g, ' ').trim();
  const raw = document.body ? document.body.innerText : '';
  const links = Array.from(document.querySelectorAll('a[href*="/marketplace/item/"]'))
    .map(a => ({
      href: a.href,
      text: clean(a.innerText || a.getAttribute('aria-label') || '').slice(0, 180)
    }))
    .filter((v, i, arr) => v.href && arr.findIndex(x => x.href === v.href) === i)
    .slice(0, 40);
  const titles = Array.from(document.querySelectorAll('[role="main"] span, [role="main"] h1, [role="main"] h2, [role="main"] a'))
    .map(el => clean(el.innerText || ''))
    .filter(t => t.length >= 8 && t.length <= 160);
  const empty = /voc[eê] n[aã]o tem classificados|n[aã]o h[aá] classificados|no listings|ainda n[aã]o anunciou|n[aã]o anunciou nada/i.test(raw);
  const seller = (raw.match(/vendedor[:\\s]+([^\\n]{3,80})/i) || raw.match(/selling as[:\\s]+([^\\n]{3,80})/i) || [])[1] || '';
  return {
    href: location.href,
    empty,
    seller: clean(seller),
    links,
    sampleTitles: Array.from(new Set(titles)).slice(0, 30),
    textHead: clean(raw).slice(0, 3000)
  };
})()`;

const GROUPS_JS = `(() => {
  const clean = s => String(s || '').replace(/\\s+/g, ' ').trim();
  const raw = document.body ? document.body.innerText : '';
  const items = [];
  const seen = new Set();
  const anchors = Array.from(document.querySelectorAll('a[href*="/groups/"]'));
  for (const a of anchors) {
    const href = a.href || '';
    if (!/facebook\\.com\\/groups\\/\\d+|facebook\\.com\\/groups\\/[\\w.\\-]+/i.test(href)) continue;
    if (/\\/groups\\/feed|\\/groups\\/joins|\\/groups\\/discover|\\/groups\\/creates|\\/groups\\/\\?/.test(href)) continue;
    const key = href.split('?')[0].replace(/\\/$/, '');
    if (seen.has(key)) continue;
    seen.add(key);
    const text = clean((a.innerText || '') + ' ' + (a.getAttribute('aria-label') || ''));
    const card = a.closest('[role="listitem"], [role="article"], [data-pagelet], div') || a;
    const ctx = clean((card && card.innerText) ? card.innerText : text).slice(0, 240);
    items.push({ href: key, text: text.slice(0, 180), ctx });
  }
  const saleRe = /compra e venda|compra\\s*e\\s*venda|classificados|vende-?se|compravenda|marketplace|desapego|bazar|brech[oó]|carros?|ve[ií]culos?|autos?|caminho|motos?|im[oó]ve/i;
  const sale = items.filter(it => saleRe.test(it.text + ' ' + it.ctx));
  const participateBtns = Array.from(document.querySelectorAll('button, [role="button"]'))
    .map(el => clean((el.innerText || '') + ' ' + (el.getAttribute('aria-label') || '')))
    .filter(t => /participar|join group/i.test(t))
    .slice(0, 5);
  return {
    href: location.href,
    title: document.title,
    totalListed: items.length,
    saleCount: sale.length,
    sale,
    all: items,
    participateBtns,
    textHead: clean(raw).slice(0, 2500)
  };
})()`;

function log(obj) {
  console.log(typeof obj === 'string' ? obj : JSON.stringify(obj));
}

const out = {
  when: new Date().toISOString(),
  whenBRT: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
  bitbrowserName: '8-face camila marques',
  port: PORT,
  tab: TAB,
};

let c;
try {
  c = await connectTab(PORT, TAB);
  await c.send('Page.enable');
  await c.send('Runtime.enable');

  // 1) Marketplace homepage already open
  out.home = {
    state: await c.evaluate(PAGE_STATE_JS),
    extract: await c.evaluate(EXTRACT_JS),
  };
  out.homeShot = `${PRINTS}\\pnovo-checagem.jpg`;
  out.homeShotBytes = await c.screenshot(out.homeShot, 85);
  log({ phase: 'home', url: out.home.state?.url, flags: out.home.state?.flags, names: out.home.extract?.names, loc: out.home.extract?.locCands, shot: out.homeShotBytes });

  // 2) Selling list — read only
  await c.navigate('https://www.facebook.com/marketplace/you/selling', 10000);
  await sleep(3000);
  out.selling = {
    state: await c.evaluate(PAGE_STATE_JS),
    extract: await c.evaluate(EXTRACT_JS),
    list: await c.evaluate(SELLING_JS),
  };
  out.sellingShot = `${PRINTS}\\pnovo-selling.jpg`;
  out.sellingShotBytes = await c.screenshot(out.sellingShot, 85);
  log({ phase: 'selling', url: out.selling.state?.url, flags: out.selling.state?.flags, names: out.selling.extract?.names, ads: out.selling.list?.links?.length, empty: out.selling.list?.empty, shot: out.sellingShotBytes });

  // 3) Groups list — read only, never click Participar
  await c.navigate('https://www.facebook.com/groups/joins/', 10000);
  await sleep(3500);
  // scroll to load more, still on the list page
  for (let i = 0; i < 8; i++) {
    await c.evaluate(`window.scrollTo(0, document.body.scrollHeight)`);
    await sleep(800);
  }
  await c.evaluate(`window.scrollTo(0, 0)`);
  await sleep(500);
  out.groups = {
    state: await c.evaluate(PAGE_STATE_JS),
    list: await c.evaluate(GROUPS_JS),
  };
  out.groupsShot = `${PRINTS}\\pnovo-grupos.jpg`;
  out.groupsShotBytes = await c.screenshot(out.groupsShot, 85);
  log({ phase: 'groups', url: out.groups.state?.url, flags: out.groups.state?.flags, total: out.groups.list?.totalListed, sale: out.groups.list?.saleCount, shot: out.groupsShotBytes });

  // Restore the tab to the Marketplace homepage
  await c.navigate('https://www.facebook.com/marketplace/?ref=bookmark', 8000);
  await sleep(1500);
  out.restored = { url: await c.evaluate('location.href') };
  log({ phase: 'restored', url: out.restored.url });

  const flags = [
    ...(out.home.state?.flags || []),
    ...(out.home.extract?.warningBits || []),
    ...(out.selling.state?.flags || []),
    ...(out.selling.extract?.warningBits || []),
    ...(out.groups.state?.flags || []),
  ];
  out.flagsAll = Array.from(new Set(flags));
  const names = [
    ...(out.home.extract?.names || []),
    ...(out.home.state?.nameCands || []),
    ...(out.selling.extract?.names || []),
    ...(out.selling.list?.seller ? [out.selling.list.seller] : []),
  ];
  out.namesAll = Array.from(new Set(names.filter(Boolean)));
  out.apto = out.flagsAll.length === 0;
} catch (e) {
  out.error = String(e && e.stack || e);
  log({ phase: 'FAIL', error: out.error });
  try {
    if (c) {
      out.errorShot = `${PRINTS}\\pnovo-checagem-erro.jpg`;
      await c.screenshot(out.errorShot, 85);
    }
  } catch {}
} finally {
  if (c) c.close();
}

writeFileSync(`${OUT}\\inspect-pnovo.json`, JSON.stringify(out, null, 2), 'utf8');
const lite = {
  when: out.when,
  whenBRT: out.whenBRT,
  bitbrowserName: out.bitbrowserName,
  port: PORT,
  tab: TAB,
  apto: out.apto,
  flagsAll: out.flagsAll,
  namesAll: out.namesAll,
  home: {
    url: out.home?.state?.url,
    flags: out.home?.state?.flags,
    names: out.home?.extract?.names,
    locCands: out.home?.extract?.locCands,
    locFromText: out.home?.extract?.locFromText,
    locOther: out.home?.extract?.locOther,
    toasts: out.home?.extract?.toasts,
  },
  selling: {
    url: out.selling?.state?.url,
    flags: out.selling?.state?.flags,
    empty: out.selling?.list?.empty,
    seller: out.selling?.list?.seller,
    ads: out.selling?.list?.links,
    names: out.selling?.extract?.names,
  },
  groups: {
    url: out.groups?.state?.url,
    flags: out.groups?.state?.flags,
    totalListed: out.groups?.list?.totalListed,
    saleCount: out.groups?.list?.saleCount,
    sale: out.groups?.list?.sale,
    allNames: (out.groups?.list?.all || []).map(g => g.text || g.href),
  },
  shots: { home: out.homeShot, selling: out.sellingShot, groups: out.groupsShot },
  error: out.error || null,
  restored: out.restored || null,
};
writeFileSync(`${OUT}\\inspect-pnovo-lite.json`, JSON.stringify(lite, null, 2), 'utf8');
log({ phase: 'WROTE', lite });
