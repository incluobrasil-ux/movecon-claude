import { writeFileSync, mkdirSync } from 'fs';
import { connectTab, PAGE_STATE_JS, sleep } from './cdp.mjs';

const PORT = 53688;
const TAB = '63E1C1E5B54CD3E0874F6ADAD7E1C8B8';
const PRINTS = 'C:\\Users\\Public\\prints-marketplace-1811';
const OUT = 'C:\\Users\\Public\\cdp-postador-1811\\out';
mkdirSync(PRINTS, { recursive: true });
mkdirSync(OUT, { recursive: true });

const NAME_FROM_SOURCE_JS = `(() => {
  const html = document.documentElement ? document.documentElement.innerHTML : '';
  const found = [];
  const push = (src, name, extra) => {
    const n = String(name || '').replace(/\\\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).trim();
    if (!n || n.length < 2 || n.length > 80) return;
    if (/facebook|marketplace|undefined|null|http|script|function/i.test(n)) return;
    found.push({ src, name: n, extra: extra || null });
  };
  const res = [];
  const rx = [
    /"viewer"\\s*:\\s*\\{[\\s\\S]{0,400}?"name"\\s*:\\s*"((?:\\\\.|[^"\\\\]){2,80})"/g,
    /"actor"\\s*:\\s*\\{[\\s\\S]{0,300}?"name"\\s*:\\s*"((?:\\\\.|[^"\\\\]){2,80})"/g,
    /"currentUser"\\s*:\\s*\\{[\\s\\S]{0,300}?"name"\\s*:\\s*"((?:\\\\.|[^"\\\\]){2,80})"/g,
    /"ACCOUNT_ID"\\s*:\\s*"(\\d+)"[\\s\\S]{0,200}?"NAME"\\s*:\\s*"((?:\\\\.|[^"\\\\]){2,80})"/g,
    /"NAME"\\s*:\\s*"((?:\\\\.|[^"\\\\]){2,80})"[\\s\\S]{0,200}?"ACCOUNT_ID"\\s*:\\s*"(\\d+)"/g,
    /"short_name"\\s*:\\s*"((?:\\\\.|[^"\\\\]){2,80})"/g
  ];
  for (const re of rx) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(html)) && found.length < 40) {
      if (m[2] && /^\\d+$/.test(m[1])) push(re.source.slice(0,40), m[2], m[1]);
      else if (m[2] && /^\\d+$/.test(m[2])) push(re.source.slice(0,40), m[1], m[2]);
      else push(re.source.slice(0,40), m[1] || m[2]);
    }
  }
  // unique names by frequency
  const counts = {};
  for (const f of found) counts[f.name] = (counts[f.name] || 0) + 1;
  return { found: found.slice(0, 30), counts };
})()`;

const SELLING_FULL_JS = `(() => {
  const clean = s => String(s || '').replace(/\\s+/g, ' ').trim();
  const raw = document.body ? document.body.innerText : '';
  const cards = [];
  const nodes = Array.from(document.querySelectorAll('[role="main"] a, [role="main"] div'));
  // Parse blocks by "Marcar como vendido" / "Compartilhar" / price+title
  const chunks = raw.split(/Marcar como vendido/).map(clean).filter(Boolean);
  const titles = [];
  const reItem = /((?:VENDO|Vendo|FIAT|Ford|VW|Honda|Toyota|Chevrolet|Jeep|Hyundai|BYD|Renault|CAOA|Iveco|Mercedes|Scania|Perfume|PERFUME)[\\s\\S]{5,140}?)\\s+R\\$\\s*([\\d\\.]+)/g;
  let m;
  while ((m = reItem.exec(raw))) {
    titles.push({ title: clean(m[1]).slice(0, 160), price: m[2] });
  }
  // fallback: lines around "Ativo · Anunciado"
  const lines = raw.split(/\\n/).map(clean).filter(Boolean);
  const listings = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^Ativo/.test(lines[i]) || /^Pendente/.test(lines[i]) || /^Inativo/.test(lines[i]) || /Anunciado em /.test(lines[i])) {
      const title = lines[i-2] || lines[i-1] || '';
      const price = /^R\\$/.test(lines[i-1] || '') ? lines[i-1] : (lines[i-3] && /^R\\$/.test(lines[i-3]) ? lines[i-3] : '');
      const maybeTitle = !/^R\\$/.test(title) && title.length > 3 ? title : (lines[i-2] || '');
      listings.push({
        title: maybeTitle.slice(0, 180),
        price,
        status: lines[i].slice(0, 240)
      });
    }
  }
  const avisoLink = /Avisos/.test(raw);
  const avisosBadge = (raw.match(/Avisos\\s*(\\d+)/) || [])[1] || null;
  const keepUpdated = /Mantenha seus classificados atualizados/i.test(raw);
  return {
    href: location.href,
    listings,
    titles,
    avisosBadge,
    avisoLink,
    keepUpdated,
    textHead: clean(raw).slice(0, 5000)
  };
})()`;

const GROUPS_FULL_JS = `(() => {
  const clean = s => String(s || '').replace(/\\s+/g, ' ').trim();
  const raw = document.body ? document.body.innerText : '';
  const header = (raw.match(/Todos os grupos dos quais voc[eê] participa\\s*\\((\\d+)\\)/i) || []);
  const pending = (raw.match(/Solicita[cç][oõ]es de grupo pendentes\\s*\\((\\d+)\\)/i) || []);
  const names = [];
  const seen = new Set();
  // Collect visible group cards in the membership section: look for "Ver grupo" near a title
  const buttons = Array.from(document.querySelectorAll('a, button, [role="button"]'));
  for (const b of buttons) {
    const t = clean(b.innerText || b.getAttribute('aria-label') || '');
    if (!/^Ver grupo$/i.test(t)) continue;
    let el = b;
    let title = '';
    for (let i = 0; i < 8 && el; i++) {
      el = el.parentElement;
      const txt = clean(el ? el.innerText : '');
      if (!txt) continue;
      // first non-trivial line is usually the name
      const first = txt.split(/(?:Visitado pela [uú]ltima vez|Pediu para participar|Ver grupo|Responder [aà]s perguntas)/i)[0];
      const cand = clean(first);
      if (cand && cand.length >= 3 && cand.length <= 160 && !/^Ver grupo$/i.test(cand)) { title = cand; break; }
    }
    if (title && !seen.has(title.toLowerCase())) {
      seen.add(title.toLowerCase());
      names.push(title);
    }
  }
  const saleRe = /compra|venda|vende|troca|classificad|desapeg|bazar|brech[oó]|neg[oó]cio|an[uú]ncio|mercado|marketplace|carro|ve[ií]culo|auto|moto|caminho|im[oó]ve|celular|games?|produto|servi[cç]o|loja|promo/i;
  const sale = names.filter(n => saleRe.test(n));
  const other = names.filter(n => !saleRe.test(n));
  return {
    href: location.href,
    memberCountHeader: header[1] ? Number(header[1]) : null,
    pendingCountHeader: pending[1] ? Number(pending[1]) : null,
    scrapedNames: names,
    scrapedCount: names.length,
    saleCount: sale.length,
    sale,
    other
  };
})()`;

function log(o){ console.log(typeof o === 'string' ? o : JSON.stringify(o)); }

const out = { whenBRT: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) };
let c;
try {
  c = await connectTab(PORT, TAB);
  await c.send('Page.enable');
  await c.send('Runtime.enable');

  // Name from current marketplace page source first
  out.nameFromHome = await c.evaluate(NAME_FROM_SOURCE_JS);
  log({ phase: 'name-home', counts: out.nameFromHome?.counts });

  // Selling list, scroll for all ads
  await c.navigate('https://www.facebook.com/marketplace/you/selling', 10000);
  await sleep(3000);
  for (let i = 0; i < 6; i++) {
    await c.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await sleep(700);
  }
  await c.evaluate('window.scrollTo(0, 0)');
  await sleep(400);
  out.selling = await c.evaluate(SELLING_FULL_JS);
  out.sellingState = await c.evaluate(PAGE_STATE_JS);
  out.sellingShot = `${PRINTS}\\pnovo-selling-full.jpg`;
  out.sellingShotBytes = await c.screenshot(out.sellingShot, 85);
  log({ phase: 'selling', flags: out.sellingState?.flags, listings: out.selling?.listings, titles: out.selling?.titles, avisos: out.selling?.avisosBadge });

  // Profile /me for the logged-in name — read only, then leave
  await c.navigate('https://www.facebook.com/me', 10000);
  await sleep(3500);
  out.me = {
    state: await c.evaluate(PAGE_STATE_JS),
    extract: await c.evaluate(`(() => {
      const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
      const h1 = (document.querySelector('h1') || {}).innerText || '';
      const raw = document.body ? document.body.innerText : '';
      const og = (document.querySelector('meta[property="og:title"]') || {}).content || '';
      const title = document.title || '';
      return { h1: clean(h1), og: clean(og), title: clean(title), textHead: clean(raw).slice(0, 800) };
    })()`),
    nameFromSource: await c.evaluate(NAME_FROM_SOURCE_JS)
  };
  out.meShot = `${PRINTS}\\pnovo-me.jpg`;
  out.meShotBytes = await c.screenshot(out.meShot, 85);
  log({ phase: 'me', url: out.me.state?.url, flags: out.me.state?.flags, extract: out.me.extract, counts: out.me.nameFromSource?.counts });

  // Groups again, more complete scrape
  await c.navigate('https://www.facebook.com/groups/joins/', 10000);
  await sleep(3500);
  for (let i = 0; i < 20; i++) {
    await c.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await sleep(600);
  }
  await sleep(800);
  out.groups = await c.evaluate(GROUPS_FULL_JS);
  out.groupsState = await c.evaluate(PAGE_STATE_JS);
  await c.evaluate('window.scrollTo(0, 0)');
  await sleep(400);
  out.groupsShot = `${PRINTS}\\pnovo-grupos-full.jpg`;
  out.groupsShotBytes = await c.screenshot(out.groupsShot, 85);
  log({ phase: 'groups', flags: out.groupsState?.flags, header: out.groups?.memberCountHeader, pending: out.groups?.pendingCountHeader, scraped: out.groups?.scrapedCount, sale: out.groups?.saleCount, other: out.groups?.other });

  // Restore marketplace home
  await c.navigate('https://www.facebook.com/marketplace/?ref=bookmark', 8000);
  await sleep(1500);
  out.restored = await c.evaluate('location.href');
  log({ phase: 'restored', url: out.restored });
} catch (e) {
  out.error = String(e && e.stack || e);
  log({ phase: 'FAIL', error: out.error });
} finally {
  if (c) c.close();
}

writeFileSync(`${OUT}\\inspect-pnovo-b.json`, JSON.stringify(out, null, 2), 'utf8');
log({ phase: 'WROTE' });
