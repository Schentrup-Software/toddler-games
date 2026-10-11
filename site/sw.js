// Keeps a copy of the site on the tablet, so that once it has been opened it
// still opens with no network. Browsers only run this over HTTPS or on
// localhost; over plain HTTP the site works as before, just not offline.
//
// The server is still asked for every file first, so an update shows up on the
// tablet's next load. The saved copy is for when the server can't be reached.

const CACHE = 'toddler-games';

// How long the server gets to answer before the saved copy is used instead.
// Away from home the tablet can be online and still never hear back from it.
const PATIENCE_MS = 3000;

// The whole site, saved up front so that a game works offline even if it has
// never been opened. Add new files here. Every name has to exist: if one is
// missing, nothing is saved. A file left off the list is saved when first used.
const FILES = [
  './',
  'manifest.json',
  'css/base.css',
  'js/app.js',
  'js/audio.js',
  'js/fx.js',
  'js/hold.js',
  'js/registry.js',
  'js/speech.js',
  'games/bubbles/game.css',
  'games/bubbles/game.js',
  'games/find/game.css',
  'games/find/game.js',
  'games/find/scenes.js',
  'games/music/game.css',
  'games/music/game.js',
  'games/shapes/game.css',
  'games/shapes/game.js',
  'assets/icon.svg',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/apple-touch-icon.png',
];

// Whether the server answered the last file. While it isn't answering, saved
// copies go out straight away rather than every file waiting its turn.
let reachable = true;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;

  const fresh = fetch(request);
  event.waitUntil(keep(request, fresh)); // carries on after a saved copy has gone out
  event.respondWith(answer(request, fresh));
});

/** Saves what the server sends, ready for the next time it can't be reached. */
async function keep(request, fresh) {
  const response = await fresh.catch(() => null);
  reachable = Boolean(response);
  if (!response || !response.ok) return;

  const copy = response.clone(); // before anything else reads it
  const cache = await caches.open(CACHE);
  await cache.put(request, copy);
}

/** The server's answer if it gives a good one in time, otherwise the saved copy. */
async function answer(request, fresh) {
  const saved = await caches.match(request);
  if (!saved) return fresh;
  if (!reachable) return saved;

  const live = fresh.then((response) => (response.ok ? response : saved), () => saved);
  const late = new Promise((resolve) => setTimeout(resolve, PATIENCE_MS, null));
  const response = await Promise.race([live, late]);
  if (response) return response;

  reachable = false;
  return saved;
}
