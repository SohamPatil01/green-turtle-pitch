/* ==========================================================
   Events, Bookings & Entry for The Green Turtle - Interactive proposal deck by AzeelaAI Labs
   Vanilla JavaScript. No libraries, no build step.
   All figures in the demos are illustrative demonstration data.
   ========================================================== */
(() => {
  "use strict";

  /* Edit these before presenting. Empty values are simply left out of the deck. */
  const CONFIG = {
    clientName: "The Green Turtle",
    companyName: "AzeelaAI Labs",
    contactEmail: "",   // add an email to show the closing button and open the mail app
    contactPhone: "",
    dateLabel: "November 2026",
  };

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ic = (n, cls = "") => `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const fmt = (n) => Math.round(n).toLocaleString("en-IN");
  const inr = (n) => "₹" + fmt(n);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const wait = (fn, ms) => setTimeout(fn, reduce ? 60 : ms);

  function countTo(el, to, dur = 1300, opts = {}) {
    const { format = fmt, suffix = "" } = opts;
    const from = el._v || 0;
    el._v = to;
    cancelAnimationFrame(el._raf);
    if (reduce || !dur) { el.textContent = format(to) + suffix; return; }
    const t0 = performance.now();
    const tick = (t) => {
      const p = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = format(from + (to - from) * e) + suffix;
      if (p < 1) el._raf = requestAnimationFrame(tick);
    };
    el._raf = requestAnimationFrame(tick);
  }

  /* ---------- QR-style illustration (decorative, NOT scannable, NOT a valid ticket) ---------- */
  function seeded(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h += 0x6d2b79f5; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  /* Always draw QR in dark ink on a white plate — currentColor vanishes on navy/scan UIs */
  function qrSvg(seed, size = 64, fg = "#0e3b2a") {
    const N = 25, r = seeded(seed);
    const fin = (x, y) => (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
    let cells = "";
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!fin(x, y) && r() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    const f = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
    return `<svg role="img" aria-label="Illustrative QR graphic, not a valid pass" viewBox="0 0 ${N} ${N}" width="${size}" height="${size}" fill="${fg}" shape-rendering="crispEdges">${cells}${f(0, 0)}${f(N - 7, 0)}${f(0, N - 7)}</svg>`;
  }
  function paintQR(root = document) {
    $$(".qr[data-seed]", root).forEach((el) => {
      if (el.dataset.done) return;
      el.innerHTML = qrSvg(el.dataset.seed, +el.dataset.size || 64);
      el.dataset.done = "1";
    });
  }
  const ticketHTML = (o = {}) => `
    <div class="ticket">
      <div class="ticket-top"><div class="s-row" style="align-items:flex-start"><div><div class="k">Admit family</div><div class="n">Annual Day 2027</div></div><span class="cat">FAMILY</span></div>
        <div class="meta"><span>${ic("calendar")} Sat, 20 Feb · 5:00 PM</span><span>${ic("pin")} The Green Turtle, Baner</span></div></div>
      <div class="perf"></div>
      <div class="ticket-bot"><div><div class="k">Booking reference</div><div class="ref">GT-2048-7731</div><span class="pill ok" style="margin-top:6px">${ic("check")} Confirmed</span></div><div class="qrw"><span class="qr" data-seed="GT-2048-7731" data-size="${o.qr || 60}"></span><small class="qr-cap">Illustrative QR</small></div></div>
    </div>`;

  /* ==========================================================
     Mode: deck (desktop) or stacked scroll (phones, portrait)
     ========================================================== */
  const deckMQ = matchMedia("(min-width: 900px) and (min-height: 520px)");
  const deck = deckMQ.matches;
  document.body.classList.toggle("deck-mode", deck);
  deckMQ.addEventListener("change", () => location.reload());

  /* ==========================================================
     The six journey slides
     ========================================================== */
  const STEPS = [
    { id: "step1", short: "Create", title: "Create an event", p: "Your team enters the details once. Everything else follows.", pts: ["Name, date and place", "Pass types, prices and seat limits", "Open booking when ready"],
      vis: `<div class="browser"><div class="browser-bar"><i></i><i></i><i></i><span>thegreenturtle.in/admin/new-event</span></div><div class="browser-body"><div class="s-title" style="font-size:16px">Create a new event</div><div class="form-grid">
        <div class="field" style="--n:0"><small>Event name</small><b>Summer Camp 2027, Week 1</b></div>
        <div class="two"><div class="field" style="--n:1"><small>Date and time</small><b>Mon 12 Apr, 9:00 AM</b></div><div class="field" style="--n:2"><small>Place</small><b>The Green Turtle, Baner</b></div></div>
        <div class="field" style="--n:3"><small>Pass types, prices, seats</small><div class="cat-row"><b>Early bird</b><span>30 seats</span><span class="pr">₹6,500</span></div><div class="cat-row"><b>Regular</b><span>40 seats</span><span class="pr">₹7,500</span></div><div class="cat-row"><b>Sibling pack</b><span>10 seats</span><span class="pr">₹12,000</span></div></div>
        <div class="field" style="--n:4"><small>Booking availability</small><b>Open now, closes when seats are full</b></div></div>
        <div class="publish"><span class="pill ok livetag">${ic("check")} Live on your website</span><span class="s-btn">Publish event</span></div></div></div>
        <div class="note" style="margin-top:8px">Sample names and prices, to be set by you.</div>` },
    { id: "step2", short: "Discover", title: "Parents find it", p: "The event appears on your existing website, so families stay in your brand.", pts: ["Event details and photos", "Compare pass types", "Pick seats and continue"],
      vis: `<div class="phone"><div class="phone-screen"><div class="stack" style="padding:8px 13px">
        <div class="s-title">Upcoming events</div>
        <div class="s-card sel"><div style="height:52px;border-radius:10px;background:repeating-linear-gradient(135deg,var(--ink) 0 8px,var(--ink2) 8px 16px)"></div><div class="s-title" style="font-size:13px;margin-top:7px">Annual Day 2027</div><div class="s-sub">Sat 20 Feb · The Green Turtle, Baner</div></div>
        <div class="s-sub" style="font-weight:700;text-transform:uppercase;letter-spacing:.06em">Choose your pass</div>
        <div class="s-card"><div class="s-row"><div><div class="s-title" style="font-size:12px">Early bird</div><div class="s-sub">Limited seats</div></div><b style="font-size:12px">₹250</b></div></div>
        <div class="s-card pick"><div class="s-row"><div><div class="s-title" style="font-size:12px">Family pack</div><div class="s-sub">2 adults and children</div></div><b style="font-size:12px">₹700</b></div></div>
        <div class="s-card"><div class="s-row"><div><div class="s-title" style="font-size:12px">Regular</div><div class="s-sub">One adult</div></div><b style="font-size:12px">₹400</b></div></div>
        <div class="s-btn">Continue to booking</div></div></div></div>` },
    { id: "step3", short: "Book & pay", title: "Book and pay", p: "Parents choose how to pay. A pass is issued only once payment is confirmed. Free events skip this step.", pts: ["Online: UPI, card or net banking", "Front desk: cash or UPI, recorded by staff"],
      extra: `<div class="try"><small>Try it</small><div class="try-btns" role="group" aria-label="Payment scenario"><button class="btn line sm" data-pay="ok">Online, succeeds</button><button class="btn line sm" data-pay="fail">Online, fails</button><button class="btn line sm" data-pay="counter">At the front desk</button></div><p class="try-cap" id="pay-cap" aria-live="polite"></p></div>`,
      vis: `<div class="phone"><div class="phone-screen"><div class="stack" style="padding:8px 13px" id="pay-screen"></div></div></div>` },
    { id: "step4", short: "Pass", title: "A pass is issued", p: "After a confirmed payment, the platform creates a digital pass straight away and can send it by WhatsApp or email.", pts: ["Event, date and place", "Unique booking reference", "QR code and pass status"],
      vis: `<div class="phone"><div class="phone-screen"><div class="stack" style="padding:8px 13px;text-align:center">
        <div class="tick pop">${ic("check")}</div><div class="s-title">Booking confirmed</div><div class="s-sub">Your pass is ready</div>
        <div class="rise-ticket" style="text-align:left">${ticketHTML({ qr: 54 })}</div></div></div></div>` },
    { id: "step5", short: "Verify", title: "Entry is verified", p: "Staff scan the QR code. When entrances are connected, a used pass cannot be used twice.", pts: ["Green: valid, welcome in", "Red: already used or invalid, please check", "Yellow: needs a quick look"],
      vis: `<div class="phone"><div class="phone-screen dk"><div style="padding:8px 13px">
        <div class="s-row"><div class="s-title" style="color:#fff">Gate 2 scanner</div><span class="pill ok">${ic("check")} Online</span></div>
        <div class="scan-view" style="margin-top:10px"><span class="qr" data-seed="GT-2048-7731" data-size="78"></span><span class="scan-line"></span></div>
        <div class="result ok" id="scan-result"></div>
        <div class="scan-pick" id="scan-pick"><button data-k="ok">Valid</button><button data-k="dup">Scan again</button><button data-k="warn">Check</button></div>
        <div class="scan-note">Illustrative QR graphic, not a valid pass.</div></div></div></div>` },
    { id: "step6", short: "Monitor", title: "Watch it live", p: "Bookings, payments and arrivals are tracked separately, so the picture is always clear.", pts: ["Booked, remaining, collected", "Arrived and still to come", "Online versus front desk"],
      vis: `<div class="browser"><div class="browser-bar"><i></i><i></i><i></i><span>thegreenturtle.in/admin/live</span></div><div class="browser-body"><div class="s-row"><div class="s-title" style="font-size:15px">Live event monitor</div><span style="font-size:9px;font-weight:700;color:var(--ok);display:inline-flex;gap:5px;align-items:center"><i style="width:6px;height:6px;border-radius:50%;background:var(--ok);display:inline-block"></i>LIVE</span></div>
        <div class="kpis" style="margin-top:8px">
          <div class="kpi"><small>Seats booked</small><b class="tnum" data-jc="286">0</b></div><div class="kpi"><small>Remaining</small><b class="tnum" data-jc="114">0</b></div>
          <div class="kpi" style="grid-column:span 2"><small>Payments collected</small><b class="tnum" data-jc="118600" data-cur="1">0</b></div>
          <div class="kpi"><small>Arrived</small><b class="tnum" data-jc="178">0</b></div><div class="kpi"><small>Still to come</small><b class="tnum" data-jc="108">0</b></div>
          <div class="kpi"><small>Online</small><b class="tnum" data-jc="214">0</b></div><div class="kpi"><small>Front desk</small><b class="tnum" data-jc="72">0</b></div></div>
        <div class="h-row"><div class="t">Arrival progress <span>62% of booked seats arrived</span></div><div class="h-track"><i id="j-entry"></i></div></div>
        <div class="note" style="margin-top:6px">Illustrative demonstration data</div></div></div>` },
  ];
  const stepHTML = STEPS.map((s, i) => {
    const bar = STEPS.map((t, j) => {
      const node = `<button class="sb-node ${j < i ? "done" : j === i ? "on" : ""}" data-go="${t.id}" aria-label="Go to step ${j + 1}: ${t.title}"><span class="sb-dot">${j < i ? ic("check") : j + 1}</span>${t.short}</button>`;
      const conn = j < STEPS.length - 1 ? `<span class="sb-conn ${j < i - 1 ? "full" : j === i - 1 ? "grow" : ""}"><i></i></span>` : "";
      return node + conn;
    }).join("");
    return `<section class="slide" id="${s.id}" data-title="Step ${i + 1}: ${s.title}"><div class="s-body">
      <div class="split"><div class="step-copy"><div class="kick a">Step ${i + 1} of 6</div><h2 class="t2 a" style="--n:1">${s.title}</h2><p class="p a" style="--n:2">${s.p}</p>
      <ul class="checks a" style="--n:3">${s.pts.map((p) => `<li>${ic("check-circle")}<span>${p}</span></li>`).join("")}</ul>${s.extra || ""}</div>
      <div class="vis a" style="--n:2">${s.vis}</div></div><div class="stepbar a" style="--n:4">${bar}</div></div></section>`;
  }).join("");
  $("#sec1").insertAdjacentHTML("afterend", stepHTML);
  $("#hub-lines");


  /* ==========================================================
     Colour themes (the header swatches switch them live)
     ========================================================== */
  const THEMES = {
    turtle: { name: "Turtle green", ink: "#0e3b2a", ink2: "#1c5a41", navy: "#0e3b2a", teal: "#1f7a46", blue: "#d4ecd2", coral: "#f2a33a", soft: "#f2f8ef", line: "#dfeadb", track: "#dbe9d6", grey: "#52695c", grey2: "#9bb5a4", stage: "#e3eedf", sw: "#1f7a46" },
    sunshine: { name: "Sunshine", ink: "#3b2a0e", ink2: "#5c4216", navy: "#3b2a0e", teal: "#b8650a", blue: "#fbe7bd", coral: "#2f8f5b", soft: "#fdf6e6", line: "#f0e4c8", track: "#f1e4c4", grey: "#7a6a4c", grey2: "#bfae88", stage: "#f7efd9", sw: "#f2a33a" },
    lagoon: { name: "Lagoon", ink: "#0b2f3a", ink2: "#164b5b", navy: "#0b2f3a", teal: "#0f7f8c", blue: "#cfeaf0", coral: "#f08a5d", soft: "#eff7f9", line: "#dbe9ee", track: "#d8e8ed", grey: "#506b75", grey2: "#9ab4bd", stage: "#e1eef2", sw: "#0f7f8c" },
    berry: { name: "Berry", ink: "#2b1236", ink2: "#46214f", navy: "#2b1236", teal: "#8a2e8f", blue: "#f0dcf1", coral: "#f2a33a", soft: "#faf3fa", line: "#eadbea", track: "#ecdcee", grey: "#6b536f", grey2: "#b49bb8", stage: "#f1e6f2", sw: "#8a2e8f" },
  };
  const themeBox = $("#themes");
  function applyTheme(k) {
    const t = THEMES[k] || THEMES.turtle, r = document.documentElement.style;
    ["ink", "ink2", "navy", "teal", "blue", "coral", "soft", "line", "track", "grey", "grey2"].forEach((v) => r.setProperty("--" + v, t[v]));
    r.setProperty("--stage-bg", t.stage);
    $$("button", themeBox).forEach((b) => { const on = b.dataset.t === k; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    try { localStorage.setItem("gt-pitch-theme", k); } catch (e) { /* storage may be unavailable */ }
  }
  themeBox.innerHTML = Object.entries(THEMES).map(([k, t]) => `<button data-t="${k}" aria-label="Colour theme: ${t.name}" title="${t.name}" style="--sw:${t.sw}"></button>`).join("");
  themeBox.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) applyTheme(b.dataset.t); });
  let savedTheme = "turtle"; try { savedTheme = localStorage.getItem("gt-pitch-theme") || "turtle"; if (!THEMES[savedTheme]) savedTheme = "turtle"; } catch (e) { /* ignore */ }
  applyTheme(savedTheme);

  /* ---------- Slide furniture ---------- */
  const slides = $$(".slide");
  const N = slides.length;
  const footLeft = CONFIG.clientName ? `Prepared for ${CONFIG.clientName}` : "Events, bookings and entry proposal";
  slides.forEach((s, i) => {
    s.insertAdjacentHTML("afterbegin", `<div class="s-top"><span>The Green Turtle x AzeelaAI Labs</span><span>${s.dataset.title}</span></div>`);
    s.insertAdjacentHTML("beforeend", `<div class="s-foot"><span>${footLeft}</span><span class="num tnum">${String(i + 1).padStart(2, "0")}</span></div>`);
  });
  const idx = (id) => slides.findIndex((s) => s.id === id);
  paintQR();
  const two = (n) => String(n).padStart(2, "0");
  $("#d-count").textContent = `01 / ${two(N)}`;

  /* Story chapters for the chrome (maps slide ids → narrative arc) */
  const CHAPTERS = [
    { label: "Intro", ids: ["title"] },
    { label: "Challenge", ids: ["problem"] },
    { label: "Solution", ids: ["solution", "yours"] },
    { label: "Journey", ids: ["sec1", "step1", "step2", "step3", "step4", "step5", "step6"] },
    { label: "Booking", ids: ["sec2", "inventory"] },
    { label: "Day of", ids: ["sec3", "offline", "gates", "control"] },
    { label: "Experience", ids: ["customer", "benefits"] },
    { label: "Plan", ids: ["roadmap", "cost", "about", "needs"] },
    { label: "The ask", ids: ["ask"] },
    { label: "Close", ids: ["closing"] },
  ];
  const chapterOf = (slideId) => CHAPTERS.findIndex((c) => c.ids.includes(slideId));
  const storyEl = $("#d-story");
  storyEl.innerHTML = CHAPTERS.map((c, i) => `<button type="button" data-ch="${i}" aria-label="Jump to ${c.label}">${c.label}</button>`).join("");
  storyEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ch]"); if (!b) return;
    const id = CHAPTERS[+b.dataset.ch].ids[0], i = idx(id);
    if (i < 0) return;
    if (deck) go(i); else scrollToSlide(i);
  });

  /* Speaker notes (opened in a second window with N) */
  const NOTES = {
    title: "Open with the school’s name, not ours. Promise: one place for events, bookings and entry.",
    problem: "Stay on the pain — chat groups, double booking, door chaos, weak Wi-Fi. Do not pitch yet.",
    solution: "Hover the hub. One platform, five jobs. Pause on Entry and Reports.",
    yours: "Name their programmes out loud. Summer Camp and Annual Day are the emotional anchors.",
    sec1: "Section beat: the parent journey in six steps.",
    step1: "Admin creates once. Everything else inherits.",
    step2: "Stays on their website — brand continuity.",
    step3: "Pass only after payment confirms. Try the fail path once.",
    step4: "Digital pass, WhatsApp or email. Reference + QR.",
    step5: "Green / red / yellow. Duplicate scan is the key demo.",
    step6: "Booked ≠ arrived ≠ collected. Three separate truths.",
    sec2: "Section beat: one shared seat list.",
    inventory: "Click online, then front desk, then the last-seat race.",
    sec3: "Section beat: calm entrance on a bad network day.",
    offline: "Toggle Connected → No internet → Campus network down. Be honest about the last case.",
    gates: "Scan Gate 1, then Gate 2. Flip ‘network down’ and show the warning.",
    control: "Organiser view. Switch events; mention reports are illustrative.",
    customer: "Let it autoplay once, then pause on the pass screen.",
    benefits: "Pick three that matter to them: shared stock, calmer door, less admin.",
    roadmap: "Five stages. Stress: dates only after scope is agreed.",
    cost: "₹0 licensing where feasible — not ₹0 project. Hosting and payments still cost.",
    about: "Who we are, briefly. Then back to their school.",
    needs: "This is a discovery checklist, not homework tonight.",
    ask: "The close before the flourish: meeting this week, one pilot event, what you need from them.",
    closing: "Land the feeling, then the three next steps. If email is set, point to the CTA.",
  };

  /* ==========================================================
     Deck engine
     ========================================================== */
  const hooks = {};
  const hook = (id, h) => (hooks[id] = h);
  let cur = -1;
  const ovGrid = $("#ov-grid"), overview = $("#overview"), deckEl = $("#deck");
  const blackout = $("#blackout"), spot = $("#spot");
  let notesWin = null, pointerOn = false;
  const bus = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("gt-pitch") : null;
  ovGrid.innerHTML = slides.map((s, i) => `<button class="ov-card" data-i="${i}" aria-label="Go to slide ${i + 1}: ${s.dataset.title}"><b>${two(i + 1)}</b><span>${s.dataset.title}</span></button>`).join("");

  const enter = (i) => { const s = slides[i], h = hooks[s.id]; if (h && h.enter) h.enter(s); setTimeout(() => s.classList.add("seen"), 1900); };
  const leave = (i) => { const h = hooks[slides[i].id]; if (h && h.leave) h.leave(slides[i]); };

  function syncNotes(i) {
    const s = slides[i]; if (!s) return;
    const payload = { i, n: N, id: s.id, title: s.dataset.title, note: NOTES[s.id] || s.dataset.title };
    try { localStorage.setItem("gt-pitch-notes", JSON.stringify(payload)); } catch (e) { /* ignore */ }
    if (bus) bus.postMessage(payload);
  }
  function updateUI() {
    $("#d-count").textContent = `${two(cur + 1)} / ${two(N)}`;
    $("#d-prog").style.width = ((cur + 1) / N) * 100 + "%";
    $("#prev").disabled = cur <= 0; $("#next").disabled = cur >= N - 1;
    $$(".ov-card", ovGrid).forEach((c, k) => { c.classList.toggle("on", k === cur); if (k === cur) c.setAttribute("aria-current", "true"); else c.removeAttribute("aria-current"); });
    const ch = chapterOf(slides[cur]?.id);
    $$("button", storyEl).forEach((b, k) => {
      b.classList.toggle("on", k === ch);
      b.classList.toggle("done", ch >= 0 && k < ch);
      if (k === ch) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
    if (cur >= 0) syncNotes(cur);
  }
  function go(i, replace = true) {
    i = clamp(i, 0, N - 1);
    if (i === cur) return;
    const old = cur; cur = i;
    slides.forEach((s, k) => {
      s.classList.toggle("active", k === i);
      s.classList.toggle("before", k < i);
      s.classList.remove("seen");
      s.setAttribute("aria-hidden", k === i ? "false" : "true");
    });
    if (old >= 0) leave(old);
    enter(i); updateUI();
    if (replace) history.replaceState(null, "", "#" + (i + 1));
  }
  const scrollToSlide = (i) => slides[i].scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  const nearest = () => { let b = 0, d = 1e9; slides.forEach((s, k) => { const t = Math.abs(s.getBoundingClientRect().top - 60); if (t < d) { d = t; b = k; } }); return b; };
  function advance(delta) {
    if (deck) go(cur + delta);
    else scrollToSlide(clamp(nearest() + delta, 0, N - 1));
  }
  function goTo(target) {
    if (target === "next") return advance(1);
    const i = idx(target);
    if (i < 0) return;
    if (deck) go(i);
    else scrollToSlide(i);
  }

  /* Overview dialog: focus moves in, is trapped, and is restored on close */
  let lastFocus = null;
  function openOv() {
    lastFocus = document.activeElement; overview.classList.add("open"); overview.setAttribute("aria-modal", "true"); deckEl.inert = true;
    (ovGrid.querySelector(".ov-card.on") || $("#ov-close")).focus();
  }
  function closeOv() {
    overview.classList.remove("open"); deckEl.inert = false;
    if (lastFocus && lastFocus.focus) lastFocus.focus(); lastFocus = null;
  }
  overview.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const f = $$("button", overview); const a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  });
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-go]"); if (g) { e.preventDefault(); goTo(g.dataset.go); }
    const oc = e.target.closest(".ov-card"); if (oc) { const i = +oc.dataset.i; closeOv(); if (deck) go(i); else scrollToSlide(i); }
  });
  $("#btn-ov").addEventListener("click", openOv); $("#ov-close").addEventListener("click", closeOv);
  $("#prev").addEventListener("click", () => advance(-1));
  $("#next").addEventListener("click", () => advance(1));
  const fsBtn = $("#btn-full");
  fsBtn.addEventListener("click", () => {
    if (!document.fullscreenEnabled) return;
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {});
  });
  if (!document.fullscreenEnabled) fsBtn.hidden = true;

  function setBlackout(on) {
    blackout.hidden = !on;
    blackout.setAttribute("aria-hidden", on ? "false" : "true");
    if (on) setPointer(false);
  }
  function setPointer(on) {
    pointerOn = on;
    spot.hidden = !on;
    spot.setAttribute("aria-hidden", on ? "false" : "true");
    document.body.classList.toggle("spot-on", on);
  }
  function moveSpot(e) {
    if (!pointerOn) return;
    spot.style.setProperty("--sx", e.clientX + "px");
    spot.style.setProperty("--sy", e.clientY + "px");
  }
  addEventListener("pointermove", moveSpot, { passive: true });
  blackout.addEventListener("click", () => setBlackout(false));

  function openNotes() {
    if (notesWin && !notesWin.closed) { notesWin.focus(); if (cur >= 0) syncNotes(cur); return; }
    notesWin = open("", "gt-pitch-notes", "width=420,height=640");
    if (!notesWin) return;
    const css = `body{margin:0;font:500 15px/1.5 system-ui,sans-serif;background:#0e3b2a;color:#fff;padding:28px}
      .k{font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.55;font-weight:700}
      h1{font-size:22px;font-weight:700;letter-spacing:-.02em;margin:8px 0 0;line-height:1.2}
      .n{margin-top:22px;font-size:16px;line-height:1.55;opacity:.92}
      .c{margin-top:28px;font-size:12px;opacity:.45;font-variant-numeric:tabular-nums}
      .hint{margin-top:36px;font-size:11px;opacity:.4}`;
    notesWin.document.write(`<!doctype html><html><head><title>Speaker notes</title><style>${css}</style></head>
      <body><div class="k" id="k">Speaker notes</div><h1 id="t">—</h1><p class="n" id="n"></p>
      <div class="c" id="c"></div><p class="hint">Stays in sync with the deck. Keep this on your laptop screen.</p>
      <script>
        const paint = (d) => { if (!d) return; t.textContent = d.title; n.textContent = d.note; c.textContent = String(d.i+1).padStart(2,"0")+" / "+String(d.n).padStart(2,"0"); k.textContent = d.id; };
        try { paint(JSON.parse(localStorage.getItem("gt-pitch-notes"))); } catch (e) {}
        const ch = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("gt-pitch") : null;
        if (ch) ch.onmessage = (e) => paint(e.data);
        addEventListener("storage", (e) => { if (e.key === "gt-pitch-notes" && e.newValue) try { paint(JSON.parse(e.newValue)); } catch (err) {} });
      <\/script></body></html>`);
    notesWin.document.close();
    if (cur >= 0) syncNotes(cur);
  }
  $("#btn-notes").addEventListener("click", openNotes);

  addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!blackout.hidden) { setBlackout(false); return; }
      if (pointerOn) { setPointer(false); return; }
      if (overview.classList.contains("open")) { closeOv(); return; }
    }
    if (e.target.matches("input, textarea, select") || e.altKey || e.ctrlKey || e.metaKey) return;
    if (!blackout.hidden && (e.key === "b" || e.key === "B")) { e.preventDefault(); setBlackout(false); return; }
    if (!blackout.hidden) return;
    if (overview.classList.contains("open")) { if (e.key === "o" || e.key === "O") closeOv(); return; }
    if (e.key === "o" || e.key === "O") openOv();
    else if (e.key === "n" || e.key === "N") { e.preventDefault(); openNotes(); }
    else if (e.key === "b" || e.key === "B") { e.preventDefault(); setBlackout(true); }
    else if (e.key === "p" || e.key === "P") { e.preventDefault(); setPointer(!pointerOn); }
    else if (e.key === "f" || e.key === "F") { if (document.fullscreenEnabled) fsBtn.click(); }
    else if ((e.key === "ArrowRight" || e.key === "PageDown" || e.key === " " || e.key === "Enter") && !e.target.closest("[role=tablist]")) { e.preventDefault(); advance(1); }
    else if ((e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "Backspace") && !e.target.closest("[role=tablist]")) { e.preventDefault(); advance(-1); }
    else if (e.key === "Home") { e.preventDefault(); if (deck) go(0); else scrollToSlide(0); }
    else if (e.key === "End") { e.preventDefault(); if (deck) go(N - 1); else scrollToSlide(N - 1); }
  });

  /* Swipe on the stage for presentation feel */
  let touchX = 0, touchY = 0;
  deckEl.addEventListener("touchstart", (e) => { const t = e.changedTouches[0]; touchX = t.clientX; touchY = t.clientY; }, { passive: true });
  deckEl.addEventListener("touchend", (e) => {
    if (overview.classList.contains("open") || !deck) return;
    const t = e.changedTouches[0], dx = t.clientX - touchX, dy = t.clientY - touchY;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;
    advance(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* Fit the 1280×720 slide canvas inside the viewport chrome */
  if (deck) {
    const fit = () => {
      const vw = Math.max(320, innerWidth - 48);
      const vh = Math.max(240, innerHeight - 52 - 56 - 24);
      document.documentElement.style.setProperty("--s", Math.min(1, vw / 1280, vh / 720).toFixed(4));
    };
    fit(); addEventListener("resize", fit);
    addEventListener("fullscreenchange", () => {
      document.body.classList.toggle("is-fullscreen", !!document.fullscreenElement);
      fit();
      fsBtn.textContent = document.fullscreenElement ? "Exit full screen" : "Full screen";
    });
  } else {
    /* Phones / portrait: stacked scroll with IntersectionObserver */
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const i = slides.indexOf(e.target);
      if (e.isIntersecting && !e.target.classList.contains("active")) { e.target.classList.add("active"); cur = i; updateUI(); enter(i); }
      else if (!e.isIntersecting && e.target.classList.contains("active")) { e.target.classList.remove("active"); leave(i); }
    }), { threshold: 0.35 });
    slides.forEach((s) => io.observe(s));
  }
  let boot = () => {
    const n = parseInt(location.hash.slice(1), 10);
    const start = (n >= 1 && n <= N) ? n - 1 : 0;
    if (deck) go(start, false);
    else if (start > 0) slides[start].scrollIntoView();
  };

  /* Closing slide: contact details only when configured */
  const cta = $("#cta");
  if (CONFIG.contactEmail) cta.href = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent("The Green Turtle events platform: next steps")}`;
  else cta.hidden = true;
  $("#prep").innerHTML = [CONFIG.clientName && `Prepared for ${CONFIG.clientName}`, CONFIG.companyName && `Prepared by ${CONFIG.companyName}`, CONFIG.contactEmail, CONFIG.contactPhone, CONFIG.dateLabel].filter(Boolean).map((t) => `<span>${t}</span>`).join("");

  /* ==========================================================
     Slide 1: title
     ========================================================== */
  let heroTimer;
  hook("title", {
    enter(s) {
      $$("[data-count]", s).forEach((el) => { el._v = 0; setTimeout(() => countTo(el, +el.dataset.count, 1600), 700); });
      if (!reduce) { let left = 128; heroTimer = setInterval(() => { left = left <= 112 ? 128 : left - 1; $("#hero-left").textContent = left; }, 1400); }
    },
    leave() { clearInterval(heroTimer); },
  });

  /* Slide 2: problem illustrations */
  $("#sheet").insertAdjacentHTML("afterbegin", Array.from({ length: 20 }, (_, i) => `<i class="${[3, 7, 11, 14, 18].includes(i) ? "b" : ""}" style="--d:${(i % 6) * 0.25}s"></i>`).join(""));
  $("#people").innerHTML = Array.from({ length: 8 }, (_, i) => `<i style="--d:${i * 0.12}s"></i>`).join("");

  /* ==========================================================
     Slide 3: solution hub
     ========================================================== */
  const HUB = [
    { name: "Event Management", icon: "calendar", x: 50, y: 11, text: "Create events, set dates and places, and open or close booking in a few taps.", who: "Office and admin team", benefit: "One place to run every event." },
    { name: "Online Booking", icon: "globe", x: 89, y: 38, text: "Parents choose seats on your own website and get their pass straight away.", who: "Parents", benefit: "Easy booking, any time of day." },
    { name: "Front Desk Booking", icon: "cash", x: 76, y: 87, text: "Staff at reception book from the same seat list as the website.", who: "Front desk staff", benefit: "No double booking between channels." },
    { name: "Entry & QR Check", icon: "scan", x: 24, y: 87, text: "Staff scan a pass and see at once whether it can be accepted.", who: "Entrance team", benefit: "Quicker checks, a calmer door." },
    { name: "Reports & Insights", icon: "chart", x: 11, y: 38, text: "See bookings, payments and arrivals as they happen.", who: "Management", benefit: "Clear decisions from clear numbers." },
  ];
  const hub = $("#hub"), hubLines = $("#hub-lines"), hubInfo = $("#hub-info");
  hubLines.innerHTML = HUB.map((n) => `<line class="ln" x1="50" y1="50" x2="${n.x}" y2="${n.y - 3}"/>`).join("");
  let hubManual = false, hubIdx = 0, hubTimer;
  HUB.forEach((n, i) => {
    const b = document.createElement("button");
    b.className = "node"; b.style.left = n.x + "%"; b.style.top = n.y + "%";
    b.setAttribute("aria-label", `${n.name}: show details`);
    b.innerHTML = `<span class="ico">${ic(n.icon)}</span>${n.name}`;
    ["mouseenter", "focus", "click"].forEach((ev) => b.addEventListener(ev, () => { hubManual = true; setHub(i); }));
    hub.appendChild(b);
  });
  function setHub(i) {
    hubIdx = i;
    $$(".node", hub).forEach((b, k) => b.classList.toggle("on", k === i));
    $$(".ln", hubLines).forEach((l, k) => l.classList.toggle("on", k === i));
    const n = HUB[i];
    hubInfo.innerHTML = `<div class="swap"><span class="ico">${ic(n.icon)}</span><h3>${n.name}</h3><p class="p">${n.text}</p>
      <div class="hub-row"><b>Used by</b><span>${n.who}</span></div><div class="hub-row"><b>Benefit</b><span>${n.benefit}</span></div>
      <div class="hint">${ic("search")} Hover or tap any part of the platform</div></div>`;
  }
  setHub(0);
  hook("solution", {
    enter() { hubManual = false; if (!reduce) hubTimer = setInterval(() => { if (!hubManual) setHub((hubIdx + 1) % HUB.length); }, 3800); },
    leave() { clearInterval(hubTimer); },
  });

  /* ==========================================================
     Step 3: booking and payment
     ========================================================== */
  const paySc = $("#pay-screen"), payCap = $("#pay-cap");
  let payTimer, payAuto, payKind = "ok";
  const PAYCAP = {
    ok: "The parent pays through the selected online payment provider. The pass is issued only after the payment is confirmed.",
    fail: "If the payment fails, the booking is not marked as paid and no pass is issued. The parent can simply try again.",
    counter: "The parent pays with an accepted front desk method, such as cash or UPI. An authorised staff member records it, and the pass is issued after that.",
  };
  function payIdle(kind) {
    const online = kind !== "counter";
    paySc.innerHTML = `<div class="s-title">Your booking</div>
      <div class="s-card"><div class="s-row"><span class="s-sub">1 x Family pack</span><b style="font-size:13px">₹700</b></div></div>
      <div class="s-sub" style="font-weight:700;text-transform:uppercase;letter-spacing:.06em">How would you like to pay?</div>
      <div class="s-card ${online ? "sel" : ""}"><div class="pay-opt"><span class="ic">${ic("card")}</span><span>Pay online<br><span class="s-sub" style="font-weight:500">UPI, card or net banking</span></span></div></div>
      <div class="s-card ${online ? "" : "sel"}"><div class="pay-opt"><span class="ic">${ic("cash")}</span><span>Pay at the front desk<br><span class="s-sub" style="font-weight:500">Cash or UPI at school</span></span></div></div>
      <div class="s-btn">${online ? "Pay ₹700" : "Reserve and pay at front desk"}</div>
      <div class="pill" style="display:flex;justify-content:center">${ic("alert")} Status: not paid yet</div>`;
  }
  function payRun(kind) {
    clearTimeout(payTimer); clearTimeout(payAuto); payKind = kind;
    $$("[data-pay]").forEach((b) => b.classList.toggle("on", b.dataset.pay === kind));
    payCap.textContent = PAYCAP[kind];
    payIdle(kind);
    payTimer = wait(() => {
      paySc.innerHTML = `<div class="pay-proc"><div class="spin" role="status" aria-label="Processing"></div><div class="s-title">${kind === "counter" ? "Front desk is recording the payment" : "Contacting your payment provider"}</div><div class="s-sub">Please wait. Nothing is confirmed yet.</div></div>`;
      payTimer = wait(() => {
        if (kind === "fail") paySc.innerHTML = `<div class="pay-res"><div class="res-ic bad">${ic("x")}</div><div class="s-title">Payment failed</div><div class="s-sub">Your booking is not confirmed and no pass was issued.</div><div class="pill bad">${ic("x-circle")} Status: not paid</div><div class="s-btn" style="width:100%">Try again</div></div>`;
        else paySc.innerHTML = `<div class="pay-res"><div class="res-ic ok">${ic("check")}</div><div class="s-title">${kind === "counter" ? "Payment recorded at front desk" : "Payment received"}</div><div class="s-sub">Booking confirmed. Your pass is on its way.</div><div class="pill ok">${ic("check-circle")} Status: paid and confirmed</div></div>`;
      }, 1500);
    }, 900);
  }
  $$("[data-pay]").forEach((b) => b.addEventListener("click", () => payRun(b.dataset.pay)));
  payIdle("ok"); payCap.textContent = PAYCAP.ok;
  hook("step3", {
    enter() { payIdle("ok"); payCap.textContent = PAYCAP.ok; $$("[data-pay]").forEach((b) => b.classList.remove("on")); payAuto = wait(() => payRun("ok"), 1600); },
    leave() { clearTimeout(payTimer); clearTimeout(payAuto); },
  });

  /* ==========================================================
     Step 5: scanner outcomes, Step 6: live monitor
     ========================================================== */
  const SCAN = {
    ok: { cls: "ok", icon: "check-circle", t: "Valid pass", s: "Welcome in" },
    dup: { cls: "bad", icon: "x-circle", t: "Already used", s: "Please check. Same pass, scanned again" },
    warn: { cls: "warn", icon: "alert", t: "Needs a quick look", s: "Please ask the coordinator" },
  };
  let scanTimer;
  function setScan(k) {
    const r = $("#scan-result"), d = SCAN[k];
    r.className = "result " + d.cls; r.innerHTML = `${ic(d.icon)}<div>${d.t}<small>${d.s}</small></div>`;
    $$("#scan-pick button").forEach((b) => { const on = b.dataset.k === k; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
  }
  $$("#scan-pick button").forEach((b) => b.addEventListener("click", () => { clearInterval(scanTimer); setScan(b.dataset.k); }));
  setScan("ok");
  hook("step5", {
    enter() { setScan("ok"); if (!reduce) { const o = ["ok", "dup", "warn"]; let n = 0; scanTimer = setInterval(() => { n = (n + 1) % 3; setScan(o[n]); }, 2600); } },
    leave() { clearInterval(scanTimer); },
  });
  hook("step6", {
    enter(s) {
      $$("[data-jc]", s).forEach((el) => { el._v = 0; countTo(el, +el.dataset.jc, 1500, el.dataset.cur ? { format: inr } : {}); });
      const e = $("#j-entry"); e.style.width = "0";
      setTimeout(() => { e.style.width = "62%"; }, 200);
    },
  });

  /* ==========================================================
     Inventory (shared stock) with last-ticket scenario
     ========================================================== */
  const CAT0 = [{ n: "Early bird", cap: 150 }, { n: "Regular", cap: 200 }, { n: "Family pack", cap: 50 }];
  let CATS = CAT0.map((c) => ({ ...c, o: 0, c: 0 }));
  const TOTAL = 400, CIRC = 2 * Math.PI * 44;
  let sel = 0, raceBusy = false, raceTimers = [];
  const ringsEl = $("#rings"), raceEl = $("#race"), msgEl = $("#inv-msg"), toastEl = $("#inv-toast");
  ringsEl.innerHTML = CATS.map((c, i) => `<button class="ring-btn ${i === 0 ? "on" : ""}" data-i="${i}" aria-pressed="${i === 0}" aria-label="${c.n} seats"><div class="ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" style="stroke:var(--track)"/><circle data-a cx="50" cy="50" r="44" style="stroke:var(--ink)" stroke-dasharray="0 ${CIRC}"/><circle data-b cx="50" cy="50" r="44" style="stroke:var(--coral)" stroke-dasharray="0 ${CIRC}"/></svg><div class="rt"><b class="tnum"></b><small>left</small></div></div><h4>${c.n}</h4><p></p></button>`).join("");
  const raceIdle = () => { raceEl.innerHTML = `<b>What if two parents want the last seat?</b>Even if several people try to book the same final seat at nearly the same time, the system protects the list and confirms only one booking.`; };
  function renderInv() {
    const o = CATS.reduce((a, c) => a + c.o, 0), c = CATS.reduce((a, x) => a + x.c, 0), left = TOTAL - o - c;
    $("#inv-left").textContent = fmt(left); $("#lg-o").textContent = fmt(o); $("#lg-c").textContent = fmt(c); $("#lg-l").textContent = fmt(left);
    const set = (id, v) => { const e = $(id); e.style.width = (v / TOTAL) * 100 + "%"; e.textContent = v / TOTAL > 0.07 ? fmt(v) : ""; };
    set("#sb-o", o); set("#sb-c", c); set("#sb-l", left);
    CATS.forEach((x, i) => {
      const el = $(`.ring-btn[data-i="${i}"]`, ringsEl), l = x.cap - x.o - x.c;
      const a = (x.o / x.cap) * CIRC, b = (x.c / x.cap) * CIRC, [ca, cb] = $$("circle[data-a], circle[data-b]", el);
      ca.setAttribute("stroke-dasharray", `${a} ${CIRC - a}`); ca.setAttribute("transform", "rotate(-90 50 50)");
      cb.setAttribute("stroke-dasharray", `${b} ${CIRC - b}`); cb.setAttribute("transform", `rotate(${-90 + (a / CIRC) * 360} 50 50)`);
      $(".rt b", el).textContent = fmt(l);
      $("p", el).innerHTML = l <= 0 ? `<span class="sold-out">${ic("x-circle")} Full</span>` : `of ${fmt(x.cap)} seats`;
    });
    const cs = CATS[sel], out = cs.cap - cs.o - cs.c <= 0 || raceBusy;
    $("#sell-o").disabled = out; $("#sell-c").disabled = out;
  }
  function say(t) { msgEl.textContent = t; toastEl.classList.remove("pop"); void toastEl.offsetWidth; toastEl.classList.add("pop"); }
  const leftAll = () => TOTAL - CATS.reduce((a, x) => a + x.o + x.c, 0);
  function sell(ch) {
    const c = CATS[sel], want = ch === "o" ? 20 : 10, n = Math.min(want, c.cap - c.o - c.c); if (n <= 0 || raceBusy) return;
    c[ch] += n; renderInv();
    const now = c.cap - c.o - c.c;
    say(`${ch === "o" ? "Online" : "Front desk"} booking: ${n} ${c.n}. ${now === 0 ? c.n + " is now full on both channels." : "Both channels now show " + now + " " + c.n + " left."} Remaining overall: ${fmt(leftAll())}.`);
  }
  function resetInv() {
    raceTimers.forEach(clearTimeout); raceTimers = []; raceBusy = false;
    CATS = CAT0.map((c) => ({ ...c, o: 0, c: 0 })); sel = 0;
    $$(".ring-btn", ringsEl).forEach((x, i) => { x.classList.toggle("on", i === 0); x.setAttribute("aria-pressed", i === 0); });
    raceIdle(); renderInv(); msgEl.textContent = "Choose a pass type, then try a booking.";
  }
  function race() {
    if (raceBusy) return;
    const c = CATS[sel]; c.o = Math.max(0, c.cap - 1 - c.c); if (c.o + c.c > c.cap - 1) { c.c = c.cap - 1 - c.o; }
    raceBusy = true; renderInv();
    const row = (who, id) => `<div class="race-row"><span>${who}</span><span class="pill" id="${id}">${ic("sync")} Trying to buy</span></div>`;
    raceEl.innerHTML = `<b>Last ${c.n} seat: two parents at once</b>1 seat left. Both try at the same moment.${row("Parent A, on the website", "rA")}${row("Parent B, at the front desk", "rB")}`;
    raceTimers.push(setTimeout(() => {
      const aWins = Math.random() < 0.5, win = aWins ? "A" : "B", lose = aWins ? "B" : "A";
      $("#r" + win).className = "pill ok"; $("#r" + win).innerHTML = `${ic("check-circle")} Booking confirmed`;
      $("#r" + lose).className = "pill bad"; $("#r" + lose).innerHTML = `${ic("x-circle")} Just taken. Not charged`;
      c[aWins ? "o" : "c"] += 1; raceBusy = false; renderInv();
      say(`Only one booking was confirmed. ${c.n} is full and nothing was overbooked.`);
    }, reduce ? 100 : 1300));
  }
  ringsEl.addEventListener("click", (e) => {
    const b = e.target.closest(".ring-btn"); if (!b) return;
    sel = +b.dataset.i; $$(".ring-btn", ringsEl).forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); }); renderInv();
    say(`Booking from ${CATS[sel].n}. Choose a booking channel.`);
  });
  $("#sell-o").addEventListener("click", () => sell("o")); $("#sell-c").addEventListener("click", () => sell("c"));
  $("#race-btn").addEventListener("click", race); $("#inv-reset").addEventListener("click", resetInv);
  raceIdle(); renderInv();
  hook("inventory", { leave() { resetInv(); } });

  /* ==========================================================
     Offline / online entry
     ========================================================== */
  const net = $("#net"), netState = $("#net-state"), netPanel = $("#net-panel"), chipsEl = $("#chips"), logLabel = $("#log-label"), logCount = $("#log-count"), syncBar = $("#sync-bar");
  const CHIPS = {
    on: [["Internet", "Connected", "ok", "check-circle"], ["Campus network", "Available", "ok", "check-circle"], ["Local coordination", "Operational", "ok", "check-circle"], ["Pass checks", "Live with the central system", "ok", "check-circle"]],
    off: [["Internet", "Disconnected", "bad", "x-circle"], ["Campus network", "Available", "ok", "check-circle"], ["Local coordination", "Operational", "ok", "check-circle"], ["Pass checks", "Available within the prepared offline setup", "ok", "check-circle"]],
    lan: [["Internet", "Disconnected", "bad", "x-circle"], ["Campus network", "Not available", "bad", "x-circle"], ["Local coordination", "Not reachable", "bad", "x-circle"], ["Pass checks", "Manual procedure needed", "warn", "alert"]],
    sync: [["Internet", "Restored", "ok", "check-circle"], ["Campus network", "Available", "ok", "check-circle"], ["Local coordination", "Operational", "ok", "check-circle"], ["Pass checks", "Sending recorded entries", "warn", "sync"]],
  };
  const NETTXT = {
    on: { pill: "Connected", icon: "wifi", h: "Everything stays in step", s: "Entrances check passes with the central system as families arrive, and every entrance sees the same record." },
    off: { pill: "No internet", icon: "wifi-off", h: "Entry continues on the campus network", s: "Entrances check passes against the list prepared in advance. Every arrival is recorded on campus and sent on when the internet returns." },
    lan: { pill: "Campus network down", icon: "alert", h: "Now the backup plan matters", s: "If the campus network also fails, entrances cannot share what they scanned. Staff follow an agreed manual check, records are matched up afterwards, and a pass used twice is a risk we manage with you during this time." },
    sync: { pill: "Back online. Syncing", icon: "sync", h: "Catching up, automatically", s: "Recorded entries move to the central system and the counts are brought up to date. Entry carries on while this happens." },
  };
  let mode = "on", total = 1204, pending = 0, syncRaf, netTimer;
  function renderNet() {
    net.className = "net-diagram is-" + (mode === "on" ? "on" : mode === "off" ? "off" : mode === "lan" ? "lan" : "sync");
    const t = NETTXT[mode];
    netState.innerHTML = ic(t.icon) + t.pill;
    chipsEl.innerHTML = CHIPS[mode].map((c) => `<div class="chip ${c[2]}">${ic(c[3])}<div><small>${c[0]}</small>${c[1]}</div></div>`).join("");
    netPanel.innerHTML = `<h3>${t.h}</h3><p class="sub">${t.s}</p>`;
    const act = { on: mode === "on" || mode === "sync", off: mode === "off", lan: mode === "lan" };
    [["m-on", act.on], ["m-off", act.off], ["m-lan", act.lan]].forEach(([id, v]) => { $("#" + id).classList.toggle("on", v); $("#" + id).setAttribute("aria-pressed", v); });
    if (mode !== "sync") showLog();
  }
  function showLog() {
    syncBar.style.width = "0";
    if (mode === "on") { logLabel.textContent = "Arrivals verified today"; logCount.textContent = fmt(total); }
    else if (mode === "off") { logLabel.textContent = "Pending synchronisation (stored on campus)"; logCount.textContent = fmt(pending); }
    else { logLabel.textContent = "Pending reconciliation (recorded on gate devices)"; logCount.textContent = fmt(pending); }
  }
  function runSync() {
    const start = pending, t0 = performance.now(), dur = reduce ? 1 : 3200; let lastP = 0;
    logLabel.textContent = "Pending synchronisation";
    const packet = () => { const p = document.createElement("div"); p.className = "pk"; p.style.top = "46%"; net.appendChild(p); if (p.animate && !reduce) p.animate([{ top: "46%", opacity: 1 }, { top: "20%", opacity: 0.2 }], { duration: 900, easing: "ease-in" }).onfinish = () => p.remove(); else p.remove(); };
    (function step(t) {
      const p = clamp((t - t0) / dur, 0, 1);
      pending = Math.round(start * (1 - p)); syncBar.style.width = p * 100 + "%"; logCount.textContent = fmt(pending);
      if (t - lastP > 300 && p < 1) { lastP = t; packet(); }
      if (p < 1) { syncRaf = requestAnimationFrame(step); return; }
      total += start; pending = 0; mode = "on"; renderNet();
      logLabel.textContent = "All entries synchronised"; logCount.textContent = fmt(total); syncBar.style.width = "100%"; netState.innerHTML = ic("check-circle") + "All synced";
      setTimeout(() => { if (mode === "on") showLog(); }, 1500);
    })(t0);
  }
  function setNet(m) {
    cancelAnimationFrame(syncRaf); $$(".pk", net).forEach((p) => p.remove());
    if (m === "on" && pending > 0) { mode = "sync"; renderNet(); runSync(); return; }
    mode = m; renderNet();
  }
  $("#m-on").addEventListener("click", () => { if (mode === "off" || mode === "lan") setNet("on"); });
  $("#m-off").addEventListener("click", () => { if (mode !== "off") setNet("off"); });
  $("#m-lan").addEventListener("click", () => { if (mode !== "lan") setNet("lan"); });
  renderNet();
  hook("offline", {
    enter() { if (!reduce) netTimer = setInterval(() => { if (mode === "off" || mode === "lan") { pending++; logCount.textContent = fmt(pending); } else if (mode === "on") { total++; logCount.textContent = fmt(total); } }, 1100); },
    leave() { clearInterval(netTimer); cancelAnimationFrame(syncRaf); pending = 0; mode = "on"; $$(".pk", net).forEach((p) => p.remove()); renderNet(); },
  });

  /* ==========================================================
     Gates: venue picture and the shared-record scenario
     ========================================================== */
  const GX = [170, 400, 630], NS = "http://www.w3.org/2000/svg", crowdAnims = [];
  GX.forEach((x) => $("#staff").insertAdjacentHTML("beforeend", `<g><circle cx="${x - 28}" cy="306" r="10" style="fill:var(--ink)"/><rect x="${x + 12}" y="292" width="16" height="24" rx="4" style="fill:var(--teal)"/><circle cx="${x + 20}" cy="300" r="3" fill="#fff"/></g>`));
  const shades = ["var(--ink)", "var(--teal)", "var(--grey2)", "var(--coral)"];
  GX.forEach((gx, gi) => {
    for (let n = 0; n < 7; n++) {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("r", 6); c.style.fill = shades[(n + gi) % shades.length];
      const sx = gx + (((n * 53 + gi * 29) % 160) - 80), sy = 380 + ((n * 17) % 30);
      if (reduce || !c.animate) { c.setAttribute("cx", sx); c.setAttribute("cy", sy); }
      else {
        c.setAttribute("cx", 0); c.setAttribute("cy", 0);
        const a = c.animate([
          { transform: `translate(${sx}px,${sy}px)`, opacity: 0 },
          { transform: `translate(${sx}px,${sy}px)`, opacity: 1, offset: 0.08 },
          { transform: `translate(${gx}px,330px)`, opacity: 1, offset: 0.55 },
          { transform: `translate(${gx + ((n % 3) - 1) * 10}px,272px)`, opacity: 1, offset: 0.85 },
          { transform: `translate(${gx + ((n % 3) - 1) * 24}px,252px)`, opacity: 0 },
        ], { duration: 6400, delay: n * 900 + gi * 300, iterations: Infinity, easing: "ease-in-out" });
        a.pause(); crowdAnims.push(a);
      }
      $("#crowd").appendChild(c);
    }
  });
  const gc = [42, 51, 37]; let gTimer, tkUsed = null, lanUp = true;
  const gres = $("#gate-result"), tkStatus = $("#tk-status");
  const paintGates = () => { $("#gt").textContent = fmt(gc[0] + gc[1] + gc[2]); $("#g-extra").textContent = fmt(TOTAL - (gc[0] + gc[1] + gc[2])); $("#gc-line").textContent = gc.join(" / "); };
  function gShow(cls, icn, t, s) { gres.className = "result-lt " + cls; gres.innerHTML = `${ic(icn)}<div>${t}<small>${s}</small></div>`; }
  function gateReset() {
    tkUsed = null; tkStatus.className = "pill"; tkStatus.textContent = "Not used yet";
    gShow("", "scan", "Pick a gate to scan the pass", "Then try a second gate.");
  }
  function scanAt(g) {
    if (tkUsed === null) {
      tkUsed = g; gc[g - 1]++; paintGates();
      tkStatus.className = "pill ok"; tkStatus.innerHTML = `${ic("check")} Used at Gate ${g}`;
      gShow("ok", "check-circle", "Valid pass. Welcome in", lanUp ? `Gate ${g} marks it as used for every gate through the campus network.` : `Gate ${g} recorded it on this gate only, because the gates cannot share records right now.`);
    } else if (tkUsed === g) {
      gShow("bad", "x-circle", "Already used. Please check", `Gate ${g} scanned this ticket a moment ago.`);
    } else if (lanUp) {
      gShow("bad", "x-circle", "Already used. Please check", `This pass was used at Gate ${tkUsed}. Gate ${g} sees the same shared record.`);
    } else {
      tkStatus.className = "pill warn"; tkStatus.innerHTML = `${ic("alert")} Needs reconciliation`;
      gShow("warn", "alert", "Cannot confirm. Follow the manual check", `Gate ${g} cannot see Gate ${tkUsed}. Staff verify by hand and the entry is flagged to match up later. A pass used twice is a risk until the network is back.`);
    }
  }
  $$("[data-gate]").forEach((b) => b.addEventListener("click", () => scanAt(+b.dataset.gate)));
  const setLan = (up) => { lanUp = up; $("#lan-up").classList.toggle("on", up); $("#lan-down").classList.toggle("on", !up); $("#lan-up").setAttribute("aria-pressed", up); $("#lan-down").setAttribute("aria-pressed", !up); gateReset(); };
  $("#lan-up").addEventListener("click", () => setLan(true)); $("#lan-down").addEventListener("click", () => setLan(false));
  $("#gate-reset").addEventListener("click", gateReset);
  paintGates(); gateReset();
  hook("gates", {
    enter() { crowdAnims.forEach((a) => a.play()); paintGates(); if (!reduce) gTimer = setInterval(() => { gc[Math.floor(Math.random() * 3)] += 1; paintGates(); }, 1300); },
    leave() { crowdAnims.forEach((a) => a.pause()); clearInterval(gTimer); setLan(true); },
  });

  /* ==========================================================
     Organiser control centre
     ========================================================== */
  const TIERS = ["Early bird", "Regular", "Family pack"];
  const EVENTS = [
    { name: "Annual Day 2027", venue: "The Green Turtle, Baner", date: "Sat 20 Feb", status: ["ok", "Entry open"], online: 0.72, checked: 238, cats: [[120, 118, 250], [150, 128, 400], [30, 30, 700]] },
    { name: "Summer Camp, Week 1", venue: "The Green Turtle, Baner", date: "Mon 12 Apr", status: ["", "On sale"], online: 0.88, checked: 0, cats: [[30, 30, 6500], [40, 33, 7500], [10, 6, 12000]] },
    { name: "Parent Workshop", venue: "The Green Turtle, Baner", date: "Sat 13 Mar", status: ["", "On sale"], online: 0.61, checked: 0, cats: [[20, 20, 300], [40, 26, 500], [10, 4, 800]] },
    { name: "Spring Fun Fair", venue: "School grounds, Baner", date: "Sat 27 Mar", status: ["ok", "Entry open"], online: 0.58, checked: 190, cats: [[100, 88, 200], [200, 164, 300], [40, 22, 700]] },
  ];
  EVENTS.forEach((e) => {
    e.cap = e.cats.reduce((a, c) => a + c[0], 0); e.sold = e.cats.reduce((a, c) => a + c[1], 0);
    const on = Math.round(e.sold * e.online), co = e.sold - on;
    const split = (tot, w) => { const s = w.reduce((a, b) => a + b, 0); let acc = 0; return w.map((x, i) => { const v = i === w.length - 1 ? tot - acc : Math.round((tot * x) / s); acc += v; return v; }); };
    e.dayOn = split(on, [8, 10, 12, 14, 17, 19, 20]); e.dayCo = split(co, [5, 7, 10, 13, 18, 22, 25]);
  });
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], WEEKS = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"];
  const evList = $("#ev-list"), dashMain = $("#dash-main");
  const D = { ev: "all", cat: "all", ch: "all", range: "7", tab: "overview" };
  const evBtn = (key, name, sub, pct) => `<button class="ev-btn ${D.ev === key ? "on" : ""}" data-k="${key}" aria-pressed="${D.ev === key}"><b>${name}</b><small>${sub}</small><div class="mini"><i style="width:${pct}%"></i></div></button>`;
  evList.innerHTML = evBtn("all", "All events", `4 events · ${fmt(EVENTS.reduce((a, e) => a + e.sold, 0))} sold`, (EVENTS.reduce((a, e) => a + e.sold, 0) / EVENTS.reduce((a, e) => a + e.cap, 0)) * 100)
    + EVENTS.map((e, i) => evBtn(i, e.name, `${e.date} · ${fmt(e.sold)} of ${fmt(e.cap)}`, (e.sold / e.cap) * 100)).join("");

  function compute() {
    const evs = D.ev === "all" ? EVENTS : [EVENTS[D.ev]];
    const catIdx = D.cat === "all" ? [0, 1, 2] : [+D.cat];
    const m = { sold: 0, rev: 0, left: 0, checked: 0, online: 0, counter: 0, revOn: 0, revCo: 0, byCat: [0, 0, 0], capCat: [0, 0, 0], on7: Array(7).fill(0), co7: Array(7).fill(0) };
    evs.forEach((e) => {
      const chShare = D.ch === "all" ? 1 : D.ch === "online" ? e.online : 1 - e.online;
      let share = 0;
      catIdx.forEach((ci) => {
        const [cap, sold, price] = e.cats[ci];
        m.sold += sold * chShare; m.rev += sold * price * chShare; m.left += cap - sold; share += sold / e.sold;
        if (D.ch !== "counter") { m.online += sold * e.online; m.revOn += sold * price * e.online; }
        if (D.ch !== "online") { m.counter += sold * (1 - e.online); m.revCo += sold * price * (1 - e.online); }
        m.byCat[ci] += sold; m.capCat[ci] += cap;
        m.checked += e.checked * (sold / e.sold) * chShare;
      });
      e.dayOn.forEach((v, q) => { if (D.ch !== "counter") m.on7[q] += v * share; });
      e.dayCo.forEach((v, q) => { if (D.ch !== "online") m.co7[q] += v * share; });
    });
    ["sold", "rev", "left", "checked", "online", "counter", "revOn", "revCo"].forEach((k) => (m[k] = Math.round(m[k])));
    m.collected = Math.round(m.rev * 0.96); m.pending = Math.max(0, m.sold - m.checked);
    m.collectedOn = Math.round(m.revOn * 0.96); m.collectedCo = Math.round(m.revCo * 0.96);
    m.events = evs.length; m.evs = evs;
    return m;
  }
  const sel2 = (id, lab, opts, val) => `<label for="${id}">${lab}<select id="${id}">${opts.map(([v, t]) => `<option value="${v}" ${String(val) === String(v) ? "selected" : ""}>${t}</option>`).join("")}</select></label>`;
  function csv(rows, name) {
    const body = ["Illustrative sample data, not real bookings"].concat(rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))).join("\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([body], { type: "text/csv" })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 500);
  }
  function renderDash(animate = true) {
    const m = compute(), name = D.ev === "all" ? "All events" : EVENTS[D.ev].name;
    const sub = D.ev === "all" ? "4 events, sample data" : `${EVENTS[D.ev].date} · ${EVENTS[D.ev].venue}`;
    const kpi = (lab, icn, val, o = {}) => `<div class="kpi-lg"><small>${ic(icn)}${lab}</small><b class="tnum" data-v="${val}" ${o.cur ? 'data-cur="1"' : ""} ${o.pct ? 'data-pct="1"' : ""}>0</b></div>`;
    const head = `<div class="dm-head"><div><h3>${name}</h3><div class="note">${sub}</div></div><div class="seg" role="group" aria-label="View"><button data-tab="overview" class="${D.tab === "overview" ? "on" : ""}" aria-pressed="${D.tab === "overview"}">Overview</button><button data-tab="reports" class="${D.tab === "reports" ? "on" : ""}" aria-pressed="${D.tab === "reports"}">Reports</button></div></div>
      <div class="filters">${sel2("f-range", "Date range", [["7", "Last 7 days"], ["30", "Last 30 days"]], D.range)}${sel2("f-cat", "Pass type", [["all", "All pass types"], ...TIERS.map((t, i) => [i, t])], D.cat)}${sel2("f-ch", "Booking channel", [["all", "Online and front desk"], ["online", "Online only"], ["counter", "Front desk only"]], D.ch)}</div>`;
    let bodyHTML;
    if (D.tab === "overview") {
      const day = D.range === "7" ? { lab: DAYS, on: m.on7, co: m.co7, t: "Seats booked per day, last 7 days" } : (() => { const w = [0.14, 0.2, 0.28, 0.38], so = m.on7.reduce((a, b) => a + b, 0), sc = m.co7.reduce((a, b) => a + b, 0); return { lab: WEEKS, on: w.map((x) => so * x), co: w.map((x) => sc * x), t: "Seats booked per week, last 30 days" }; })();
      const mx = Math.max(1, ...day.on.map((v, q) => v + day.co[q]));
      const cats = (D.cat === "all" ? [0, 1, 2] : [+D.cat]);
      bodyHTML = `<div class="kpi-row">${kpi("Seats booked", "ticket", m.sold)}${kpi("Payments collected", "rupee", m.collected, { cur: 1 })}${kpi("Seats remaining", "layers", m.left)}${kpi("Arrived", "users", m.checked)}</div>
        <div class="kpi-row">${kpi("Still to come", "clock", m.pending)}${kpi("Online bookings", "globe", m.online)}${kpi("Front desk bookings", "cash", m.counter)}${D.ev === "all" ? kpi("Total events", "calendar", m.events) : kpi("Arrival progress", "scan", m.sold ? Math.round((m.checked / m.sold) * 100) : 0, { pct: 1 })}</div>
        <div class="charts">
          <div class="chart-card"><h4>${day.t}<span class="legend-i"><span><i style="background:var(--navy)"></i>Online</span><span><i style="background:var(--coral)"></i>Front desk</span></span></h4>
            <div class="col-chart" role="img" aria-label="${day.t}">${day.lab.map((d, q) => `<div class="col" title="${d}"><i class="c" data-h="${(day.co[q] / mx) * 100}"></i><i class="o" data-h="${(day.on[q] / mx) * 100}"></i></div>`).join("")}</div>
            <div class="col-labels">${day.lab.map((d) => `<span>${d}</span>`).join("")}</div></div>
          <div class="chart-card"><h4>Pass type performance</h4>${cats.map((ci) => `<div class="h-row"><div class="t">${TIERS[ci]}<span>${fmt(m.byCat[ci])} of ${fmt(m.capCat[ci])} booked</span></div><div class="h-track"><i data-w="${m.capCat[ci] ? (m.byCat[ci] / m.capCat[ci]) * 100 : 0}"></i></div></div>`).join("")}</div>
        </div>
        <div class="note" style="margin-top:6px">Seats booked, payments collected and families arrived are tracked as separate numbers. Remaining seats are not affected by the channel filter.</div>`;
    } else {
      const reps = [
        ["Bookings report", [["Seats booked", fmt(m.sold)], ["Online bookings", fmt(m.online)], ["Front desk bookings", fmt(m.counter)]], "bookings-report.csv"],
        ["Attendance report", [["Arrived", fmt(m.checked)], ["Still to come", fmt(m.pending)], ["Arrival progress", (m.sold ? Math.round((m.checked / m.sold) * 100) : 0) + "%"]], "attendance-report.csv"],
        ["Pass type report", (D.cat === "all" ? [0, 1, 2] : [+D.cat]).map((ci) => [TIERS[ci], `${fmt(m.byCat[ci])} of ${fmt(m.capCat[ci])}`]), "pass-type-report.csv"],
        ["Payment collection report", [["Payments collected", inr(m.collected)], ["Collected online", inr(m.collectedOn)], ["Collected at front desk", inr(m.collectedCo)]], "payment-collection-report.csv"],
      ];
      bodyHTML = `<div class="rep-grid">${reps.map((r, i) => `<div class="rep"><h4>${r[0]}</h4><table><tbody>${r[1].map((x) => `<tr><td>${x[0]}</td><td class="tnum">${x[1]}</td></tr>`).join("")}</tbody></table><button class="btn line sm" data-rep="${i}">${ic("download")} Download sample CSV</button></div>`).join("")}</div>
        <div class="note" style="margin-top:8px">Sample files contain illustrative demonstration data only.</div>`;
      dashMain._reps = reps;
    }
    dashMain.innerHTML = head + bodyHTML;
    const run = () => {
      $$("[data-v]", dashMain).forEach((el) => { el._v = 0; countTo(el, +el.dataset.v, animate ? 1000 : 0, { format: el.dataset.cur ? inr : fmt, suffix: el.dataset.pct ? "%" : "" }); });
      $$("[data-h]", dashMain).forEach((b) => (b.style.height = b.dataset.h + "%"));
      $$("[data-w]", dashMain).forEach((b) => (b.style.width = b.dataset.w + "%"));
    };
    animate && !reduce ? setTimeout(run, 60) : run();
  }
  dashMain.addEventListener("change", (e) => {
    const map = { "f-range": "range", "f-cat": "cat", "f-ch": "ch" }; const k = map[e.target.id]; if (!k) return;
    D[k] = e.target.value; renderDash(false); const again = $("#" + e.target.id); if (again) again.focus();
  });
  dashMain.addEventListener("click", (e) => {
    const t = e.target.closest("[data-tab]"); if (t) { D.tab = t.dataset.tab; renderDash(false); const b = $(`[data-tab="${D.tab}"]`, dashMain); if (b) b.focus(); return; }
    const r = e.target.closest("[data-rep]"); if (r) { const rep = dashMain._reps[+r.dataset.rep]; csv([["Metric", "Value"], ...rep[1]], rep[2]); }
  });
  evList.addEventListener("click", (ev) => {
    const b = ev.target.closest(".ev-btn"); if (!b) return;
    D.ev = b.dataset.k === "all" ? "all" : +b.dataset.k;
    $$(".ev-btn", evList).forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); });
    renderDash(true);
  });
  renderDash(false);
  hook("control", { enter() { renderDash(true); } });

  /* ==========================================================
     Customer phone journey (13 screens)
     ========================================================== */
  const row = (n, s, p, on) => `<div class="s-card ${on ? "sel" : ""}"><div class="s-row"><div><div class="s-title" style="font-size:12px">${n}</div><div class="s-sub">${s}</div></div><b style="font-size:12px">${p}</b></div></div>`;
  const art = `<div style="height:52px;border-radius:10px;background:repeating-linear-gradient(135deg,var(--ink) 0 8px,var(--ink2) 8px 16px)"></div>`;
  const CX = [
    { ph: 0, t: "Visit the website", d: "The parent opens your existing website. There is nothing new to learn.", html: `<div class="stack"><div class="site-hero"><div class="site-nav"><span>Home</span><span>Programmes</span><span class="hl-on">Events</span><span>Contact</span></div><div class="s-title" style="color:#fff;font-size:15px">Welcome to The Green Turtle</div><div class="s-sub" style="color:rgba(255,255,255,.7)">Preschool, Daycare and Activities</div></div><div class="s-card"><div class="s-title" style="font-size:12px">Upcoming events</div><div class="s-sub">Tap Events to see what is on</div></div><div class="s-btn">Browse events</div></div>` },
    { ph: 0, t: "Discover an event", d: "Upcoming events appear right on your own site.", html: `<div class="stack"><div class="s-title">Events</div><div class="s-card sel">${art}<div class="s-title" style="font-size:13px;margin-top:7px">Annual Day 2027</div><div class="s-sub">Sat 20 Feb · The Green Turtle, Baner</div></div><div class="s-card"><div class="s-title" style="font-size:12px">Summer Camp, Week 1</div><div class="s-sub">Mon 12 Apr · The Green Turtle, Baner</div></div><div class="s-card"><div class="s-title" style="font-size:12px">Parent Workshop</div><div class="s-sub">Sat 13 Mar · The Green Turtle, Baner</div></div></div>` },
    { ph: 0, t: "Open event details", d: "Date, place and pass options, all in one place.", html: `<div class="stack">${art}<div class="s-title">Annual Day 2027</div><div class="s-sub">${ic("calendar")} Sat 20 Feb, 5:00 PM</div><div class="s-sub">${ic("pin")} The Green Turtle, Baner</div><div class="s-card"><div class="s-sub">From</div><b>₹250</b></div><div class="s-btn">Choose passes</div></div>` },
    { ph: 1, t: "Select a pass type", d: "Early bird, Regular or Family pack, with clear prices.", html: `<div class="stack"><div class="s-title">Choose a pass type</div>${row("Early bird", "Limited seats", "₹250")}${row("Regular", "One adult", "₹400")}${row("Family pack", "2 adults and children", "₹700", 1)}<div class="s-btn">Continue</div></div>` },
    { ph: 1, t: "Choose how many", d: "The number is checked against the shared seat list.", html: `<div class="stack" style="text-align:center"><div class="s-title">How many packs?</div><div class="s-sub">Family pack · ₹700 each</div><div class="stepper"><i>-</i><b>1</b><i>+</i></div><div class="s-card"><div class="s-row"><span class="s-sub">Seats available</span><b>Yes</b></div></div><div class="s-btn">Review booking</div></div>` },
    { ph: 1, t: "Review the booking", d: "A clear summary before anything is paid.", html: `<div class="stack"><div class="s-title">Booking summary</div><div class="s-card"><div class="s-row"><span class="s-sub">1 x Family pack</span><b style="font-size:12px">₹700</b></div><div class="s-row"><span class="s-sub">Annual Day 2027</span></div></div><div class="s-card sel"><div class="s-row"><b>Total</b><b>₹700</b></div></div><div class="s-btn">Continue to payment</div></div>` },
    { ph: 2, t: "Select a payment method", d: "Pay online now, or reserve and pay at the front desk.", html: `<div class="stack"><div class="s-title">Payment method</div><div class="s-card sel"><div class="pay-opt"><span class="ic">${ic("card")}</span><span>Pay online<br><span class="s-sub" style="font-weight:500">UPI, card or net banking</span></span></div></div><div class="s-card"><div class="pay-opt"><span class="ic">${ic("cash")}</span><span>Pay at the front desk<br><span class="s-sub" style="font-weight:500">Cash or UPI at school</span></span></div></div><div class="s-btn">Pay ₹700</div></div>` },
    { ph: 2, t: "Complete payment", d: "The online payment provider confirms the payment. Demo only, no real payment is made.", html: `<div class="stack"><div class="pay-proc"><div class="spin" role="status" aria-label="Processing"></div><div class="s-title">Confirming your payment</div><div class="s-sub">Please wait a moment.</div><div class="pill warn">${ic("sync")} Not confirmed yet</div></div></div>` },
    { ph: 2, t: "Receive confirmation", d: "The booking is confirmed only after the payment is confirmed. A copy can go to WhatsApp or email.", html: `<div class="stack" style="text-align:center"><div class="tick pop">${ic("check")}</div><div class="s-title">Payment confirmed</div><div class="s-sub">Booking reference</div><div class="mono" style="font-size:14px">GT-2048-7731</div><div class="pill ok" style="justify-content:center">${ic("check-circle")} Booking confirmed</div></div>` },
    { ph: 3, t: "Show the digital pass", d: "A pass with a QR code, ready on the phone.", html: `<div class="stack" style="text-align:center"><div class="s-title">Your pass</div><div class="rise-ticket" style="text-align:left">${ticketHTML({ qr: 54 })}</div></div>` },
    { ph: 3, t: "Arrive at school", d: "Signs and staff point to the nearest open entrance.", html: `<div class="stack"><div class="s-title">You have arrived</div><div class="venue-art"><div class="path"></div><span class="walker"></span><div class="gatepin">${ic("pin")}<br>Gate 2</div></div><div class="s-card"><div class="s-row"><span class="s-sub">Nearest open entrance</span><span class="pill dark">Gate 2</span></div></div><div class="s-btn">Show my pass</div></div>` },
    { ph: 3, t: "Scan the pass", d: "Staff scan the QR code at the entrance.", html: `<div class="stack" style="text-align:center"><div class="s-title">Show your pass</div><div class="scan-view"><span class="qr" data-seed="GT-2048-7731" data-size="92"></span><span class="scan-line"></span></div><div class="pill ok" style="display:flex;justify-content:center;padding:9px">${ic("scan")} Scanning at Gate 2</div><div class="s-sub" style="font-size:9px">Illustrative QR graphic, not a valid pass.</div></div>` },
    { ph: 3, t: "Enter the event", d: "A valid pass opens the way in.", html: `<div class="stack" style="text-align:center;padding-top:22px"><div class="tick pop" style="width:64px;height:64px;font-size:34px;background:var(--ok)">${ic("check")}</div><div class="s-title" style="font-size:19px">Valid pass</div><div class="s-sub">Welcome in. Enjoy the show!</div><div class="confetti">${Array.from({ length: 16 }, (_, i) => `<i style="left:${10 + i * 5.2}%;--d:${(i % 5) * 0.08}s;--x:${(i % 2 ? 1 : -1) * (10 + ((i * 7) % 40))}px;--r:${(i * 47) % 360}deg"></i>`).join("")}</div></div>` },
  ];
  const PH = ["Discover", "Choose", "Pay", "Enter"];
  const cxScreen = $("#cx-screen"), cxDots = $("#cx-dots"), cxPh = $("#cx-phases");
  cxScreen.innerHTML = CX.map((s, i) => `<div class="screen" data-i="${i}">${s.html}</div>`).join("");
  cxDots.innerHTML = CX.map((s, i) => `<button data-i="${i}" aria-label="Screen ${i + 1} of ${CX.length}: ${s.t}"><i></i></button>`).join("");
  cxPh.innerHTML = PH.map((p) => `<span>${p}</span>`).join("");
  paintQR(cxScreen);
  let cxI = 0, cxPlaying = !reduce, cxTimer, cxActive = false;
  function cxSet(i) {
    cxI = (i + CX.length) % CX.length;
    const s = CX[cxI];
    $$(".screen", cxScreen).forEach((el, q) => {
      const was = el.classList.contains("on"); el.classList.toggle("on", q === cxI);
      if (q === cxI && !was) $$(".rise-ticket,.pop,.confetti i", el).forEach((n) => { n.style.animation = "none"; void n.offsetWidth; n.style.animation = ""; });
    });
    $("#cx-no").textContent = two(cxI + 1); $("#cx-title").textContent = s.t; $("#cx-desc").textContent = s.d;
    $$("button", cxDots).forEach((b, q) => { b.classList.toggle("on", q === cxI); b.classList.toggle("done", q < cxI); if (q === cxI) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
    $$("span", cxPh).forEach((p, q) => p.classList.toggle("on", q === s.ph));
    clearTimeout(cxTimer); if (cxPlaying && cxActive) cxTimer = setTimeout(() => cxSet(cxI + 1), 3200);
  }
  $$("button", cxDots).forEach((b) => b.addEventListener("click", () => cxSet(+b.dataset.i)));
  $("#cx-next").addEventListener("click", () => cxSet(cxI + 1)); $("#cx-prev").addEventListener("click", () => cxSet(cxI - 1));
  const cxBtn = $("#cx-play");
  const cxIcon = () => { cxBtn.innerHTML = ic(cxPlaying ? "pause" : "play"); cxBtn.setAttribute("aria-label", cxPlaying ? "Pause autoplay" : "Play autoplay"); };
  cxBtn.addEventListener("click", () => { cxPlaying = !cxPlaying; cxIcon(); cxSet(cxI); });
  cxIcon(); cxSet(0);
  hook("customer", { enter() { cxActive = true; cxSet(0); }, leave() { cxActive = false; clearTimeout(cxTimer); } });

  /* ==========================================================
     Benefits
     ========================================================== */
  const BEN = [
    ["sliders", "Run every event from one place", "Annual Day, camps and workshops in one calm view."],
    ["layers", "One shared seat list", "Online and front desk bookings use the same count."],
    ["trend", "Better visibility", "See online and front desk bookings side by side."],
    ["clipboard", "Less paperwork", "Scan passes instead of ticking names off a list."],
    ["zap", "A quicker welcome", "A fast scan replaces hand checks at the door."],
    ["door", "Several entrances, one record", "Entrances share which passes are used."],
    ["wifi-off", "Ready for weak Wi-Fi", "A plan for slow or lost internet."],
    ["users", "Know who has arrived", "A live headcount while the event runs."],
    ["heart", "Happier parents", "Easy booking, a clear pass and no confusion."],
    ["network", "Room to grow", "Add new events and programmes without new tools."],
    ["chart", "Simple reports", "Bookings, arrivals and payments in plain tables."],
    ["clock", "More time for children", "Less admin for teachers and front desk staff."],
  ];
  $("#b-grid").innerHTML = BEN.map((b, i) => `<div class="b-item a" style="--n:${i + 2}"><span class="ico">${ic(b[0])}</span><h3>${b[1]}</h3><p>${b[2]}</p></div>`).join("");

  /* ==========================================================
     Roadmap: five stages
     ========================================================== */
  const STAGES = [
    ["Discovery and planning", "Understand your school, events and goals.", ["Look at your current website", "Learn how families book today", "List your event types and pass types", "Understand how your team runs the day", "Estimate how many families attend", "Confirm what matters most to you"]],
    ["Build and connect", "Build the platform and connect it to your site.", ["Event management", "Seat list and limits", "Booking flow for parents", "Online payment connection", "Front desk booking", "Reports for your team"]],
    ["Campus preparation", "Prepare the school for event day.", ["Scanning device setup", "Campus Wi-Fi check", "Offline preparation", "Several entrances working together", "Synchronisation testing"]],
    ["Testing", "Prove it works, including on a bad day.", ["Online bookings", "Front desk bookings", "Two parents booking the last seat", "Failed payments", "Cancellations", "A pass scanned twice", "Several entrances", "Internet interruption", "Campus network failure", "Synchronisation and matching up records"]],
    ["Training and launch", "Prepare your team and go live.", ["Admin team training", "Front desk training", "Entrance team training", "Pilot with one event", "Full launch", "Support after launch"]],
  ];
  const stagesEl = $("#stages"), stageDetail = $("#stage-detail");
  stagesEl.innerHTML = STAGES.map((s, i) => `<button class="stage-btn" role="tab" id="st-tab-${i}" data-i="${i}"><span class="no">${two(i + 1)}</span><h3>${s[0]}</h3><p>${s[1]}</p></button>`).join("");
  let stI = 0, stManual = false, stTimer;
  function setStage(i) {
    stI = i;
    $$(".stage-btn", stagesEl).forEach((b, q) => { b.classList.toggle("on", q === i); b.classList.toggle("done", q < i); b.setAttribute("aria-selected", q === i); b.tabIndex = q === i ? 0 : -1; });
    const s = STAGES[i];
    stageDetail.setAttribute("aria-labelledby", "st-tab-" + i);
    stageDetail.innerHTML = `<h3>Stage ${i + 1}: ${s[0]}</h3><ul>${s[2].map((t) => `<li>${ic("check-circle")}<span>${t}</span></li>`).join("")}</ul>`;
  }
  stagesEl.addEventListener("click", (e) => { const b = e.target.closest(".stage-btn"); if (b) { stManual = true; setStage(+b.dataset.i); } });
  stagesEl.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.stopPropagation(); e.preventDefault(); stManual = true;
    const n = clamp(stI + (e.key === "ArrowRight" ? 1 : -1), 0, STAGES.length - 1); setStage(n); $(`#st-tab-${n}`).focus();
  });
  setStage(0);
  hook("roadmap", {
    enter() { stManual = false; setStage(0); if (!reduce) stTimer = setInterval(() => { if (!stManual && stI < STAGES.length - 1) setStage(stI + 1); }, 3200); },
    leave() { clearInterval(stTimer); },
  });

  /* ==========================================================
     Cost and requirements
     ========================================================== */
  const COST = [
    ["Initial development", "Platform build, connection to your website, booking flow, admin dashboard and entry checks."],
    ["Infrastructure", "Hosting, database, backups, scanning devices and campus Wi-Fi checks."],
    ["Third-party services", "Payment gateway charges, WhatsApp, SMS and email services, if you choose to use them."],
    ["Ongoing support", "Bug fixes, monitoring, updates, help for your team and future improvements."],
  ];
  $("#cost-grid").innerHTML = COST.map((c, i) => `<div class="cost-card"><b>${two(i + 1)}</b><h3>${c[0]}</h3><p>${c[1]}</p></div>`).join("");
  const NEEDS = [
    ["Your website", ["How the site is built", "Who hosts it", "How families book today", "Access for connecting the platform"]],
    ["Your events", ["Which events you run each year", "How many families attend", "Pass types and prices", "Refund and cancellation rules"]],
    ["Payments", ["Preferred payment provider", "Online payment methods", "Front desk payment methods", "How refunds are handled"]],
    ["Campus", ["Number of entrances", "Number of scanning devices", "Wi-Fi coverage", "Backup power", "Where the front desk sits"]],
    ["Your team", ["Who creates events", "Who works the front desk", "Who checks passes at the door", "Which reports you need", "How parents are notified"]],
    ["Open questions", ["Can passes be shared with relatives?", "Can parents cancel a booking?", "What if a pass is lost?", "Is re-entry allowed?", "Do you need a waiting list for camps?", "How early should booking open?"]],
  ];
  $("#needs-grid").innerHTML = NEEDS.map((n, i) => `<div class="need-card a" style="--n:${i + 2}"><b>${two(i + 1)}</b><h3>${n[0]}</h3><ul>${n[1].map((t) => `<li>${t}</li>`).join("")}</ul></div>`).join("");
  boot();
})();
