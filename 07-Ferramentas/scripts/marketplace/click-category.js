(() => {
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const norm = s => clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const lab = Array.from(document.querySelectorAll('label')).find(l => norm(l.innerText) === 'categoria' || norm(l.innerText).startsWith('categoria'));
  if (!lab) throw new Error('categoria nao encontrada');
  lab.scrollIntoView({ block: 'center' });
  lab.click();
  const combo = lab.matches('[role="combobox"]') ? lab : lab.querySelector('[role="combobox"]') || lab;
  if (combo && typeof combo.click === 'function') combo.click();
  return 'clicked';
})()
