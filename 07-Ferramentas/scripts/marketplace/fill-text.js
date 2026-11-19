(() => {
  const data = window.__listingData;
  if (!data) throw new Error('missing listing data');
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const norm = s => clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function label(textNorm) {
    return Array.from(document.querySelectorAll('label')).find(l => {
      const n = norm(l.innerText);
      return n === textNorm || n.startsWith(textNorm);
    });
  }
  function setNative(el, value) {
    el.scrollIntoView({ block: 'center' });
    el.focus();
    el.click();
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    setter.call(el, value);
    el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: value }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return el.value;
  }
  const titleLabel = label('titulo');
  if (!titleLabel) {
    const all = Array.from(document.querySelectorAll('label')).map(l => clean(l.innerText)).filter(Boolean);
    throw new Error('titulo nao encontrado; labels=' + all.join(' | '));
  }
  const titleInput = titleLabel.querySelector('input, textarea');
  if (!titleInput) throw new Error('input de titulo nao encontrado');
  const titleSet = setNative(titleInput, data.titulo);

  const priceLabel = label('preco');
  if (!priceLabel) throw new Error('preco nao encontrado');
  const priceInput = priceLabel.querySelector('input, textarea');
  if (!priceInput) throw new Error('input de preco nao encontrado');
  const priceSet = setNative(priceInput, data.preco);

  let moreClicked = false;
  const more = Array.from(document.querySelectorAll('button, [role="button"]')).find(el => /Mais detalhes/i.test(el.innerText || ''));
  if (more) { more.click(); moreClicked = true; }

  titleInput.blur();
  priceInput.blur();

  return JSON.stringify({
    titleSet,
    priceSet,
    moreClicked,
    titleNow: titleInput.value,
    priceNow: priceInput.value
  });
})()
