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

  var HERO_STATS = [
    { n: "13", l: "Years in product design" },
    { n: "120+", l: "Designers mentored" },
    { n: "Top 50", l: "ADPList mentor" }
  ];

  // Rotated by wirePhilosophyRotator in app.js. All four render as normal
  // static text regardless, JS just crossfades between them when motion
  // isn't reduced, so nothing here is screen-reader-only or hidden content.
  var PHILOSOPHY_LINES = [
    "It's not a portfolio review.",
    "It's making the judgment behind your decisions visible.",
    "It's the structural feedback your manager isn't giving you.",
    "It's finding the one thing that's actually in your way."
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

  // Playlist embed lives on the Listening page itself; see renderAboutVibes.
  var SPOTIFY_PLAYLIST_ID = "4oRzgnJ9saRxGuNM3VwKyR";

  // Placeholder shots for the Seeing page layout, swap for real ones
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
    return '<' + tag + ' class="card rcard"' + attrs + '>' +
      '<div><div class="t">' + opts.title + '</div><div class="m">' + opts.meta + '</div>' +
      (opts.tag ? '<div class="gap-tag">' + opts.tag + '</div>' : '') + '</div>' +
      '<span class="get">' + opts.action + '</span></' + tag + '>';
  }

  function resourceCard(r) {
    return listRow({ id: r.id, title: r.t, meta: r.m, tag: r.gap, action: 'Download' });
  }

  function offerCard(o) {
    return '<div class="card ocard">' +
      '<h2>' + o.h + '</h2><p>' + o.p + '</p>' +
      '<div class="who">' + o.who + '</div>' +
    '</div>';
  }

  function turnCard(s) {
    return '<div class="card turn">' +
      '<div class="turn-was">' + s.was + '</div>' +
      '<div class="turn-bridge">' + s.shift + '</div>' +
      '<span class="turn-now">' + s.now + '</span>' +
    '</div>';
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
    return '<a class="card note-card reveal d' + ((i % 3) + 1) + '" href="' + n.href + '" target="_blank" rel="noopener">' +
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
    '<section><div class="wrap">' +
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
      '<div class="hub-text">' +
        '<h1 class="reveal">Find the one thing keeping you at <em>mid-level.</em></h1>' +
      '</div>' +
      '<div class="hero-stats reveal d2">' + HERO_STATS.map(function (s) { return '<div class="stat"><span class="n">' + s.n + '</span><span class="l">' + s.l + '</span></div>'; }).join("") + '</div>' +
    '</div></section>' +

    '<section class="philosophy"><div class="wrap">' +
      '<div class="section-head reveal">' +
        '<h2>Design mentorship isn\'t a Figma critique.</h2>' +
      '</div>' +
      '<div class="philosophy-rotator reveal d1">' +
        PHILOSOPHY_LINES.map(function (t) { return '<p class="rotator-line">' + t + '</p>'; }).join("") +
      '</div>' +
    '</div></section>' +

    '<section id="work-with-me"><div class="wrap">' +
      '<div class="section-head reveal"><p class="kicker">Ways to work</p><h2>Three ways in. Same goal: <em>clarity.</em></h2></div>' +
      '<div class="offer-grid">' + OFFERS.map(offerCard).join("") + '</div>' +
      '<div class="offer-cta reveal"><a class="btn-textlink cta-purple" href="#" data-booking-link>Book a time <span class="arrow" aria-hidden="true">&rarr;</span></a></div>' +
    '</div></section>' +

    '<section><div class="wrap">' +
      '<div class="section-head stories-head reveal">' +
        '<p class="kicker">What changed for people I\'ve worked with</p>' +
        '<h2>Not quotes on a wall. Real turns.</h2>' +
      '</div>' +
      '<div class="stories reveal">' + STORIES.map(turnCard).join("") + '</div>' +
      '<p class="soft-note reveal">Names left out on purpose. These are placeholders, real anonymized stories are on the way.</p>' +
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
      '<a class="btn-textlink" style="margin-top:1.2rem;" href="#/mentorship/resources">See free resources <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
    '</div></section>';
  }

  function renderMentorshipResources() {
    return '' +
    liquidHeroOpen() +
      '<p class="kicker reveal">Take something with you</p>' +
      '<h1 class="reveal d1">Free. No email wall. <em>Just useful.</em></h1>' +
      '<p class="sub reveal d2">Start with these whether or not we ever talk. If they help, you\'ll know where to find me.</p>' +
    '</div></section>' +
    '<section><div class="wrap">' +
      '<div class="grid-2">' + RESOURCES.map(resourceCard).join("") + '</div>' +
      '<p class="soft-note reveal">Everything here is free today. <b>A small library of deeper guides is on the way</b>, and this is where it will live.</p>' +
    '</div></section>' +
    '<section class="cta-band"><div class="wrap"><div class="cta-card reveal"><div class="inner">' +
        '<p class="kicker" style="color:var(--btn-fg);">Stay close</p>' +
        '<h2>Get the thinking every couple of weeks.</h2>' +
        '<p>The newsletter is where the harder questions go, the ones without clean answers.</p>' +
        '<div class="cta-actions">' +
          '<a class="btn on-purple" href="https://pooyamalek.substack.com" target="_blank" rel="noopener">Read the newsletter <span class="arrow" aria-hidden="true">&#8599;</span></a>' +
          '<a class="btn on-purple-ghost" href="#" data-booking-link>Book a time <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
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
        '<a class="btn-textlink cta-purple" href="#" data-booking-link>Book a time <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
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

  // One area for the whole flow: #assessmentArea starts as the intro pitch
  // and CTA, and assessment.js replaces its own content in place with the
  // progress bar + step mount once "Start" is clicked, the same way each
  // question later replaces the previous one. No separate hero-then-card
  // split, no hidden section revealed below, just one hero-liquid section
  // that carries the whole thing through to the result.
  function renderMentorshipAssessment() {
    return '' +
    liquidHeroOpen() +
      '<div id="assessmentArea">' +
        '<p class="kicker reveal">The Clarity Assessment</p>' +
        '<h1 class="reveal d1">Let\'s find the one thing<br>keeping you at <em>mid-level.</em></h1>' +
        '<p class="sub reveal d2">Seven honest questions, about three minutes. I\'ll read your answers the way I would in a session and give you a straight diagnosis, plus a plan you can actually run. No score to feel bad about.</p>' +
        '<div class="hero-actions reveal d2">' +
          '<button class="btn solid" id="assessmentBegin">Start the diagnosis <span class="arrow" aria-hidden="true">&rarr;</span></button>' +
        '</div>' +
        '<p class="fineprint reveal d2">Free. Takes a few minutes. Your answers stay on your device.</p>' +
      '</div>' +
    '</div></section>';
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
      '<section><div class="wrap">' +
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
    '<section><div class="wrap">' +
      '<div class="notes-grid">' + NOTES.map(noteCard).join("") + '</div>' +
      '<div class="notes-more reveal"><a class="btn-textlink" href="https://pooyamalek.substack.com" target="_blank" rel="noopener">See all on Substack <span class="arrow" aria-hidden="true">&#8599;</span></a></div>' +
      '<p class="soft-note reveal">Pulled from Substack by hand, not a live feed, updated whenever something new goes out.</p>' +
    '</div></section>';
  }

  function renderAboutVibes() {
    return '' +
    '<section class="hero"><div class="wrap">' +
      '<p class="kicker reveal">Listening</p>' +
      '<h1 class="reveal d1">What\'s on <em>repeat.</em></h1>' +
      '<p class="sub reveal d2">A playlist I keep coming back to, off the clock.</p>' +
    '</div></section>' +
    '<section><div class="wrap">' +
      '<div class="spotify-embed"><iframe src="https://open.spotify.com/embed/playlist/' + SPOTIFY_PLAYLIST_ID + '?utm_source=generator&theme=0" width="100%" height="480" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Pooya\'s Spotify playlist"></iframe></div>' +
    '</div></section>';
  }

  function renderAboutBooks() {
    return '' +
    '<section class="hero"><div class="wrap">' +
      '<p class="kicker reveal">Reading</p>' +
      '<h1 class="reveal d1">What I\'ve been <em>reading.</em></h1>' +
      '<p class="sub reveal d2">Design and a bit of philosophy, off the clock. Hover a cover to see why it stuck.</p>' +
    '</div></section>' +
    '<section><div class="wrap">' +
      '<div class="books-grid">' + BOOKS.map(bookCard).join("") + '</div>' +
    '</div></section>';
  }

  function renderAboutPhotography() {
    return '' +
    '<section class="hero"><div class="wrap">' +
      '<p class="kicker reveal">Seeing</p>' +
      '<h1 class="reveal d1">A few frames, <em>off the clock.</em></h1>' +
      '<p class="sub reveal d2">The real gallery is still being put together, these are stand-ins so the layout has something to show.</p>' +
    '</div></section>' +
    '<section><div class="wrap">' +
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
        '<h1>Hi, I\'m <em>Pooya.</em></h1>' +
        '<p class="lead">I design products for a living, and I spend part of my time helping other designers figure out what\'s actually holding them back. Here\'s the short version of how I got here.</p>' +
      '</div>' +
      '<div class="story-hero-photo reveal d1"><img src="assets/pooya.jpg" alt="Pooya Malek" /></div>' +
    '</div></section>' +

    '<section><div class="wrap">' +
      '<div class="about-grid">' +
        '<div class="about-body reveal">' +
          '<p>For thirteen years I\'ve designed products people use to book flights, find homes, and buy things online. Right now I\'m <strong>Product Design Lead and Functional Lead at Eurowings Digital</strong> in Berlin, where I own the partner and ancillary experience across post-booking, a portfolio of six-plus products. I helped grow the design team there from five people to more than twenty, and the systems we built are still running across multiple integrations.</p>' +
          '<p>Along the way I kept noticing the same pattern. Designers who were clearly good at their craft had no idea how their career actually worked. They were doing strong work and still not getting promoted. Not because they lacked skill. Because they lacked clarity on what senior actually means and how to show it.</p>' +
          '<p>That\'s what pulled me into mentoring. I\'m a <strong>Top 50 Mentor on ADPList</strong> with twenty-plus mentees, and I\'ve been <strong>Lead Instructor at UserX Academy</strong> in Iran since 2021: four cohorts, over a hundred and twenty students. I write about the same questions on Substack.</p>' +
          '<p>If you\'re a designer trying to level up, or a company building a design function in travel or e-commerce, I\'d like to hear from you.</p>' +
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
        return '<div class="card logo-block' + size + ' reveal d' + ((i % 3) + 1) + '"><span>' + c + '</span></div>';
      }).join("") + '</div>' +
    '</div></section>' +

    '<section class="testimonials"><div class="wrap">' +
      '<div class="section-head reveal"><p class="kicker">What people say</p><h2>Working with Pooya.</h2></div>' +
      '<p class="lead reveal d1">The real feedback lives on ADPList, twenty-plus sessions and counting. Here\'s a live look.</p>' +
      '<div class="adplist-embed reveal d1"><iframe src="https://adplist.org/widgets/reviews?src=pooya-malek" title="Reviews for Pooya Malek on ADPList" loading="lazy"></iframe></div>' +
      '<p class="reveal d2" style="margin-top:1.2rem;"><a class="btn-textlink" href="https://adplist.org/mentors/pooya-malek" target="_blank" rel="noopener">See all reviews on ADPList <span class="arrow" aria-hidden="true">&#8599;</span></a></p>' +
      '<p class="section-close reveal">Bring the thing you can\'t figure out. <a href="#/mentorship">Explore mentorship &rarr;</a></p>' +
    '</div></section>';
  }

  // ---- Design system reference (#/system, not linked from the nav) ----
  // Every swatch/sample below renders through the site's real classes and
  // custom properties, not a copy of them, so this page can't quietly go
  // stale the way a separate written spec could. Update the token, this
  // page updates itself.

  var SG_COLORS = [
    { t: '--bg', hex: '#0A0A0D', note: 'Page background' },
    { t: '--surface', hex: '#121116', note: 'Card and tile surface' },
    { t: '--raise', hex: '#17161C', note: 'Raised band, e.g. Being honest' },
    { t: '--ink', hex: '#F5F4F7', note: 'Primary text' },
    { t: '--ink-soft', hex: '#B6B3BE', note: 'Secondary text, body copy' },
    { t: '--muted', hex: '#83808C', note: 'Tertiary text, meta and labels' },
    { t: '--line', hex: '#26242D', note: 'Standard border and divider' },
    { t: '--line-soft', hex: '#1E1D24', note: 'Subtler divider, used once by design' },
    { t: '--purple', hex: '#704DFF', note: 'Primary accent, solid fills' },
    { t: '--purple-2', hex: '#9A80FF', note: 'Links, kickers, text on dark' },
    { t: '--purple-press', hex: '#633DFF', note: 'Solid button hover/press only' },
    { t: '--wash', hex: '#1A1730', note: 'Tinted background band' },
    { t: '--ok', hex: '#4ADE80', note: 'Success state, not yet used in UI' }
  ];

  var SG_TYPE = [
    { t: '--s12', sample: 'Aa 176' }, { t: '--s11', sample: 'Aa 128' }, { t: '--s10', sample: 'Aa 90' },
    { t: '--s9', sample: 'Aa 62' }, { t: '--s8', sample: 'Aa 46' }, { t: '--s7', sample: 'Aa 36' },
    { t: '--s6', sample: 'Aa 29' }, { t: '--s5', sample: 'Aa 23' }, { t: '--s4', sample: 'Aa 19' },
    { t: '--s3', sample: 'Aa 15' }, { t: '--s2', sample: 'Aa 13' }, { t: '--s1', sample: 'Aa 12' }
  ];

  var SG_SPACE = ['--sp-1', '--sp-2', '--sp-3', '--sp-4', '--sp-5', '--sp-6', '--sp-7', '--sp-8', '--sp-9', '--sp-10'];

  var SG_RADIUS = [
    { t: '--radius', label: '10px · controls', note: 'Buttons, inputs, pills, tabs' },
    { t: '--radius-md', label: '16px · cards', note: 'Tiles, embeds, emphasis blocks' },
    { t: '--radius-lg', label: '20px · surfaces', note: 'CTA band, sheet, assessment card' }
  ];

  function sgSwatch(c) {
    return '<div class="sg-swatch"><span class="sg-swatch-color" style="background:var(' + c.t + ')"></span>' +
      '<div><div class="sg-swatch-name">' + c.t + '</div><div class="sg-swatch-note">' + c.hex + ' &middot; ' + c.note + '</div></div></div>';
  }

  function sgTypeRow(r) {
    return '<div class="sg-type-row"><span class="sg-type-label">' + r.t + '</span><span class="sg-type-sample" style="font-size:var(' + r.t + ')">' + r.sample + '</span></div>';
  }

  function sgSpaceRow(t) {
    return '<div class="sg-space-row"><span class="sg-type-label">' + t + '</span><span class="sg-space-bar" style="width:var(' + t + ')"></span></div>';
  }

  function sgRadiusBox(r) {
    return '<div class="sg-radius-item"><span class="sg-radius-box" style="border-radius:var(' + r.t + ')"></span>' +
      '<div><div class="sg-swatch-name">' + r.t + '</div><div class="sg-swatch-note">' + r.label + ' &middot; ' + r.note + '</div></div></div>';
  }

  function sgSection(kicker, title, body) {
    return '<section><div class="wrap">' +
      '<div class="section-head reveal"><p class="kicker">' + kicker + '</p><h2>' + title + '</h2></div>' +
      '<div class="sg-block reveal d1">' + body + '</div>' +
    '</div></section>';
  }

  function renderStyleGuide() {
    return '' +
    '<section class="hero"><div class="wrap">' +
      '<p class="kicker reveal">Reference, not a page</p>' +
      '<h1 class="reveal d1">Design <em>system.</em></h1>' +
      '<p class="sub reveal d2">Every token and component below is the real thing, rendered with the site\'s actual CSS. Not linked from navigation, bookmark the URL.</p>' +
    '</div></section>' +

    sgSection('Color', 'Tokens, not hex codes.', '<div class="sg-swatches">' + SG_COLORS.map(sgSwatch).join("") + '</div>') +

    sgSection('Type', 'Twelve steps, fluid between 375 and 1440px.', '<div class="sg-type-scale">' + SG_TYPE.map(sgTypeRow).join("") + '</div>') +

    sgSection('Space', 'One scale, from 4px to 128px.', '<div class="sg-space-scale">' + SG_SPACE.map(sgSpaceRow).join("") + '</div>') +

    sgSection('Radius', 'Three tiers. Reach for the closest one before adding a new value.', '<div class="sg-radius-list">' + SG_RADIUS.map(sgRadiusBox).join("") + '</div>') +

    sgSection('Buttons and links', 'One role, one treatment, every time it appears.', '' +
      '<div class="sg-row"><a class="btn solid">Primary</a><span class="sg-row-note">.btn.solid &middot; the one action on a screen that matters most</span></div>' +
      '<div class="sg-row"><a class="btn ghost">Secondary</a><span class="sg-row-note">.btn.ghost &middot; an alternative, present but not competing</span></div>' +
      '<div class="sg-row sg-row-purple"><a class="btn on-purple">On purple</a><a class="btn on-purple-ghost">On purple ghost</a><span class="sg-row-note">.btn.on-purple / .on-purple-ghost &middot; primary/secondary when the surface itself is solid purple</span></div>' +
      '<div class="sg-row"><a class="btn-textlink">Inline link <span class="arrow" aria-hidden="true">&rarr;</span></a><span class="sg-row-note">.btn-textlink &middot; low-commitment navigation, not a decision</span></div>' +
      '<div class="sg-row"><a class="btn-textlink cta-purple">Book a time <span class="arrow" aria-hidden="true">&rarr;</span></a><span class="sg-row-note">.btn-textlink.cta-purple &middot; reserved for the one recurring conversion action, everywhere it appears</span></div>' +
      '<div class="sg-row"><span class="rcard sg-get-demo"><span class="get">Card action <span class="arrow" aria-hidden="true">&rarr;</span></span></span><span class="sg-row-note">.get &middot; compact action embedded inside a .rcard row, scoped to appear only there</span></div>'
    ) +

    sgSection('Cards', 'One shared surface (.card), each component adds only its own layout.', '' +
      '<div class="sg-card-grid">' +
        '<div class="card sg-demo-card"><div class="sg-demo-t">Surface</div><div class="sg-demo-m">background, border, radius-md, hover-lift, all from .card</div></div>' +
        '<div class="card sg-demo-card"><div class="sg-demo-t">Used by</div><div class="sg-demo-m">.rcard .ocard .note-card .logo-block .stories .turn</div></div>' +
      '</div>'
    ) +

    sgSection('Motion', 'Three patterns, reused everywhere rather than invented per component.', '' +
      '<ul class="honest-list">' +
        '<li><b>Reveal</b> &middot; fade + 16px rise on scroll into view, staggered by .d1/.d2/.d3. Skipped entirely under prefers-reduced-motion.</li>' +
        '<li><b>Hover-lift</b> &middot; border tints purple, -3px translateY, soft shadow. Shared by every .card.</li>' +
        '<li><b>Arrow-slide</b> &middot; the arrow glyph next to a link nudges up-right on hover, shared by every button and text link.</li>' +
      '</ul>'
    ) +

    sgSection('Breakpoints', 'Picked per component from real content needs, not a fixed grid.', '' +
      '<ul class="honest-list">' +
        '<li><b>640px</b> &middot; grids go from 1-2 columns to 3-4 (books, notes, photos, team blocks)</li>' +
        '<li><b>720px</b> &middot; two-column tile grids, the Stories card\'s internal split</li>' +
        '<li><b>820px</b> &middot; About page\'s body/sidebar and Story hero\'s text/photo splits</li>' +
        '<li><b>960px</b> &middot; the site\'s main shift: rail navigation appears, sheets become modals, Philosophy splits in two</li>' +
        '<li><b>1300px</b> &middot; deliberately later than 960px, the Mentorship hero needs the extra room before it can share a row with the stats column</li>' +
      '</ul>'
    );
  }

  window.Views = {
    mentorship: {
      home: renderMentorshipHome,
      resources: renderMentorshipResources,
      learn: renderMentorshipLearn,
      plan: renderMentorshipPlan,
      assessment: renderMentorshipAssessment
    },
    design: { professional: renderDesignProfessional, personal: renderDesignPersonal },
    about: { story: renderAboutStory, notes: renderAboutNotes, vibes: renderAboutVibes, books: renderAboutBooks, photography: renderAboutPhotography },
    system: { guide: renderStyleGuide },
    RESOURCES: RESOURCES
  };
})();
