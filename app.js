
(function () {
  'use strict';

  var DEFAULT_BG = '#15140F', DEFAULT_INK = '#EDE8DD';
  var IG_URL = 'https://www.instagram.com/chnghnjn/';

  function warn(msg) { try { console.warn('[포트폴리오] ' + msg); } catch (e) {} }

 
  function normalize(raw) {
    if (!Array.isArray(raw)) {
      try { console.error('[포트폴리오] content/series.js 를 불러오지 못했습니다. 파일 위치와 문법(쉼표, 따옴표, 괄호)을 확인하세요.'); } catch (e) {}
      return [];
    }
    var seen = {}, out = [];
    raw.forEach(function (s, i) {
      if (!s || typeof s !== 'object' || !s.id) { warn('series.js 의 ' + (i + 1) + '번째 항목에 id 가 없어 건너뜁니다.'); return; }
      var id = String(s.id);
      if (seen[id]) { warn('id "' + id + '" 가 중복되어 두 번째 항목을 건너뜁니다.'); return; }
      seen[id] = true;
      if (s.show === false) return;
      var urlOf = function (f) {
        f = String(f);
        
        return (/^(https?:)?\/\//.test(f) || /^data:/.test(f) || f.indexOf('/') >= 0) ? f : 'photos/' + id + '/' + f;
      };
      var title = s.title || id;
      var year = s.year || '';
      var fileOf = function (v) { return (v && typeof v === 'object') ? v.file : v; };
      var photos = (Array.isArray(s.photos) ? s.photos : []).map(function (p, n) {
        var o = (p && typeof p === 'object') ? p : { file: p };
        if (!o.file) { warn('"' + id + '" 시리즈의 ' + (n + 1) + '번째 사진에 file 이 없습니다.'); return null; }
        return { url: urlOf(o.file), meta: (o.meta && typeof o.meta === 'object') ? o.meta : null };
      }).filter(Boolean);
      photos.forEach(function (p, n) { p.label = title + (year ? ' ' + year : '') + ' — ' + (n + 1); });
      var cover = fileOf(s.cover);        
      var hero = fileOf(s.hero) || cover; 
      if (!hero) warn('"' + id + ';
      out.push({ id: id, name: title, year: year, heroUrl: hero ? urlOf(hero) : '', photos: photos });
    });
    return out;
  }

  /* ---------- 스타일 ---------- */
  var CSS = [
    '.pa-root{--pa-top:calc(30px + max(21px,clamp(17px,2.2vw,22px)) + clamp(36px,5vw,56px));min-height:100vh;-webkit-font-smoothing:antialiased;font-family:\'Hanken Grotesk\',system-ui,sans-serif;}',
    '.pa-root *{box-sizing:border-box;}',
    '.pa-header{position:fixed;top:0;left:0;right:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:30px clamp(20px,5vw,64px) 0;}',
    
    'html.pa-hide-sb{scrollbar-width:none;-ms-overflow-style:none;}',
    'html.pa-hide-sb::-webkit-scrollbar{display:none;width:0;height:0;}',

    '.pa-logo{background:none;border:none;padding:14px 22px;margin:-14px -22px;cursor:pointer;color:inherit;font-family:inherit;font-size:clamp(17px,2.2vw,22px);font-weight:600;letter-spacing:.18em;text-transform:uppercase;line-height:1;}',
    '.pa-logo span{text-decoration:underline;text-decoration-color:transparent;text-decoration-thickness:2px;text-underline-offset:7px;transition:text-decoration-color .18s ease;}',
    '.pa-logo:hover span,.pa-logo:focus-visible span{text-decoration-color:currentColor;}',
    '.pa-ig{display:flex;color:inherit;line-height:0;padding:14px;margin:-14px;cursor:pointer;opacity:1;transition:opacity .18s ease;}',
    '.pa-ig:hover,.pa-ig:focus-visible{opacity:.6;}',
    '.pa-logo:focus-visible,.pa-ig:focus-visible{outline:2px solid currentColor;outline-offset:-4px;border-radius:4px;}',
    '.pa-main{padding:var(--pa-top) clamp(20px,5vw,64px) 64px;}',
    '.pa-is-home .pa-main{display:none;}',
    '.pa-fade{animation:pa-in .45s ease both;}',
    '@keyframes pa-in{from{opacity:0}to{opacity:1}}',
    '@media (prefers-reduced-motion:reduce){.pa-fade{animation:none}}'
  ].join('');

  function injectStyle() {
    if (document.getElementById('pa-style')) return;
    var st = document.createElement('style');
    st.id = 'pa-style';
    st.textContent = CSS;
    document.head.appendChild(st);
  }


  function hashText() {
    try { return decodeURIComponent((location.hash || '').replace(/^#/, '')); } catch (e) { return ''; }
  }
  function hrefOf(r) {
    if (r.view === 'series') return '#s/' + encodeURIComponent(r.id);
    if (r.view === 'photo') return '#s/' + encodeURIComponent(r.id) + '/' + r.n;
    return r.id ? '#' + encodeURIComponent(r.id) : location.pathname + location.search;
  }

  function start(host, opts) {
    opts = opts || {};
    var bg = opts.bg || DEFAULT_BG, ink = opts.ink || DEFAULT_INK;
    injectStyle();
    var list = normalize(opts.series || window.PORTFOLIO_SERIES);
    var byId = {};
    list.forEach(function (s) { byId[s.id] = s; });

    var oldRestoration = null;
    try { oldRestoration = history.scrollRestoration; history.scrollRestoration = 'manual'; } catch (e) {}


    var root = document.createElement('div');
    root.className = 'pa-root';
    root.style.cssText = 'background:' + bg + ';color:' + ink + ';';
    root.style.setProperty('--pa-bg', bg);

    var header = document.createElement('header');
    header.className = 'pa-header';
    var logo = document.createElement('button');
    logo.type = 'button'; logo.className = 'pa-logo';
    logo.setAttribute('aria-label', 'Home');
    logo.innerHTML = '<span>CHUNG&nbsp;HANJUN</span>';
    var ig = document.createElement('a');
    ig.className = 'pa-ig'; ig.href = IG_URL; ig.target = '_blank'; ig.rel = 'noopener noreferrer';
    ig.setAttribute('aria-label', 'Instagram');
    ig.innerHTML = '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.2"></rect><circle cx="12" cy="12" r="4.1"></circle><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"></circle></svg>';
    header.appendChild(logo); header.appendChild(ig);

    var homeHost = document.createElement('div');
    var main = document.createElement('main');
    main.className = 'pa-main';
    root.appendChild(header); root.appendChild(homeHost); root.appendChild(main);
    host.appendChild(root);

    
    var cur = null;            
    var homeView = null, seriesView = null, photoView = null;
    var lastHomeId = '';      
    var depth = 0;            
    var destroyed = false;

    function stateOf(r, extra) {
      var s = { rs: 1, view: r.view, id: r.id || '', n: r.n || 0, depth: r.view === 'home' ? 0 : (r.view === 'series' ? 1 : 2) };
      if (extra) for (var k in extra) if (extra.hasOwnProperty(k)) s[k] = extra[k];
      return s;
    }

   
    function routeFrom(st) {
      var r = null;
      if (st && st.rs) r = { view: st.view, id: st.id, n: st.n, scrollY: st.scrollY || 0 };
      else {
        var h = hashText(), m = /^s\/([^\/]+)(?:\/(\d+))?$/.exec(h);
        if (m) r = { view: m[2] ? 'photo' : 'series', id: m[1], n: m[2] ? parseInt(m[2], 10) : 0, scrollY: 0 };
        else r = { view: 'home', id: h, n: 0, scrollY: 0 };
      }
      if (r.view !== 'home') {
        var s = byId[r.id];
        if (!s) return { view: 'home', id: '', n: 0, scrollY: 0 };
        if (r.view === 'photo') {
          if (!s.photos.length) return { view: 'series', id: r.id, n: 0, scrollY: 0 };
          r.n = Math.max(1, Math.min(s.photos.length, r.n || 1));
        }
      } else if (!byId[r.id]) r.id = '';
      return r;
    }

    function setSolid(on) {
      if (on) root.classList.remove('pa-is-home'); else root.classList.add('pa-is-home');
      document.documentElement.classList.toggle('pa-hide-sb', on);
    }

    function unmountAll() {
      if (homeView) { try { homeView.destroy(); } catch (e) {} homeView = null; }
      if (seriesView) { try { seriesView.destroy(); } catch (e) {} seriesView = null; }
      if (photoView) { try { photoView.destroy(); } catch (e) {} photoView = null; }
    }

   
    function openSeries(id) {
      var from = history.state && history.state.rs ? history.state : null;
      if (cur && cur.view === 'home' && homeView && homeView.index() >= 0) lastHomeId = homeItems[homeView.index()] || lastHomeId;
      var r = { view: 'series', id: id, n: 0 };
      try { history.pushState(stateOf(r), '', hrefOf(r)); } catch (e) {}
      apply(r);
    }
    function openPhoto(id, n) {
      var y = window.pageYOffset;
      try { history.replaceState(stateOf({ view: 'series', id: id }, { scrollY: y }), '', hrefOf({ view: 'series', id: id })); } catch (e) {}
      var r = { view: 'photo', id: id, n: n };
      try { history.pushState(stateOf(r), '', hrefOf(r)); } catch (e) {}
      apply(r);
    }
    function up() {
      if (depth > 0) { history.back(); return; }
      apply({ view: 'home', id: lastHomeId, n: 0 });
    }
    function goHome() {
      if (cur && cur.view === 'home') { if (homeView) homeView.goTo(0, true); return; }
      if (depth > 0) history.go(-depth); else apply({ view: 'home', id: lastHomeId, n: 0 });
    }

    var homeItems = list.filter(function (s) { return s.heroUrl; }).map(function (s) { return s.id; });

    function fade(node) {
      if (!node) return;
      node.classList.add('pa-fade');
    }

    function mountHome(r) {
      setSolid(false);
      var id = r.id || lastHomeId;
      var items = list.filter(function (s) { return s.heroUrl; }).map(function (s) {
        return { id: s.id, name: s.name, year: s.year, heroUrl: s.heroUrl };
      });
      try {
        if (!window.PortfolioHome) throw new Error('home.js 를 불러오지 못했습니다');
        homeView = window.PortfolioHome.create(homeHost, { series: items, startId: id, onOpen: openSeries, bg: bg, ink: ink });
      } catch (e) {
        try { console.error('[포트폴리오] 홈 화면을 만들지 못해 간단한 목록으로 대신 표시합니다: ' + e.message); } catch (e2) {}
        root.classList.remove('pa-is-home');
        var box = document.createElement('div');
        box.style.cssText = 'padding:120px clamp(20px,5vw,64px) 40px;';
        items.forEach(function (s) {
          var b = document.createElement('button');
          b.type = 'button';
          b.textContent = s.name + (s.year ? ' ' + s.year : '');
          b.style.cssText = 'display:block;background:none;border:none;color:inherit;font:inherit;font-size:20px;padding:10px 0;cursor:pointer;';
          b.onclick = function () { openSeries(s.id); };
          box.appendChild(b);
        });
        homeHost.appendChild(box);
        homeView = { destroy: function () { if (box.parentNode) box.parentNode.removeChild(box); }, goTo: function () {}, index: function () { return -1; } };
      }
    }

    function apply(r) {
      if (destroyed) return;
      var s = byId[r.id];
      var same = cur && cur.view === r.view && cur.id === r.id;
      depth = r.view === 'home' ? 0 : (r.view === 'series' ? 1 : 2);

      if (same && r.view === 'photo' && photoView) {         
        photoView.setIndex(r.n - 1);
        cur = { view: 'photo', id: r.id, n: r.n };
        return;
      }
      if (same && r.view !== 'photo') { cur = { view: r.view, id: r.id, n: 0 }; return; }

      unmountAll();
      cur = { view: r.view, id: r.id, n: r.n || 0 };

      if (r.view === 'home') {
        if (r.id) lastHomeId = r.id;
        mountHome(r);
        return;
      }
      lastHomeId = r.id;
      setSolid(true);
      try { window.scrollTo(0, 0); } catch (e) {}
      if (r.view === 'series') {
        seriesView = window.PortfolioViews.createSeries(main, {
          series: s,
          scrollY: r.scrollY || 0,
          hrefFor: function (n) { return hrefOf({ view: 'photo', id: s.id, n: n }); },
          onOpenPhoto: function (n) { openPhoto(s.id, n); }
        });
        fade(main.lastChild);
      } else {
        photoView = window.PortfolioViews.createPhoto(main, {
          series: s,
          index: r.n - 1,
          onUp: up,
          onChange: function (i) {
            cur = { view: 'photo', id: s.id, n: i + 1 };
            var rr = { view: 'photo', id: s.id, n: i + 1 };
            try { history.replaceState(stateOf(rr), '', hrefOf(rr)); } catch (e) {}
          }
        });
        fade(main.lastChild);
      }
    }

   
    function onPop(e) {
      var r = routeFrom(e.state);
      if (!(e.state && e.state.rs)) {         
        try { history.replaceState(stateOf(r), '', hrefOf(r)); } catch (err) {}
      }
      apply(r);
    }
    window.addEventListener('popstate', onPop);

    logo.addEventListener('click', goHome);

   
    var first = routeFrom(history.state);
    if (!(history.state && history.state.rs)) {
     
      if (first.view === 'home') {
        try { history.replaceState(stateOf(first), '', hrefOf(first)); } catch (e) {}
      } else {
        try {
          history.replaceState(stateOf({ view: 'home', id: first.id }), '', hrefOf({ view: 'home', id: first.id }));
          history.pushState(stateOf({ view: 'series', id: first.id }), '', hrefOf({ view: 'series', id: first.id }));
          if (first.view === 'photo') history.pushState(stateOf(first), '', hrefOf(first));
        } catch (e) {}
      }
    }
    apply(first);

    return {
      destroy: function () {
        destroyed = true;
        window.removeEventListener('popstate', onPop);
        document.documentElement.classList.remove('pa-hide-sb');
        unmountAll();
        if (root.parentNode) root.parentNode.removeChild(root);
        try { if (oldRestoration) history.scrollRestoration = oldRestoration; } catch (e) {}
      },
      _go: { openSeries: openSeries, openPhoto: openPhoto }
    };
  }

  window.PortfolioApp = { start: start, _normalize: normalize };
})();
