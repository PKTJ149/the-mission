// Paste into javascript_tool (read-only) on both tabs; then call __dump(selector?) — it returns one line
// per element of the subtree (document order): tag.class | x,y,w,h (page coords) | colour | background |
// font | border | radius | shadow | opacity | visibility | align | padding | margin | ::before.
// Save both results and compare them with tools/style-diff.py.
window.__dump = (selector = '#__nuxt', pad = 60000) => {
  const roots = [...document.querySelectorAll(selector)];
  const r1 = (v) => Math.round(v * 10) / 10;
  const lines = [];
  const line = (el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const b = getComputedStyle(el, '::before');
    const border = ['Top', 'Right', 'Bottom', 'Left'].map((k) => cs[`border${k}Width`] === '0px' ? '0'
      : `${cs[`border${k}Width`]} ${cs[`border${k}Style`]} ${cs[`border${k}Color`]}`).join(',');
    lines.push([
      el.tagName.toLowerCase() + (el.classList.length ? '.' + [...el.classList].slice(0, 4).join('.') : ''),
      [r.x + scrollX, r.y + scrollY, r.width, r.height].map(r1).join(','),
      cs.color, cs.backgroundColor + (cs.backgroundImage !== 'none' ? ' ' + cs.backgroundImage.slice(0, 60) : ''),
      `${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight} ${cs.fontFamily.split(',')[0]}`,
      border, cs.borderRadius, cs.boxShadow, cs.opacity, cs.visibility, cs.textAlign, cs.padding, cs.margin,
      b.content && b.content !== 'none' && b.content !== 'normal' ? b.content : '',
    ].join(' | '));
  };
  for (const root of roots) { line(root); root.querySelectorAll('*').forEach(line); }
  return { count: lines.length, scroll: [scrollX, scrollY], size: [innerWidth, innerHeight], pad: 'x'.repeat(pad), dump: lines.join('\n') };
};
'dump ready';
