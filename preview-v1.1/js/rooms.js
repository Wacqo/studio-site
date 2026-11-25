/* RMDesign — Work section, grouped by room.
   Builds one button per room from ROOMS (js/projects.js) and shows only
   the projects whose `room` matches. A room with no projects yet shows a
   "coming soon" line. Runs after main.js has built the project cards. */
(function () {
  'use strict';
  var rooms = window.ROOMS || [];
  var bar = document.getElementById('rooms');
  var grid = document.getElementById('work-grid');
  var empty = document.getElementById('rooms-empty');
  if (!bar || !grid || !rooms.length) return;

  function show(room) {
    var cards = grid.querySelectorAll('.card');
    var shown = 0;
    Array.prototype.forEach.call(cards, function (card) {
      var match = card.getAttribute('data-room') === room;
      card.hidden = !match;
      if (match) shown++;
    });
    var soon = grid.querySelector('.coming-soon');
    if (soon) soon.hidden = shown === 0;
    if (empty) {
      empty.hidden = shown > 0;
      empty.textContent = shown > 0 ? '' : room + ': photographs coming soon.';
    }
    Array.prototype.forEach.call(bar.querySelectorAll('.room-btn'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-room') === room ? 'true' : 'false');
    });
  }

  rooms.forEach(function (room) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'room-btn';
    b.setAttribute('data-room', room);
    b.textContent = room;
    b.addEventListener('click', function () { show(room); });
    bar.appendChild(b);
  });

  /* Start on the first room that has a project */
  var first = rooms[0];
  for (var i = 0; i < rooms.length; i++) {
    if (grid.querySelector('.card[data-room="' + rooms[i] + '"]')) { first = rooms[i]; break; }
  }
  show(first);
})();
