/* Fallsky Weather — standalone rebuild. All behavior, vanilla JS. */
(function () {
  'use strict';

  var mq = window.matchMedia('(max-width: 900px)');

  /* ---------- Off-canvas / mega menu ---------- */
  var nav = document.getElementById('mainNav');
  var toggle = document.getElementById('navToggle');
  var close = document.getElementById('navClose');
  var backdrop = document.getElementById('navBackdrop');

  function openNav() {
    nav.classList.add('is-open');
    backdrop.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    nav.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle) toggle.addEventListener('click', function () {
    nav.classList.contains('is-open') ? closeNav() : openNav();
  });
  if (close) close.addEventListener('click', closeNav);
  if (backdrop) backdrop.addEventListener('click', closeNav);

  // Dropdown headings: on mobile they toggle the submenu open; on desktop CSS hover handles it.
  var headings = document.querySelectorAll('.menu__item--has-children > .menu__heading');
  Array.prototype.forEach.call(headings, function (h) {
    function trigger(e) {
      if (!mq.matches) return; // desktop: leave to CSS hover
      e.preventDefault();
      var sub = h.nextElementSibling;
      if (sub) sub.classList.toggle('is-open');
    }
    h.addEventListener('click', trigger);
    h.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') trigger(e);
    });
  });

  // Close the off-canvas after tapping a real link
  Array.prototype.forEach.call(nav.querySelectorAll('a'), function (a) {
    a.addEventListener('click', function () { if (mq.matches) closeNav(); });
  });

  /* ---------- Hero slideshow ---------- */
  var hero = document.getElementById('hero');
  if (hero) {
    var slides = hero.querySelectorAll('.hero__slide');
    var dotsWrap = document.getElementById('heroDots');
    var idx = 0, timer;
    var dots = [];

    function show(n) {
      slides[idx].classList.remove('is-active');
      dots[idx].classList.remove('is-active');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('is-active');
      dots[idx].classList.add('is-active');
    }
    function next() { show(idx + 1); }
    function start() { timer = setInterval(next, 5000); }
    function reset() { clearInterval(timer); start(); }

    // build dot controls
    Array.prototype.forEach.call(slides, function (_, i) {
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Show slide ' + (i + 1));
      if (i === 0) b.classList.add('is-active');
      b.addEventListener('click', function () { show(i); reset(); });
      dotsWrap.appendChild(b);
      dots.push(b);
    });

    if (slides.length > 1) start();
  }

  /* ---------- weatherwidget.io loader (single injected script) ---------- */
  (function (d, s, id) {
    if (d.getElementById(id)) return;
    var js = d.createElement(s);
    js.id = id;
    js.src = 'https://weatherwidget.io/js/widget.min.js';
    var first = d.getElementsByTagName(s)[0];
    first.parentNode.insertBefore(js, first);
  })(document, 'script', 'weatherwidget-io-js');

  /* ---------- SPC activity loop: cache-bust so it stays current ---------- */
  var spc = document.getElementById('spcLoop');
  if (spc) {
    var spcUrl = spc.getAttribute('data-src');
    function refreshSpc() { spc.src = spcUrl + '?t=' + Date.now(); }
    refreshSpc();
    setInterval(refreshSpc, 5 * 60 * 1000); // every 5 min
  }

  /* ---------- AccuWeather mosaic iframe: load + refresh every 5 min ---------- */
  var mosaic = document.getElementById('mosaicFrame');
  if (mosaic) {
    var mosaicUrl = mosaic.getAttribute('data-src');
    function refreshMosaic() { mosaic.src = mosaicUrl + '?t=' + Date.now(); }
    refreshMosaic();
    setInterval(refreshMosaic, 5 * 60 * 1000);
  }

  /* ---------- Scroll-to-top ---------- */
  var up = document.getElementById('scrollUp');
  if (up) {
    window.addEventListener('scroll', function () {
      up.classList.toggle('is-visible', window.pageYOffset > 400);
    });
    up.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
