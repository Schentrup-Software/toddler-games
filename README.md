# Toddler Games

A small website of games for 2–3 year olds, made for tablets and made to be
hosted at home. It is plain static files: no accounts, no ads, no tracking, and
nothing is fetched from the internet once it is running on your network.

| Game | What you do |
| --- | --- |
| **Bubbles** | Tap or swipe the floating bubbles to pop them. Every so often a star bubble floats up and throws confetti. |
| **Shapes** | Drag each shape into the hole it fits. Fill all three for a celebration and a new set. |
| **Music** | A rainbow xylophone. Tap a bar, slide across them, or use both hands. |
| **Find It** | Pick a picture: garden, bedroom, farm, kitchen or beach. A word is then shown and spoken ("Find the duck"). Touch that thing in the picture. Touching anything else names it instead ("That's the cat"), and the answer wiggles after two misses. Five scenes, 55 words. |

Built for small hands:

- Nothing to read, and no scores, timers or ways to lose.
- Big targets, and every finger on the screen counts.
- The home button (top right, in a game) needs a **press-and-hold**, so a stray
  palm doesn't end the game. So does the button at the top left of a Find It
  scene, which goes back to the pictures.
- Zooming, text selection and long-press menus are switched off.

## Host it on TrueNAS

You need a TrueNAS version with Docker-based apps (24.10 "Electric Eel" or
newer). Both options use **Apps → Discover Apps → ⋮ next to Custom App →
Install via YAML**. Name the app `toddler-games`, paste the YAML, and save.
Then open `http://<your-nas-ip>:8080` on the tablet.

If port 8080 is already used on your NAS, change the **left** number in
`"8080:8080"`.

### Option A: pull the image from GitHub (recommended)

Every push to `master` builds the site into a container image and publishes it
to `ghcr.io/schentrup-software/toddler-games` (see
[.github/workflows/publish.yml](.github/workflows/publish.yml)).

```yaml
services:
  toddler-games:
    image: ghcr.io/schentrup-software/toddler-games:latest
    pull_policy: always
    ports:
      - "8080:8080"
    restart: unless-stopped
```

The first time the workflow runs, GitHub may create the package as private. If
TrueNAS can't pull it, open the package on GitHub and set its visibility to
public, or add a `ghcr.io` login in the TrueNAS Apps settings.

To update, push your change, wait for the workflow to finish, then stop and
start the app so it pulls the new image.

### Option B: serve the files from a dataset (no registry)

Copy the `site` folder and `nginx.conf` from this repo into a dataset, for
example `/mnt/tank/apps/toddler-games/`. The container runs as TrueNAS's
built-in `apps` user (ID 568), so that user needs read access to the dataset.

```yaml
services:
  toddler-games:
    image: nginxinc/nginx-unprivileged:stable-alpine
    user: "568:568"
    ports:
      - "8080:8080"
    volumes:
      - /mnt/tank/apps/toddler-games/site:/usr/share/nginx/html:ro
      - /mnt/tank/apps/toddler-games/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: unless-stopped
```

To update, copy the new files over the old ones. No restart is needed.

## Set up the tablet

- **iPad:** open the site in Safari, then Share → **Add to Home Screen**. It
  then opens full screen like an app. Guided Access (Settings → Accessibility)
  keeps a child from leaving it.
- **Android:** tap the full-screen button at the top right of the home screen.
  App pinning (Settings → Security) keeps a child from leaving it.

Find It speaks with the tablet's own text-to-speech voice, so it sounds like
whatever voice the tablet has. If it is silent, turn the media volume up, check
that a voice is installed in the tablet's text-to-speech settings, and tap the
word at the top of the game to hear it again.

## Run it on your own computer

```sh
docker compose up --build        # http://localhost:8080
```

Or without Docker, with any static file server:

```sh
python -m http.server 8080 --directory site
```

Opening `index.html` straight from disk does not work; browsers only load
JavaScript modules over HTTP.

## Add a game

There is no build step. Each game is a folder with two files.

1. Create `site/games/<id>/game.js`:

   ```js
   export function start(stage) {
     // Build the game inside `stage`, which fills the screen.
     return () => {
       // Stop timers and remove what you added.
     };
   }
   ```

2. Create `site/games/<id>/game.css` for its styles.
3. Add an entry to [site/js/registry.js](site/js/registry.js). That puts a card
   on the home screen and makes `#/<id>` open the game.

Things to reuse:

- [site/css/base.css](site/css/base.css) holds the pastel palette. Add a
  `c-<name>` class (`coral`, `peach`, `butter`, `mint`, `aqua`, `sky`, `lilac`,
  `pink`) to an element and style it with `var(--c)` and the darker `var(--cd)`.
- [site/js/audio.js](site/js/audio.js) has the sounds (`mallet`, `pop`, `boop`,
  `chime`, `fanfare`). They are synthesised, so there are no audio files.
- [site/js/fx.js](site/js/fx.js) has `burst` and `confetti`.
- [site/js/speech.js](site/js/speech.js) has `say("any text")`, which speaks
  with the device's voice.
- [site/js/hold.js](site/js/hold.js) has `holdButton(button, onHeld)`, for
  buttons a child shouldn't trigger by accident.

## Add words to Find It

The scenes live in [site/games/find/scenes.js](site/games/find/scenes.js). Each
scene is a name, a background and a list of things, and each thing is one word:

```js
{
  word: 'ball',        // shown on screen and spoken as "Find the ball"
  at: [95, 655],       // where its centre goes on the 1000 x 750 scene
  scale: 1.15,
  art: `<circle class="c-coral f" r="40"/>`, // SVG drawn around (0, 0)
}
```

Add a thing to an existing scene, or add a whole new scene to the `SCENES`
list at the bottom of the file. A new scene shows up on the picker by itself,
with a small copy of the scene as its picture. The game asks for every word in
the chosen scene once, then goes back to the picker.

## Layout

```
site/                 the website; this folder is all that gets served
  index.html          home screen and the shell that games run in
  css/base.css        palette and shared styles
  js/                 router, game list, sounds, effects
  games/<id>/         one folder per game
Dockerfile            nginx serving ./site as a non-root user on port 8080
nginx.conf            nginx site config
compose.yaml          build and run with Docker Compose
```

## Licence

MIT. See [LICENSE](LICENSE).
