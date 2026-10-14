// Paint: pick a picture, then touch each part of it to colour it in. Every part
// has its own colour, so the picture comes out right whatever order they are
// touched in. When nothing is left white, it is back to the picker.

import { fanfare, pop } from '../../js/audio.js';
import { burst, confetti, rand } from '../../js/fx.js';
import { holdButton } from '../../js/hold.js';
import { PICTURES } from './pictures.js';

const STROKE = 7; // outline width in page units
const DONE_MS = 4200; // time to admire a finished picture before the picker
const HINT_IDLE_MS = 10000; // this long with nothing painted and the white parts start to glow

const BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h5.5v5.5H5ZM13.5 5H19v5.5h-5.5ZM5 13.5h5.5V19H5ZM13.5 13.5H19V19h-5.5Z"/></svg>';

// The page's rounded border, and a mat around it that hides whatever a picture
// draws past the edge.
const EDGE = `
  <path class="paint__mat" d="M-500-500H1500V1250H-500ZM40 4H960A36 36 0 0 1 996 40V710A36 36 0 0 1 960 746H40A36 36 0 0 1 4 710V40A36 36 0 0 1 40 4Z"/>
  <rect class="paint__edge" x="4" y="4" width="992" height="742" rx="36"/>`;

// One picture as an SVG: white to play with, already painted on the picker.
function page(picture, done) {
  return `
    <svg class="paint__page${done ? ' is-done' : ''}" viewBox="0 0 1000 750" preserveAspectRatio="xMidYMid meet" stroke-width="${STROKE}" aria-hidden="true">
      ${picture.art}${EDGE}
    </svg>`;
}

// The palette name out of a part's "c-<name>" class.
const colorOf = (part) => /\bc-(\w+)/.exec(part.getAttribute('class'))[1];

export function start(stage) {
  const root = document.createElement('div');
  root.className = 'paint';
  root.innerHTML = `
    <div class="paint__picker">
      <div class="paint__choices">
        ${PICTURES.map(
          (picture, i) => `
            <button class="paint__choice" type="button" data-picture="${i}" style="--i:${i}">
              <span class="paint__thumb">${page(picture, true)}</span>
              <span class="paint__name">${picture.name}</span>
            </button>`,
        ).join('')}
      </div>
    </div>
    <div class="paint__play" hidden>
      <button class="round-btn paint__back" type="button" aria-label="Pick another picture (press and hold)">${BACK}</button>
      <div class="paint__easel"></div>
    </div>`;
  stage.append(root);
  const picker = root.querySelector('.paint__picker');
  const playView = root.querySelector('.paint__play');
  const easel = root.querySelector('.paint__easel');

  let sheet = null; // the picture being painted
  let left = 0; // parts of it that are still white
  let doneTimer = 0;
  let hintTimer = 0;

  function showPicker() {
    clearTimeout(doneTimer);
    clearTimeout(hintTimer);
    easel.textContent = '';
    playView.hidden = true;
    picker.hidden = false;
  }

  function play(picture) {
    picker.hidden = true;
    playView.hidden = false;
    easel.innerHTML = page(picture, false);
    sheet = easel.firstElementChild;
    left = sheet.querySelectorAll('.p').length;
    waitToHint();
  }

  // After a quiet spell every white part glows in its own colour, which shows
  // both what is left to do and what it will look like.
  function waitToHint() {
    clearTimeout(hintTimer);
    sheet.classList.remove('is-hinting');
    hintTimer = setTimeout(() => sheet.classList.add('is-hinting'), HINT_IDLE_MS);
  }

  function finish() {
    clearTimeout(hintTimer);
    fanfare();
    confetti(root);
    sheet.animate(
      [
        { transform: 'none' },
        { transform: 'scale(1.04) rotate(-1.5deg)', offset: 0.25 },
        { transform: 'none', offset: 0.5 },
        { transform: 'scale(1.03) rotate(1.5deg)', offset: 0.75 },
        { transform: 'none' },
      ],
      { duration: 1000, easing: 'ease-in-out' },
    );
    doneTimer = setTimeout(showPicker, DONE_MS);
  }

  // Every touch splashes, so a part that is already painted still answers.
  function touch(part, e) {
    const frame = root.getBoundingClientRect();
    burst(root, e.clientX - frame.left, e.clientY - frame.top, colorOf(part), 8);
    pop(rand(0, 1));
    if (part.classList.contains('is-painted')) return;

    part.classList.add('is-painted');
    left -= 1;
    if (left > 0) waitToHint();
    else finish();
  }

  picker.addEventListener('click', (e) => {
    const choice = e.target.closest('.paint__choice');
    if (choice) play(PICTURES[choice.dataset.picture]);
  });

  holdButton(root.querySelector('.paint__back'), showPicker);

  easel.addEventListener('pointerdown', (e) => {
    const part = e.target.closest('.p');
    if (part) touch(part, e);
  });

  return () => {
    clearTimeout(doneTimer);
    clearTimeout(hintTimer);
    root.remove();
  };
}
