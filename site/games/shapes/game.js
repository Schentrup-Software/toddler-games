// Shapes: drag each shape into the hole it fits. A wrong drop just glides the
// shape back; filling every hole throws confetti and deals a new set.

import { boop, chime, fanfare } from '../../js/audio.js';
import { COLORS, confetti, shuffle } from '../../js/fx.js';

const PER_ROUND = 3;
const SNAP = 0.6; // a piece dropped within this many hole-widths of its hole snaps in
const NEXT_ROUND_MS = 2000;

// Drawn in a 100x100 box. `face` is how far down the smile sits.
const SHAPES = {
  circle:   { face: 50, body: '<circle cx="50" cy="50" r="40"/>' },
  square:   { face: 50, body: '<rect x="12" y="12" width="76" height="76" rx="8"/>' },
  triangle: { face: 62, body: '<path d="M50 12 92 86H8Z"/>' },
  star:     { face: 55, body: '<path d="M50 6 62.9 34.2 93.7 37.8 70.9 58.8 77 89.2 50 74 23 89.2 29.1 58.8 6.3 37.8 37.1 34.2Z"/>' },
  heart:    { face: 42, body: '<path d="M50 88C22 66 8 50 8 32 8 18 19 9 31 9c8 0 15 4 19 11 4-7 11-11 19-11 12 0 23 9 23 23 0 18-14 34-42 56Z"/>' },
  plus:     { face: 50, body: '<path d="M36 10h28v26h26v28H64v26H36V64H10V36h26Z"/>' },
};

function draw(name, asPiece) {
  const { body, face } = SHAPES[name];
  const extras = asPiece
    ? `<g class="piece__face" transform="translate(50 ${face})">
         <circle cx="-9" cy="-3" r="3.2"/><circle cx="9" cy="-3" r="3.2"/>
         <path d="M-6 5q6 6 12 0"/>
       </g>`
    : '';
  // A darker copy peeking out underneath gives the piece a chunky bottom edge.
  const edge = asPiece ? `<g class="piece__edge" transform="translate(0 4)">${body}</g>` : '';
  return `<svg viewBox="-4 -4 108 108" aria-hidden="true">${edge}<g class="shape__body">${body}</g>${extras}</svg>`;
}

const centre = (el) => {
  const box = el.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2, size: box.width };
};

export function start(stage) {
  const board = document.createElement('div');
  board.className = 'shapes';
  board.innerHTML = '<div class="shapes__row"></div><div class="shapes__row shapes__tray"></div>';
  stage.append(board);
  const [holeRow, tray] = board.children;

  let placed = 0;
  let nextRound = 0;

  function deal() {
    placed = 0;
    board.classList.remove('is-done');
    holeRow.textContent = '';
    tray.textContent = '';

    const names = shuffle(Object.keys(SHAPES)).slice(0, PER_ROUND);
    const colors = shuffle(COLORS);
    // Rotating the order guarantees no piece starts directly under its hole.
    const shift = 1 + Math.floor(Math.random() * (PER_ROUND - 1));

    names.forEach((name, i) => {
      const hole = document.createElement('div');
      hole.className = 'hole';
      hole.dataset.shape = name;
      hole.innerHTML = draw(name, false);
      holeRow.append(hole);

      const trayName = names[(i + shift) % PER_ROUND];
      const slot = document.createElement('div');
      slot.className = 'slot';
      const piece = document.createElement('div');
      piece.className = `piece c-${colors[i]}`;
      piece.dataset.shape = trayName;
      piece.innerHTML = draw(trayName, true);
      slot.append(piece);
      tray.append(slot);
    });

    for (const piece of tray.querySelectorAll('.piece')) {
      makeDraggable(piece, holeRow.querySelector(`[data-shape="${piece.dataset.shape}"]`));
    }
  }

  function makeDraggable(piece, hole) {
    const slot = piece.parentElement;
    let pointer = null;
    let grabX = 0;
    let grabY = 0;

    const moveTo = (x, y) => {
      piece.style.setProperty('--dx', `${x}px`);
      piece.style.setProperty('--dy', `${y}px`);
    };
    const isNear = () => {
      const a = centre(piece);
      const b = centre(hole);
      return Math.hypot(a.x - b.x, a.y - b.y) < b.size * SNAP;
    };

    piece.addEventListener('pointerdown', (e) => {
      if (pointer !== null || piece.classList.contains('is-placed')) return;
      pointer = e.pointerId;
      piece.setPointerCapture(pointer);
      // Measure rather than assume, so a piece caught mid-glide doesn't jump.
      const now = piece.getBoundingClientRect();
      const rest = slot.getBoundingClientRect();
      grabX = e.clientX - (now.left - rest.left);
      grabY = e.clientY - (now.top - rest.top);
      piece.classList.add('is-held');
      moveTo(e.clientX - grabX, e.clientY - grabY);
    });

    piece.addEventListener('pointermove', (e) => {
      if (e.pointerId !== pointer) return;
      moveTo(e.clientX - grabX, e.clientY - grabY);
      hole.classList.toggle('is-near', isNear());
    });

    const drop = (e) => {
      if (e.pointerId !== pointer) return;
      pointer = null;
      piece.classList.remove('is-held');
      hole.classList.remove('is-near');
      if (isNear()) {
        place(piece, hole);
      } else {
        moveTo(0, 0);
        boop();
      }
    };
    piece.addEventListener('pointerup', drop);
    piece.addEventListener('pointercancel', drop);
  }

  function place(piece, hole) {
    // Move the piece into the hole in the DOM so it stays put when the tablet
    // rotates, then animate from where it was dropped.
    const from = piece.getBoundingClientRect();
    hole.append(piece);
    piece.classList.add('is-placed');
    piece.style.removeProperty('--dx');
    piece.style.removeProperty('--dy');
    const to = piece.getBoundingClientRect();
    piece.animate(
      [{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` }, { transform: 'none' }],
      { duration: 220, easing: 'cubic-bezier(.3, 1.4, .6, 1)' },
    );

    placed += 1;
    if (placed < PER_ROUND) {
      chime();
      return;
    }
    fanfare();
    confetti(board);
    board.classList.add('is-done');
    nextRound = setTimeout(deal, NEXT_ROUND_MS);
  }

  deal();

  return () => {
    clearTimeout(nextRound);
    board.remove();
  };
}
