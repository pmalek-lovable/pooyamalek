/* Pooya Malek · view templates for the Mentorship, Design, and About tabs.
   Each render* function returns an HTML string for #view-root; app.js wires
   up interactive bits (buttons, disclosures, sheets) after inserting it.
   Every <section> wraps its content in its own .wrap so section backgrounds
   (human/raise, cta-band/purple) can bleed full width while #view-root
   itself stays unconstrained. */
(function () {

  var RESOURCES = [
    { id: "senior-readiness-check", t: "The Senior Readiness Check", m: "Ten honest questions. Fifteen minutes. Know where you actually stand.", gap: null },
    { id: "impact-over-output", t: "Impact over Output", m: "A one-page way to reframe your work so it reads senior.", gap: "For the visibility gap" },
    { id: "portfolio-decision-map", t: "The Portfolio Decision Map", m: "Turn a wall of screens into a story about decisions.", gap: "For the framing gap" },
    { id: "interview-story-template", t: "Interview Story Template", m: "Tell one project so the reasoning, not the pixels, lands.", gap: "For the story gap" }
  ];

  var OFFERS = [
    { h: "A mentoring session", p: "A focused live call. Career direction, a portfolio walk-through, or the one thing you can't figure out on your own.", who: "Best if you want a sharp outside read, fast." },
    { h: "A portfolio or resume teardown", p: "An async, recorded review. I go through your work and show you exactly where it reads mid-level and how to make it read senior.", who: "Best if your work is good but it isn't landing." },
    { h: "Three-month coaching", p: "Month one is diagnosis and clarity. Month two is execution. Month three is application. For designers making a real move.", who: "Best if you're serious about levelling up on a timeline." }
  ];

  var STORIES = [
    { was: "“Mid-level for four years. Always ‘so close.’”", shift: "We stopped polishing the portfolio and rebuilt how she talked about her decisions.", now: "Promoted to senior two review cycles later." },
    { was: "“Strong designer. Fell apart in interviews.”", shift: "We practiced one project until the reasoning carried it, not the visuals.", now: "Signed a senior offer, and asked for more than he planned to." },
    { was: "“Being pushed into management, unsure it was right.”", shift: "We separated what they wanted from what was being handed to them.", now: "Stayed an IC, moved onto a staff track, still doing the craft." }
  ];

  var COMPANIES = ["Eurowings Digital", "ImmobilienScout24", "Best Buy Canada", "UserX Academy", "ADPList", "Yocale", "Simon Fraser University", "BrainStation"];

  var TESTIMONIALS = [
    { quote: "Pooya has this rare ability to turn a vague problem into a clear decision everyone can rally behind.", name: "Name, Role", placeholder: true },
    { quote: "Working with him made me rethink how I talk about my own work, not just what I build.", name: "Name, Role", placeholder: true },
    { quote: "He's direct, generous with his time, and genuinely invested in the people he mentors.", name: "Name, Role", placeholder: true }
  ];

  var CASE_STUDIES = [
    {
      slug: "eurowings-partner-scale",
      role: "Eurowings Digital · Product Design Lead",
      tag: "Systems",
      title: "Making the post-booking partner experience scale.",
      hook: "Six-plus products, one shared system instead of six one-off builds.",
      problem: "Every new partner integration in the post-booking flow was designed from scratch. Six-plus products, inconsistent patterns, and a team solving the same problem slightly differently each time.",
      decision: "Stop designing integrations one by one. Build a shared model for how partner and ancillary experiences behave, so the next integration starts from a system instead of a blank canvas.",
      matters: "The interesting part wasn't the UI. It was convincing the team that consistency was a design decision worth defending, and turning that belief into something reusable that outlived any single project.",
      outcomes: [{ n: "4+", l: "Integrations adopted the shared playbook" }, { n: "6+", l: "Products owned end to end" }]
    },
    {
      slug: "b2c-checkout-friction",
      role: "B2C e-commerce · Senior Product Designer",
      tag: "Conversion",
      title: "Reducing friction where the stakes felt high.",
      hook: "The redesign everyone wanted would have looked better and changed nothing.",
      problem: "Users hesitated at a high-commitment step. The instinct on the team was to redesign the screen. The data suggested the screen wasn't the issue, the sequence and the framing were.",
      decision: "Change what the user is asked to decide, and when, instead of restyling the page. Make the commitment feel proportional to where they were in the journey.",
      matters: "It's the difference between treating a symptom and finding the cause. The redesign everyone wanted would have looked better and changed nothing. Naming the real problem is the senior move.",
      outcomes: [{ n: "[ X% ]", l: "Lift in completion after reframing" }, { n: "2", l: "Iterations to validate the call" }]
    }
  ];

  // Pulled from https://pooyamalek.substack.com/feed by hand, not a live
  // fetch: the feed doesn't send CORS headers, so a static site can't read
  // it client-side without routing through a third-party proxy. Update
  // this list manually after publishing something new.
  var NOTES = [
    { title: "The Context Crisis", meta: "Substack · Jan 20, 2026", href: "https://pooyamalek.substack.com/p/the-context-crisis" },
    { title: "Self-Curiosity", meta: "Substack · Jan 1, 2026", href: "https://pooyamalek.substack.com/p/self-curiosity" },
    { title: "The Quiet Freedom of Not Knowing", meta: "Substack · Dec 8, 2025", href: "https://pooyamalek.substack.com/p/the-quiet-freedom-of-not-knowing" }
  ];

  var BOOKS = [
    { title: "The Design of Everyday Things", meta: "Don Norman", isbn: "9780465050659",
      why: "The book that taught me to blame the design, not the user. I still think in affordances and signifiers every day." },
    { title: "A Pattern Language", meta: "Christopher Alexander", isbn: "9780195019193",
      why: "Proof that good design is really about naming the problem precisely. I return to it whenever a system feels messier than it should." },
    { title: "Zen and the Art of Motorcycle Maintenance", meta: "Robert Pirsig", isbn: "9780060589462",
      why: "The clearest explanation I've found for why craft and care aren't the same thing as perfectionism." },
    { title: "Meditations", meta: "Marcus Aurelius", isbn: "9780140449334",
      why: "Two thousand years old and still the best career advice I've read: control what's yours, let the rest go." },
    { title: "Man's Search for Meaning", meta: "Viktor Frankl", isbn: "9780807014295",
      why: "A book about finding purpose inside constraints, which is basically what mentoring is." },
    { title: "Thinking in Systems", meta: "Donella Meadows", isbn: "9781603580557",
      why: "Changed how I see every product problem. It's rarely the screen, it's the loop behind it." }
  ];

  // Playlist embed lives on the Vibes page itself; see renderAboutVibes.
  var SPOTIFY_PLAYLIST_ID = "4oRzgnJ9saRxGuNM3VwKyR";

  // Placeholder shots for the Photography page layout, swap for real ones
  // whenever there's a gallery to show. Picsum seeds keep the same image
  // per slot on every load instead of changing on refresh.
  var PHOTOS = [
    { seed: "pm-01", w: 800, h: 1000 },
    { seed: "pm-02", w: 800, h: 800 },
    { seed: "pm-03", w: 800, h: 1100 },
    { seed: "pm-04", w: 800, h: 900 },
    { seed: "pm-05", w: 800, h: 1000 },
    { seed: "pm-06", w: 800, h: 800 }
  ];

  // Shared row for anything that's a title + meta + an action, read as a
  // list rather than a card: resources, and (via caseListItem) case studies.
  function listRow(opts) {
    var tag = opts.href ? 'a' : 'button';
    var attrs = opts.href ? ' href="' + opts.href + '"' : ' data-resource="' + opts.id + '" id="' + opts.id + '"';
    return '<' + tag + ' class="rcard"' + attrs + '>' +
      '<div><div class="t">' + opts.title + '</div><div class="m">' + opts.meta + '</div>' +
      (opts.tag ? '<div class="gap-tag">' + opts.tag + '</div>' : '') + '</div>' +
      '<span class="get">' + opts.action + '</span></' + tag + '>';
  }

  function resourceCard(r) {
    return listRow({ id: r.id, title: r.t, meta: r.m, tag: r.gap, action: 'Download' });
  }

  function offerCard(o) {
    return '<div class="ocard">' +
      '<h2>' + o.h + '</h2><p>' + o.p + '</p>' +
      '<div class="who">' + o.who + '</div>' +
    '</div>';
  }

  function turnCard(s) {
    return '<div class="turn">' +
      '<div class="turn-was">' + s.was + '</div>' +
      '<div class="turn-bridge">' + s.shift + '</div>' +
      '<span class="turn-now">' + s.now + '</span>' +
    '</div>';
  }

  function testimonialCard(t) {
    return '<figure class="testi-card">' +
      '<blockquote>&ldquo;' + t.quote + '&rdquo;</blockquote>' +
      '<figcaption>' + t.name + (t.placeholder ? ' <span class="ph-tag">placeholder</span>' : '') + '</figcaption>' +
    '</figure>';
  }

  function bookCard(b, i) {
    var cover = 'https://covers.openlibrary.org/b/isbn/' + b.isbn + '-L.jpg';
    return '<div class="book-card reveal d' + ((i % 3) + 1) + '">' +
      '<div class="book-cover">' +
        '<img src="' + cover + '" alt="' + b.title + ' cover" loading="lazy" />' +
        '<div class="book-why"><p>&ldquo;' + b.why + '&rdquo;</p></div>' +
      '</div>' +
      '<div class="book-meta"><span>' + b.title + '</span><small>' + b.meta + '</small></div>' +
    '</div>';
  }

  function noteCard(n, i) {
    return '<a class="note-card reveal d' + ((i % 3) + 1) + '" href="' + n.href + '" target="_blank" rel="noopener">' +
      '<span class="note-index">' + String(i + 1).padStart(2, "0") + '</span>' +
      '<h3>' + n.title + '</h3>' +
      '<div class="note-foot"><small>' + n.meta + '</small><span class="arrow" aria-hidden="true">&rarr;</span></div>' +
    '</a>';
  }

  function caseListItem(c) {
    return listRow({ href: '#/design/professional/' + c.slug, title: c.title, meta: c.hook, tag: c.tag,
      action: 'Read <span class="arrow" aria-hidden="true">&rarr;</span>' });
  }

  function caseDetail(c) {
    return '' +
    liquidHeroOpen() +
      '<p class="reveal" style="margin:0 0 1.4rem;"><a href="#/design/professional" class="btn-textlink">&larr; Back to work</a></p>' +
      '<p class="kicker reveal">' + c.tag + '</p>' +
      '<h1 class="reveal d1">' + c.title + '</h1>' +
    '</div></section>' +
    '<section style="padding-top:0;"><div class="wrap">' +
      '<article class="case reveal">' +
        '<div class="case-top"><span class="case-role">' + c.role + '</span><span class="case-tag">' + c.tag + '</span></div>' +
        '<div class="case-block" style="margin-top:1.8rem;"><div class="k">The problem</div><p>' + c.problem + '</p></div>' +
        '<div class="turn"><div class="turn-stage">The decision</div><span class="case-decision">' + c.decision + '</span></div>' +
        '<div class="case-block"><div class="k">Why it mattered</div><p>' + c.matters + '</p></div>' +
        '<div class="case-out">' + c.outcomes.map(function (o) { return '<div><div class="n">' + o.n + '</div><div class="l">' + o.l + '</div></div>'; }).join("") + '</div>' +
      '</article>' +
      '<p class="soft-note reveal">Metrics in brackets are placeholders.</p>' +
      '<p class="section-close reveal">Want your work to read like this? <a href="#/mentorship">Explore mentorship &rarr;</a></p>' +
    '</div></section>';
  }

  // ---- Mentorship ----

  function renderMentorshipHome() {
    return '' +
    '<section class="hub-head hero-liquid">' + liquidCanvasTag() + '<div class="wrap">' +
      '<h1>Find the one thing keeping you at <em>mid-level.</em></h1>' +
      '<p class="sub">13 years in product design. 120+ designers mentored. One honest assessment to find out what\'s really holding you back.</p>' +
      '<div class="hero-actions">' +
        '<a class="btn-textlink" href="#/mentorship/home/work-with-me">Explore ways to work <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
      '</div>' +
    '</div></section>' +

    '<section><div class="wrap">' +
      '<div class="section-head stories-head reveal">' +
        '<div class="stories-head-top">' +
          '<p class="kicker">What changed for people I\'ve worked with</p>' +
          '<div class="stories-nav">' +
            '<button class="stories-arrow" data-stories-scroll="-1" aria-label="Previous story">&larr;</button>' +
            '<button class="stories-arrow" data-stories-scroll="1" aria-label="Next story">&rarr;</button>' +
          '</div>' +
        '</div>' +
        '<h2>Not quotes on a wall. Real turns.</h2>' +
      '</div>' +
      '<div class="stories reveal">' + STORIES.map(turnCard).join("") + '</div>' +
      '<p class="soft-note reveal">Names left out on purpose. These are placeholders, real anonymized stories are on the way.</p>' +
    '</div></section>' +

    '<section id="work-with-me"><div class="wrap">' +
      '<div class="section-head reveal"><p class="kicker">Ways to work</p><h2>Three ways in. Same goal: <em>clarity.</em></h2></div>' +
      '<div class="offer-grid">' + OFFERS.map(offerCard).join("") + '</div>' +
      '<div class="offer-cta reveal"><a class="btn solid" href="#" data-booking-link>Book a time <span class="arrow" aria-hidden="true">&rarr;</span></a></div>' +
    '</div></section>' +

    '<section class="honest"><div class="wrap">' +
      '<div class="section-head reveal"><p class="kicker">Being honest</p><h2>This probably isn\'t for you if&hellip;</h2></div>' +
      '<ul class="honest-list reveal">' +
        '<li>You want someone to tell you your work is great and leave it there.</li>' +
        '<li>You\'re looking for a quick portfolio polish, not a change in how you think about your career.</li>' +
        '<li>You want a template to copy rather than a way of reasoning you can reuse.</li>' +
      '</ul>' +
    '</div></section>' +

    '<section><div class="wrap">' +
      '<p class="kicker">One more thing</p>' +
      '<p class="lead">Free guides and templates, no email wall.</p>' +
      '<a class="btn ghost" style="margin-top:1.2rem;" href="#/mentorship/resources">See free resources <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
    '</div></section>';
  }

  function renderMentorshipResources() {
    return '' +
    liquidHeroOpen() +
      '<p class="kicker reveal">Take something with you</p>' +
      '<h1 class="reveal d1">Free. No email wall. <em>Just useful.</em></h1>' +
      '<p class="sub reveal d2">Start with these whether or not we ever talk. If they help, you\'ll know where to find me.</p>' +
    '</div></section>' +
    '<section style="padding-top:0;"><div class="wrap">' +
      '<div class="grid-2">' + RESOURCES.map(resourceCard).join("") + '</div>' +
      '<p class="soft-note reveal">Everything here is free today. <b>A small library of deeper guides is on the way</b>, and this is where it will live.</p>' +
    '</div></section>' +
    '<section class="cta-band"><div class="wrap"><div class="cta-card reveal"><div class="inner">' +
        '<p class="kicker" style="color:var(--btn-fg);">Stay close</p>' +
        '<h2>Get the thinking every couple of weeks.</h2>' +
        '<p>The newsletter is where the harder questions go, the ones without clean answers.</p>' +
        '<div class="cta-actions">' +
          '<a class="btn on-purple" href="https://pooyamalek.substack.com" target="_blank" rel="noopener">Read the newsletter <span class="arrow" aria-hidden="true">&#8599;</span></a>' +
          '<a class="btn on-purple-ghost" href="#" data-booking-link>Book a time</a>' +
        '</div>' +
      '</div></div></div></section>';
  }

  function renderMentorshipLearn() {
    return '' +
    liquidHeroOpen() +
      '<p class="kicker reveal">Learn</p>' +
      '<h1 class="reveal d1">Structured lessons, <em>on the way.</em></h1>' +
      '<p class="sub reveal d2">Course content from UserX Academy and beyond is landing on this page. Until then, a live session is still the fastest way in.</p>' +
      '<div class="hero-actions reveal d2">' +
        '<a class="btn solid" href="#" data-booking-link>Book a time <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
        '<a class="btn-textlink" href="#/mentorship/resources">See free resources <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
      '</div>' +
    '</div></section>';
  }

  function renderMentorshipPlan() {
    var saved = window.ClarityAssessment && window.ClarityAssessment.getSavedPlan();
    if (!saved || !saved.gap) {
      return '<section class="plan-empty"><div class="wrap">' +
        '<p class="kicker">Your plan</p><h1>No saved plan yet.</h1>' +
        '<p class="lead" style="margin-left:auto;margin-right:auto;">Take the Clarity Assessment once and your result lives here, so you can come back to it any time.</p>' +
        '<div style="margin-top:1.6rem;"><a class="btn solid" href="#/mentorship/assessment">Take the 3-minute assessment <span class="arrow" aria-hidden="true">&rarr;</span></a></div>' +
      '</div></section>';
    }
    return '<section style="padding-top:0;"><div class="wrap"><div id="savedPlanMount"></div></div></section>';
  }

  // ---- Design ----

  // Opening tag for a hero that carries the WebGL liquid-glow background
  // (see initLiquidCanvas in app.js). The canvas is inert markup here,
  // app.js finds it by class after render and mounts the effect on it.
  // liquidHeroOpen covers the standard .hero shape; liquidCanvasTag is for
  // sections like Mentorship's .hub-head that need the same background on
  // a differently-shaped hero.
  function liquidCanvasTag() {
    return '<canvas class="liquid-canvas" aria-hidden="true"></canvas>';
  }
  function liquidHeroOpen() {
    return '<section class="hero hero-liquid">' + liquidCanvasTag() + '<div class="wrap">';
  }

  function renderDesignProfessional(deep) {
    var match = CASE_STUDIES.filter(function (c) { return c.slug === deep; })[0];
    if (match) return caseDetail(match);
    return '' +
      liquidHeroOpen() +
        '<p class="kicker reveal">Selected work</p>' +
        '<h1 class="reveal d1">Decisions, not just <em>screens.</em></h1>' +
        '<p class="sub reveal d2">Two problems where the interesting part was the thinking. Confidential product detail is left out on purpose.</p>' +
      '</div></section>' +
      '<section style="padding-top:0;"><div class="wrap">' +
        '<div class="grid-2">' + CASE_STUDIES.map(caseListItem).join("") + '</div>' +
        '<p class="soft-note reveal">What matters is how the call got made, which is the same thing I teach.</p>' +
      '</div></section>';
  }

  function renderDesignPersonal() {
    return '' +
    liquidHeroOpen() +
      '<p class="kicker reveal">Personal</p>' +
      '<h1 class="reveal d1">Side projects, <em>for the fun of it.</em></h1>' +
      '<p class="sub reveal d2">Things built outside of work, just to make something. Landing here soon.</p>' +
    '</div></section>';
  }

  // ---- About (its own tab, plus reachable from the footer) ----

  function renderAboutNotes() {
    return '' +
    '<section class="hero"><div class="wrap">' +
      '<p class="kicker reveal">Notes</p>' +
      '<h1 class="reveal d1">The thinking, in <em>longer form.</em></h1>' +
      '<p class="sub reveal d2">The harder questions, the ones without clean answers, go here first, every couple of weeks.</p>' +
    '</div></section>' +
    '<section style="padding-top:0;"><div class="wrap">' +
      '<div class="notes-grid">' + NOTES.map(noteCard).join("") + '</div>' +
      '<div class="notes-more reveal"><a class="btn-textlink" href="https://pooyamalek.substack.com" target="_blank" rel="noopener">See all on Substack <span class="arrow" aria-hidden="true">&#8599;</span></a></div>' +
      '<p class="soft-note reveal">Pulled from Substack by hand, not a live feed, updated whenever something new goes out.</p>' +
    '</div></section>';
  }

  function renderAboutVibes() {
    return '' +
    '<section class="hero"><div class="wrap">' +
      '<p class="kicker reveal">Vibes</p>' +
      '<h1 class="reveal d1">What\'s on <em>repeat.</em></h1>' +
      '<p class="sub reveal d2">A playlist I keep coming back to, off the clock.</p>' +
    '</div></section>' +
    '<section style="padding-top:0;"><div class="wrap">' +
      '<div class="spotify-embed"><iframe src="https://open.spotify.com/embed/playlist/' + SPOTIFY_PLAYLIST_ID + '?utm_source=generator&theme=0" width="100%" height="480" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Pooya\'s Spotify playlist"></iframe></div>' +
    '</div></section>';
  }

  function renderAboutBooks() {
    return '' +
    '<section class="hero"><div class="wrap">' +
      '<p class="kicker reveal">Books</p>' +
      '<h1 class="reveal d1">What I\'ve been <em>reading.</em></h1>' +
      '<p class="sub reveal d2">Design and a bit of philosophy, off the clock. Hover a cover to see why it stuck.</p>' +
    '</div></section>' +
    '<section style="padding-top:0;"><div class="wrap">' +
      '<div class="books-grid">' + BOOKS.map(bookCard).join("") + '</div>' +
    '</div></section>';
  }

  function renderAboutPhotography() {
    return '' +
    '<section class="hero"><div class="wrap">' +
      '<p class="kicker reveal">Photography</p>' +
      '<h1 class="reveal d1">A few frames, <em>off the clock.</em></h1>' +
      '<p class="sub reveal d2">The real gallery is still being put together, these are stand-ins so the layout has something to show.</p>' +
    '</div></section>' +
    '<section style="padding-top:0;"><div class="wrap">' +
      '<div class="photo-grid">' +
        PHOTOS.map(function (p) {
          return '<div class="photo-tile"><img src="https://picsum.photos/seed/' + p.seed + '/' + p.w + '/' + p.h + '" alt="" loading="lazy" width="' + p.w + '" height="' + p.h + '" /></div>';
        }).join("") +
      '</div>' +
      '<p class="soft-note reveal">Placeholder shots from Picsum. Real photos go here.</p>' +
    '</div></section>';
  }

  function renderAboutStory() {
    return '' +
    '<section class="story-hero"><div class="wrap story-hero-grid">' +
      '<div class="story-hero-text reveal">' +
        '<p class="kicker">Story</p>' +
        '<h1>A designer who kept noticing the same <em>thing.</em></h1>' +
        '<p class="lead">Most good designers aren\'t stuck on skill. They\'re stuck on clarity. Fixing that turned out to be the work I care about most.</p>' +
      '</div>' +
      '<div class="story-hero-photo"><img src="assets/pooya.jpg" alt="Pooya Malek" /></div>' +
    '</div></section>' +

    '<section><div class="wrap">' +
      '<div class="about-grid">' +
        '<div class="about-body reveal">' +
          '<p>For thirteen years I\'ve designed products people use to book flights, find homes, and buy things online. Now I spend part of my time helping other designers figure out what they\'re missing.</p>' +
          '<p>I\'m a <strong>Product Design Lead and Functional Lead at Eurowings Digital</strong>, where I own the partner and ancillary experience across post-booking, a portfolio of six-plus products. I co-built the design team there from five to twenty-plus people and shipped systems adopted across multiple integrations.</p>' +
          '<p>Along the way I kept noticing the same thing. Most designers who are genuinely good at their craft have no idea how their career actually works. They\'re stuck not because of skill, but because of clarity.</p>' +
          '<p>So I started helping. <strong>As an ADPList Top 50 Mentor</strong> with twenty-plus mentees, as <strong>Lead Instructor at UserX Academy</strong> across four cohorts and a hundred and twenty-plus students, and through writing on Substack.</p>' +
          '<p>If you\'re a designer trying to level up, or a company building a design function in a consumer or travel product, I\'d like to hear from you.</p>' +
        '</div>' +
        '<aside class="about-side reveal d1">' +
          '<div class="row"><div class="k">Now</div><div class="v">Product Design Lead, Eurowings Digital</div></div>' +
          '<div class="row"><div class="k">Before</div><div class="v">ImmobilienScout24 &middot; Best Buy Canada</div></div>' +
          '<div class="row"><div class="k">Teaching</div><div class="v">Lead Instructor, UserX Academy &middot; 4 cohorts</div></div>' +
          '<div class="row"><div class="k">Mentoring</div><div class="v">ADPList Top 50 &middot; 20+ mentees</div></div>' +
          '<div class="row"><div class="k">Based in</div><div class="v">Berlin, Germany</div></div>' +
          '<div class="row"><div class="k">Languages</div><div class="v">Persian, English, Spanish, French</div></div>' +
        '</aside>' +
      '</div>' +
    '</div></section>' +

    '<section class="logos"><div class="wrap">' +
      '<p class="logos-label reveal">Teams I\'ve been part of</p>' +
      '<div class="logos-grid">' + COMPANIES.map(function (c, i) {
        var size = i === 0 ? ' big' : i === 6 ? ' wide' : i === 3 ? ' tall' : '';
        return '<div class="logo-block' + size + ' reveal d' + ((i % 3) + 1) + '"><span>' + c + '</span></div>';
      }).join("") + '</div>' +
    '</div></section>' +

    '<section class="testimonials"><div class="wrap">' +
      '<div class="section-head reveal"><p class="kicker">What people say</p><h2>Working with Pooya.</h2></div>' +
      '<div class="testi-grid reveal">' + TESTIMONIALS.map(testimonialCard).join("") + '</div>' +
      '<p class="soft-note reveal">Placeholder quotes. Real ones from colleagues and clients go here.</p>' +
      '<p class="section-close reveal">Bring the thing you can\'t figure out. <a href="#/mentorship">Explore mentorship &rarr;</a></p>' +
    '</div></section>';
  }

  window.Views = {
    mentorship: {
      home: renderMentorshipHome,
      resources: renderMentorshipResources,
      learn: renderMentorshipLearn,
      plan: renderMentorshipPlan,
      assessment: function () { return '<div class="wrap"><div class="asmt"><div class="asmt-card"><div class="progress" aria-hidden="true"><span id="bar"></span></div><div id="stage" aria-live="polite"></div></div></div></div>'; }
    },
    design: { professional: renderDesignProfessional, personal: renderDesignPersonal },
    about: { story: renderAboutStory, notes: renderAboutNotes, vibes: renderAboutVibes, books: renderAboutBooks, photography: renderAboutPhotography },
    RESOURCES: RESOURCES
  };
})();
