/* ==========================================================================
   시리즈 화면 + 사진 상세 화면
   --------------------------------------------------------------------------
   · 시리즈 화면: 사진을 열(column)로 배치, lazy 로딩 + 페이드인(깜박임 방지),
                  휠 스크롤 부드럽게(관성), 화면에 들어올 때 살짝 떠오르는 등장 효과
   · 사진 상세: 좌우 화살표 / ← → 키 / 터치 스와이프로 이전·다음 사진, 촬영 정보 표시
   · 이 파일은 app.js 가 불러 쓰며, 보통 수정할 필요가 없습니다.
   ========================================================================== */
(function () {
  'use strict';

  var MUTED = '#9B968B';
  var SEP = '#C9C4B8';
  var PLACEHOLDER = '#1C1B16';   // 사진이 뜨기 전 자리 색 (어두운 테마에 맞춤)

  /* ---------- 공통 ---------- */
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return !!(mqReduce && mqReduce.matches); }

  // 사진 가로세로 비율을 기억해 두면 다음 방문부터 자리를 정확히 잡아 화면이 밀리지 않습니다.
  var ratios = {};
  try { ratios = JSON.parse(localStorage.getItem('rs_ratios') || '{}') || {}; } catch (e) { ratios = {}; }
  var saveTimer = 0;
  function rememberRatio(url, r) {
    if (ratios[url] === r) return;
    ratios[url] = r;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { try { localStorage.setItem('rs_ratios', JSON.stringify(ratios)); } catch (e) {} }, 400);
  }

  function el(tag, cls, attrs) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (attrs) for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    return e;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function titleOf(s) { return s.name + (s.year ? ' ' + s.year : ''); }

  var CSS = [
    // 시리즈 이름(경로)은 헤더 로고처럼 스크롤해도 제자리에 머뭅니다 (sticky). 글자 밑의 사진을 누를 수 있도록 글자 영역만 클릭을 받습니다.
    '.pv-title{position:sticky;top:var(--pa-top,100px);z-index:5;width:max-content;max-width:100%;pointer-events:none;display:flex;align-items:baseline;gap:12px;margin-bottom:clamp(26px,3.2vw,44px);font-size:clamp(20px,2.6vw,28px);font-weight:600;letter-spacing:-0.01em;line-height:1;flex-wrap:wrap;}',
    '.pv-title .pv-name{white-space:nowrap;}',
    '.pv-crumb{pointer-events:auto;background:none;border:none;padding:10px 12px;margin:-10px -12px;cursor:pointer;font-family:inherit;font-size:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;color:' + MUTED + ';white-space:nowrap;}',
    '.pv-crumb:hover,.pv-crumb:focus-visible{color:inherit;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:7px;}',
    '.pv-crumb:focus-visible,.pv-arrow:focus-visible,.pv-tile:focus-visible{outline:2px solid currentColor;outline-offset:3px;}',
    '.pv-sep{color:' + SEP + ';font-weight:400;}',
    /* 시리즈: 열 배치 */
    '.pv-grid{display:flex;align-items:flex-start;gap:0 var(--pv-gap);}',
    '.pv-col{flex:1 1 0;min-width:0;}',
    '.pv-tile{position:relative;display:block;margin:0 0 var(--pv-gap);background:' + PLACEHOLDER + ';cursor:pointer;color:inherit;overflow:hidden;opacity:0;transform:translateY(22px);}',
    '.pv-tile.pv-in{opacity:1;transform:none;transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1);}',
    '.pv-tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;opacity:0;transition:opacity .5s ease;}',
    '.pv-tile img.pv-ok{opacity:1;}',
    '.pv-tile.pv-bad{display:none;}',
    '.pv-reduce .pv-tile{opacity:1;transform:none;transition:none;}',
    '.pv-reduce .pv-tile img{transition:none;}',
    /* 사진 상세 */
    '.pv-wrap{display:flex;gap:clamp(24px,4vw,60px);align-items:flex-start;flex-wrap:wrap;}',
    '.pv-stage{position:relative;flex:1 1 440px;min-width:0;display:flex;justify-content:center;touch-action:pan-y;}',
    '.pv-imgbox{display:flex;justify-content:center;align-items:center;min-width:0;max-width:100%;}',
    '.pv-img{display:block;max-width:100%;max-height:min(74vh,780px);width:auto;height:auto;transition:opacity .22s ease;}',
    '.pv-img.pv-fade{opacity:0;}',
    '.pv-reduce .pv-img{transition:none;}',
    '.pv-side{flex:0 0 clamp(220px,26vw,300px);width:100%;max-width:340px;display:flex;flex-direction:column;}',
    '.pv-meta{min-height:352px;}',
    /* 좌우 버튼 + 진행 위치: 사진 크기와 상관없이 항상 같은 자리 */
    '.pv-nav{margin-top:26px;}',
    '.pv-navbtns{display:flex;justify-content:space-between;align-items:center;}',
    '.pv-arrow{width:44px;height:44px;border:none;background:none;color:inherit;display:flex;align-items:center;padding:0;margin:0;cursor:pointer;opacity:.9;transition:opacity .2s ease;}',
    '.pv-prev{justify-content:flex-start;}',
    '.pv-next{justify-content:flex-end;}',
    '.pv-arrow:hover{opacity:1;}',
    '.pv-arrow svg{display:block;width:26px;height:26px;}',
    '.pv-arrow[aria-disabled="true"]{opacity:.2;cursor:default;pointer-events:none;}',
    '.pv-track{position:relative;height:3px;}',
    '.pv-track::before{content:"";position:absolute;left:0;right:0;top:1px;height:1px;background:rgba(237,232,221,.35);}',
    '.pv-thumb{position:absolute;top:0;height:3px;background:currentColor;transition:left .3s ease,width .3s ease;}',
    '.pv-reduce .pv-thumb{transition:none;}',
    '.pv-meta-k{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:' + MUTED + ';padding-bottom:6px;}',
    '.pv-meta-t{font-size:17px;font-weight:600;letter-spacing:-0.01em;padding-bottom:18px;}',
    '.pv-row{display:flex;align-items:baseline;justify-content:space-between;gap:20px;min-height:41px;padding:11px 0;border-top:1px solid rgba(140,135,125,0.28);}',
    '.pv-row span:first-child{font-size:13px;color:' + MUTED + ';letter-spacing:.03em;min-width:0;}',
    '.pv-row span:last-child{font-size:14px;font-weight:500;text-align:right;white-space:nowrap;flex-shrink:0;}',
    '.pv-none{font-size:13px;color:' + MUTED + ';line-height:1.65;border-top:1px solid rgba(140,135,125,0.28);padding-top:14px;}',
    '.pv-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;}',
    '@media (max-width:699px){',
    '.pv-stage{flex:1 1 100%;height:min(66vh,calc((100vw - 2 * clamp(20px,5vw,64px)) * 1.25));}',
    '.pv-imgbox{height:100%;}',
    '.pv-img{max-height:100%;}',
    '.pv-side{flex:1 1 100%;max-width:none;flex-direction:row;align-items:flex-start;gap:20px;}',
    '.pv-meta{flex:1 1 0;min-width:0;min-height:0;}',
    '.pv-nav{flex:0 0 100px;margin-top:0;}',
    '.pv-arrow{width:40px;}',
    '}'
  ].join('');
  function injectStyle() {
    if (document.getElementById('pv-style')) return;
    var st = document.createElement('style');
    st.id = 'pv-style';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ---------- 휠 스크롤 부드럽게 ---------- */
  // 마우스 휠을 한 칸씩 끊기지 않고 관성 있게 이어지도록 보정합니다.
  // 키보드, 터치, 스크롤바 드래그는 브라우저 기본 동작을 그대로 씁니다.
  function smoothWheel() {
    var target = window.pageYOffset, cur = target, raf = 0, expected = null;
    function max() { return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); }
    function tick() {
      raf = 0;
      var diff = target - cur;
      if (Math.abs(diff) < 0.4) { cur = target; } else { cur += diff * 0.11; }
      expected = Math.round(cur);
      window.scrollTo(0, expected);
      if (cur !== target) raf = requestAnimationFrame(tick);
    }
    function onWheel(e) {
      if (e.ctrlKey || e.defaultPrevented || reduced() || e.deltaX && Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      var d = e.deltaY;
      if (e.deltaMode === 1) d *= 32; else if (e.deltaMode === 2) d *= window.innerHeight;
      e.preventDefault();
      if (!raf) { cur = window.pageYOffset; target = cur; }   // 애니메이션이 멈춰 있으면 현재 위치에서 시작
      target = clamp(target + d, 0, max());
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function onScroll() {
      // 우리가 만든 스크롤이 아니면(스크롤바, 키보드 등) 위치를 다시 맞춤
      if (expected !== null && Math.abs(window.pageYOffset - expected) <= 2) return;
      if (!raf) { cur = window.pageYOffset; target = cur; }
    }
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    return function () {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }

  /* ---------- 시리즈 화면 ---------- */
  // opts: { series, hrefFor(n), onOpenPhoto(n), scrollY }
  function createSeries(host, opts) {
    injectStyle();
    var series = opts.series;
    var photos = series.photos;
    var root = el('div', 'pv-series' + (reduced() ? ' pv-reduce' : ''));
    var title = el('div', 'pv-title');
    var name = el('h1', 'pv-name');
    name.style.cssText = 'margin:0;font:inherit;letter-spacing:inherit;';
    name.textContent = titleOf(series);
    title.appendChild(name);
    var grid = el('div', 'pv-grid');
    root.appendChild(title); root.appendChild(grid);
    host.appendChild(root);

    var destroyed = false, cols = 0;
    var io = null, batch = 0, batchTimer = 0;
    var tiles = photos.map(function (p, i) {
      var a = el('a', 'pv-tile', { href: opts.hrefFor(i + 1), 'aria-label': titleOf(series) + ' — ' + (i + 1) });
      var r = ratios[p.url];
      a.style.aspectRatio = r ? r : '4 / 5';
      a._h = 1.25; a._col = -1; a._bad = false;      // 세로/가로 비율 (모르면 4:5 로 가정)
      if (r) { var m = String(r).split('/'), rw = parseFloat(m[0]), rh = parseFloat(m[1]); if (rw && rh) a._h = rh / rw; }
      var img = el('img', null, { alt: p.label, loading: 'lazy', decoding: 'async', draggable: 'false' });
      a._img = img; a._visible = false; a._loaded = false; a._shown = false;
      img.onload = function () {
        if (img.naturalWidth && img.naturalHeight) {
          var rr = img.naturalWidth + ' / ' + img.naturalHeight;
          a.style.aspectRatio = rr;                 // 실제 비율과 정확히 같아 잘리지 않음
          a._h = img.naturalHeight / img.naturalWidth;
          rememberRatio(p.url, rr);
        }
        img.classList.add('pv-ok');
        a._loaded = true;
        maybeShow(a);
        scheduleAssign();
      };
      img.onerror = function () {
        try { console.warn('[포트폴리오] 이미지를 불러오지 못했습니다: ' + p.url + '  → 파일 이름(대소문자 포함)과 폴더 위치를 확인하세요.'); } catch (e) {}
        a.classList.add('pv-bad'); a._bad = true;
        scheduleAssign();
      };
      img.src = p.url;
      a.appendChild(img);
      a.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        opts.onOpenPhoto(i + 1);
      });
      return a;
    });

    // 사진이 화면에 들어오고 + 로딩이 끝났을 때 등장 효과
    function maybeShow(a) {
      if (a._shown || !a._visible || !a._loaded) return;
      a._shown = true;
      if (reduced()) { a.classList.add('pv-in'); return; }
      var delay = Math.min(batch++, 5) * 70;
      clearTimeout(batchTimer);
      batchTimer = setTimeout(function () { batch = 0; }, 120);
      setTimeout(function () { if (!destroyed) a.classList.add('pv-in'); }, delay);
    }
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target._visible = true; maybeShow(en.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.02 });
      tiles.forEach(function (t) { io.observe(t); });
    } else {
      tiles.forEach(function (t) { t._visible = true; maybeShow(t); });
    }

    // 열 개수: 열 너비가 300px 이상이 되도록 최대 3열 (기존 규칙과 동일)
    function gapPx() { return clamp(0.024 * window.innerWidth, 20, 38); }
    function colCount() {
      var g = gapPx();
      return clamp(Math.floor((root.clientWidth + g) / (300 + g)), 1, 3);
    }
    // 사진은 번호 순서대로, 지금 가장 짧은 열에 차례로 놓습니다. (맨 아래도 열 높이가 고르게 끝남)
    // 이미 화면에 나타난 사진은 자리를 고정하고, 아직 안 나타난 사진만 로딩 결과(실제 비율)에 맞춰 다시 배치합니다.
    var colEls = [], assignRaf = 0;
    function build(n) {
      cols = n;
      root.style.setProperty('--pv-gap', gapPx() + 'px');
      while (grid.firstChild) grid.removeChild(grid.firstChild);
      colEls = [];
      for (var c = 0; c < n; c++) { var col = el('div', 'pv-col'); colEls.push(col); grid.appendChild(col); }
      tiles.forEach(function (t) { t._col = -1; });
      assign();
    }
    function assign() {
      assignRaf = 0;
      if (destroyed || !cols) return;
      var n = cols, g = gapPx();
      var colW = Math.max(100, (root.clientWidth - g * (n - 1)) / n);
      var gf = g / colW;                       // 사진 사이 간격을 열 너비 기준 비율로 환산
      var hs = [], want = [], assigned = [], free = [], c, k, i;
      for (c = 0; c < n; c++) { hs.push(0); want.push([]); }
      var TAIL = 5;                              // 맨 끝 사진 몇 장은 모든 경우를 따져서 열 높이가 가장 고르게 끝나도록 배치
      for (i = 0; i < tiles.length; i++) {
        var t = tiles[i];
        if (t._shown && t._col >= 0) c = t._col;
        else if (n > 1 && i >= tiles.length - TAIL) { assigned[i] = -1; free.push(i); continue; }
        else { c = 0; for (k = 1; k < n; k++) if (hs[k] < hs[c] - 0.001) c = k; }
        assigned[i] = c;
        if (!t._bad) hs[c] += t._h + gf;
      }
      if (free.length) {
        var best = null, bestScore = Infinity, combo = [], total = Math.pow(n, free.length), m, j;
        for (m = 0; m < total; m++) {
          var h2 = hs.slice(), x = m;
          for (j = 0; j < free.length; j++) { var cc = x % n; x = Math.floor(x / n); combo[j] = cc; if (!tiles[free[j]]._bad) h2[cc] += tiles[free[j]]._h + gf; }
          var mx = Math.max.apply(null, h2), mn = Math.min.apply(null, h2);
          var score = (mx - mn) * 1000 + mx;     // 가장 고르게, 같으면 전체 높이가 낮게
          if (score < bestScore - 1e-9) { bestScore = score; best = combo.slice(); }
        }
        for (j = 0; j < free.length; j++) assigned[free[j]] = best[j];
      }
      for (i = 0; i < tiles.length; i++) { tiles[i]._col = assigned[i]; want[assigned[i]].push(tiles[i]); }
      want.forEach(function (list, ci) {
        var col = colEls[ci];
        list.forEach(function (t, j) { if (col.children[j] !== t) col.insertBefore(t, col.children[j] || null); });
      });
    }
    function scheduleAssign() { if (!assignRaf) assignRaf = requestAnimationFrame(assign); }
    root.style.setProperty('--pv-gap', gapPx() + 'px');
    build(colCount());
    var ro = null;
    function onResize() {
      root.style.setProperty('--pv-gap', gapPx() + 'px');
      var n = colCount();
      if (n !== cols) build(n); else scheduleAssign();
    }
    if (window.ResizeObserver) { ro = new ResizeObserver(onResize); ro.observe(root); }
    else window.addEventListener('resize', onResize);

    var stopWheel = smoothWheel();
    if (opts.scrollY) {
      try { window.scrollTo(0, opts.scrollY); } catch (e) {}
      requestAnimationFrame(function () { try { window.scrollTo(0, opts.scrollY); } catch (e) {} });
    }

    return {
      scrollY: function () { return window.pageYOffset; },
      destroy: function () {
        destroyed = true;
        stopWheel();
        if (io) io.disconnect();
        if (ro) ro.disconnect(); else window.removeEventListener('resize', onResize);
        clearTimeout(batchTimer);
        if (assignRaf) cancelAnimationFrame(assignRaf);
        if (root.parentNode) root.parentNode.removeChild(root);
      }
    };
  }

  /* ---------- 사진 상세 화면 ---------- */
  var ARROW_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14.5 5.5 8 12l6.5 6.5"/></svg>';
  var ARROW_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9.5 5.5 16 12l-6.5 6.5"/></svg>';

  // opts: { series, index(0-based), onChange(i), onUp() }
  function createPhoto(host, opts) {
    injectStyle();
    var series = opts.series, photos = series.photos, N = photos.length;
    var index = clamp(opts.index || 0, 0, N - 1);
    var root = el('div', 'pv-photo' + (reduced() ? ' pv-reduce' : ''));

    var title = el('div', 'pv-title');
    var up = el('button', 'pv-crumb', { type: 'button' });
    up.textContent = titleOf(series);
    up.addEventListener('click', function () { opts.onUp(); });
    var sep = el('span', 'pv-sep'); sep.textContent = '/';
    var cur = el('span', 'pv-name');
    title.appendChild(up); title.appendChild(sep); title.appendChild(cur);

    var wrap = el('div', 'pv-wrap');
    var stage = el('div', 'pv-stage');
    var prev = el('button', 'pv-arrow pv-prev', { type: 'button', 'aria-label': 'Previous photo' });
    prev.innerHTML = ARROW_L;
    var next = el('button', 'pv-arrow pv-next', { type: 'button', 'aria-label': 'Next photo' });
    next.innerHTML = ARROW_R;
    var box = el('div', 'pv-imgbox');
    var img = el('img', 'pv-img', { decoding: 'async', draggable: 'false' });
    box.appendChild(img);
    stage.appendChild(box);

    // 오른쪽(모바일은 아래) 영역: 촬영 정보 + 좌우 버튼/진행 위치. 버튼은 사진 크기와 상관없이 항상 같은 자리에 있습니다.
    var side = el('div', 'pv-side');
    var meta = el('aside', 'pv-meta');
    var nav = el('div', 'pv-nav');
    var btns = el('div', 'pv-navbtns');
    btns.appendChild(prev); btns.appendChild(next);
    var track = el('div', 'pv-track', { 'aria-hidden': 'true' });
    var thumb = el('div', 'pv-thumb');
    track.appendChild(thumb);
    nav.appendChild(btns); nav.appendChild(track);
    side.appendChild(meta); side.appendChild(nav);
    wrap.appendChild(stage); wrap.appendChild(side);
    var live = el('div', 'pv-sr', { 'aria-live': 'polite' });
    root.appendChild(title); root.appendChild(wrap); root.appendChild(live);
    host.appendChild(root);

    var token = 0, destroyed = false;

    function renderMeta(p) {
      meta.innerHTML = '';
      var k = el('div', 'pv-meta-k'); k.textContent = 'Metadata';
      var t = el('div', 'pv-meta-t'); t.textContent = p.label;
      meta.appendChild(k); meta.appendChild(t);
      var m = p.meta || {}, rows = [];
      if (m.camera) rows.push(['Camera', m.camera]);
      if (m.lens) rows.push(['Lens', m.lens]);
      if (m.focal) rows.push(['Focal length', m.focal]);
      if (m.aperture) rows.push(['Aperture', m.aperture]);
      if (m.shutter) rows.push(['Shutter', m.shutter]);
      if (m.iso) rows.push(['ISO', m.iso]);
      if (m.date) rows.push(['Date', m.date]);
      if (!rows.length) {
        var none = el('div', 'pv-none'); none.textContent = 'No EXIF metadata found.';
        meta.appendChild(none);
        return;
      }
      var box2 = el('div');
      rows.forEach(function (r) {
        var row = el('div', 'pv-row');
        var a = el('span'); a.textContent = r[0];
        var b = el('span'); b.textContent = r[1];
        row.appendChild(a); row.appendChild(b); box2.appendChild(row);
      });
      meta.appendChild(box2);
    }

    function preload(i) {
      if (i < 0 || i >= N) return;
      var im = new Image(); im.decoding = 'async'; im.src = photos[i].url;
    }

    function show(i, first) {
      index = clamp(i, 0, N - 1);
      var p = photos[index], my = ++token;
      cur.textContent = pad2(index + 1);
      cur.setAttribute('aria-label', 'Photo ' + (index + 1) + ' of ' + N);
      thumb.style.left = (index / N * 100) + '%';
      thumb.style.width = (100 / N) + '%';
      prev.setAttribute('aria-disabled', index === 0 ? 'true' : 'false');
      next.setAttribute('aria-disabled', index === N - 1 ? 'true' : 'false');
      prev.tabIndex = index === 0 ? -1 : 0; next.tabIndex = index === N - 1 ? -1 : 0;
      live.textContent = p.label + ' (' + (index + 1) + ' / ' + N + ')';
      renderMeta(p);
      var swap = function () {
        if (my !== token || destroyed) return;
        img.onload = function () { if (my === token) img.classList.remove('pv-fade'); };
        img.onerror = function () {
          try { console.warn('[포트폴리오] 이미지를 불러오지 못했습니다: ' + p.url); } catch (e) {}
          if (my === token) img.classList.remove('pv-fade');
        };
        img.alt = p.label;
        img.src = p.url;
        if (img.complete && img.naturalWidth) img.classList.remove('pv-fade');
      };
      if (first || reduced()) { swap(); } else { img.classList.add('pv-fade'); setTimeout(swap, 160); }
      preload(index + 1); preload(index - 1);
    }

    function go(delta) {
      var n = index + delta;
      if (n < 0 || n >= N) return;
      show(n, false);
      opts.onChange(n);
    }
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });

    function onKey(e) {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      var t = e.target, tag = (t && t.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag) || (t && t.isContentEditable)) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'Escape') { e.preventDefault(); opts.onUp(); }
    }
    window.addEventListener('keydown', onKey);

    // 터치 스와이프
    var sx = 0, sy = 0, st = 0;
    stage.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now();
    }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      var t = e.changedTouches && e.changedTouches[0];
      if (!t || !st) return;
      var dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - st < 800) go(dx < 0 ? 1 : -1);
      st = 0;
    }, { passive: true });

    show(index, true);

    return {
      setIndex: function (i) { if (i !== index) show(i, false); },
      destroy: function () {
        destroyed = true; token++;
        window.removeEventListener('keydown', onKey);
        if (root.parentNode) root.parentNode.removeChild(root);
      }
    };
  }

  window.PortfolioViews = { createSeries: createSeries, createPhoto: createPhoto };
})();
