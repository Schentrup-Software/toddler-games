// Find It: pick a scene, then a word is shown and spoken and the child finds
// that thing in the scene. Anything else they touch is named too, so every tap
// teaches a word. When everything has been found, it is back to the picker.

import { boop, chime, fanfare } from '../../js/audio.js';
import { COLORS, burst, confetti, pick, shuffle } from '../../js/fx.js';
import { holdButton } from '../../js/hold.js';
import { hush, say } from '../../js/speech.js';
import { SCENES } from './scenes.js';

const STROKE = 4.5; // outline width in scene units, whatever a thing's scale
const HIT_PAD = 12; // extra touchable margin around each thing, in scene units
const NEXT_MS = 2600; // time to enjoy a find before the next word
const HINT_MISSES = 2; // wrong guesses before the answer starts to wiggle...
const HINT_IDLE_MS = 12000; // ...or this long without finding it

const SPEAKER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5l4.5 4v-13l-4.5 4H4Z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/></svg>';
const PICTURES = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h5.5v5.5H5ZM13.5 5H19v5.5h-5.5ZM5 13.5h5.5V19H5ZM13.5 13.5H19V19h-5.5Z"/></svg>';

function draw({ word, at: [x, y], scale, art }) {
  return `
    <g class="thing" data-word="${word}" transform="translate(${x} ${y}) scale(${scale})" stroke-width="${STROKE / scale}">
      <g class="thing__art">${art}</g>
    </g>`;
}

// The whole scene as one SVG: full size when playing, small on the picker.
function picture(scene) {
  return `
    <svg class="find__picture" viewBox="0 0 1000 750" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g stroke-width="${STROKE}">${scene.back}</g>
      ${scene.things.map(draw).join('')}
    </svg>`;
}

// A flower stem or a cat's whisker is far too thin to hit, so each thing gets
// an invisible padded box behind it that takes the touch instead.
function addHitArea(thing, scale) {
  const box = thing.firstElementChild.getBBox();
  const pad = HIT_PAD / scale;
  const hit = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  hit.setAttribute('class', 'thing__hit');
  hit.setAttribute('x', box.x - pad);
  hit.setAttribute('y', box.y - pad);
  hit.setAttribute('width', box.width + pad * 2);
  hit.setAttribute('height', box.height + pad * 2);
  thing.prepend(hit);
}

export function start(stage) {
  const root = document.createElement('div');
  root.className = 'find';
  root.innerHTML = `
    <div class="find__picker">
      <div class="find__choices">
        ${SCENES.map(
          (scene, i) => `
            <button class="find__choice" type="button" data-scene="${i}" style="--i:${i}">
              <span class="find__thumb">${picture(scene)}</span>
              <span class="find__name">${scene.name}</span>
            </button>`,
        ).join('')}
      </div>
    </div>
    <div class="find__play" hidden>
      <button class="round-btn find__back" type="button" aria-label="Pick another picture (press and hold)">${PICTURES}</button>
      <button class="find__prompt" type="button" aria-label="Say the word again">
        ${SPEAKER}<span class="find__word" aria-live="polite"></span>
      </button>
      <div class="find__scene"></div>
    </div>`;
  stage.append(root);
  const picker = root.querySelector('.find__picker');
  const playView = root.querySelector('.find__play');
  const prompt = root.querySelector('.find__prompt');
  const wordEl = root.querySelector('.find__word');
  const sceneBox = root.querySelector('.find__scene');

  let deck = []; // things in this scene still to be asked for
  let target = null; // the thing being asked for; null while a find is celebrated
  let misses = 0;
  let nextTimer = 0;
  let hintTimer = 0;

  const word = (thing) => thing.dataset.word;
  const sayPrompt = () => say(`Find the ${word(target)}.`);
  const hint = () => target.classList.add('is-hint');

  function showPicker() {
    clearTimeout(nextTimer);
    clearTimeout(hintTimer);
    hush();
    target = null;
    sceneBox.textContent = '';
    playView.hidden = true;
    picker.hidden = false;
  }

  function play(scene) {
    picker.hidden = true;
    playView.hidden = false; // before drawing: hidden SVG can't be measured
    sceneBox.innerHTML = picture(scene);
    const things = [...sceneBox.querySelectorAll('.thing')];
    things.forEach((thing, i) => addHitArea(thing, scene.things[i].scale));
    deck = shuffle(things);
    ask();
  }

  function ask() {
    target = deck.pop();
    misses = 0;
    wordEl.textContent = word(target);
    wordEl.animate(
      [{ transform: 'scale(.5)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }],
      { duration: 320, easing: 'cubic-bezier(.3, 1.5, .6, 1)' },
    );
    sayPrompt();
    hintTimer = setTimeout(() => {
      hint();
      sayPrompt();
    }, HINT_IDLE_MS);
  }

  function found(thing) {
    clearTimeout(hintTimer);
    thing.classList.remove('is-hint');
    target = null;
    say(`You found the ${word(thing)}!`);

    const box = thing.getBoundingClientRect();
    const frame = root.getBoundingClientRect();
    burst(root, box.left + box.width / 2 - frame.left, box.top + box.height / 2 - frame.top, pick(COLORS), 12);
    thing.firstElementChild.animate(
      [
        { transform: 'none' },
        { transform: 'translateY(-18%) scale(1.15) rotate(-6deg)', offset: 0.25 },
        { transform: 'none', offset: 0.5 },
        { transform: 'translateY(-10%) scale(1.08) rotate(5deg)', offset: 0.75 },
        { transform: 'none' },
      ],
      { duration: 1000, easing: 'ease-in-out' },
    );

    if (deck.length > 0) {
      chime();
      nextTimer = setTimeout(ask, NEXT_MS);
      return;
    }
    // That was the last thing in this scene.
    fanfare();
    confetti(root);
    nextTimer = setTimeout(showPicker, NEXT_MS + 1200);
  }

  function missed(thing) {
    boop();
    say(`That's the ${word(thing)}. Find the ${word(target)}.`);
    thing.firstElementChild.animate(
      [
        { transform: 'rotate(0)' },
        { transform: 'rotate(-7deg)' },
        { transform: 'rotate(7deg)' },
        { transform: 'rotate(-4deg)' },
        { transform: 'rotate(0)' },
      ],
      { duration: 450, easing: 'ease-in-out' },
    );
    misses += 1;
    if (misses >= HINT_MISSES) hint();
  }

  picker.addEventListener('click', (e) => {
    const choice = e.target.closest('.find__choice');
    if (choice) play(SCENES[choice.dataset.scene]);
  });

  holdButton(root.querySelector('.find__back'), showPicker);

  sceneBox.addEventListener('pointerdown', (e) => {
    const thing = e.target.closest('.thing');
    if (!thing || !target) return;
    if (thing === target) found(thing);
    else missed(thing);
  });

  // "click", not "pointerdown": if the first prompt was blocked for want of a
  // touch, this is the touch that is allowed to start the voice.
  prompt.addEventListener('click', () => {
    if (target) sayPrompt();
  });

  return () => {
    clearTimeout(nextTimer);
    clearTimeout(hintTimer);
    hush();
    root.remove();
  };
}
