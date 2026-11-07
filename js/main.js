/* Studio Name — site behaviour
   - builds the drifting strip + Work grid from window.PROJECTS
   - scroll reveals (IntersectionObserver, no scroll listeners)
   - full-screen gallery with swipe / arrow keys / back-button close */
(function () {
  'use strict';

  var PROJECTS = window.PROJECTS || [];
  var root = document.documentElement;
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = reduceMQ.matches;

  var bySlug = {};
  PROJECTS.forEach(function (p) { bySlug[p.slug] = p; });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function base(p, im) { return p.folder + im.file; }
  function widths(p) { return p.widths || [640, 1125]; }

  /* Responsive <picture> using thumb + full in a srcset */
  function picture(p, im, sizes, extra) {
    var b = base(p, im), w = widths(p);
    return '<picture>' +
      '<source type="image/webp" srcset="' + b + '-thumb.webp ' + w[0] + 'w, ' + b + '.webp ' + w[1] + 'w" sizes="' + sizes + '">' +
      '<img src="' + b + '-thumb.jpg" srcset="' + b + '-thumb.jpg ' + w[0] + 'w, ' + b + '.jpg ' + w[1] + 'w" sizes="' + sizes + '"' +
      ' width="' + w[0] + '" height="' + Math.round(w[0] * 1.25) + '" alt="' + esc(im.alt) + '" loading="lazy" decoding="async"' + (extra || '') + '>' +
      '</picture>';
  }
  /* Thumb-only picture (strip) */
  function thumbPicture(p, im, alt) {
    var b = base(p, im), w = widths(p);
    return '<picture><source type="image/webp" srcset="' + b + '-thumb.webp">' +
      '<img src="' + b + '-thumb.jpg" width="' + w[0] + '" height="' + Math.round(w[0] * 1.25) + '" alt="' + esc(alt) + '" decoding="async" fetchpriority="low" draggable="false"></picture>';
  }

  /* ---------- Drifting strip ---------- */
  function buildStrip() {
    var track = document.getElementById('strip-track');
    if (!track || !PROJECTS.length) return;

    // Interleave images across projects so the strip mixes work.
    var items = [], max = 0;
    PROJECTS.forEach(function (p) { max = Math.max(max, p.images.length); });
    for (var i = 0; i < max; i++) {
      PROJECTS.forEach(function (p) { if (p.images[i]) items.push({ p: p, i: i }); });
    }

    function set(hidden) {
      return '<div class="strip-set"' + (hidden ? ' aria-hidden="true"' : '') + '>' +
        items.map(function (it) {
          var label = it.p.title + ', photo ' + (it.i + 1) + ' of ' + it.p.images.length;
          return '<button type="button" class="strip-item" data-project="' + it.p.slug + '" data-index="' + it.i + '"' +
            (hidden ? ' tabindex="-1"' : ' aria-label="Open ' + esc(label) + '"') + '>' +
            thumbPicture(it.p, it.p.images[it.i], hidden ? '' : it.p.images[it.i].alt) +
            '<span class="strip-label" aria-hidden="true">' + esc(it.p.title) + '</span></button>';
        }).join('') + '</div>';
    }
    track.innerHTML = set(false) + set(true);

    // Constant, slow speed regardless of how many photos there are.
    function setDuration() {
      var first = track.firstElementChild;
      if (!first) return;
      var w = first.getBoundingClientRect().width;
      var pxPerSec = window.innerWidth < 700 ? 22 : 34;
      track.style.setProperty('--dur', Math.max(30, w / pxPerSec).toFixed(1) + 's');
    }
    setDuration();
    var rT;
    window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(setDuration, 200); });

    // Pause when off-screen (saves battery on phones).
    var strip = document.getElementById('strip');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { strip.classList.toggle('is-paused', !e.isIntersecting); });
      }).observe(strip);
    }
  }

  /* ---------- Work grid ---------- */
  function buildGrid() {
    var grid = document.getElementById('work-grid');
    if (!grid) return;
    grid.innerHTML = PROJECTS.map(function (p, n) {
      var c = Math.min(p.cover || 0, p.images.length - 1);
      var cover = p.images[c];
      var meta = [p.location, p.year].filter(Boolean).map(esc).join(' &middot; ');
      return '<article class="card">' +
        '<a class="card-link" href="' + base(p, p.images[0]) + '.jpg" data-project="' + p.slug + '" data-index="0" aria-label="Open ' + esc(p.title) + ' gallery, ' + p.images.length + ' photographs">' +
        '<div class="mask ratio">' + picture(p, cover, '(min-width: 760px) 42vw, 100vw') + '</div>' +
        '<div class="card-meta"><h3 class="reveal">' + esc(p.title) + '</h3>' +
        '<p class="reveal" style="--d:.08s">' + meta + (p.type ? ' &middot; ' + esc(p.type) : '') + '</p>' +
        '<span class="card-count reveal" style="--d:.12s">' + p.images.length + ' photographs</span></div>' +
        '</a></article>';
    }).join('');
  }

  /* ---------- Reveals ---------- */
  function initReveals() {
    var els = document.querySelectorAll('.reveal, .mask, .reveal-line, .strip');
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Header border once scrolled ---------- */
  function initHeader() {
    var header = document.getElementById('site-header');
    var sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;height:24px;width:1px;pointer-events:none';
    document.body.prepend(sentinel);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        header.classList.toggle('is-scrolled', !e[0].isIntersecting);
      }).observe(sentinel);
    }
  }

  /* =========================================================
     Lightbox
     ========================================================= */
  var lb = document.getElementById('lightbox');
  var stage = document.getElementById('lb-stage');
  var track = document.getElementById('lb-track');
  var btnPrev = document.getElementById('lb-prev');
  var btnNext = document.getElementById('lb-next');
  var btnClose = document.getElementById('lb-close');
  var elTitle = document.getElementById('lb-title');
  var elMeta = document.getElementById('lb-meta');
  var elCount = document.getElementById('lb-count');
  var page = [document.querySelector('main'), document.getElementById('site-header'), document.querySelector('.site-footer')];

  var cur = null, idx = 0, isOpen = false, lastFocus = null, hideTimer = null;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function buildSlides(p) {
    track.innerHTML = p.images.map(function (im, i) {
      return '<figure class="lb-slide" data-i="' + i + '" aria-hidden="true"><picture>' +
        '<source type="image/webp" data-srcset="' + base(p, im) + '.webp">' +
        '<img data-src="' + base(p, im) + '.jpg" alt="' + esc(im.alt) + '" draggable="false" decoding="async">' +
        '</picture></figure>';
    }).join('');
  }

  function loadSlide(i) {
    var s = track.children[i];
    if (!s || s.dataset.loaded) return;
    s.dataset.loaded = '1';
    var src = s.querySelector('source'), img = s.querySelector('img');
    img.addEventListener('load', function () { img.classList.add('is-loaded'); }, { once: true });
    img.addEventListener('error', function () { img.classList.add('is-loaded'); }, { once: true });
    src.srcset = src.dataset.srcset;
    img.src = img.dataset.src;
    if (img.complete && img.naturalWidth) img.classList.add('is-loaded');
  }

  function setPos(dx, animate) {
    var w = stage.clientWidth;
    track.classList.toggle('is-dragging', !animate);
    track.style.transform = 'translate3d(' + (-idx * w + (dx || 0)) + 'px,0,0)';
  }

  function go(n, animate) {
    if (!cur) return;
    var len = cur.images.length;
    idx = Math.max(0, Math.min(len - 1, n));
    setPos(0, animate !== false);
    loadSlide(idx); loadSlide(idx + 1); loadSlide(idx - 1);
    Array.prototype.forEach.call(track.children, function (s, i) {
      s.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
    });
    elCount.textContent = pad(idx + 1) + ' / ' + pad(len);
    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx === len - 1;
  }

  function open(slug, i) {
    var p = bySlug[slug];
    if (!p) return;
    clearTimeout(hideTimer);
    lastFocus = document.activeElement;
    if (cur !== p) { cur = p; buildSlides(p); }
    elTitle.textContent = p.title;
    elMeta.textContent = [p.location, p.year].filter(Boolean).join(' · ');

    lb.hidden = false;
    root.classList.add('lb-open');
    page.forEach(function (el) { if (el) el.inert = true; });
    go(i || 0, false);
    void lb.offsetWidth;            // commit start state before fading in
    lb.classList.add('is-open');
    isOpen = true;
    btnClose.focus({ preventScroll: true });

    if (!(history.state && history.state.lb)) {
      try { history.pushState({ lb: 1 }, ''); } catch (e) {}
    }
  }

  function hideUI() {
    if (!isOpen) return;
    isOpen = false;
    lb.classList.remove('is-open');
    root.classList.remove('lb-open');
    page.forEach(function (el) { if (el) el.inert = false; });
    hideTimer = setTimeout(function () { lb.hidden = true; }, reduce ? 0 : 450);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function close() {
    if (history.state && history.state.lb) history.back(); // popstate → hideUI
    else hideUI();
  }

  window.addEventListener('popstate', function () {
    if (isOpen && !(history.state && history.state.lb)) hideUI();
  });

  // Any element with data-project opens the gallery (links fall back to the image without JS).
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-project]');
    if (!t || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    open(t.getAttribute('data-project'), parseInt(t.getAttribute('data-index'), 10) || 0);
  });

  btnPrev.addEventListener('click', function () { go(idx - 1); });
  btnNext.addEventListener('click', function () { go(idx + 1); });
  btnClose.addEventListener('click', close);

  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); }
    else if (e.key === 'Tab') {
      var f = [btnClose, btnPrev, btnNext].filter(function (b) { return !b.disabled; });
      var at = f.indexOf(document.activeElement);
      e.preventDefault();
      var next = e.shiftKey ? (at <= 0 ? f.length - 1 : at - 1) : (at + 1) % f.length;
      f[next].focus();
    }
  });

  // Swipe / drag
  var drag = null, suppressClick = false;
  stage.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, dx: 0, active: false };
  });
  stage.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.active) {
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        drag.active = true;
        try { stage.setPointerCapture(e.pointerId); } catch (err) {}
      } else if (Math.abs(dy) > 12) { drag = null; return; }
      else return;
    }
    drag.dx = dx;
    var last = cur.images.length - 1;
    if ((idx === 0 && dx > 0) || (idx === last && dx < 0)) dx *= 0.3; // resist at the ends
    setPos(dx, false);
  });
  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    if (drag.active) {
      var dt = Math.max(1, performance.now() - drag.t);
      var v = drag.dx / dt;
      var threshold = Math.min(90, stage.clientWidth * 0.18);
      if (drag.dx < -threshold || v < -0.45) go(idx + 1);
      else if (drag.dx > threshold || v > 0.45) go(idx - 1);
      else setPos(0, true);
      suppressClick = true;
      setTimeout(function () { suppressClick = false; }, 50);
    }
    drag = null;
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', function (e) { if (drag && drag.active) setPos(0, true); drag = null; });

  // Click on empty space around the photo closes; click on the photo advances.
  stage.addEventListener('click', function (e) {
    if (suppressClick) return;
    if (e.target.tagName === 'IMG') {
      var r = e.target.getBoundingClientRect();
      go(e.clientX < r.left + r.width / 3 ? idx - 1 : idx + 1);
    } else close();
  });

  window.addEventListener('resize', function () { if (isOpen) setPos(0, false); });

  /* ---------- Init ---------- */
  buildStrip();
  buildGrid();
  initReveals();
  initHeader();
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  window.__siteReady = true;
})();
