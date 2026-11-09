/* JingleMoon site: menu, countdown, advent doors, snow globes, reveal, parallax, snowfall. No tracking, no requests. */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var DECEMBER = 11, EVE = 24, DAY = 25, AFTER = 26;
  var SECOND = 1000, MINUTE = 60 * SECOND, HOUR = 60 * MINUTE, DAY_MS = 24 * HOUR;

  /* menu */
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    var small = window.matchMedia("(max-width: 47.99rem)");
    var sync = function () { nav.hidden = small.matches && menuBtn.getAttribute("aria-expanded") !== "true"; };
    menuBtn.addEventListener("click", function () {
      menuBtn.setAttribute("aria-expanded", menuBtn.getAttribute("aria-expanded") === "true" ? "false" : "true");
      sync();
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { menuBtn.setAttribute("aria-expanded", "false"); sync(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        menuBtn.setAttribute("aria-expanded", "false"); sync(); menuBtn.focus();
      }
    });
    small.addEventListener("change", sync);
    sync();
  }

  /* countdown to the start of Christmas Eve, in the visitor's own time zone */
  var clocks = document.querySelectorAll("[data-countdown]");
  var pad = function (n) { return n < 10 ? "0" + n : String(n); };
  function christmasState(now) {
    var y = now.getFullYear();
    var eve = new Date(y, DECEMBER, EVE);
    if (now >= eve && now < new Date(y, DECEMBER, DAY)) return { state: "eve" };
    if (now >= new Date(y, DECEMBER, DAY) && now < new Date(y, DECEMBER, AFTER)) return { state: "day" };
    if (now >= new Date(y, DECEMBER, AFTER)) eve = new Date(y + 1, DECEMBER, EVE);
    return { state: "count", left: eve - now };
  }
  function tick() {
    var s = christmasState(new Date());
    clocks.forEach(function (c) {
      c.setAttribute("data-state", s.state);
      var msg = c.querySelector("[data-msg]");
      if (s.state === "eve") { msg.textContent = "It is Christmas Eve. Santa is on his way!"; return; }
      if (s.state === "day") { msg.textContent = "Merry Christmas from Santa and the reindeer!"; return; }
      var t = s.left;
      var v = { d: Math.floor(t / DAY_MS), h: Math.floor(t % DAY_MS / HOUR), m: Math.floor(t % HOUR / MINUTE), s: Math.floor(t % MINUTE / SECOND) };
      c.querySelectorAll("[data-u]").forEach(function (el) {
        var u = el.getAttribute("data-u");
        var text = u === "d" ? String(v.d) : pad(v[u]);
        if (el.textContent !== text) el.textContent = text;
      });
    });
  }
  if (clocks.length) { tick(); setInterval(tick, SECOND); }

  /* advent doors: today's door glows in December, earlier doors are open */
  var doors = document.querySelector("[data-doors]");
  if (doors) {
    var order = [7, 15, 1, 20, 11, 4, 18, 2, 23, 9, 13, 6, 21, 16, 3, 10, 24, 12, 5, 19, 8, 14, 22, 17];
    var now = new Date();
    var today = now.getMonth() === DECEMBER ? now.getDate() : 0;
    order.forEach(function (n) {
      var li = document.createElement("li");
      li.textContent = n;
      if (n === today) { li.className = "today"; li.setAttribute("aria-label", "Door " + n + ", today"); }
      else if (n < today) { li.className = "open"; li.setAttribute("aria-label", "Door " + n + ", opened"); }
      else li.setAttribute("aria-label", "Door " + n);
      doors.appendChild(li);
    });
    var cap = document.querySelector("[data-advent-caption]");
    if (cap && today >= 1 && today <= EVE) cap.textContent = "Today is door " + today + ". Each door opens on its day in December.";
  }

  /* snow globes: tap to shake and swirl the snow */
  document.querySelectorAll(".globe-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (reduceMotion.matches) return;
      btn.classList.remove("shaking"); void btn.offsetWidth; btn.classList.add("shaking");
      var old = btn.querySelector(".flurry"); if (old) old.remove();
      var f = document.createElement("span"); f.className = "flurry"; f.setAttribute("aria-hidden", "true");
      for (var i = 0; i < 26; i++) {
        var p = document.createElement("i");
        p.style.left = (Math.random() * 100) + "%";
        p.style.setProperty("--x", ((Math.random() - 0.5) * 60) + "px");
        p.style.setProperty("--y", (60 + Math.random() * 80) + "px");
        p.style.setProperty("--d", (Math.random() * 0.5) + "s");
        p.style.setProperty("--t", (1.6 + Math.random() * 1.6) + "s");
        var size = 2 + Math.random() * 4; p.style.width = size + "px"; p.style.height = size + "px";
        f.appendChild(p);
      }
      btn.appendChild(f);
      setTimeout(function () { f.remove(); btn.classList.remove("shaking"); }, 3800);
    });
  });

  /* scroll reveal */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  if (reduceMotion.matches) return;

  /* parallax pine branches */
  var layers = document.querySelectorAll("[data-parallax]");
  var ticking = false;
  function parallax() {
    ticking = false;
    var vh = window.innerHeight;
    layers.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var k = parseFloat(el.getAttribute("data-parallax"));
      el.style.transform = "translate3d(0," + Math.max(0, -r.top * k).toFixed(1) + "px,0)";
    });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }, { passive: true });
  parallax();

  /* snowfall: one small canvas, paused when the tab is hidden */
  var canvas = document.getElementById("snow");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var flakes = [], w = 0, h = 0, dpr = 1, running = true, last = 0;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var count = Math.round(Math.min(110, Math.max(36, w * h / 14000)));
    while (flakes.length < count) flakes.push(make(true));
    flakes.length = count;
  }
  function make(anywhere) {
    var r = Math.random();
    return { x: Math.random() * w, y: anywhere ? Math.random() * h : -10, r: 0.8 + r * r * 2.6, s: 18 + r * 46, sway: Math.random() * Math.PI * 2, a: 0.35 + Math.random() * 0.5 };
  }
  function frame(t) {
    if (!running) return;
    var dt = Math.min(0.05, (t - last) / 1000 || 0); last = t;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      f.y += f.s * dt; f.sway += dt * 0.8; f.x += Math.sin(f.sway) * 12 * dt;
      if (f.y > h + 8) { flakes[i] = make(false); continue; }
      ctx.globalAlpha = f.a;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) { last = performance.now(); requestAnimationFrame(frame); }
  });
  reduceMotion.addEventListener("change", function (e) { if (e.matches) { running = false; ctx.clearRect(0, 0, w, h); } });
  resize();
  requestAnimationFrame(frame);
})();
