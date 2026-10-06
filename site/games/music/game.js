// Music: a rainbow xylophone. Tap a bar to play it, or slide across them.

import { NOTES, mallet } from '../../js/audio.js';
import { burst } from '../../js/fx.js';

// C major pentatonic, low to high: whatever gets mashed sounds nice together.
const BARS = [
  ['C4', 'coral'], ['D4', 'peach'], ['E4', 'butter'], ['G4', 'mint'],
  ['A4', 'aqua'], ['C5', 'sky'], ['D5', 'lilac'], ['E5', 'pink'],
];

export function start(stage) {
  const root = document.createElement('div');
  root.className = 'music';
  root.innerHTML = `<div class="xylo">${BARS.map(
    ([note, color], i) => `<div class="bar c-${color}" data-note="${note}" data-color="${color}" style="--h:${100 - i * 6}%"></div>`,
  ).join('')}</div>`;
  stage.append(root);

  const under = new Map(); // pointerId -> the bar that finger is on

  function strike(bar, e) {
    const box = root.getBoundingClientRect();
    mallet(NOTES[bar.dataset.note]);
    burst(root, e.clientX - box.left, e.clientY - box.top, bar.dataset.color, 5);
    bar.animate(
      [{ transform: 'none' }, { transform: 'translateY(8px) scale(.96)' }, { transform: 'none' }],
      { duration: 240, easing: 'ease-out' },
    );
  }

  function track(e) {
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const bar = hit && root.contains(hit) ? hit.closest('.bar') : null;
    if (bar && under.get(e.pointerId) !== bar) strike(bar, e);
    under.set(e.pointerId, bar);
  }

  root.addEventListener('pointerdown', (e) => {
    root.setPointerCapture(e.pointerId);
    track(e);
  });
  root.addEventListener('pointermove', (e) => {
    if (under.has(e.pointerId)) track(e);
  });
  for (const type of ['pointerup', 'pointercancel']) {
    root.addEventListener(type, (e) => under.delete(e.pointerId));
  }

  return () => root.remove();
}
