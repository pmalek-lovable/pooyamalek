/* Pooya Malek · app shell: hash router, tab bar, sheets, view lifecycle */
(function () {
  var viewRoot = document.getElementById('view-root');
  var topbar = document.getElementById('topbar');
  var tabbar = document.getElementById('tabbar');
  var sheetBackdrop = document.getElementById('sheetBackdrop');
  var sheet = document.getElementById('sheet');
  var sheetBody = document.getElementById('sheetBody');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tabItems = document.querySelectorAll('.tab-item');
  var tabSwitches = document.querySelectorAll('.tab-switch');

  // Every tab with a side-panel subnav, and the data attribute each one's
  // buttons carry. Drives both the click wiring and the show/hide + active
  // state in renderRoute, so adding a fourth tab's subnav is a one-line change.
  var SUBNAVS = [
    { tab: 'mentorship', nav: document.getElementById('mentorshipSubnav'), attr: 'data-mentorship-view' },
    { tab: 'design', nav: document.getElementById('designSubnav'), attr: 'data-design-view' },
    { tab: 'about', nav: document.getElementById('aboutSubnav'), attr: 'data-about-view' }
  ];

  var TITLES = {
    'mentorship/home': 'Pooya Malek · Design mentor',
    'mentorship/assessment': 'The Clarity Assessment · Pooya Malek',
    'mentorship/plan': 'Your plan · Pooya Malek',
    'mentorship/resources': 'Free resources · Pooya Malek',
    'mentorship/learn': 'Learn · Pooya Malek',
    'design/professional': 'Work · Pooya Malek',
    'design/personal': 'Personal projects · Pooya Malek',
    'about/story': 'About · Pooya Malek',
    'about/notes': 'Notes · Pooya Malek',
    'about/vibes': 'Vibes · Pooya Malek',
    'about/books': 'Books · Pooya Malek',
    'about/photography': 'Photography · Pooya Malek'
  };

  function parseRoute() {
    var raw = (location.hash || '').replace(/^#\/?/, '');
    var parts = raw.split('/').filter(Boolean);
    var tab = parts[0] === 'design' ? 'design' : (parts[0] === 'about' ? 'about' : 'mentorship');
    var view = parts[1];
    var deep = parts[2];
    if (tab === 'mentorship') {
      if (['home', 'assessment', 'plan', 'resources', 'learn'].indexOf(view) === -1) view = 'home';
    } else if (tab === 'design') {
      if (['professional', 'personal'].indexOf(view) === -1) view = 'professional';
    } else {
      if (['story', 'notes', 'vibes', 'books', 'photography'].indexOf(view) === -1) view = 'story';
    }
    return { tab: tab, view: view, deep: deep };
  }

  function setActiveTab(tab) {
    tabItems.forEach(function (b) {
      var on = b.getAttribute('data-tab') === tab;
      b.classList.toggle('active', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    syncNavIndicators();
  }

  // Sliding pill behind a tab-switch's tabs: sizes and positions its
  // indicator to match a target tab-item, then eases into place. There's
  // one tab-switch (and one indicator) at the top of the Mentorship rail
  // and another at the top of the Design rail, each synced independently.
  function moveNavIndicator(scope, target) {
    var indicator = scope.querySelector('.nav-indicator');
    if (!indicator || !target) return;
    indicator.style.width = target.offsetWidth + 'px';
    indicator.style.left = target.offsetLeft + 'px';
  }

  function syncNavIndicators() {
    tabSwitches.forEach(function (scope) {
      moveNavIndicator(scope, scope.querySelector('.tab-item.active'));
    });
  }

  function setActiveSubnav(nav, attr, view) {
    nav.querySelectorAll('.subnav-item').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute(attr) === view);
    });
  }

  function initReveal(root) {
    var els = root.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function wireDisclosures(root) {
    root.querySelectorAll('details.disclosure').forEach(function (d) {
      d.addEventListener('toggle', function () {});
    });
  }

  function wireResourceCards(root) {
    root.querySelectorAll('[data-resource]').forEach(function (card) {
      card.addEventListener('click', function () {
        var id = card.getAttribute('data-resource');
        var r = window.Views.RESOURCES.filter(function (x) { return x.id === id; })[0];
        if (!r) return;
        openSheet('<div class="sheet-resource">' +
          '<p class="kicker">Free resource</p>' +
          '<h2>' + r.t + '</h2>' +
          '<p class="lead">' + r.m + '</p>' +
          '<a class="btn solid" href="#" onclick="return false">Download <span class="arrow" aria-hidden="true">&darr;</span></a>' +
          '<p class="fineprint">This one isn\'t hooked up to a real file yet. Drop your PDF or Notion link into this card\'s action when it\'s ready.</p>' +
        '</div>');
      });
    });
  }

  // Wires the prev/next arrows next to a horizontally scrolling .stories
  // strip: each click advances by one card's width, and the arrows disable
  // themselves at either end so it's clear when you've run out of room.
  function wireStoriesScroller(root) {
    var scroller = root.querySelector('.stories');
    var prev = root.querySelector('[data-stories-scroll="-1"]');
    var next = root.querySelector('[data-stories-scroll="1"]');
    if (!scroller || !prev || !next) return;

    function step() {
      var card = scroller.querySelector('.turn');
      var gap = parseFloat(getComputedStyle(scroller).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : scroller.clientWidth;
    }
    function updateButtons() {
      var max = scroller.scrollWidth - scroller.clientWidth - 1;
      prev.disabled = scroller.scrollLeft <= 0;
      next.disabled = scroller.scrollLeft >= max;
    }
    prev.addEventListener('click', function () {
      scroller.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    next.addEventListener('click', function () {
      scroller.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    scroller.addEventListener('scroll', updateButtons, { passive: true });
    updateButtons();
  }

  // ---- Design hero liquid-glow: three metaball blobs merged with a
  // smooth-min SDF and tinted with the site's own purple tokens (hardcoded
  // here since the theme itself is hardcoded dark, see styles.css). Plain
  // WebGL1 so there's no library to load; if a browser can't give us a
  // context the hero just keeps its normal dark background, no fallback UI
  // needed. Runs at devicePixelRatio capped to 1.5 and pauses whenever the
  // tab is hidden, since it's ambient decoration, not something worth
  // spending battery on off-screen.
  var LIQUID_VERT = 'attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.0,1.0);}';
  var LIQUID_FRAG = [
    'precision mediump float;',
    'uniform vec2 u_resolution;',
    'uniform float u_time;',
    'uniform vec2 u_mouse;',
    'uniform float u_mouseT;',
    'uniform vec3 u_bg;',
    'uniform vec3 u_purple;',
    'uniform vec3 u_purple2;',
    'float smin(float a,float b,float k){',
    '  float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0);',
    '  return mix(b,a,h)-k*h*(1.0-h);',
    '}',
    'void main(){',
    '  vec2 uv=gl_FragCoord.xy/u_resolution.xy;',
    '  vec2 p=uv-0.5;',
    '  float aspect=u_resolution.x/u_resolution.y;',
    '  p.x*=aspect;',
    '  vec2 m=u_mouse;',
    '  m.x*=aspect;',
    '  float t=u_time*0.12;',
    '  vec2 c1=vec2(sin(t*1.3)*0.20+0.18,cos(t*1.7)*0.14)+m*u_mouseT*0.5;',
    '  vec2 c2=vec2(cos(t*0.9)*0.16+0.32,sin(t*1.1)*0.15-0.06)+m*u_mouseT*0.38;',
    '  vec2 c3=vec2(sin(t*0.6)*0.14+0.10,cos(t*0.8)*0.12+0.10)+m*u_mouseT*0.62;',
    '  float d1=length(p-c1)-0.14;',
    '  float d2=length(p-c2)-0.11;',
    '  float d3=length(p-c3)-0.09;',
    '  float d=smin(d1,d2,0.12);',
    '  d=smin(d,d3,0.12);',
    '  float glow=smoothstep(0.09,-0.03,d)*0.32;',
    '  float core=smoothstep(0.04,-0.06,d)*0.22;',
    '  vec3 col=mix(u_bg,u_purple,glow);',
    '  col=mix(col,u_purple2,core);',
    '  float vig=smoothstep(1.05,0.15,length(p*vec2(1.0,u_resolution.y/max(u_resolution.x,1.0))));',
    '  col*=mix(0.9,1.0,vig);',
    '  gl_FragColor=vec4(col,1.0);',
    '}'
  ].join('\n');

  function compileLiquidShader(gl, type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { gl.deleteShader(sh); return null; }
    return sh;
  }

  function initLiquidCanvas(root) {
    var canvas = root.querySelector('.liquid-canvas');
    if (!canvas) return null;
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return null;
    // The canvas itself is pointer-events:none so it never blocks clicks on
    // the hero text/links above it, so mouse tracking listens on the hero
    // section instead, canvas.getBoundingClientRect() still gives the right
    // coordinate space since the canvas fills that section edge to edge.
    var hero = canvas.closest('.hero-liquid') || canvas.parentElement;

    var vs = compileLiquidShader(gl, gl.VERTEX_SHADER, LIQUID_VERT);
    var fs = compileLiquidShader(gl, gl.FRAGMENT_SHADER, LIQUID_FRAG);
    if (!vs || !fs) return null;
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    gl.useProgram(program);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var posLoc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(program, 'u_resolution');
    var uTime = gl.getUniformLocation(program, 'u_time');
    var uMouse = gl.getUniformLocation(program, 'u_mouse');
    var uMouseT = gl.getUniformLocation(program, 'u_mouseT');
    gl.uniform3f(gl.getUniformLocation(program, 'u_bg'), 0.039, 0.039, 0.051);
    gl.uniform3f(gl.getUniformLocation(program, 'u_purple'), 0.486, 0.361, 1.0);
    gl.uniform3f(gl.getUniformLocation(program, 'u_purple2'), 0.604, 0.502, 1.0);

    var raf = null, running = false;
    var start = performance.now();

    // Mouse position and presence both ease toward their targets each frame
    // (not snapped straight to the cursor), so the blob cluster reads as
    // being dragged through something viscous rather than just tracking a
    // pointer 1:1.
    var mouseX = 0, mouseY = 0, mouseT = 0;
    var targetX = 0, targetY = 0, targetT = 0;

    function onPointerMove(e) {
      var rect = canvas.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = 0.5 - (e.clientY - rect.top) / rect.height;
      targetT = 1;
    }
    function onPointerLeave() { targetT = 0; }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.max(1, Math.round(rect.width * dpr));
      var h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    }

    function frame(now) {
      mouseX += (targetX - mouseX) * 0.07;
      mouseY += (targetY - mouseY) * 0.07;
      mouseT += (targetT - mouseT) * 0.05;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform1f(uMouseT, mouseT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (running) raf = requestAnimationFrame(frame);
    }

    function onVisibility() {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = null; }
      else if (running && !raf) { raf = requestAnimationFrame(frame); }
    }

    function onResize() {
      resize();
      if (!running) frame(performance.now());
    }

    resize();
    if (reduceMotion) {
      frame(performance.now());
    } else {
      running = true;
      raf = requestAnimationFrame(frame);
      document.addEventListener('visibilitychange', onVisibility);
      hero.addEventListener('pointermove', onPointerMove);
      hero.addEventListener('pointerleave', onPointerLeave);
    }
    window.addEventListener('resize', onResize);

    return function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
    };
  }

  function flashTarget(root, id) {
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    setTimeout(function () {
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      el.classList.add('flash');
      setTimeout(function () { el.classList.remove('flash'); }, 1800);
    }, 50);
  }

  // Tracks the last tab/view actually rendered, so a deep-link to an anchor
  // already on screen (e.g. "Explore ways to work" pointing at a section on
  // the page you're already reading) can scroll to it instead of tearing
  // down and rebuilding the whole view for no visible change.
  var lastTab = null, lastView = null;
  var stopLiquid = null;

  function renderRoute() {
    closeSheet();
    var r = parseRoute();
    var isAssessment = r.tab === 'mentorship' && r.view === 'assessment';
    var stayingPut = r.tab === lastTab && r.view === lastView && r.deep && document.getElementById(r.deep);

    setActiveTab(r.tab);
    SUBNAVS.forEach(function (s) {
      s.nav.hidden = r.tab !== s.tab;
      if (r.tab === s.tab) setActiveSubnav(s.nav, s.attr, r.view);
    });

    if (!stayingPut) {
      if (stopLiquid) { stopLiquid(); stopLiquid = null; }
      var view = window.Views[r.tab][r.view];
      viewRoot.innerHTML = view ? view(r.deep) : '';
      viewRoot.classList.remove('view-enter');
      void viewRoot.offsetWidth;
      viewRoot.classList.add('view-enter');

      if (isAssessment) {
        window.ClarityAssessment.start(document.getElementById('stage'), document.getElementById('bar'));
      } else if (r.tab === 'mentorship' && r.view === 'plan') {
        var saved = window.ClarityAssessment.getSavedPlan();
        var mount = document.getElementById('savedPlanMount');
        if (mount && saved) window.ClarityAssessment.renderSavedPlan(mount, saved);
      }

      applyBookingLinks(viewRoot);
      wireResourceCards(viewRoot);
      wireDisclosures(viewRoot);
      wireStoriesScroller(viewRoot);
      initReveal(viewRoot);
      if (r.tab === 'design' || r.tab === 'mentorship') stopLiquid = initLiquidCanvas(viewRoot);
    }
    lastTab = r.tab; lastView = r.view;

    document.title = TITLES[r.tab + '/' + r.view] || 'Pooya Malek';
    if (!r.deep) window.scrollTo(0, 0);
    if (r.deep) flashTarget(viewRoot, r.deep);
  }

  // ---- Sheet ----
  var sheetHistoryPushed = false;
  function openSheet(html) {
    sheetBody.innerHTML = html;
    sheetBackdrop.hidden = false;
    sheet.hidden = false;
    requestAnimationFrame(function () {
      sheetBackdrop.classList.add('in');
      sheet.classList.add('in');
    });
    document.body.classList.add('sheet-open');
    if (!sheetHistoryPushed) {
      history.pushState({ sheet: true }, '', location.hash);
      sheetHistoryPushed = true;
    }
  }

  function closeSheet(skipHistory) {
    if (sheet.hidden) return;
    sheetBackdrop.classList.remove('in');
    sheet.classList.remove('in');
    document.body.classList.remove('sheet-open');
    setTimeout(function () { sheetBackdrop.hidden = true; sheet.hidden = true; }, reduceMotion ? 0 : 260);
    if (sheetHistoryPushed && !skipHistory) { sheetHistoryPushed = false; history.back(); }
    sheetHistoryPushed = false;
  }

  sheetBackdrop.addEventListener('click', function () { closeSheet(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });

  window.addEventListener('popstate', function () {
    if (!sheet.hidden) { closeSheet(true); return; }
    renderRoute();
  });

  window.AppShell = {
    openBookingSheet: function () {
      openSheet(
        '<p class="kicker">Book a time</p>' +
        '<h2>Let\'s look at it together.</h2>' +
        '<p class="lead">For a mentoring session or a project enquiry, either way, grab a time that works.</p>' +
        '<div class="cal-embed"><iframe src="https://cal.com/pooya-malek?embed=true&theme=' +
          (document.documentElement.getAttribute('data-theme') || 'light') +
          '" loading="lazy" title="Book a time with Pooya Malek"></iframe></div>' +
        '<details class="disclosure">' +
          '<summary>Being honest: this probably isn\'t for you if&hellip;</summary>' +
          '<ul>' +
            '<li>You want someone to tell you your work is great and leave it there.</li>' +
            '<li>You\'re looking for a quick portfolio polish, not a change in how you think about your career.</li>' +
            '<li>You want a template to copy rather than a way of reasoning you can reuse.</li>' +
          '</ul>' +
        '</details>'
      );
    },
    openSayHelloSheet: function () {
      openSheet(
        '<p class="kicker">Say hello</p>' +
        '<h2>Let\'s talk.</h2>' +
        '<p class="lead">Questions, feedback, or a project you want to run by me. Pick whatever\'s easiest.</p>' +
        '<div class="hero-actions" style="margin-top:1.4rem;">' +
          '<a class="btn solid" href="mailto:malek.pooya@gmail.com">Email me <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
          '<a class="btn-textlink" href="https://www.linkedin.com/in/pooyamalek/" target="_blank" rel="noopener">LinkedIn <span class="arrow" aria-hidden="true">&#8599;</span></a>' +
        '</div>'
      );
    },
    closeSheet: closeSheet
  };

  // ---- Tab bar / subnav / say hello ----
  tabItems.forEach(function (b) {
    b.addEventListener('click', function () { location.hash = '#/' + b.getAttribute('data-tab'); });
  });
  tabSwitches.forEach(function (scope) {
    scope.querySelectorAll('.tab-item').forEach(function (b) {
      b.addEventListener('mouseenter', function () { moveNavIndicator(scope, b); });
    });
    scope.addEventListener('mouseleave', function () { moveNavIndicator(scope, scope.querySelector('.tab-item.active')); });
  });
  window.addEventListener('resize', syncNavIndicators, { passive: true });
  // Re-sync once the webfont has actually swapped in, its metrics differ
  // from the fallback font used for the very first paint.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncNavIndicators);
  }
  SUBNAVS.forEach(function (s) {
    s.nav.querySelectorAll('.subnav-item').forEach(function (b) {
      b.addEventListener('click', function () { location.hash = '#/' + s.tab + '/' + b.getAttribute(s.attr); });
    });
  });
  document.querySelectorAll('[data-say-hello]').forEach(function (b) {
    b.addEventListener('click', function () { window.AppShell.openSayHelloSheet(); });
  });
  document.querySelectorAll('[data-book-cta]').forEach(function (b) {
    b.addEventListener('click', function () { window.AppShell.openBookingSheet(); });
  });

  // ---- Footer year ----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Topbar border once scrolled; stays put, never hides ----
  window.addEventListener('scroll', function () {
    topbar.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  window.addEventListener('hashchange', renderRoute);
  renderRoute();

  var isLocalDev = ['localhost', '127.0.0.1'].indexOf(location.hostname) !== -1;
  if ('serviceWorker' in navigator && !isLocalDev) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js'); });
  }
})();
