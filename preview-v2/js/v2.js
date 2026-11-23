/* RMDesign v2 — finish schedule preview.
   Pointing at (or tabbing to) a finish shows the photo of it in the panel
   beside the list. Clicking is handled by main.js, which opens the gallery. */
(function () {
  'use strict';
  var view = document.getElementById('sched-view');
  if (!view) return;
  var rows = document.querySelectorAll('.sched a[data-index]');
  var imgs = view.querySelectorAll('img');

  function show(row) {
    var i = row.getAttribute('data-index');
    Array.prototype.forEach.call(imgs, function (img) {
      img.classList.toggle('is-active', img.getAttribute('data-i') === i);
    });
    Array.prototype.forEach.call(rows, function (r) { r.classList.toggle('is-current', r === row); });
    view.setAttribute('data-index', i);
    view.setAttribute('href', row.getAttribute('href'));
  }

  Array.prototype.forEach.call(rows, function (row) {
    row.addEventListener('mouseenter', function () { show(row); });
    row.addEventListener('focus', function () { show(row); });
  });
  if (rows.length) show(rows[0]);
})();
