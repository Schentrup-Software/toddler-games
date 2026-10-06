// Every sound is synthesised with Web Audio, so the site ships no audio files.

export const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0,
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, C6: 1046.5,
};

let ctx = null;
let out = null;

function context() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    out = ctx.createGain();
    out.gain.value = 0.5;
    // Ten fingers at once shouldn't clip.
    const limiter = ctx.createDynamicsCompressor();
    out.connect(limiter);
    limiter.connect(ctx.destination);
  }
  if (ctx.state !== 'running') {
    const resumed = ctx.resume();
    if (resumed && resumed.catch) resumed.catch(() => {});
  }
  return ctx;
}

// Browsers keep audio suspended until a touch, and iOS suspends it again after
// the tab is backgrounded, so every gesture gets a chance to wake it.
export function initAudio() {
  for (const type of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) {
    window.addEventListener(type, context, { capture: true, passive: true });
  }
}

function voice({ freq, to, type = 'sine', at = 0, decay = 0.3, gain = 0.3 }) {
  const ac = context();
  if (!ac) return;
  const start = ac.currentTime + at;
  const end = start + 0.006 + decay;
  const osc = ac.createOscillator();
  const env = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, end);
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + 0.006);
  env.gain.exponentialRampToValueAtTime(0.0001, end);
  osc.connect(env);
  env.connect(out);
  osc.start(start);
  osc.stop(end + 0.05);
}

/** A xylophone-ish note: a long fundamental plus a short bright overtone. */
export function mallet(freq, at = 0) {
  voice({ freq, at, decay: 0.9, gain: 0.4 });
  voice({ freq: freq * 4, at, decay: 0.15, gain: 0.1 });
}

/** Bubble pop. `size` runs 0 (small, high) to 1 (big, low). */
export function pop(size = 0.5) {
  const freq = 950 - size * 500;
  voice({ freq, to: freq * 0.35, decay: 0.09, gain: 0.5 });
}

/** Soft, friendly "not there" — never a buzzer. */
export function boop() {
  voice({ freq: 280, to: 190, type: 'triangle', decay: 0.16, gain: 0.3 });
}

export function chime() {
  mallet(NOTES.E5);
  mallet(NOTES.G5, 0.09);
}

export function fanfare() {
  [NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6].forEach((freq, i) => mallet(freq, i * 0.11));
}
