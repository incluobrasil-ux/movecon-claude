(() => {
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const norm = s => clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const input = Array.from(document.querySelectorAll('input')).find(el => /localiza/i.test(el.getAttribute('aria-label') || ''))
    || (Array.from(document.querySelectorAll('label')).find(l => norm(l.innerText).startsWith('localizacao')) || {}).querySelector?.('input');
  if (!input) throw new Error('campo Localizacao nao encontrado');
  input.scrollIntoView({ block: 'center' });
  input.click();
  input.focus();
  if (typeof input.select === 'function') input.select();
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(input, '');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a', ctrlKey: true }));
  return JSON.stringify({
    focused: document.activeElement === input,
    value: input.value,
    aria: input.getAttribute('aria-label') || '',
    expanded: input.getAttribute('aria-expanded')
  });
})()
