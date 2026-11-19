(() => {
  const want = window.__wantClick;
  if (!want) throw new Error('missing want click');
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const norm = s => clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const wantN = norm(want);
  const buttons = Array.from(document.querySelectorAll('button, [role="button"], a[role="button"]'));
  const matches = buttons.filter(el => {
    const t = norm(el.innerText);
    const a = norm(el.getAttribute('aria-label') || '');
    return t === wantN || a === wantN || t.startsWith(wantN + ' ') || a.startsWith(wantN + ' ');
  });
  if (!matches.length) {
    const sample = buttons.map(el => clean(el.innerText || el.getAttribute('aria-label') || '')).filter(Boolean).slice(0, 40);
    throw new Error('botao nao encontrado: ' + want + ' sample=' + sample.join(' || '));
  }
  const el = matches[0];
  const disabled = !!(el.disabled || el.getAttribute('aria-disabled') === 'true');
  if (disabled) throw new Error('botao desabilitado: ' + want);
  el.scrollIntoView({ block: 'center' });
  el.click();
  return JSON.stringify({ clicked: clean(el.innerText || el.getAttribute('aria-label')), tag: el.tagName });
})()
