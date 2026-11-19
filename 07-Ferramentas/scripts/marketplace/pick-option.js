(() => {
  const want = window.__wantOption;
  if (!want) throw new Error('missing want option');
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const norm = s => clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const dialog = document.querySelector('[role="dialog"]') || document.body;
  const nodes = Array.from(dialog.querySelectorAll('*'));
  const exact = nodes.filter(el => norm(el.innerText) === norm(want));
  exact.sort((a, b) => {
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    return (ra.width * ra.height) - (rb.width * rb.height);
  });
  if (!exact.length) {
    const sample = nodes.map(el => clean(el.innerText)).filter(t => t && t.length < 80).slice(0, 40);
    throw new Error('opcao nao encontrada: ' + want + ' sample=' + sample.join(' || '));
  }
  const el = exact[0];
  el.scrollIntoView({ block: 'center' });
  el.click();
  return JSON.stringify({ clicked: clean(el.innerText), tag: el.tagName });
})()
