// Small helpers and effects shared by the games.

/** Palette names; pair with the .c-<name> classes in css/base.css. */
export const COLORS = ['coral', 'peach', 'butter', 'mint', 'aqua', 'sky', 'lilac', 'pink'];

export const rand = (min, max) => min + Math.random() * (max - min);

export const pick = (list) => list[Math.floor(Math.random() * list.length)];

export function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function particle(layer, className, keyframes, options) {
  const el = document.createElement('i');
  el.className = className;
  layer.append(el);
  el.animate(keyframes, { fill: 'forwards', ...options }).onfinish = () => el.remove();
  return el;
}

/** A ring of dots flying out from (x, y), in `layer`'s own coordinates. */
export function burst(layer, x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + rand(-0.3, 0.3);
    const reach = rand(60, 130);
    const size = rand(14, 28);
    const duration = rand(450, 700);
    const el = particle(
      layer,
      `fx fx--dot c-${color}`,
      [
        { transform: 'translate(0, 0)' },
        { transform: `translate(${Math.cos(angle) * reach}px, ${Math.sin(angle) * reach}px)` },
      ],
      { duration, easing: 'cubic-bezier(.2, .8, .3, 1)' },
    );
    // Fade separately and late, so the dots are still solid while they fly.
    el.animate({ opacity: [1, 1, 0], offset: [0, 0.55, 1] }, { duration, fill: 'forwards' });
    el.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px`;
  }
}

/** Confetti raining down the whole of `layer`. */
export function confetti(layer, count = 60) {
  const { width, height } = layer.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const drift = rand(-80, 80);
    const el = particle(
      layer,
      `fx fx--confetti c-${pick(COLORS)}`,
      [
        { transform: 'translate(0, 0) rotate(0deg)' },
        { transform: `translate(${drift}px, ${height + 60}px) rotate(${rand(-720, 720)}deg)` },
      ],
      { duration: rand(1400, 2600), delay: rand(0, 500), easing: 'cubic-bezier(.3, .1, .7, 1)' },
    );
    el.style.left = `${rand(0, width)}px`;
  }
}
