
(function () {
  'use strict';

  var DEFAULT_BG = '#15140F';   
  var DEFAULT_INK = '#EDE8DD'; 

 
  var CSS = [
    '.ph-bg{position:fixed;inset:0;z-index:0;}',
    '.ph-scroller{position:fixed;inset:0;z-index:1;overflow-x:hidden;overflow-y:auto;scroll-snap-type:y mandatory;overscroll-behavior:contain;scrollbar-width:none;-webkit-overflow-scrolling:touch;cursor:pointer;}',
    '.ph-scroller::-webkit-scrollbar{display:none;}',
    '.ph-scroller:focus{outline:none;}',
    '.ph-sec{position:relative;height:100vh;height:100dvh;scroll-snap-align:start;scroll-snap-stop:always;box-sizing:border-box;display:flex;',
    'padding:clamp(76px,11vh,110px) clamp(20px,5vw,64px) clamp(84px,12vh,112px);}',
    '.ph-fig{flex:1 1 auto;min-width:0;min-height:0;display:flex;align-items:center;justify-content:center;}',
    '.ph-img{display:block;width:100%;height:100%;object-fit:contain;}',
    '.ph-cap{position:absolute;left:clamp(20px,5vw,64px);bottom:clamp(24px,4.5vh,40px);display:flex;align-items:baseline;gap:6px 22px;flex-wrap:wrap;max-width:calc(100% - 2 * clamp(20px,5vw,64px) - 80px);}',
    '.ph-title{font-size:15px;font-weight:500;letter-spacing:.005em;line-height:1.2;white-space:nowrap;}',
    '.ph-view{background:none;border:none;padding:6px 0;margin:0;font:inherit;font-size:12px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:inherit;cursor:pointer;white-space:nowrap;border-bottom:1px solid transparent;}',
    '.ph-view:hover,.ph-view:focus-visible{border-bottom-color:currentColor;outline:none;}',
    '.ph-view:focus-visible{outline:2px solid currentColor;outline-offset:3px;}',
   
    '.ph-track{position:fixed;z-index:3;top:50%;transform:translateY(-50%);right:calc(clamp(20px,5vw,64px) / 2 - 1.5px);width:3px;height:min(240px,38vh);pointer-events:none;}',
    '.ph-track::before{content:"";position:absolute;top:0;bottom:0;left:1px;width:1px;background:currentColor;opacity:.35;}',
    '.ph-thumb{position:absolute;left:0;width:3px;background:currentColor;}',
    '.ph-hint{position:absolute;left:50%;bottom:clamp(24px,4.5vh,40px);transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;pointer-events:none;}',
    '.ph-hint i{font-style:normal;font-size:14px;line-height:1;animation:ph-bob 1.8s ease-in-out infinite;}',
    '@keyframes ph-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}',
    '@media (max-width:699px){',
    '.ph-hint{left:auto;right:clamp(20px,5vw,64px);transform:none;}',
    '.ph-cap{flex-direction:column;gap:0;align-items:flex-start;}',
    '}',
    '@media (prefers-reduced-motion:reduce){.ph-hint i{animation:none;}}'
  ].join('');

  function injectStyle() {
    if (document.getElementById('ph-style')) return;
    var st = document.createElement('style');
    st.id = 'ph-style';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function el(tag, cls, attrs) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (attrs) for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    return e;
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

 
  function create(host, opts) {
    opts = opts || {};
    var series = (opts.series || []).map(function (s, i) {
      return { id: s.id, name: s.name || s.id, year: s.year || '', url: s.heroUrl };
    });
    var N = series.length;
    injectStyle();

    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var reduce = !!(mq && mq.matches);
    var onMq = function () { reduce = !!(mq && mq.matches); update(); };
    if (mq) { if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq); }

    var root = el('div', 'ph-root');
    root.style.color = opts.ink || DEFAULT_INK;
    var bg = el('div', 'ph-bg', { 'aria-hidden': 'true' });
    bg.style.backgroundColor = opts.bg || DEFAULT_BG;
    var scroller = el('div', 'ph-scroller', { tabindex: '-1', role: 'region', 'aria-label': 'Photo series' });
    series.forEach(function (s, i) {
      var sec = el('section', 'ph-sec', { id: s.id, 'aria-label': s.name + (s.year ? ' ' + s.year : '') });
      sec.setAttribute('data-index', String(i));
      var fig = el('div', 'ph-fig');
      var img = el('img', 'ph-img', { alt: s.name + (s.year ? ' ' + s.year : ''), decoding: 'async', draggable: 'false' });
      if (i === 0) { img.setAttribute('loading', 'eager'); img.setAttribute('fetchpriority', 'high'); }
      else img.setAttribute('loading', 'lazy');
      img.onerror = function () {
        try { console.warn('[포트폴리오] 홈 대표 이미지를 불러오지 못했습니다: ' + s.url + '  → hero/cover 파일 이름과 위치를 확인하세요.'); } catch (e) {}
        img.style.visibility = 'hidden';
      };
      img.src = s.url;
      fig.appendChild(img);
      var cap = el('div', 'ph-cap');
      var title = el('span', 'ph-title');
      title.textContent = s.name + (s.year ? ' ' + s.year : '');
      var view = el('button', 'ph-view', { type: 'button', 'aria-label': s.name + (s.year ? ' ' + s.year : '') + ' — View series' });
      view.textContent = 'View series →';
      cap.appendChild(title); cap.appendChild(view);
      sec.appendChild(fig); sec.appendChild(cap);
      if (i === 0 && N > 1) {
        var hint = el('div', 'ph-hint', { 'aria-hidden': 'true' });
        hint.innerHTML = '<span>Scroll</span><i>↓</i>';
        sec.appendChild(hint);
      }
      scroller.appendChild(sec);
    });

    var track = el('div', 'ph-track', { 'aria-hidden': 'true' });
    var thumb = el('div', 'ph-thumb');
    thumb.style.height = (N ? 100 / N : 100) + '%';
    track.appendChild(thumb);
    root.appendChild(bg); root.appendChild(scroller); if (N > 1) root.appendChild(track);
    host.appendChild(root);

    var prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    
    var active = -1, raf = 0, lastNav = 0, navTarget = 0, destroyed = false;
    var lastHash = '';

    function secH() { var s = scroller.firstChild; return (s && s.offsetHeight) || scroller.clientHeight || 1; }

    function update() {
      raf = 0;
      if (destroyed || !N) return;
      var p = clamp(scroller.scrollTop / secH(), 0, Math.max(0, N - 1));
      var idx = Math.round(p);
      if (N) thumb.style.top = (p / N * 100) + '%';
      if (idx !== active) {
        active = idx;
        writeHash(series[idx].id);
      }
    }

    function writeHash(id) {
      if (id === lastHash) return;
      var first = lastHash === '';
      lastHash = id;
      if (first && !opts.startId) return;     
      try { history.replaceState(history.state, '', '#' + id); } catch (e) {}
    }

    function schedule() { if (!raf) raf = requestAnimationFrame(update); }

    function goTo(i, smooth) {
      if (!N) return;
      i = clamp(i, 0, N - 1);
      var top = i * secH();
      lastNav = Date.now(); navTarget = i;
      if (smooth && !reduce && scroller.scrollTo) {
        try { scroller.scrollTo({ top: top, behavior: 'smooth' }); return; } catch (e) {}
      }
      scroller.scrollTop = top;
      schedule();
    }
    function current() { return Date.now() - lastNav < 700 ? navTarget : Math.round(scroller.scrollTop / secH()); }

   
    scroller.addEventListener('scroll', schedule, { passive: true });

    scroller.addEventListener('click', function (e) {
      var sec = e.target.closest ? e.target.closest('.ph-sec') : null;
      if (!sec) return;
      var s = series[parseInt(sec.getAttribute('data-index'), 10)];
      if (s && opts.onOpen) opts.onOpen(s.id);
    });

    function onKey(e) {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      var t = e.target, tag = (t && t.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag) || (t && t.isContentEditable)) return;
      var key = e.key, delta = 0, abs = null;
      if (key === 'ArrowDown' || key === 'PageDown') delta = 1;
      else if (key === 'ArrowUp' || key === 'PageUp') delta = -1;
      else if (key === ' ' || key === 'Spacebar') {
        if (/^(BUTTON|A)$/.test(tag)) return;   
        delta = e.shiftKey ? -1 : 1;
      } else if (key === 'Home') abs = 0;
      else if (key === 'End') abs = N - 1;
      else return;
      e.preventDefault();
      goTo(abs !== null ? abs : current() + delta, true);
    }
    window.addEventListener('keydown', onKey);

    function indexOfHash() {
      var h = '';
      try { h = decodeURIComponent((location.hash || '').replace(/^#/, '')); } catch (e) {}
      for (var i = 0; i < N; i++) if (series[i].id === h) return i;
      return -1;
    }
    function onHash() { var i = indexOfHash(); if (i >= 0 && i !== active) goTo(i, true); }
    window.addEventListener('hashchange', onHash);

    var ro = null;
    function onResize() {
      var keep = active >= 0 ? active : 0;
      if (Date.now() - lastNav > 700) scroller.scrollTop = keep * secH();
      update();
    }
    if (window.ResizeObserver) { ro = new ResizeObserver(onResize); ro.observe(scroller); }
    else window.addEventListener('resize', onResize);

   
    var start = -1;
    for (var k = 0; k < N; k++) if (series[k].id === opts.startId) start = k;
    var fromHash = indexOfHash();
    if (fromHash >= 0) start = fromHash;
    if (start < 0) start = 0;
    scroller.scrollTop = start * secH();
    update();
    try { scroller.focus({ preventScroll: true }); } catch (e) {}

    return {
      goTo: goTo,
      index: function () { return active; },
      destroy: function () {
        destroyed = true;
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('hashchange', onHash);
        window.removeEventListener('resize', onResize);
        if (ro) ro.disconnect();
        if (mq) { if (mq.removeEventListener) mq.removeEventListener('change', onMq); else if (mq.removeListener) mq.removeListener(onMq); }
        document.documentElement.style.overflow = prevOverflow;
        if (root.parentNode) root.parentNode.removeChild(root);
      }
    };
  }

  window.PortfolioHome = { create: create };
})();
