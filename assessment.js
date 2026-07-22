/* Pooya Malek · The Clarity Assessment · conversational diagnostic, static client-side flow */
(function () {

  // ---- Lead capture config ----
  // Get these from your ConvertKit (Kit) account:
  // Form ID: Grow > Landing Pages & Forms > open or create a form > the number in its URL.
  // API Key: Account Settings > Developer > API Keys > use "API Key", not "API Secret".
  var LEAD_CONFIG = {
    formId: 'REPLACE_WITH_CONVERTKIT_FORM_ID',
    apiKey: 'REPLACE_WITH_CONVERTKIT_API_KEY'
  };

  // Single seam for the email provider. Swap the body of this function to
  // change providers later without touching the rest of the flow.
  function submitLead(lead) {
    if (LEAD_CONFIG.formId.indexOf('REPLACE_WITH') === 0) {
      return Promise.reject(new Error('Lead capture is not configured yet.'));
    }
    return fetch('https://api.convertkit.com/v3/forms/' + LEAD_CONFIG.formId + '/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: LEAD_CONFIG.apiKey,
        email: lead.email,
        fields: { gap: lead.gap, urgency: lead.urgency }
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('ConvertKit responded with ' + res.status);
      return res.json();
    });
  }

  var GAPS = {
    visibility: {
      badge: "Your gap: visibility",
      name: "You're the one doing the work nobody sees.",
      read: "Here's the honest read. Your craft isn't the problem, and deep down you know that. The problem is that your thinking stays invisible. You hand over strong outcomes, but the judgment behind them, the part that reads as senior, never makes it into the room. People are evaluating what they can see, and right now they can't see the best of you.",
      plan: [
        "Before your next review, write down three decisions you made this quarter and what each one prevented or unlocked. Not tasks. Decisions.",
        "In your next design review, lead with the call and the tradeoff, not the walkthrough. Make your reasoning the headline.",
        "Ask your manager one question: what would they need to see to consider you senior? Then go make that visible on purpose."
      ],
      match: 'The <a href="resources.html#impact-over-output">Impact over Output</a> guide is the fastest way to start turning what you do into what people notice.'
    },
    framing: {
      badge: "Your gap: framing",
      name: "You talk about what you built, not what changed.",
      read: "The work is good. What's holding you back is how you frame it. You describe outputs, the redesign, the flow, the screens, when the people deciding your level need to hear impact. Same project, two different sentences. One keeps you at mid. The other gets you promoted. This is a framing problem, and framing is learnable fast.",
      plan: [
        "Take your last project. Write the outcome sentence you'd normally say. Then rewrite it as what changed because of the decision you made.",
        "Rebuild your portfolio's lead project around one hard call, not a tour of screens.",
        "Practice the difference out loud until impact-framing is your default, not your edit."
      ],
      match: 'Start with the <a href="resources.html#portfolio-decision-map">Portfolio Decision Map</a>. It turns a wall of screens into a story about decisions.'
    },
    story: {
      badge: "Your gap: telling the story",
      name: "Your work is strong. It falls apart when you present it.",
      read: "You're not stuck because of your skill. You're stuck at the moment you have to talk about it. In interviews or reviews you try to remember everything, so you ramble and run out of time before the point lands. Confidence here doesn't come from more slides. It comes from knowing one story so well that the decision, not the design, is what people remember.",
      plan: [
        "Pick one project. Cut it down to a single decision worth defending.",
        "Tell that story in ninety seconds, out loud, until the reasoning carries it without the visuals.",
        "In your next interview, lead with that story before they even ask. Set the frame yourself."
      ],
      match: 'The <a href="resources.html#interview-story-template">Interview Story Template</a> gives you the exact structure to make one project land.'
    },
    transition: {
      badge: "Your gap: the crossroads",
      name: "You're being pushed toward leading, and you're not sure.",
      read: "This isn't a skill gap, it's a clarity gap, and it's the most important kind to get right. You're being handed a management path because you're good, but nobody's asked whether it's the path you actually want. You don't need a title to lead. What you need is to separate what you want from what's being offered, before you say yes to a version of your career you didn't choose.",
      plan: [
        "Write two honest lists: what energizes you about the work, and what drains you. Be specific.",
        "Name what you'd be giving up if you moved to management, and whether that trade is worth it to you.",
        "Explore the staff or lead-IC track before you assume management is the only way up."
      ],
      match: 'This one\'s worth a real conversation. <a href="#" data-booking-link target="_blank" rel="noopener">A single session</a> is usually enough to see it clearly.'
    }
  };

  var QUESTIONS = [
    { q: "Let's start simple. Where are you right now?", help: "Pick whichever is closest. There's no wrong answer.", options: [
      { t: "I do strong work but keep getting passed over.", g: "visibility" },
      { t: "My portfolio or interviews aren't landing.", g: "story" },
      { t: "I feel ready for senior but can't prove it.", g: "framing" },
      { t: "I'm being nudged toward management and I'm unsure.", g: "transition" }
    ]},
    { q: "When your manager sees your work, what usually happens?", help: "Think about your last few reviews.", options: [
      { t: "They like it, but it doesn't move my case forward.", g: "visibility" },
      { t: "I end up describing what I built more than why.", g: "framing" },
      { t: "I get nervous and lose the thread.", g: "story" },
      { t: "They keep asking if I want to lead a team.", g: "transition" }
    ]},
    { q: "Be honest about your portfolio.", help: "Whichever stings a little is probably the true one.", options: [
      { t: "Lots of polished screens, not much thinking.", g: "framing" },
      { t: "Good work, but I can't tell the story of it.", g: "story" },
      { t: "Solid, but it doesn't show the decisions I made.", g: "visibility" },
      { t: "I've stopped updating it. I'm eyeing a lead role.", g: "transition" }
    ]},
    { q: "When you talk about a past project, you tend to...", help: "Your default, not your best day.", options: [
      { t: "List everything I delivered.", g: "framing" },
      { t: "Ramble, then run out of time.", g: "story" },
      { t: "Undersell the hard calls I made.", g: "visibility" },
      { t: "Talk about the team more than myself.", g: "transition" }
    ]},
    { q: "What would make the biggest difference in six months?", help: "The thing you actually want.", options: [
      { t: "Being recognized for the decisions I make.", g: "visibility" },
      { t: "A senior title and the raise that comes with it.", g: "framing" },
      { t: "Walking into interviews without freezing.", g: "story" },
      { t: "Knowing whether to manage or stay hands-on.", g: "transition" }
    ]},
    { q: "What's the quiet story you tell yourself about being stuck?", help: "Nobody sees this but you.", options: [
      { t: "Maybe my work just isn't good enough.", g: "framing" },
      { t: "I'm bad at selling myself.", g: "story" },
      { t: "No one really sees what I do.", g: "visibility" },
      { t: "I don't even know what I want next.", g: "transition" }
    ]},
    { q: "Last one. How soon do you need to move?", help: "This helps me point you to the right next step.", urgency: true, options: [
      { t: "Now. There's a review or a search on the clock.", u: "high" },
      { t: "In the next few months.", u: "mid" },
      { t: "Just exploring for now.", u: "low" }
    ]}
  ];

  var stage, bar, state, totalSteps = QUESTIONS.length + 2;
  function setBar(n) { bar.style.width = Math.round((n / totalSteps) * 100) + "%"; }
  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }

  function renderIntro() {
    setBar(0); stage.innerHTML = "";
    var s = el('<div class="step center-block">' +
      '<p class="kicker">The Clarity Assessment</p>' +
      '<h1>Let\'s find the one thing<br>keeping you at mid-level.</h1>' +
      '<p class="lead">Seven honest questions, about three minutes. I\'ll read your answers the way I would in a session and give you a straight diagnosis, plus a plan you can actually run. No score to feel bad about.</p>' +
      '<div class="field" style="justify-content:center;"><button class="btn solid" id="begin">Start the diagnosis <span class="arrow" aria-hidden="true">&rarr;</span></button></div>' +
      '<p class="fineprint">Free. Takes a few minutes. Your answers stay on your device.</p>' +
    '</div>');
    stage.appendChild(s);
    document.getElementById('begin').addEventListener('click', function () { state.i = 0; renderQuestion(); });
  }

  function renderQuestion() {
    var qi = state.i, Q = QUESTIONS[qi];
    setBar(qi + 1); stage.innerHTML = "";
    var opts = Q.options.map(function (o, idx) {
      var sel = state.answers[qi] && state.answers[qi].idx === idx ? " sel" : "";
      return '<button class="opt' + sel + '" data-idx="' + idx + '"><span class="dot" aria-hidden="true"></span><span>' + o.t + '</span></button>';
    }).join("");
    var s = el('<div class="step">' +
      '<div class="pooya-line"><span class="av">P</span><div><div class="who">Pooya asks</div></div></div>' +
      '<div class="q-text">' + Q.q + '</div>' +
      '<div class="q-help">' + Q.help + '</div>' +
      '<div class="options" role="group" aria-label="Choose one">' + opts + '</div>' +
      '<div class="nav-row"><button class="back" id="back"' + (qi === 0 ? ' hidden' : '') + '>&larr; Back</button>' +
      '<span class="count">Question ' + (qi + 1) + ' of ' + QUESTIONS.length + '</span></div>' +
    '</div>');
    stage.appendChild(s);
    s.querySelectorAll('.opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = +btn.getAttribute('data-idx'), o = Q.options[idx];
        state.answers[qi] = { idx: idx, g: o.g, u: o.u };
        if (Q.urgency) state.urgency = o.u;
        s.querySelectorAll('.opt').forEach(function (b) { b.classList.remove('sel'); });
        btn.classList.add('sel');
        setTimeout(function () { if (qi < QUESTIONS.length - 1) { state.i++; renderQuestion(); } else { renderGate(); } }, 260);
      });
    });
    var back = document.getElementById('back');
    if (back) back.addEventListener('click', function () { if (state.i > 0) { state.i--; renderQuestion(); } });
  }

  function computeGap() {
    var t = { visibility: 0, framing: 0, story: 0, transition: 0 };
    state.answers.forEach(function (a) { if (a && a.g) t[a.g]++; });
    var best = "visibility", max = -1;
    Object.keys(t).forEach(function (k) { if (t[k] > max) { max = t[k]; best = k; } });
    return best;
  }

  function renderGate() {
    setBar(totalSteps - 1); stage.innerHTML = "";
    var s = el('<div class="step center-block">' +
      '<div class="pooya-line" style="justify-content:center;"><span class="av">P</span><div><div class="who">Almost there</div></div></div>' +
      '<h1>Your read is ready.</h1>' +
      '<p class="lead">I\'ve gone through your answers. Where should I send your diagnosis and plan, so you have it to come back to?</p>' +
      '<form class="field" id="gate" style="justify-content:center;" novalidate>' +
      '<label class="sr-only" for="email">Email address</label>' +
      '<input type="email" id="email" name="email" placeholder="you@email.com" required autocomplete="email" />' +
      '<button class="btn solid" type="submit">Show me my result <span class="arrow" aria-hidden="true">&rarr;</span></button></form>' +
      '<p class="fineprint">One email with your plan, then the occasional note worth reading. Leave whenever you like.</p>' +
      '<div class="nav-row" style="justify-content:center;"><button class="back" id="back">&larr; Back</button></div>' +
    '</div>');
    stage.appendChild(s);
    document.getElementById('back').addEventListener('click', function () { state.i = QUESTIONS.length - 1; renderQuestion(); });
    document.getElementById('gate').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = document.getElementById('email').value.trim();
      if (!v || v.indexOf('@') < 1) { document.getElementById('email').focus(); return; }
      state.email = v;
      var gap = computeGap();
      try { localStorage.setItem('pm-assessment', JSON.stringify({ gap: gap, urgency: state.urgency, email: v, at: Date.now() })); } catch (err) {}
      // Optimistic: render the result immediately, do not block on the network.
      // The value to them is the plan, the signup is secondary.
      submitLead({ email: v, gap: gap, urgency: state.urgency }).catch(function () {
        var note = document.getElementById('leadNote');
        if (note) showLeadNote(note);
      });
      renderResult();
    });
  }

  function showLeadNote(note) {
    note.hidden = false;
    note.className = 'lead-note err';
    note.innerHTML = 'Couldn\'t save your email just now. Your plan below is still yours to keep. <button type="button" id="retryLead">Try again</button>';
    var retry = document.getElementById('retryLead');
    if (retry) retry.addEventListener('click', function () {
      note.className = 'lead-note';
      note.textContent = 'Retrying...';
      submitLead({ email: state.email, gap: computeGap(), urgency: state.urgency }).then(function () {
        note.className = 'lead-note';
        note.textContent = 'Got it. Your plan is on its way.';
      }).catch(function () { showLeadNote(note); });
    });
  }

  function renderResult() {
    setBar(totalSteps);
    var G = GAPS[computeGap()];
    var steps = G.plan.map(function (p, i) { return '<div class="plan-step"><span class="n">' + (i + 1) + '</span><p>' + p + '</p></div>'; }).join("");
    var primaryCta, secondaryCta;
    if (state.urgency === "high") {
      primaryCta = '<a class="btn solid" href="mailto:malek.pooya@gmail.com" data-booking-link target="_blank" rel="noopener">Book a session, let\'s fix this now <span class="arrow" aria-hidden="true">&rarr;</span></a>';
      secondaryCta = '<a class="btn ghost" href="resources.html">Grab the free resources</a>';
    } else {
      primaryCta = '<a class="btn solid" href="https://substack.com/@pooyamalek" target="_blank" rel="noopener">Get the thinking every two weeks <span class="arrow" aria-hidden="true">&#8599;</span></a>';
      secondaryCta = '<a class="btn ghost" href="mailto:malek.pooya@gmail.com" data-booking-link target="_blank" rel="noopener">Or book a session</a>';
    }
    stage.innerHTML = "";
    var s = el('<div class="step result">' +
      '<span class="result-badge">' + G.badge + '</span>' +
      '<h2>' + G.name + '</h2>' +
      '<p class="read">' + G.read + '</p>' +
      '<div class="plan"><div class="ph">Your three-step plan</div>' + steps + '</div>' +
      '<div class="match"><b>Start with this.</b> ' + G.match + '</div>' +
      '<p class="lead-note" id="leadNote" hidden></p>' +
      '<div class="result-cta">' + primaryCta + secondaryCta + '</div>' +
      '<div class="restart"><button id="restart">Retake the assessment</button></div>' +
    '</div>');
    stage.appendChild(s);
    if (window.applyBookingLinks) window.applyBookingLinks(s);
    document.getElementById('restart').addEventListener('click', function () { state = { i: -1, answers: [], urgency: "mid", email: "" }; renderIntro(); });
  }

  function start() {
    stage = document.getElementById('stage'); bar = document.getElementById('bar');
    if (!stage || !bar) return; // this page doesn't host the live quiz, e.g. plan.html
    state = { i: -1, answers: [], urgency: "mid", email: "" };
    renderIntro();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  // Exposed so plan.html can render a saved result without duplicating the gap data.
  window.CLARITY_GAPS = GAPS;
})();
