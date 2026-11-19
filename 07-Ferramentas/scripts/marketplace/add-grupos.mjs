import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { listTabs, connectTab, PAGE_STATE_JS, sleep } from './cdp.mjs';

const PRINTS = 'C:\\Users\\Public\\prints-marketplace-1811';
const OUT = 'C:\\Users\\Public\\cdp-postador-1811\\out';

const PROFILES = {
  1: { port: 56934, tab: '4ECFE63E6847803AEF48A025A3F56BA8', conta: 'Yasmin Nátally (1-face samuel junior)' },
  2: { port: 56930, tab: '3BCC6B1FEBBD92D17DB95AB8ADAD5F7F', conta: 'Pedro Brito (2-face pedro brito)' },
  3: { port: 56852, tab: '1F699FF09921EEB1E9D0569BC16BE09A', conta: 'Joao Tanan (3-face joao tanan)' },
  4: { port: 56839, tab: 'FEF8C602AFD928070460530840B92E1E', conta: 'Daniel Santos (4-Dani)' },
  6: { port: 56784, tab: '6D848E0052F4AD3670CE909296E4DA35', conta: 'Ítalo Ezequiel (6-face italo)' },
  7: { port: 56782, tab: '267D03697B45145EF6B054000DFC6EB5', conta: 'Joao Brito Tanan (7-face joao brito tanan)' },
  9: { port: 62275, tab: '85324F95CDC9D2027820552EEAD663FC', conta: 'Pedro Silva Teixeira (9-CONTA VIRADINHA CAMINHAO)' },
  10: { port: 62218, tab: '71C747DE464F833FD368501BCC7F34CF', conta: 'Leomarcos S. Porto (10-face leo)' },
  8: { port: 53688, tab: '63E1C1E5B54CD3E0874F6ADAD7E1C8B8', conta: 'Pedro Ryan Rocha Abreu (8-face camila marques)' },
};

// Today's ads first (rodada 1 + rodada ~13h20). Older ads optional via --old.
const ADS = [
  { profile: 1, title: 'Fiat Fastback Turbo 200 2025 no parcelamento', id: '29541295488837407', slug: 'r1-fastback', when: 'today' },
  { profile: 1, title: 'T-Cross 2025: SUV turbo em parcelas', id: '28833622842986268', slug: 'r2-tcross', when: 'today' },
  { profile: 2, title: 'Van Ducato MaxiCargo Diesel 2025 em parcelas', id: '40073189872329506', slug: 'r1-ducato', when: 'today' },
  { profile: 2, title: 'TRACKER 1.0 TURBO AUTOMÁTICO 2023 PARCELADO', id: '29537671435858562', slug: 'r2-tracker', when: 'today' },
  { profile: 3, title: 'IVECO DAILY CITY 30-130 2022 – CAMINHÃO LEVE', id: '28983857644611705', slug: 'r1-daily-city', when: 'today' },
  { profile: 3, title: 'CAOA Chery Tiggo 5X Sport 2023 parcelado', id: '29324033957280220', slug: 'r2-tiggo5x', when: 'today' },
  { profile: 4, title: 'Cavalo VW 19.330 Constellation 2014 parcelado', id: '29059578173669051', slug: 'r1-vw19330', when: 'today' },
  { profile: 4, title: 'TIGGO 7 SPORT 2025 🚙 COM PARCELAS DE R$ 2.139,96', id: '28340827032257927', slug: 'r2-tiggo7', when: 'today' },
  { profile: 6, title: 'Iveco Daily 65-170 cabine dupla com baú 2021', id: '29150276211320598', slug: 'r1-daily-cd', when: 'today' },
  { profile: 6, title: 'BYD Dolphin Mini 2025: elétrico em parcelas', id: '29303614989269950', slug: 'r2-dolphin-mini', when: 'today' },
  { profile: 7, title: 'HB20 TURBO 2023 COMFORT PLUS NO PARCELAMENTO', id: '29165911136411423', slug: 'r1-hb20', when: 'today' },
  { profile: 7, title: 'Jeep Renegade Sport T270 2022 no parcelamento', id: '30754247744165712', slug: 'r2-renegade', when: 'today' },
  { profile: 9, title: 'Hyundai Creta Platinum 2024 com entrada de R$ 27.180', id: '29546104681691466', slug: 'r1-creta', when: 'today' },
  { profile: 9, title: 'VW POLO MPI 2024 COM ENTRADA DE R$ 13.398', id: '29158949200390813', slug: 'r2-polo', when: 'today' },
  { profile: 10, title: 'Onix 2022 em parcelas de R$ 1.459,06 🚗', id: '27120111891019466', slug: 'r1-onix', when: 'today' },
  { profile: 10, title: 'Fiat Pulse Impetus 200 Turbo 2023 ✨ parcelado', id: '40278139595164415', slug: 'r2-pulse-impetus', when: 'today' },

  // 3ª rodada (exceto conta 4 / Captur). Já saíram com 20 grupos (ou 0 na c4).
  { profile: 1, title: 'CRONOS DRIVE 2023 COM ENTRADA DE R$ 14.998', id: '27099889636374768', slug: 'r3-cronos', when: 'r3' },
  { profile: 2, title: 'Ford F 4000 4x4 2018 🚛 entrada de R$ 49.560', id: '39998643369780451', slug: 'r3-f4000', when: 'r3' },
  { profile: 3, title: 'Renault Duster Intense automático 2024 parcelado', id: '28923094520716372', slug: 'r3-duster', when: 'r3' },
  { profile: 6, title: 'HONDA HR-V EXL 2021 EM PARCELAS', id: '29050976784563448', slug: 'r3-hrv', when: 'r3' },
  { profile: 7, title: 'Toyota Yaris XL automático 2024, entrada de R$ 18.180', id: '29865961902988383', slug: 'r3-yaris', when: 'r3' },
  { profile: 9, title: 'ARGO 1.0 DRIVE 2025 – PARCELAS DE R$ 1.459,06', id: '28944269705215618', slug: 'r3-argo', when: 'r3' },
  { profile: 10, title: 'Ford Ka SE Plus 2021 automático 🔑 em parcelas', id: '29463285213302704', slug: 'r3-ka', when: 'r3' },
  // 4a rodada (~16h12–16h19)
  { profile: 2, title: 'Onix Plus Premier 2024 🚘 entrada de R$ 17.198', id: '40000347806278370', slug: 'r4-onix-plus', when: 'r4' },
  { profile: 6, title: 'SAVEIRO ROBUST 2023 PARCELADA PRO SERVIÇO', id: '29103539352643449', slug: 'r4-saveiro', when: 'r4' },
  { profile: 7, title: 'Chevrolet Montana Premier automática 2023', id: '29513475371623211', slug: 'r4-montana', when: 'r4' },
  { profile: 9, title: 'HYUNDAI HR 2019 COM CARROCERIA EM PARCELAS', id: '40033211132993108', slug: 'r4-hr', when: 'r4' },
  { profile: 10, title: 'Fiat Fiorino Endurance 2023, entrada de R$ 17.980', id: '29206599145635221', slug: 'r4-fiorino', when: 'r4' },
  { profile: 1, title: 'ATEGO 1719 2021 🚚 CAMINHÃO TOCO PARCELADO', id: '29364817089827953', slug: 'r4-atego', when: 'r4' },
  { profile: 3, title: 'Caminhão VW 8.120 2011 com parcelas de R$ 2.334,50', id: '40616395874617993', slug: 'r4-vw8120', when: 'r4' },

  // 5a rodada (~17h32–17h40)
  { profile: 1, title: 'GRAND SIENA 1.4 2021 🔑 NO PARCELAMENTO', id: '29956086990644481', slug: 'r5-siena', when: 'r5' },
  { profile: 2, title: 'VW CONSTELLATION 24.260 2019 NO PARCELAMENTO', id: '40098655869748900', slug: 'r5-constellation', when: 'r5' },
  { profile: 3, title: 'CAOA CHERY TIGGO 7 SPORT 2024 🚙 PARCELADO', id: '29760247190246046', slug: 'r5-tiggo7-2024', when: 'r5' },
  { profile: 6, title: 'Ducato 2025 2.2 TDI 📦 parcelas de R$ 3.890,84', id: '28591639773846899', slug: 'r5-ducato', when: 'r5' },
  { profile: 7, title: 'Tiggo 5X TXS Turboflex automático 2021', id: '29049171261400455', slug: 'r5-tiggo5x-2021', when: 'r5' },
  { profile: 9, title: 'Montana 1.2 Turbo 2024, entrada de R$ 22.100', id: '28267331509606292', slug: 'r5-montana-2024', when: 'r5' },
  { profile: 10, title: 'Fastback Abarth 2024 com entrada de R$ 25.600', id: '41284530924467380', slug: 'r5-fastback-2024', when: 'r5' },



  // 6a rodada (~18h48–19h06; perfil 8 às 20h01). c4 Ka fora de grupos.
  { profile: 1, title: 'Ford Territory Titanium 2024 no parcelamento', id: '40299606236350420', slug: 'r6-territory', when: 'r6' },
  { profile: 2, title: 'TORO DIESEL 4WD 2021 – ENTRADA DE R$ 23.980', id: '29676687478603656', slug: 'r6-toro', when: 'r6' },
  { profile: 3, title: 'HONDA CIVIC EXL 2019 COM PARCELAS DE R$ 2.139,96', id: '29888471740756729', slug: 'r6-civic', when: 'r6' },
  { profile: 6, title: 'Fiat Pulse Drive 1.0 CVT 2024 parcelado', id: '29159492923679286', slug: 'r6-pulse', when: 'r6' },
  { profile: 7, title: 'HB20 Evolution 2021 ✨ entrada de R$ 13.200', id: '30138743099046501', slug: 'r6-hb20-2021', when: 'r6' },
  { profile: 8, title: 'BYD Dolphin EV 2024 em parcelas de R$ 2.139,96', id: '29086294727693834', slug: 'r6-dolphin', when: 'r6' },
  { profile: 9, title: 'DUCATO MAXICARGO DIESEL 2024 PARCELADA', id: '28808149978826665', slug: 'r6-ducato-2024', when: 'r6' },
  { profile: 10, title: 'Hyundai Creta Limited Turbo 2023 parcelado', id: '29646479348303805', slug: 'r6-creta', when: 'r6' },


  // 8a rodada (~21h33–22h17). c4 fora.
  { profile: 1, title: 'Yaris XL 1.5 automático 2024 parcelado', id: '29441398368829935', slug: 'r8-yaris-xl', when: 'r8' },
  { profile: 2, title: 'Renault Master Grand Vitré 2013 no parcelamento', id: '28994864916803016', slug: 'r8-master', when: 'r8' },
  { profile: 3, title: 'VW Polo MPI 2023 💙 no parcelamento', id: '29149555688036680', slug: 'r8-polo-mpi', when: 'r8' },
  { profile: 6, title: 'Toyota Corolla XEi 2024 🚘 em parcelas', id: '30401227392800802', slug: 'r8-corolla-xei', when: 'r8' },
  { profile: 7, title: 'VW 24.260 CONSTELLATION 6X2 2019 EM PARCELAS', id: '28765315796484025', slug: 'r8-constellation-24260', when: 'r8' },
  { profile: 8, title: 'Volkswagen T-Cross 200 TSI 2019 parcelado', id: '30083403287927338', slug: 'r8-tcross', when: 'r8' },
  { profile: 9, title: 'Nivus Highline 200 TSI 2023 com entrada de R$ 21.100', id: '28621174557578511', slug: 'r8-nivus', when: 'r8' },
  { profile: 10, title: 'SAVEIRO ROBUST CS 2019 – PARCELAS DE R$ 1.459,06', id: '29655099890794455', slug: 'r8-saveiro-robust', when: 'r8' },

  // Older live ads on open accounts (skip Accelo). Used only with --old.
  { profile: 2, title: 'Ford Cargo 1119 2015', id: '29188676167465452', slug: 'old-cargo', when: 'old' },
  { profile: 2, title: 'Fiat Cronos Drive 1.3 2024', id: '29540044425633817', slug: 'old-cronos', when: 'old' },
  { profile: 3, title: 'Toyota Hilux SRV CD 4x4 2018', id: '29058602000448575', slug: 'old-hilux', when: 'old' },
  { profile: 3, title: 'Chevrolet Onix LT 1.0 2024', id: '29248762024763583', slug: 'old-onix-lt', when: 'old' },
  { profile: 3, title: 'PULSE DRIVE AUTOMÁTICO 2023 – PARCELE', id: '29073266565635327', slug: 'old-pulse', when: 'old' },
  { profile: 3, title: 'Hyundai HB20S Comfort 2025', id: '29352819577713862', slug: 'old-hb20s', when: 'old' },
  { profile: 4, title: 'Fiat Strada Freedom CD 2023', id: '40084314884516544', slug: 'old-strada', when: 'old' },
  { profile: 4, title: 'Fiat Toro Freedom 270 Turbo 2023', id: '29196731143293490', slug: 'old-toro', when: 'old' },
  { profile: 7, title: 'GWM Poer P30 Trail 2.4 TDI 2025', id: '29143589515290563', slug: 'old-poer', when: 'old' },
  { profile: 7, title: 'Chevrolet Onix Plus Premier Turbo 2022', id: '29279540875006036', slug: 'old-onixplus', when: 'old' },
];

const SKIP_TITLE = /accelo/i;

const FLAGS_EXTRA = `
  const extra = [
    ['rapido_demais', /indo r[aá]pido demais|too fast|tente novamente mais tarde|voc[eê] est[aá] indo r[aá]pido/i],
    ['limite_grupos', /muitos grupos|too many groups|limite de grupos|n[aã]o [eé] poss[ií]vel compartilhar em mais|selecionar at[eé] 20/i],
    ['captcha', /captcha|n[aã]o sou um rob[oô]|confirma que voc[eê] [eé] humano/i],
    ['aviso_conta', /aviso da conta|restringimos|sua conta est[aá] com restri|limitamos alguns recursos/i]
  ];
`;

function log(obj) {
  const line = typeof obj === 'string' ? obj : JSON.stringify(obj);
  console.log(line);
}

function nowBRT() {
  return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function foldName(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+\d+[.,]?\d*\s*(mil\s*)?membros.*$/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function stripMembers(s) {
  return String(s || '').replace(/\s+\d+[.,]?\d*\s*(mil\s*)?membros.*$/i, '').replace(/\s+/g, ' ').trim();
}

function persistAccount(result) {
  try {
    mkdirSync(OUT, { recursive: true });
    writeFileSync(`${OUT}\\grupos-p${result.profile}.json`, JSON.stringify(result, null, 2));
  } catch (e) { log({ phase: 'persist-fail', err: String(e) }); }
}

function persistAd(accountResult, rec) {
  if (!accountResult) return;
  const i = accountResult.ads.findIndex(a => a.slug === rec.slug);
  if (i >= 0) accountResult.ads[i] = rec; else accountResult.ads.push(rec);
  persistAccount(accountResult);
}

async function findFacebookTab(port, preferredId) {
  const tabs = await listTabs(port);
  const fb = tabs.filter(t => /^https:\/\/(www\.)?facebook\.com\//i.test(t.url || ''));
  if (!fb.length) throw new Error(`no facebook tab on port ${port}`);
  if (preferredId && fb.some(t => t.id === preferredId)) return preferredId;
  const selling = fb.find(t => /marketplace/i.test(t.url || ''));
  return (selling || fb[0]).id;
}

async function abortIfDanger(c, phase, result) {
  const st = await c.evaluate(PAGE_STATE_JS);
  const extra = await c.evaluate(`(() => {
    const raw = (document.body && document.body.innerText) ? document.body.innerText : '';
    const flags = [];
    const checks = [
      ['rapido_demais', /indo r[aá]pido demais|too fast|tente novamente mais tarde|voc[eê] est[aá] indo r[aá]pido/i],
      ['limite_grupos', /muitos grupos|too many groups|limite de grupos|n[aã]o [eé] poss[ií]vel compartilhar em mais/i],
      ['captcha', /captcha|n[aã]o sou um rob[oô]|confirma que voc[eê] [eé] humano/i]
    ];
    for (const [name, re] of checks) { if (re.test(raw)) flags.push(name); }
    const toasts = [...document.querySelectorAll('[role="alert"], [role="status"], div[aria-live]')]
      .map(el => (el.innerText||'').replace(/\\s+/g,' ').trim()).filter(Boolean).slice(0,8);
    return { flags, toasts, url: location.href };
  })()`);
  const flags = [...(st.flags || []), ...(extra.flags || [])];
  const hard = flags.filter(f => f !== 'limite_grupos');
  // limite_grupos during selection can be informational; still stop the account if it appears as a block after post, handled by caller.
  const fatal = hard.length > 0;
  if (fatal) {
    const shot = `${PRINTS}\\grupos-STOP-p${result.profile}-${phase}.jpg`;
    try { await c.screenshot(shot); } catch {}
    const err = new Error(`STOP ${phase} flags=${flags.join(',')}`);
    err.stop = true;
    err.flags = flags;
    err.shot = shot;
    err.toasts = extra.toasts;
    throw err;
  }
  return { flags, toasts: extra.toasts, url: extra.url, st };
}

async function closeDialog(c) {
  const r = await c.evaluate(`(() => {
    const d = [...document.querySelectorAll('[role="dialog"]')].find(x => /anunciar em mais locais|anunciar nos seus grupos/i.test(x.innerText||''));
    if (!d) {
      const menus = [...document.querySelectorAll('[role="menu"]')];
      if (!menus.length) return 'no_dialog';
      const b = [...document.querySelectorAll('button,[role="button"]')].find(el => /fechar|close/i.test((el.getAttribute('aria-label')||'')+(el.innerText||'')));
      if (b) { b.click(); return 'closed_menu'; }
      return 'menu_no_close';
    }
    const b = [...d.querySelectorAll('button,[role="button"]')].find(el => /fechar|close/i.test((el.getAttribute('aria-label')||'')+(el.innerText||'')));
    if (b) { b.click(); return 'closed'; }
    return 'dialog_no_close';
  })()`);
  if (r === 'dialog_no_close' || r === 'menu_no_close') {
    try {
      await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
      await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    } catch {}
  }
  await sleep(800);
  return r;
}

async function collapseChatRail(c) {
  return await c.evaluate(`(() => {
    const labs = [...document.querySelectorAll('button,[role="button"]')];
    const re = /ocultar (a )?(lista|barra) de conversas|recolher (a )?(barra|lista) de conversas|fechar (o )?bate-papo|esconder conversas|ocultar bate-papo/i;
    const btn = labs.find(el => re.test((el.getAttribute('aria-label')||'')+' '+(el.innerText||'')));
    if (btn) { btn.click(); return 'collapsed:'+(btn.getAttribute('aria-label')||btn.innerText||'').slice(0,80); }
    return 'no_collapse';
  })()`);
}

async function goSelling(c) {
  await c.navigate('https://www.facebook.com/marketplace/you/selling', 10000);
  await sleep(2500);
  try { await collapseChatRail(c); } catch {}
  await sleep(400);
}

async function scrollSellingToFind(c, title) {
  const prefix = title.slice(0, 24);
  for (let i = 0; i < 12; i++) {
    const found = await c.evaluate(`(() => {
      const wantTitle = ${JSON.stringify(title)};
      const prefix = ${JSON.stringify(prefix)};
      const aria = [...document.querySelectorAll('button,[role="button"]')].map(el => el.getAttribute('aria-label')||'');
      const hit = aria.find(a => /mais op[cç][oõ]es/i.test(a) && (a.includes(wantTitle) || a.includes(prefix)));
      const textHit = (document.body.innerText||'').includes(prefix);
      return { hit: !!hit, aria: hit || null, textHit };
    })()`);
    if (found.hit) return found;
    await c.evaluate(`(() => {
      const el = document.scrollingElement || document.documentElement;
      el.scrollBy(0, Math.round(window.innerHeight * 0.85));
    })()`);
    await sleep(700);
  }
  // try scroll to top and search again once
  await c.evaluate(`(() => { (document.scrollingElement||document.documentElement).scrollTo(0,0); })()`);
  await sleep(500);
  return await c.evaluate(`(() => {
    const wantTitle = ${JSON.stringify(title)};
    const prefix = ${JSON.stringify(prefix)};
    const aria = [...document.querySelectorAll('button,[role="button"]')].map(el => el.getAttribute('aria-label')||'');
    const hits = aria.filter(a => /mais op[cç][oõ]es/i.test(a));
    const hit = hits.find(a => a.includes(wantTitle) || a.includes(prefix));
    return { hit: !!hit, aria: hit || null, textHit: (document.body.innerText||'').includes(prefix), maisSample: hits.slice(0, 20) };
  })()`);
}

async function clickMaisOpcoes(c, title) {
  const find = await scrollSellingToFind(c, title);
  if (!find.hit) return { ok: false, reason: 'mais_not_found', find };
  const clicked = await c.evaluate(`(() => {
    const wantTitle = ${JSON.stringify(title)};
    const prefix = ${JSON.stringify(title.slice(0, 24))};
    const els = [...document.querySelectorAll('button, [role="button"]')];
    const vis = els.filter(el => {
      const aria = (el.getAttribute('aria-label') || '') + ' ' + (el.innerText || '');
      if (!/mais op[cç][oõ]es/i.test(aria)) return false;
      if (!(aria.includes(wantTitle) || aria.includes(prefix))) return false;
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none';
    });
    if (!vis.length) return { ok:false, reason:'mais_not_visible' };
    const el = vis[0];
    el.scrollIntoView({block:'center', inline:'center'});
    const r = el.getBoundingClientRect();
    // nudge page so the menu has space to the left of the chat rail
    const dx = Math.max(0, r.right - (window.innerWidth - 280));
    if (dx > 0) (document.scrollingElement||document.documentElement).scrollBy(0, 0);
    el.click();
    return { ok:true, clicked: (el.getAttribute('aria-label')||''), found: vis.length, right: Math.round(r.right), vw: window.innerWidth };
  })()`);
  await sleep(1800);
  // if menu is empty, wait a bit more and retry the click once
  const hasMenu = await c.evaluate(`(() => !!document.querySelector('[role="menu"] [role="menuitem"], [role="menu"]') && ([...document.querySelectorAll('[role="menuitem"]')].length>0))()`);
  if (!hasMenu) {
    await sleep(1200);
    const retry = await c.evaluate(`(() => {
      const wantTitle = ${JSON.stringify(title)};
      const prefix = ${JSON.stringify(title.slice(0, 24))};
      const els = [...document.querySelectorAll('button, [role="button"]')];
      const el = els.find(e => {
        const aria = (e.getAttribute('aria-label') || '') + ' ' + (e.innerText || '');
        if (!/mais op[cç][oõ]es/i.test(aria)) return false;
        if (!(aria.includes(wantTitle) || aria.includes(prefix))) return false;
        const r = e.getBoundingClientRect();
        return r.width>0 && r.height>0;
      });
      if (!el) return { retried:false };
      el.scrollIntoView({block:'center', inline:'start'});
      el.click();
      return { retried:true, aria: el.getAttribute('aria-label')||'' };
    })()`);
    clicked.retry = retry;
    await sleep(1800);
  }
  return { ...clicked, find, hasMenu };
}

async function clickAnunciarMais(c) {
  return await c.evaluate(`(() => {
    const want = /anunciar em mais locais|anunciar nos seus grupos/i;
    const all = [];
    const consider = (el, loose=false) => {
      const text = String(el.innerText || el.getAttribute('aria-label') || '').replace(/\\s+/g,' ').trim();
      if (text) all.push(text);
      if (!want.test(text) || /editar|promover|turbinar|vender|excluir|marcar como|mensage|messenger/i.test(text)) return null;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return null;
      el.click();
      return { ok:true, clicked:text, all, loose };
    };
    for (const menu of document.querySelectorAll('[role="menu"]')) {
      for (const el of menu.querySelectorAll('[role="menuitem"]')) {
        const r = consider(el);
        if (r) return r;
      }
    }
    for (const el of document.querySelectorAll('[role="menuitem"], [role="button"]')) {
      const text = String(el.innerText || el.getAttribute('aria-label') || '').replace(/\\s+/g,' ').trim();
      if ((/^anunciar em mais locais$/i.test(text) || /^anunciar nos seus grupos$/i.test(text)) && text.length < 50) {
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        el.click();
        return { ok:true, clicked:text, all, loose:true };
      }
    }
    const menus = [...document.querySelectorAll('[role="menu"], [role="dialog"]')].slice(0,8).map(m => ({
      role: m.getAttribute('role'),
      text: (m.innerText||'').replace(/\\s+/g,' ').trim().slice(0,300),
      box: {w:Math.round(m.getBoundingClientRect().width), h:Math.round(m.getBoundingClientRect().height), x:Math.round(m.getBoundingClientRect().x), y:Math.round(m.getBoundingClientRect().y)}
    }));
    return { ok:false, reason:'not_found', all, menus };
  })()`);
}

async function inventoryGroups(c) {
  return await c.evaluate(`(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const fold = s => String(s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/\\s+/g,' ').trim().toLowerCase();
    const nameOf = el => {
      const text = String(el.innerText || el.getAttribute('aria-label') || '').replace(/\\s+/g,' ').trim();
      return text.replace(/\\s+\\d+[.,]?\\d*\\s*(mil\\s*)?membros.*$/i,'').trim();
    };
    const isPending = raw => /pedido pendente|solicita[cç][aã]o pendente|pediu para participar|responder [aà]s perguntas|aguardando aprova|pending (request|invite)|convite pendente/i.test(raw);
    const pendingNames = [
      'venda e troca de carros antigos VITORIA DA CONQUISTA',
      'Vitória da Conquista - Bahia - Produtos e Serviços'
    ].map(fold);
    const isBuySell = name => {
      const n = fold(name);
      if (/bitcoin|criptomoeda|forex/.test(n)) return false;
      return /compr[aeo]|vend[aeo]|classificado|desapega|mercado|feira|anuncio|troc[aeo]|negocio|rolo|bazar|olx|carros|automove|veiculo/.test(n);
    };
    const dialog = [...document.querySelectorAll('[role="dialog"]')].find(d => /anunciar em mais locais|anunciar nos seus grupos/i.test(d.innerText||''));
    if (!dialog) return { ok:false, reason:'no_dialog', body: (document.body.innerText||'').slice(0,500) };
    const suggestedHeading = () => {
      const all = [...dialog.querySelectorAll('*')];
      for (const el of all) {
        if (el.children.length > 4) continue;
        const t = String(el.textContent||'').replace(/\\s+/g,' ').trim();
        if (/^grupos sugeridos para voc[eê] participar$/i.test(t)) return el;
      }
      return null;
    };
    const memberBoxes = () => {
      const sug = suggestedHeading();
      return [...dialog.querySelectorAll('[role="checkbox"]')].filter(el => {
        if (/participar do grupo/i.test(el.innerText||'')) return false;
        // keep only checkboxes that appear BEFORE the suggested heading
        if (sug && (el.compareDocumentPosition(sug) & Node.DOCUMENT_POSITION_PRECEDING)) return false;
        return true;
      });
    };
    const collect = () => memberBoxes().map(el => {
      const raw = String(el.innerText || el.getAttribute('aria-label') || '').replace(/\s+/g,' ').trim();
      const name = nameOf(el);
      const pending = isPending(raw) || pendingNames.includes(fold(name));
      return {
        name,
        key: fold(name),
        checked: el.getAttribute('aria-checked') === 'true' || el.checked === true,
        pending,
        eligible: isBuySell(name) && !pending
      };
    }).filter(x => x.name);
    const seen = {};
    const add = () => { for (const x of collect()) { if (x.key) seen[x.key] = x; } };
    add();
    const firstBox = memberBoxes()[0];
    let scrollable = null;
    let p = firstBox && firstBox.parentElement;
    while (p) {
      const st = getComputedStyle(p);
      if (p.scrollHeight > p.clientHeight + 30 && p.clientHeight > 80 && /(auto|scroll)/.test(st.overflowY+' '+st.overflow)) { scrollable = p; break; }
      p = p.parentElement;
    }
    if (scrollable) scrollable.scrollTop = 0;
    await sleep(250);
    add();
    let stable = 0;
    for (let i = 0; i < 60; i++) {
      const n0 = Object.keys(seen).length;
      if (scrollable) {
        scrollable.scrollTop = Math.min(scrollable.scrollHeight, scrollable.scrollTop + Math.max(120, (scrollable.clientHeight || 200) * 0.7));
      } else {
        const boxes = memberBoxes();
        if (boxes.length) boxes[boxes.length-1].scrollIntoView({ block: 'end' });
      }
      await sleep(280);
      add();
      const sug = suggestedHeading();
      if (sug && scrollable) {
        // if suggested heading is visible, we reached the end of member list
        const r = sug.getBoundingClientRect();
        const sr = scrollable.getBoundingClientRect();
        if (r.top < sr.bottom) stable++;
      }
      if (Object.keys(seen).length === n0) stable++; else stable = 0;
      if (stable >= 5) break;
      if (scrollable && scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 4 && Object.keys(seen).length === n0) break;
    }
    if (scrollable) scrollable.scrollTop = 0;
    const all = Object.values(seen);
    const checked = all.filter(x => x.checked).map(x => x.name);
    const unchecked = all.filter(x => !x.checked).map(x => x.name);
    const eligibleUnchecked = all.filter(x => !x.checked && x.eligible).map(x => x.name);
    const skippedPending = all.filter(x => x.pending).map(x => x.name);
    const skipped = all.filter(x => !x.checked && !x.eligible).map(x => x.name);
    const postBtn = [...dialog.querySelectorAll('button,[role="button"]')].filter(b => /^postar$/i.test((b.innerText||b.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim())).map(b => ({
      text: (b.innerText||'').trim(),
      disabled: !!(b.disabled || b.getAttribute('aria-disabled')==='true')
    }));
    const participarN = [...dialog.querySelectorAll('button,[role="button"]')].filter(b => /participar do grupo/i.test((b.innerText||b.getAttribute('aria-label')||''))).length;
    return {
      ok: true,
      total: all.length,
      checked,
      unchecked,
      eligibleUnchecked,
      skipped,
      skippedPending,
      postBtn,
      participarN,
      sample: all.slice(0, 8).map(x => x.name)
    };
  })()`, true);
}

async function selectGroups(c, names, alreadyCount) {
  const capNew = 20;
  const take = names.slice(0, capNew);
  return await c.evaluate(`(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const fold = s => String(s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/\\s+/g,' ').trim().toLowerCase();
    const nameOf = el => {
      const text = String(el.innerText || el.getAttribute('aria-label') || '').replace(/\\s+/g,' ').trim();
      return text.replace(/\\s+\\d+[.,]?\\d*\\s*(mil\\s*)?membros.*$/i,'').trim();
    };
    const want = ${JSON.stringify(take)}.map(n => ({ raw:n, key: fold(n) }));
    const dialog = [...document.querySelectorAll('[role="dialog"]')].find(d => /anunciar em mais locais|anunciar nos seus grupos/i.test(d.innerText||''));
    if (!dialog) return { ok:false, reason:'no_dialog' };
    const suggestedHeading = () => {
      const all = [...dialog.querySelectorAll('*')];
      for (const el of all) {
        if (el.children.length > 4) continue;
        const t = String(el.textContent||'').replace(/\\s+/g,' ').trim();
        if (/^grupos sugeridos para voc[eê] participar$/i.test(t)) return el;
      }
      return null;
    };
    const memberBoxes = () => {
      const sug = suggestedHeading();
      return [...dialog.querySelectorAll('[role="checkbox"]')].filter(el => {
        if (/participar do grupo/i.test(el.innerText||'')) return false;
        if (sug && (el.compareDocumentPosition(sug) & Node.DOCUMENT_POSITION_PRECEDING)) return false;
        return true;
      });
    };
    const list = () => memberBoxes().map(el => ({
      el, name: nameOf(el), key: fold(nameOf(el)),
      checked: el.getAttribute('aria-checked') === 'true' || el.checked === true
    }));
    const first = memberBoxes()[0];
    let scrollable = null;
    let p = first && first.parentElement;
    while (p) {
      const st = getComputedStyle(p);
      if (p.scrollHeight > p.clientHeight + 30 && p.clientHeight > 80 && /(auto|scroll)/.test(st.overflowY+' '+st.overflow)) { scrollable = p; break; }
      p = p.parentElement;
    }
    const clicked = [];
    const missing = [];
    const already = [];
    for (const w of want) {
      let hits = list().filter(a => a.key === w.key || a.key.startsWith(w.key + ' ') || w.key.startsWith(a.key + ' '));
      if (!hits.length && scrollable) {
        scrollable.scrollTop = 0;
        await sleep(200);
        for (let i=0;i<20 && !hits.length;i++) {
          hits = list().filter(a => a.key === w.key || a.key.startsWith(w.key + ' ') || w.key.startsWith(a.key + ' '));
          if (hits.length) break;
          scrollable.scrollTop = Math.min(scrollable.scrollHeight, scrollable.scrollTop + Math.max(120, scrollable.clientHeight*0.7));
          await sleep(200);
        }
      }
      if (!hits.length) { missing.push(w.raw); continue; }
      const hit = hits.find(h => h.key === w.key) || hits[0];
      if (hit.checked) { already.push(hit.name); continue; }
      hit.el.scrollIntoView({block:'center'});
      await sleep(220);
      hit.el.click();
      clicked.push(hit.name);
      await sleep(350);
    }
    const after = list().filter(x => x.checked).map(x => x.name);
    return { ok:true, clicked, already, missing, checkedNow: after, checkedCount: after.length };
  })()`, true);
}

async function clickPostar(c) {
  return await c.evaluate(`(() => {
    const dialog = [...document.querySelectorAll('[role="dialog"]')].find(d => /anunciar em mais locais|anunciar nos seus grupos/i.test(d.innerText||''));
    if (!dialog) return { ok:false, reason:'no_dialog' };
    const buttons = [...dialog.querySelectorAll('button, [role="button"]')];
    const posts = buttons.filter(el => /^postar$/i.test(String(el.innerText||el.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim()));
    const enabled = posts.filter(el => !(el.disabled || el.getAttribute('aria-disabled')==='true'));
    const vis = enabled.filter(el => {
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return r.width>2 && r.height>2 && st.visibility!=='hidden' && st.display!=='none';
    });
    const el = vis[0] || enabled[0];
    if (!el) return { ok:false, reason:'no_enabled_postar', posts:posts.length };
    el.click();
    return { ok:true, clicked:'Postar', vis:vis.length };
  })()`);
}

async function extractLink(c, title) {
  return await c.evaluate(`(() => {
    const want = ${JSON.stringify(title)}.slice(0, 18).toLowerCase();
    const els = [...document.querySelectorAll('a,[role=button]')];
    for (const el of els) {
      const aria = (el.getAttribute('aria-label')||'').toLowerCase();
      const href = el.href || el.closest('a')?.href || '';
      const m = href.match(/target_id=(\\d+)/) || href.match(/item\\/(\\d+)/);
      if (m && (aria.includes(want) || /promover agora/i.test(aria))) {
        if (aria.includes(want) || href.includes('target_id')) {
          if (aria.includes(want)) return { id: m[1], href };
        }
      }
    }
    const hit = els.map(el => {
      const aria = (el.getAttribute('aria-label')||'');
      const href = el.href || el.closest('a')?.href || '';
      const m = href.match(/target_id=(\\d+)/) || href.match(/item\\/(\\d+)/);
      return { id: m && m[1], href, aria: aria.slice(0,160) };
    }).filter(x => x.id && x.aria.toLowerCase().includes(want));
    return hit[0] || null;
  })()`);
}

async function processAd(c, ad, profileN, accountResult) {
  const rec = {
    profile: profileN,
    title: ad.title,
    slug: ad.slug,
    id: ad.id,
    link: ad.id ? `https://www.facebook.com/marketplace/item/${ad.id}` : null,
    antes: [],
    depois: [],
    added: [],
    batches: [],
    skippedOffTopic: [],
    totalGruposConta: null,
    hora: nowBRT(),
    status: 'pending'
  };
  log({ phase: 'ad-start', slug: ad.slug, title: ad.title });
  await goSelling(c);
  await abortIfDanger(c, 'selling-'+ad.slug, { profile: profileN });

  const mais = await clickMaisOpcoes(c, ad.title);
  if (!mais.ok) {
    rec.status = 'not_found_on_selling';
    rec.mais = mais;
    log({ phase: 'mais-miss', slug: ad.slug, mais });
    try { await c.screenshot(`${PRINTS}\\grupos-p${profileN}-${ad.slug}-nao-achou.jpg`); } catch {}
    return rec;
  }
  await sleep(1500);
  const anunciar = await clickAnunciarMais(c);
  if (!anunciar.ok) {
    rec.status = 'menu_sem_anunciar_em_mais_locais';
    rec.menu = anunciar;
    log({ phase: 'menu-miss', slug: ad.slug, anunciar });
    try { await c.screenshot(`${PRINTS}\\grupos-p${profileN}-${ad.slug}-menu.jpg`); } catch {}
    await closeDialog(c);
    return rec;
  }
  await sleep(4000);
  await abortIfDanger(c, 'dialog-'+ad.slug, { profile: profileN });

  const coveredOrig = [];
  const covered = new Set();
  const addCovered = (name) => {
    const clean = stripMembers(name);
    const k = foldName(clean);
    if (!k || covered.has(k)) return;
    covered.add(k);
    coveredOrig.push(clean);
  };
  (Array.isArray(ad.alreadyAdded) ? ad.alreadyAdded : []).forEach(addCovered);
  if (covered.size) log({ phase: 'seed-covered', slug: ad.slug, n: covered.size, sample: coveredOrig.slice(0, 6) });
  let firstInventory = null;
  let batch = 0;
  while (batch < 15) {
    batch++;
    const inv = await inventoryGroups(c);
    if (!inv.ok) {
      rec.status = batch === 1 ? 'no_dialog' : 'dialog_gone';
      rec.invError = inv;
      log({ phase: 'inv-fail', slug: ad.slug, inv });
      try { await c.screenshot(`${PRINTS}\\grupos-p${profileN}-${ad.slug}-nodialog.jpg`); } catch {}
      break;
    }
    if (!firstInventory) {
      firstInventory = inv;
      rec.antes = inv.checked.slice();
      rec.totalGruposConta = inv.total;
      rec.skippedOffTopic = inv.skipped || [];
      (inv.checked || []).forEach(addCovered);
    }
    const remaining = (inv.eligibleUnchecked || []).filter(n => !covered.has(foldName(n)));
    log({ phase: 'inventory', slug: ad.slug, batch, total: inv.total, checked: inv.checked.length, remaining: remaining.length, seed: covered.size, skippedPending: (inv.skippedPending||[]).length, skipped: (inv.skipped||[]).length });

    if (batch === 1) {
      try { await c.screenshot(`${PRINTS}\\grupos-p${profileN}-${ad.slug}-antes.jpg`); } catch {}
      writeFileSync(`${OUT}\\dump-p${profileN}-${ad.slug}.json`, JSON.stringify({
        slug: ad.slug, hora: nowBRT(), total: inv.total, checked: inv.checked,
        eligibleUnchecked: inv.eligibleUnchecked, skipped: inv.skipped || [],
        seed: coveredOrig.slice(), remaining
      }, null, 2));
      if (typeof dumpOnly !== 'undefined' && dumpOnly) {
        rec.status = 'dump-only';
        rec.eligibleUnchecked = inv.eligibleUnchecked;
        rec.depois = coveredOrig.slice();
        log({ phase: 'dump-only', slug: ad.slug, remaining: remaining.length, total: inv.total });
        try { await c.screenshot(`${PRINTS}\\grupos-p${profileN}-${ad.slug}-dump.jpg`); } catch {}
        await closeDialog(c);
        break;
      }
    }

    if (!remaining.length) {
      rec.depois = coveredOrig.length ? coveredOrig.slice() : inv.checked.slice();
      rec.status = batch === 1 && !coveredOrig.length && inv.checked.length === inv.total ? 'ja_completo' : 'completo';
      try { await c.screenshot(`${PRINTS}\\grupos-p${profileN}-${ad.slug}-depois.jpg`); } catch {}
      await closeDialog(c);
      break;
    }

    const take = remaining.slice(0, 20);
    const sel = await selectGroups(c, take, inv.checked.length);
    rec.batches.push({ batch, wanted: take, sel });
    (sel.clicked || []).forEach(addCovered);
    rec.added.push(...(sel.clicked || []));
    log({ phase: 'selected', slug: ad.slug, batch, clicked: (sel.clicked||[]).length, names: sel.clicked, checkedCount: sel.checkedCount });
    try { await c.screenshot(`${PRINTS}\\grupos-p${profileN}-${ad.slug}-b${batch}.jpg`); } catch {}

    if (!(sel.clicked || []).length) {
      rec.status = 'nenhum_marcado';
      rec.depois = (sel.checkedNow || inv.checked).slice();
      await closeDialog(c);
      break;
    }

    const post = await clickPostar(c);
    rec.batches[rec.batches.length - 1].post = post;
    await sleep(3500);
    const danger = await abortIfDanger(c, 'depois-post-'+ad.slug, { profile: profileN });
    const toastShot = `${PRINTS}\\grupos-p${profileN}-${ad.slug}-post-b${batch}.jpg`;
    try { await c.screenshot(toastShot); } catch {}
    rec.batches[rec.batches.length - 1].toasts = danger.toasts;
    rec.depois = coveredOrig.slice();
    rec.hora = nowBRT();
    persistAd(accountResult, rec);

    if (!post.ok) {
      rec.status = 'postar_falhou';
      rec.depois = (sel.checkedNow || []).slice();
      await closeDialog(c);
      break;
    }

    // After posting, dialog usually closes. Reopen for another batch if needed.
    await sleep(2000);
    await closeDialog(c);
    await goSelling(c);
    await abortIfDanger(c, 'selling-again-'+ad.slug, { profile: profileN });

    // If remaining after this batch still exists, reopen
    const still = remaining.length - (sel.clicked || []).length;
    if (still <= 0) {
      rec.depois = coveredOrig.slice();
      rec.status = 'completo';
      break;
    }
    const mais2 = await clickMaisOpcoes(c, ad.title);
    if (!mais2.ok) { rec.status = 'reopen_fail'; rec.depois = coveredOrig.slice(); rec.reopenMais = mais2; break; }
    await sleep(2200);
    let anunciar2 = await clickAnunciarMais(c);
    if (!anunciar2.ok) {
      log({ phase:'reopen-menu-retry', slug: ad.slug, anunciar2 });
      try { await c.screenshot(`${PRINTS}\\grupos-p${profileN}-${ad.slug}-reopen-menu.jpg`); } catch {}
      await closeDialog(c);
      await sleep(800);
      const mais3 = await clickMaisOpcoes(c, ad.title);
      await sleep(2500);
      anunciar2 = await clickAnunciarMais(c);
      if (!anunciar2.ok) {
        rec.status = 'reopen_menu_fail';
        rec.depois = coveredOrig.slice();
        rec.reopenMenu = anunciar2;
        rec.reopenMais3 = mais3;
        try { await c.screenshot(`${PRINTS}\\grupos-p${profileN}-${ad.slug}-reopen-menu2.jpg`); } catch {}
        await closeDialog(c);
        break;
      }
    }
    await sleep(4000);
  }

  if (!rec.depois.length && firstInventory) rec.depois = coveredOrig.slice();
  if (!rec.link) {
    try {
      const lk = await extractLink(c, ad.title);
      if (lk?.id) {
        rec.id = lk.id;
        rec.link = `https://www.facebook.com/marketplace/item/${lk.id}`;
      }
    } catch {}
  }
  rec.hora = nowBRT();
  rec.addedThisRun = rec.added.slice();
  rec.added = coveredOrig.slice();
  if (!rec.depois.length) rec.depois = coveredOrig.slice();
  return rec;
}

async function processProfile(n) {
  const meta = PROFILES[n];
  if (!meta) throw new Error('unknown profile '+n);
  const ads = ADS.filter(a => {
    if (a.profile !== n) return false;
    if (SKIP_TITLE.test(a.title)) return false;
    if (onlySlugs) return onlySlugs.includes(a.slug);
    if (a.when === 'today') return true;
    if (includeR3 && a.when === 'r3') return true;
    if (includeR4 && a.when === 'r4') return true;
    if (includeR5 && a.when === 'r5') return true;
    if (includeR6 && a.when === 'r6') return true;
    if (includeR8 && a.when === 'r8') return true;
    if (includeOld && a.when === 'old') return true;
    return false;
  });
  try {
    const map = {};
    const mergePrev = (prev, label) => {
      for (const a of (prev.ads || [])) {
        const names = [...(a.added || []), ...(a.depois || []), ...(a.alreadyAdded || []), ...(a.eligiblePrefixSkip || [])];
        if (!names.length) continue;
        map[a.slug] = [...new Set([...(map[a.slug] || []), ...names])];
      }
      if (prev.seeds && typeof prev.seeds === 'object') {
        for (const [slug, names] of Object.entries(prev.seeds)) {
          if (Array.isArray(names)) map[slug] = [...new Set([...(map[slug] || []), ...names])];
        }
      }
      log({ phase: 'loaded-prev', n, label, slugs: Object.keys(map).map(s => `${s}:${(map[s]||[]).length}`) });
    };
    for (const fname of [`grupos-p${n}.json`, `grupos-p${n}-pause.json`, `grupos-seed-p${n}.json`]) {
      const prevPath = `${OUT}\\${fname}`;
      if (!existsSync(prevPath)) continue;
      try { mergePrev(JSON.parse(readFileSync(prevPath, 'utf8')), fname); }
      catch (e) { log({ phase: 'prev-fail', file: fname, err: String(e) }); }
    }
    for (const a of ads) if (map[a.slug]) a.alreadyAdded = [...new Set([...(a.alreadyAdded || []), ...map[a.slug]])];
  } catch (e) { log({ phase:'prev-fail', err: String(e) }); }
  const result = {
    profile: n,
    conta: meta.conta,
    port: meta.port,
    started: nowBRT(),
    ads: [],
    stop: null,
    mainPrint: `${PRINTS}\\grupos-p${n}.jpg`
  };
  log({ phase: 'profile-start', n, conta: meta.conta, ads: ads.map(a => a.slug) });

  let c;
  try {
    const tabId = await findFacebookTab(meta.port, meta.tab);
    result.tabId = tabId;
    if (tabId !== meta.tab) result.tabNote = `preferred tab missing, used ${tabId}`;
    c = await connectTab(meta.port, tabId);
    await c.send('Page.enable');
    await c.send('Runtime.enable');
    await goSelling(c);
    await abortIfDanger(c, 'open', { profile: n });
    try { await c.screenshot(`${PRINTS}\\grupos-p${n}-selling.jpg`); } catch {}

    for (const ad of ads) {
      const rec = await processAd(c, ad, n, result);
      const i = result.ads.findIndex(a => a.slug === rec.slug);
      if (i >= 0) result.ads[i] = rec; else result.ads.push(rec);
    }

    // one print per account: last selling page or last dialog after
    await goSelling(c);
    try { await c.screenshot(result.mainPrint); } catch (e) { result.shotError = String(e); }
    result.finished = nowBRT();
  } catch (e) {
    result.stop = {
      error: String(e && e.message || e),
      flags: e.flags || null,
      shot: e.shot || null,
      toasts: e.toasts || null,
      stop: !!e.stop
    };
    try { if (c) await c.screenshot(`${PRINTS}\\grupos-p${n}-ERROR.jpg`); } catch {}
    log({ phase: 'profile-stop', n, err: result.stop });
  } finally {
    if (c) c.close();
  }
  writeFileSync(`${OUT}\\grupos-p${n}.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ profile: n, stop: result.stop, ads: result.ads.map(a => ({ slug: a.slug, status: a.status, antes: (a.antes||[]).length, depois: (a.depois||[]).length, added: (a.added||[]).length, total: a.totalGruposConta, link: a.link })) }, null, 2));
  return result;
}

const args = process.argv.slice(2);
const includeOld = args.includes('--old');
const includeR3 = args.includes('--r3') || args.includes('--also-r3');
const includeR4 = args.includes('--r4') || args.includes('--also-r4');
const includeR5 = args.includes('--r5') || args.includes('--also-r5');
const includeR6 = args.includes('--r6') || args.includes('--also-r6');
const includeR8 = args.includes('--r8') || args.includes('--also-r8');
const dumpOnly = args.includes('--dump-only');
const onlyArg = args.find(a => a.startsWith('--only='));
const onlySlugs = onlyArg ? onlyArg.slice('--only='.length).split(',').filter(Boolean) : null;
const nums = args.filter(a => /^\d+$/.test(a)).map(Number);
if (!nums.length) {
  console.error('usage: node add-grupos.mjs <profile> [--old] [--r3] [--r4] [--r5] [--r6] [--r8] [--only=slug,slug] [--dump-only]');
  process.exit(2);
}
const r = await processProfile(nums[0]);
if (r.stop && r.stop.stop) process.exit(3);
