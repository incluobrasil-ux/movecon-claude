import { writeFileSync } from 'fs';
import { connectTab, listTabs, sleep, PAGE_STATE_JS } from './cdp.mjs';

const PRINTS = 'C:\\Users\\Public\\prints-marketplace-1811';
const port = 62275;
const preferred = '85324F95CDC9D2027820552EEAD663FC';

const tabs = await listTabs(port);
const fb = tabs.filter(t => /^https:\/\/(www\.)?facebook\.com\//i.test(t.url||''));
const tabId = fb.some(t => t.id===preferred) ? preferred : (fb.find(t=>/marketplace/i.test(t.url||''))||fb[0])?.id;
if (!tabId) { console.log(JSON.stringify({error:'no fb tab'})); process.exit(1); }

const c = await connectTab(port, tabId);
try {
  await c.send('Page.enable'); await c.send('Runtime.enable');
  const st = await c.evaluate(PAGE_STATE_JS);
  const info = await c.evaluate(`(() => {
    const dialog = [...document.querySelectorAll('[role="dialog"]')].find(d => /anunciar em mais locais|anunciar nos seus grupos/i.test(d.innerText||''));
    const menu = [...document.querySelectorAll('[role="menu"]')].map(m => (m.innerText||'').replace(/\\s+/g,' ').trim().slice(0,200));
    if (!dialog) return { dialog:false, url:location.href, menu, textHead: (document.body.innerText||'').slice(0,400) };
    const boxes = [...dialog.querySelectorAll('[role="checkbox"]')];
    const checked = boxes.filter(b => b.getAttribute('aria-checked')==='true' || b.checked===true).length;
    const posts = [...dialog.querySelectorAll('button,[role="button"]')].filter(el => /^postar$/i.test(String(el.innerText||el.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim()));
    const postEnabled = posts.some(el => !(el.disabled || el.getAttribute('aria-disabled')==='true'));
    const head = (dialog.innerText||'').slice(0,500);
    return { dialog:true, checked, totalBoxes: boxes.length, postEnabled, posts: posts.length, head, url:location.href };
  })()`);
  await c.screenshot(`${PRINTS}\\grupos-p9-pause-inspect.jpg`);
  console.log(JSON.stringify({ tabId, flags: st.flags, info }, null, 2));
  writeFileSync('C:\\Users\\Public\\cdp-postador-1811\\out\\grupos-p9-pause-inspect.json', JSON.stringify({tabId, flags:st.flags, info}, null, 2));

  let action = 'none';
  if (info.dialog && info.checked > 0 && info.postEnabled) {
    const post = await c.evaluate(`(() => {
      const dialog = [...document.querySelectorAll('[role="dialog"]')].find(d => /anunciar em mais locais|anunciar nos seus grupos/i.test(d.innerText||''));
      if (!dialog) return {ok:false, reason:'no_dialog'};
      const el = [...dialog.querySelectorAll('button,[role="button"]')].find(e => /^postar$/i.test(String(e.innerText||e.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim()) && !(e.disabled||e.getAttribute('aria-disabled')==='true'));
      if (!el) return {ok:false, reason:'no_postar'};
      el.click();
      return {ok:true};
    })()`);
    action = 'posted-mid-batch';
    console.log('POST', JSON.stringify(post));
    await sleep(4000);
    await c.screenshot(`${PRINTS}\\grupos-p9-pause-after-post.jpg`);
  } else if (info.dialog) {
    const closed = await c.evaluate(`(() => {
      const dialog = [...document.querySelectorAll('[role="dialog"]')].find(d => /anunciar em mais locais|anunciar nos seus grupos/i.test(d.innerText||''));
      if (!dialog) return 'no_dialog';
      const b = [...dialog.querySelectorAll('button,[role="button"]')].find(el => /fechar|close|cancelar/i.test((el.getAttribute('aria-label')||'')+(el.innerText||'')));
      if (b && !/^postar$/i.test((b.innerText||'').trim())) { b.click(); return 'clicked:'+(b.getAttribute('aria-label')||b.innerText||''); }
      return 'no_close_btn';
    })()`);
    action = 'closed-dialog:'+closed;
    if (closed === 'no_close_btn') {
      try {
        await c.send('Input.dispatchKeyEvent', { type:'keyDown', key:'Escape', windowsVirtualKeyCode:27, nativeVirtualKeyCode:27 });
        await c.send('Input.dispatchKeyEvent', { type:'keyUp', key:'Escape', windowsVirtualKeyCode:27, nativeVirtualKeyCode:27 });
        action += '+escape';
      } catch {}
    }
    await sleep(1000);
    await c.screenshot(`${PRINTS}\\grupos-p9-pause-after-close.jpg`);
  } else if ((info.menu||[]).length) {
    try {
      await c.send('Input.dispatchKeyEvent', { type:'keyDown', key:'Escape', windowsVirtualKeyCode:27, nativeVirtualKeyCode:27 });
      await c.send('Input.dispatchKeyEvent', { type:'keyUp', key:'Escape', windowsVirtualKeyCode:27, nativeVirtualKeyCode:27 });
    } catch {}
    action = 'escape-menu';
    await sleep(800);
  }

  const after = await c.evaluate(`(() => {
    const dialog = [...document.querySelectorAll('[role="dialog"]')].some(d => /anunciar em mais locais|anunciar nos seus grupos/i.test(d.innerText||''));
    const toasts = [...document.querySelectorAll('[role="alert"], [role="status"], div[aria-live]')]
      .map(el => (el.innerText||'').replace(/\\s+/g,' ').trim()).filter(Boolean).slice(0,8);
    return { url: location.href, dialogOpen: dialog, toasts };
  })()`);
  if (!after.dialogOpen && !(after.url||'').includes('marketplace/you/selling')) {
    await c.navigate('https://www.facebook.com/marketplace/you/selling', 8000);
    await sleep(2000);
  }
  await c.screenshot(`${PRINTS}\\grupos-p9-pause-final.jpg`);
  const finalUrl = await c.evaluate('location.href');
  const stillDialog = await c.evaluate(`([...document.querySelectorAll('[role="dialog"]')].some(d => /anunciar em mais locais|anunciar nos seus grupos/i.test(d.innerText||'')))`);
  console.log(JSON.stringify({ action, after, finalUrl, stillDialog }));
} finally { c.close(); }
