// A button that only fires after a press-and-hold, so a stray palm can't set
// it off. A ring around the button fills while it is held (see css/base.css).

const HOLD_MS = 700;

const RING = '<svg class="hold-btn__ring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29"/></svg>';

/** Makes `button` call `onHeld` once it has been held down for a moment. */
export function holdButton(button, onHeld) {
  let timer = 0;
  button.classList.add('hold-btn');
  button.style.setProperty('--hold', `${HOLD_MS}ms`);
  button.insertAdjacentHTML('afterbegin', RING);

  const release = () => {
    clearTimeout(timer);
    button.classList.remove('is-holding');
  };
  button.addEventListener('pointerdown', () => {
    release();
    button.classList.add('is-holding');
    timer = setTimeout(() => {
      release();
      onHeld();
    }, HOLD_MS);
  });
  for (const type of ['pointerup', 'pointercancel', 'pointerleave']) {
    button.addEventListener(type, release);
  }
  // Keyboards and screen readers "click" without a pointer; let those through.
  button.addEventListener('click', (e) => {
    if (e.detail === 0) onHeld();
  });
}
