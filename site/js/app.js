import { initAudio } from './audio.js';
import { games } from './registry.js';

const HOLD_MS = 700; // how long the home button must be held to leave a game

const home = document.getElementById('home');
const grid = document.getElementById('games');
const play = document.getElementById('play');
const stage = document.getElementById('stage');
const homeBtn = document.getElementById('home-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

let stopGame = null;
let routeCount = 0;

function renderHome() {
  grid.innerHTML = games
    .map(
      (game, i) => `
        <a class="card c-${game.color}" href="#/${game.id}" draggable="false" style="--i:${i}">
          <span class="card__art">${game.art}</span>
          <span class="card__name">${game.name}</span>
        </a>`,
    )
    .join('');
}

function loadStyles(id) {
  if (document.querySelector(`link[data-game="${id}"]`)) return Promise.resolve();
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `games/${id}/game.css`;
    link.dataset.game = id;
    link.onload = link.onerror = resolve;
    document.head.append(link);
  });
}

// One page, hash-routed: "#/bubbles" plays a game, anything else is home.
// Staying on one page keeps full screen and audio alive between games.
async function route() {
  const thisRoute = ++routeCount;
  const id = location.hash.replace(/^#\/?/, '');
  const game = games.find((g) => g.id === id);

  if (stopGame) stopGame();
  stopGame = null;
  stage.textContent = '';

  home.hidden = Boolean(game);
  play.hidden = !game;
  if (!game) return;

  try {
    const [module] = await Promise.all([import(`../games/${id}/game.js`), loadStyles(id)]);
    if (thisRoute !== routeCount) return; // left again while it was loading
    stopGame = module.start(stage);
  } catch (error) {
    console.error(error);
    if (thisRoute === routeCount) goHome();
  }
}

function goHome() {
  location.hash = '#/';
}

function initHomeButton() {
  let timer = 0;
  homeBtn.style.setProperty('--hold', `${HOLD_MS}ms`);

  const release = () => {
    clearTimeout(timer);
    homeBtn.classList.remove('is-holding');
  };
  homeBtn.addEventListener('pointerdown', () => {
    release();
    homeBtn.classList.add('is-holding');
    timer = setTimeout(() => {
      release();
      goHome();
    }, HOLD_MS);
  });
  for (const type of ['pointerup', 'pointercancel', 'pointerleave']) {
    homeBtn.addEventListener(type, release);
  }
  // Keyboards and screen readers "click" without a pointer; let those through.
  homeBtn.addEventListener('click', (e) => {
    if (e.detail === 0) goHome();
  });
}

function initFullscreen() {
  const root = document.documentElement;
  const enter = root.requestFullscreen || root.webkitRequestFullscreen;
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  // No API on iPhone, and nothing to hide when launched from the home screen.
  const standalone = navigator.standalone || matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches;
  if (!enter || !exit || standalone) return;

  fullscreenBtn.hidden = false;
  fullscreenBtn.addEventListener('click', () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) exit.call(document);
    else enter.call(root);
  });
}

// Long-presses, pinches and drags all open browser UI a toddler can't dismiss.
function childProof() {
  for (const type of ['contextmenu', 'dragstart', 'gesturestart', 'gesturechange']) {
    document.addEventListener(type, (e) => e.preventDefault());
  }
}

childProof();
initAudio();
initHomeButton();
initFullscreen();
renderHome();
window.addEventListener('hashchange', route);
route();
