// Paste into javascript_tool on BOTH tabs (staging + local) after every navigation.
// Read-only helpers: nothing here clicks, submits or changes the page.
//   __at([[x,y],...])      -> top 2 elements at viewport points, with key computed styles
//   __sub(selectorOrEl, n) -> one line per visible descendant (max n, default 60):
//                             relPath | x,y,w,h relative to root | text | colour bg | font | border | radius | ::before
//   __fp(el)               -> full key-style object for one element
(() => {
  const PICK = ['color', 'background-color', 'background-image', 'font-family', 'font-size', 'font-weight',
    'line-height', 'letter-spacing', 'text-align', 'text-transform', 'border-top', 'border-right', 'border-bottom',
    'border-left', 'border-radius', 'padding', 'margin', 'box-shadow', 'opacity', 'display', 'gap', 'width', 'height'];
  const r1 = (v) => Math.round(v * 10) / 10;
  const own = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent)
    .join('').replace(/\s+/g, ' ').trim().slice(0, 60);
  const name = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') +
    (el.classList.length ? '.' + [...el.classList].join('.') : '');
  const before = (el) => {
    const b = getComputedStyle(el, '::before');
    return b.content && b.content !== 'none' && b.content !== 'normal'
      ? `${b.content} ${b.fontFamily.split(',')[0]} ${b.color}` : '';
  };
  window.__fp = (el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const s = {};
    for (const p of PICK) {
      let v = cs.getPropertyValue(p);
      if (p === 'background-image' && v.length > 90) v = v.slice(0, 90) + '…';
      if (p === 'font-family') v = v.split(',')[0];
      s[p] = v;
    }
    const bf = before(el);
    if (bf) s['::before'] = bf;
    const out = { el: name(el), rect: [r.x, r.y, r.width, r.height].map(r1), text: own(el), s };
    const src = el.currentSrc || el.getAttribute('src');
    if (src) out.src = src.split('?')[0].slice(-80);
    if ('value' in el && el.value !== undefined && el.tagName !== 'BUTTON' && el.tagName !== 'LI') out.value = String(el.value).slice(0, 60);
    if (el.placeholder) out.placeholder = el.placeholder;
    return out;
  };
  window.__path = (el, stop = document.body) => {
    const p = [];
    while (el && el !== stop) {
      let i = 1;
      let s = el;
      while ((s = s.previousElementSibling)) if (s.tagName === el.tagName) i++;
      p.unshift(el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + ':' + i);
      el = el.parentElement;
    }
    return p.join('>');
  };
  window.__at = (pts) => pts.map(([x, y]) => ({
    pt: [x, y],
    hits: document.elementsFromPoint(x, y)
      .filter((e) => e !== document.documentElement && e !== document.body).slice(0, 2)
      .map((e) => ({ path: __path(e), ...__fp(e) })),
  }));
  window.__sub = (root, n = 60) => {
    if (typeof root === 'string') root = document.querySelector(root);
    if (!root) return 'not found';
    const R = root.getBoundingClientRect();
    const lines = [];
    const walk = (el) => {
      if (lines.length >= n) return;
      const r = el.getBoundingClientRect();
      if (!el.getClientRects().length) return; // display:none subtree
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden') return;
      const font = `${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight} ${cs.fontFamily.split(',')[0]}`;
      const border = ['Top', 'Right', 'Bottom', 'Left'].map((k) => cs[`border${k}Width`] === '0px' ? '0'
        : `${cs[`border${k}Width`]} ${cs[`border${k}Color`]}`).join(',');
      lines.push([__path(el, root.parentElement), [r.x - R.x, r.y - R.y, r.width, r.height].map(r1).join(','),
        JSON.stringify(own(el)), cs.color, cs.backgroundColor, font, border, cs.borderRadius, before(el),
        (el.currentSrc || el.getAttribute('src') || '').split('?')[0].slice(-50)].join(' | '));
      for (const c of el.children) walk(c);
    };
    walk(root);
    return lines.join('\n');
  };
  return 'inspect helpers ready';
})();
