// Spoken words come from the device's own text-to-speech voices (the Web
// Speech API), so there are no recordings to ship and any word can be said.

const synth = window.speechSynthesis;
const supported = Boolean(synth && window.SpeechSynthesisUtterance);

// Follow the tablet's accent if it is set to some kind of English.
const LANG = /^en\b/i.test(navigator.language || '') ? navigator.language : 'en-US';
const RATE = 0.85; // a little slower than normal, for small listeners

let utterance = null; // held on to so it can't be garbage-collected mid-word
let queued = 0;

function speak(text) {
  utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG;
  utterance.rate = RATE;
  synth.speak(utterance);
}

/** Say `text` now, cutting off anything still being said. */
export function say(text) {
  if (!supported) return;
  clearTimeout(queued);
  if (synth.speaking || synth.pending) {
    synth.cancel();
    // Some browsers drop a speak() made straight after a cancel().
    queued = setTimeout(() => speak(text), 80);
  } else {
    speak(text);
  }
}

export function hush() {
  if (!supported) return;
  clearTimeout(queued);
  synth.cancel();
}

// iOS only lets a page start talking from inside a touch. Saying nothing at
// all on the first one is enough; after that, speech works whenever asked.
export function initSpeech() {
  if (!supported) return;
  const gestures = ['pointerup', 'touchend', 'click', 'keydown'];
  const unlock = () => {
    synth.speak(new SpeechSynthesisUtterance(''));
    for (const type of gestures) window.removeEventListener(type, unlock, true);
  };
  for (const type of gestures) window.addEventListener(type, unlock, true);
}
