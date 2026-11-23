/* RMDesign v2 — the photo reel.
   The reel is an ordinary sideways scroller (swipe, trackpad or scrollbar).
   The Previous / Next buttons and the left / right arrow keys move it one
   photograph at a time. Clicking a photograph is handled by main.js. */
(function () {
  'use strict';
  var reel = document.getElementById('reel');
  var prev = document.getElementById('reel-prev');
  var next = document.getElementById('reel-next');
  if (!reel || !prev || !next) return;

  var smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function step() {
    var first = reel.querySelector('.frame');
    if (!first) return reel.clientWidth * 0.8;
    var gap = parseFloat(getComputedStyle(reel).columnGap) || 0;
    return first.getBoundingClientRect().width + gap;
  }
  function move(dir) {
    reel.scrollBy({ left: dir * step(), behavior: smooth ? 'smooth' : 'auto' });
  }
  function update() {
    var max = reel.scrollWidth - reel.clientWidth;
    prev.disabled = reel.scrollLeft <= 2;
    next.disabled = reel.scrollLeft >= max - 2;
  }

  prev.addEventListener('click', function () { move(-1); });
  next.addEventListener('click', function () { move(1); });
  reel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
  });
  reel.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
