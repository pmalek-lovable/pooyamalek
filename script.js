/* Pooya Malek · shared behavior */

// ---- Site config ----
// Single source of truth for the booking link. When moving off Cal.com to a
// custom booking/payment flow, change this one value (or point it at an
// in-page route) and every [data-booking-link] element updates.
var BOOKING_URL = 'https://cal.com/pooya-malek';

// Applies BOOKING_URL to every [data-booking-link] element under root (defaults
// to the whole document). Call again after injecting new markup dynamically,
// e.g. from assessment.js after rendering the result.
function applyBookingLinks(root) {
  (root || document).querySelectorAll('[data-booking-link]').forEach(function (a) {
    a.href = BOOKING_URL;
  });
}

(function () {
  var root = document.documentElement;

  // ---- Theme: restore saved preference, else follow system ----
  try {
    var saved = localStorage.getItem('pm-theme');
    if (saved) {
      root.setAttribute('data-theme', saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      root.setAttribute('data-theme', 'dark');
    }
  } catch (e) {}

  document.addEventListener('DOMContentLoaded', function () {
    // Year
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // Booking links: driven entirely by BOOKING_URL above
    applyBookingLinks();

    // Pick up your plan: quiet entry point if a saved assessment result exists
    var pickup = document.getElementById('pickupPlan');
    if (pickup) {
      try {
        var saved = JSON.parse(localStorage.getItem('pm-assessment') || 'null');
        if (saved && saved.gap) pickup.hidden = false;
      } catch (e) {}
    }

    // plan.html: render the saved assessment result, or an honest empty state
    var planView = document.getElementById('planView');
    if (planView) {
      var savedPlan = null;
      try { savedPlan = JSON.parse(localStorage.getItem('pm-assessment') || 'null'); } catch (e) {}
      var G = savedPlan && window.CLARITY_GAPS ? window.CLARITY_GAPS[savedPlan.gap] : null;
      if (G) {
        var when = new Date(savedPlan.at || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        var steps = G.plan.map(function (p, i) { return '<div class="plan-step"><span class="n">' + (i + 1) + '</span><p>' + p + '</p></div>'; }).join('');
        planView.innerHTML =
          '<div class="result">' +
          '<p class="kicker">Your saved plan</p>' +
          '<span class="result-badge">' + G.badge + '</span>' +
          '<h2>' + G.name + '</h2>' +
          '<p class="read">' + G.read + '</p>' +
          '<div class="plan"><div class="ph">Your three-step plan</div>' + steps + '</div>' +
          '<div class="match"><b>Start with this.</b> ' + G.match + '</div>' +
          '<p class="fineprint">Saved on ' + when + '. <a href="assessment.html">Retake the assessment</a> any time, it only takes a few minutes.</p>' +
          '</div>';
        applyBookingLinks(planView);
      } else {
        planView.innerHTML =
          '<div class="plan-empty">' +
          '<p class="kicker">Your plan</p>' +
          '<h1>No saved plan yet.</h1>' +
          '<p class="lead" style="margin-left:auto;margin-right:auto;">Take the Clarity Assessment once and your result lives here, so you can come back to it any time.</p>' +
          '<div style="margin-top:1.6rem;"><a class="btn solid" href="assessment.html">Take the 3-minute assessment <span class="arrow" aria-hidden="true">&rarr;</span></a></div>' +
          '</div>';
      }
    }

    // Theme toggle
    var tb = document.getElementById('themeBtn');
    var tl = document.getElementById('themeLabel');
    function syncLabel() {
      if (tl) tl.textContent = root.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark';
    }
    syncLabel();
    if (tb) {
      tb.addEventListener('click', function () {
        var dark = root.getAttribute('data-theme') === 'dark';
        var next = dark ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('pm-theme', next); } catch (e) {}
        syncLabel();
      });
    }

    // Sticky nav border
    var nav = document.getElementById('nav');
    if (nav) {
      var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Mobile menu
    var menuBtn = document.getElementById('menuBtn');
    var navLinks = document.getElementById('navLinks');
    function setMenu(open) {
      document.body.classList.toggle('menu-open', open);
      if (menuBtn) menuBtn.setAttribute('aria-expanded', String(open));
    }
    if (menuBtn) menuBtn.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
    if (navLinks) navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });

    // Accordion (questions)
    document.querySelectorAll('.qitem').forEach(function (it) {
      var btn = it.querySelector('.qbtn');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var open = it.classList.contains('open');
        document.querySelectorAll('.qitem').forEach(function (x) { x.classList.remove('open'); });
        if (!open) it.classList.add('open');
      });
    });

    // Reveal on scroll
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var els = document.querySelectorAll('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      els.forEach(function (el) { io.observe(el); });
    }
  });
})();
