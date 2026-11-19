import { writeFileSync, mkdirSync } from 'fs';
import { connectTab, PAGE_STATE_JS, sleep } from './cdp.mjs';

const PRINTS = 'C:\\Users\\Public\\prints-marketplace-1811';
const OUT = 'C:\\Users\\Public\\cdp-postador-1811\\out';
mkdirSync(PRINTS, { recursive: true });
mkdirSync(OUT, { recursive: true });

const PROFILES = [
  { n: 1,  name: '1-face samuel junior',           port: 56934, tab: '4ECFE63E6847803AEF48A025A3F56BA8' },
  { n: 2,  name: '2-face pedro brito',             port: 56930, tab: '3BCC6B1FEBBD92D17DB95AB8ADAD5F7F' },
  { n: 3,  name: '3-face joao tanan',              port: 56852, tab: '1F699FF09921EEB1E9D0569BC16BE09A' },
  { n: 4,  name: '4-Dani',                         port: 56839, tab: 'FEF8C602AFD928070460530840B92E1E' },
  { n: 6,  name: '6-face italo',                   port: 56784, tab: '6D848E0052F4AD3670CE909296E4DA35' },
  { n: 7,  name: '7-face joao brito tanan',        port: 56782, tab: '267D03697B45145EF6B054000DFC6EB5' },
  { n: 9,  name: '9-CONTA VIRADINHA CAMINHAO',     port: 62275, tab: '85324F95CDC9D2027820552EEAD663FC' },
  { n: 10, name: '10-face leo',                    port: 62218, tab: '71C747DE464F833FD368501BCC7F34CF' },
];

const PULSE = 'https://www.facebook.com/marketplace/item/29073266565635327';
const results = [];

for (const p of PROFILES) {
  const rec = { ...p, ok: false };
  let c;
  try {
    c = await connectTab(p.port, p.tab);
    await c.send('Page.enable');
    await c.send('Runtime.enable');
    rec.state = await c.evaluate(PAGE_STATE_JS);
    rec.shot = `${PRINTS}\\perfil-${p.n}-antes.jpg`;
    rec.shotBytes = await c.screenshot(rec.shot);
    rec.ok = true;
    if (rec.state?.flags?.length) rec.STOP = rec.state.flags;
    console.log(JSON.stringify({
      n: p.n, ok: true, url: rec.state.url, title: rec.state.title,
      flags: rec.state.flags, nameCands: rec.state.nameCands, shot: rec.shot
    }));
  } catch (e) {
    rec.error = String(e && e.stack || e);
    console.error('FAIL perfil', p.n, rec.error);
  } finally {
    if (c) c.close();
  }
  results.push(rec);
}

// Pulse check on account 3, same already-open Facebook tab
const pulse = { url: PULSE, ok: false };
let c3;
try {
  c3 = await connectTab(56852, '1F699FF09921EEB1E9D0569BC16BE09A');
  await c3.send('Page.enable');
  await c3.send('Runtime.enable');
  await c3.navigate(PULSE, 10000);
  pulse.state = await c3.evaluate(PAGE_STATE_JS);
  pulse.extra = await c3.evaluate(`(() => {
    const t = document.body.innerText || '';
    const gone = /este classificado n[aã]o est[aá] dispon|an[uú]ncio n[aã]o est[aá] dispon|content isn'?t available|isso n[aã]o est[aá] dispon/i.test(t);
    const title = (document.querySelector('h1, [role="main"] h1, [role="main"] span') || {}).innerText || '';
    const price = (t.match(/R\\$\\s*[\\d\\.]+/ ) || [''])[0];
    const loc = (t.match(/Vit[oó]ria da Conquista[^\\n]{0,40}/i) || [''])[0];
    const age = (t.match(/Anunciado[\\s\\S]{0,60}/i) || [''])[0];
    return { gone, title: String(title).slice(0,200), price, loc, age, href: location.href };
  })()`);
  pulse.shot = `${PRINTS}\\pulse-conta3-check.jpg`;
  pulse.shotBytes = await c3.screenshot(pulse.shot);
  pulse.ok = true;
  console.log('PULSE', JSON.stringify({ ok: true, extra: pulse.extra, flags: pulse.state?.flags, url: pulse.state?.url, title: pulse.state?.title }));
} catch (e) {
  pulse.error = String(e && e.stack || e);
  console.error('FAIL pulse', pulse.error);
  try {
    if (c3) {
      pulse.shot = `${PRINTS}\\pulse-conta3-check-erro.jpg`;
      await c3.screenshot(pulse.shot);
    }
  } catch {}
} finally {
  if (c3) c3.close();
}

const out = { when: new Date().toISOString(), results, pulse };
writeFileSync(`${OUT}\\inspect.json`, JSON.stringify(out, null, 2), 'utf8');
writeFileSync(`${OUT}\\inspect-lite.json`, JSON.stringify({
  when: out.when,
  profiles: results.map(r => ({
    n: r.n, name: r.name, ok: r.ok, error: r.error || null,
    url: r.state?.url, title: r.state?.title, flags: r.state?.flags,
    nameCands: r.state?.nameCands, shot: r.shot, STOP: r.STOP || null
  })),
  pulse: {
    ok: pulse.ok, error: pulse.error || null,
    url: pulse.state?.url, flags: pulse.state?.flags,
    extra: pulse.extra, shot: pulse.shot
  }
}, null, 2), 'utf8');
console.log('WROTE', `${OUT}\\inspect-lite.json`);
