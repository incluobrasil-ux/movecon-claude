import { writeFileSync } from 'fs';
import { listTabs, connectTab, sleep } from './cdp.mjs';

const PRINTS = 'C:\\Users\\Public\\prints-marketplace-1811';
const port = 56934, tab = '4ECFE63E6847803AEF48A025A3F56BA8';
const title = 'Fiat Fastback Turbo 200 2025 no parcelamento';

const c = await connectTab(port, tab);
try {
  await c.send('Page.enable'); await c.send('Runtime.enable');
  await c.navigate('https://www.facebook.com/marketplace/you/selling', 10000);
  await sleep(2500);
  const clicked = await c.evaluate(`(() => {
    const wantTitle = ${JSON.stringify(title)};
    const prefix = wantTitle.slice(0,24);
    const els = [...document.querySelectorAll('button,[role="button"]')];
    const el = els.find(e => {
      const a=(e.getAttribute('aria-label')||'')+' '+(e.innerText||'');
      return /mais op[cç][oõ]es/i.test(a) && (a.includes(wantTitle)||a.includes(prefix));
    });
    if(!el) return {ok:false};
    el.scrollIntoView({block:'center'}); el.click();
    return {ok:true, aria: el.getAttribute('aria-label')};
  })()`);
  console.log('mais', JSON.stringify(clicked));
  await sleep(1500);
  const anunciar = await c.evaluate(`(() => {
    const items=[...document.querySelectorAll('[role="menuitem"]')];
    const all=items.map(el=> (el.innerText||el.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim());
    const el=items.find(e=>/anunciar em mais locais|anunciar nos seus grupos/i.test((e.innerText||'')+(e.getAttribute('aria-label')||'')));
    if(el){ el.click(); return {ok:true, all}; }
    return {ok:false, all};
  })()`);
  console.log('anunciar', JSON.stringify(anunciar));
  await sleep(4000);
  const info = await c.evaluate(`(() => {
    const dialog=[...document.querySelectorAll('[role="dialog"]')].find(d=>/anunciar em mais locais|anunciar nos seus grupos/i.test(d.innerText||''));
    if(!dialog) return {ok:false, text:(document.body.innerText||'').slice(0,800)};
    const boxes=[...dialog.querySelectorAll('[role="checkbox"]')];
    const parents=[];
    let el=boxes[0]||dialog;
    while(el){
      const st=getComputedStyle(el);
      parents.push({
        tag: el.tagName,
        role: el.getAttribute('role'),
        aria: (el.getAttribute('aria-label')||'').slice(0,80),
        class: (el.className||'').toString().slice(0,80),
        overflowY: st.overflowY,
        overflow: st.overflow,
        scrollH: el.scrollHeight,
        clientH: el.clientHeight,
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        scrollTop: el.scrollTop
      });
      if(el===dialog) break;
      el=el.parentElement;
    }
    const buttons=[...dialog.querySelectorAll('button,[role="button"]')].map(b=>(b.innerText||b.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim()).filter(Boolean).slice(0,30);
    const head=(dialog.innerText||'').slice(0,1500);
    return {ok:true, boxCount: boxes.length, parents, buttons, head};
  })()`);
  writeFileSync('C:\\\\Users\\\\Public\\\\cdp-postador-1811\\\\out\\\\grupos-p1-dialog-inspect.json', JSON.stringify(info,null,2));
  console.log(JSON.stringify(info,null,2));
  await c.screenshot(PRINTS+'\\\\grupos-p1-inspect-dialog.jpg');
  // close
  await c.evaluate(`(() => {
    const d=[...document.querySelectorAll('[role="dialog"]')].find(x=>/anunciar em mais locais/i.test(x.innerText||''));
    const b=d && [...d.querySelectorAll('button,[role="button"]')].find(el=>/fechar|close/i.test((el.getAttribute('aria-label')||'')+(el.innerText||'')));
    if(b) b.click();
  })()`);
} finally { c.close(); }
