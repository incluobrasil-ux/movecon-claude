(() => {
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const dialog = document.querySelector('[role="dialog"]');
  if (!dialog) throw new Error('dialog da categoria nao encontrado');
  const nodes = Array.from(dialog.querySelectorAll('*'));
  const exact = nodes.filter(el => clean(el.innerText) === 'Diversos');
  exact.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
  if (!exact.length) {
    const sample = nodes.map(el => clean(el.innerText)).filter(t => /diversos/i.test(t)).slice(0, 10);
    throw new Error('Diversos nao encontrado. sample=' + sample.join(' || '));
  }
  const el = exact[0];
  el.scrollIntoView({ block: 'center' });
  el.click();
  const r = el.getBoundingClientRect();
  return JSON.stringify({ clicked: clean(el.innerText), tag: el.tagName, className: String(el.className).slice(0, 80), x: r.x, y: r.y });
})()
