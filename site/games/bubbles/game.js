// Bubbles: tap (or swipe through) the floating bubbles to pop them.
// There is nothing to lose — bubbles that float away are simply replaced.

import { fanfare, pop } from '../../js/audio.js';
import { COLORS, burst, confetti, pick, rand } from '../../js/fx.js';

const COUNT = 9;
const STAR_EVERY = 8; // every Nth pop sends up a star bubble that throws confetti
const HIT_SLOP = 1.2; // bubbles pop from a little outside their edge

const STAR = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 6 62.9 34.2 93.7 37.8 70.9 58.8 77 89.2 50 74 23 89.2 29.1 58.8 6.3 37.8 37.1 34.2Z"/></svg>';

export function start(stage) {
  const field = document.createElement('div');
  field.className = 'bubbles';
  stage.append(field);

  const bubbles = [];
  const timers = new Set();
  let width = 0;
  let height = 0;
  let popped = 0;
  let lastFrame = performance.now();
  let frameId = 0;

  function measure() {
    width = field.clientWidth;
    height = field.clientHeight;
  }

  function later(fn, ms) {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  }

  function spawn({ onScreen = false, star = false } = {}) {
    const unit = Math.min(width, height);
    const radius = unit * (star ? 0.15 : rand(0.08, 0.13));
    const color = star ? 'butter' : pick(COLORS);
    const el = document.createElement('div');
    el.className = `bubble c-${color}`;
    el.style.width = el.style.height = `${radius * 2}px`;
    if (star) el.innerHTML = STAR;
    field.append(el);
    bubbles.push({
      el,
      radius,
      color,
      star,
      lane: rand(0, 1), // horizontal position as a fraction, so it survives a rotate
      x: 0,
      y: onScreen ? rand(radius, height - radius) : height + radius,
      speed: height / rand(9, 15),
      sway: unit * rand(0.01, 0.035),
      phase: rand(0, Math.PI * 2),
    });
  }

  function remove(bubble, replacement) {
    bubbles.splice(bubbles.indexOf(bubble), 1);
    bubble.el.remove();
    later(() => spawn(replacement), rand(300, 1200));
  }

  function popBubble(bubble) {
    popped += 1;
    burst(field, bubble.x, bubble.y, bubble.color, bubble.star ? 14 : 8);
    if (bubble.star) {
      fanfare();
      confetti(field);
    } else {
      pop((bubble.radius / Math.min(width, height) - 0.08) / 0.05);
    }
    remove(bubble, { star: popped % STAR_EVERY === 0 });
  }

  function popAt(e) {
    const box = field.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    // Later bubbles are drawn on top, so test those first.
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const bubble = bubbles[i];
      if (Math.hypot(x - bubble.x, y - bubble.y) <= bubble.radius * HIT_SLOP) {
        popBubble(bubble);
        return;
      }
    }
  }

  function frame(now) {
    const dt = Math.min((now - lastFrame) / 1000, 0.05);
    lastFrame = now;
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const bubble = bubbles[i];
      const margin = bubble.radius + bubble.sway;
      bubble.phase += dt;
      bubble.y -= bubble.speed * dt;
      bubble.x = margin + bubble.lane * (width - margin * 2) + Math.sin(bubble.phase) * bubble.sway;
      if (bubble.y < -bubble.radius) {
        remove(bubble);
        continue;
      }
      bubble.el.style.transform = `translate3d(${bubble.x - bubble.radius}px, ${bubble.y - bubble.radius}px, 0)`;
    }
    frameId = requestAnimationFrame(frame);
  }

  field.addEventListener('pointerdown', popAt);
  // A finger dragged across the screen pops whatever it runs into. Touch only
  // reports moves while it is down; a mouse has to be holding a button.
  field.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || e.buttons) popAt(e);
  });

  const resizes = new ResizeObserver(measure);
  resizes.observe(field);
  measure();
  for (let i = 0; i < COUNT; i++) spawn({ onScreen: true });
  frameId = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(frameId);
    timers.forEach(clearTimeout);
    resizes.disconnect();
    field.remove();
  };
}
