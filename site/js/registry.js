// The home screen and the router are both driven by this list.
//
// To add a game, create games/<id>/game.js (exporting `start(stage)`, which
// returns a function that stops the game) and games/<id>/game.css, then add
// an entry here. `color` is a palette name from css/base.css and `art` is the
// picture on the home-screen card.

export const games = [
  {
    id: 'bubbles',
    name: 'Bubbles',
    color: 'sky',
    art: `
      <svg viewBox="0 0 120 120" aria-hidden="true" stroke-width="3">
        <circle cx="44" cy="72" r="33" style="fill:var(--pink);stroke:var(--pink-deep)"/>
        <ellipse cx="31" cy="58" rx="9" ry="5" transform="rotate(-38 31 58)" fill="#fff" opacity=".9"/>
        <circle cx="88" cy="40" r="22" style="fill:var(--butter);stroke:var(--butter-deep)"/>
        <ellipse cx="80" cy="31" rx="6" ry="3.5" transform="rotate(-38 80 31)" fill="#fff" opacity=".9"/>
        <circle cx="94" cy="92" r="13" style="fill:var(--mint);stroke:var(--mint-deep)"/>
        <ellipse cx="89" cy="87" rx="3.6" ry="2.2" transform="rotate(-38 89 87)" fill="#fff" opacity=".9"/>
      </svg>`,
  },
  {
    id: 'shapes',
    name: 'Shapes',
    color: 'butter',
    art: `
      <svg viewBox="0 0 120 120" aria-hidden="true" stroke-width="3" stroke-linejoin="round">
        <rect x="12" y="58" width="48" height="48" rx="9" style="fill:var(--mint);stroke:var(--mint-deep)"/>
        <circle cx="84" cy="80" r="26" style="fill:var(--sky);stroke:var(--sky-deep)"/>
        <path d="M60 12 90 56H30Z" style="fill:var(--coral);stroke:var(--coral-deep)"/>
        <g style="fill:var(--ink)">
          <circle cx="76" cy="77" r="2.6"/><circle cx="92" cy="77" r="2.6"/>
        </g>
        <path d="M78 85q6 6 12 0" fill="none" stroke-width="2.6" stroke-linecap="round" style="stroke:var(--ink)"/>
      </svg>`,
  },
  {
    id: 'music',
    name: 'Music',
    color: 'pink',
    art: `
      <svg viewBox="0 0 120 120" aria-hidden="true" stroke-width="3">
        <rect x="10"  y="14" width="16" height="92" rx="8" style="fill:var(--peach);stroke:var(--peach-deep)"/>
        <rect x="31"  y="21" width="16" height="78" rx="8" style="fill:var(--butter);stroke:var(--butter-deep)"/>
        <rect x="52"  y="28" width="16" height="64" rx="8" style="fill:var(--mint);stroke:var(--mint-deep)"/>
        <rect x="73"  y="35" width="16" height="50" rx="8" style="fill:var(--sky);stroke:var(--sky-deep)"/>
        <rect x="94"  y="42" width="16" height="36" rx="8" style="fill:var(--lilac);stroke:var(--lilac-deep)"/>
      </svg>`,
  },
  {
    id: 'find',
    name: 'Find It',
    color: 'mint',
    art: `
      <svg viewBox="0 0 120 120" aria-hidden="true" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
        <path d="M80 80 105 105" style="fill:none;stroke:var(--lilac-deep);stroke-width:14"/>
        <circle cx="52" cy="52" r="38" style="fill:var(--surface);stroke:var(--lilac-deep);stroke-width:8"/>
        <g transform="translate(54 55) scale(.6)" stroke-width="5" style="fill:var(--butter);stroke:var(--butter-deep)">
          <path d="M28 8 46-8 38 18Z"/>
          <path d="M-32-20-49-14-32-9Z" style="fill:var(--peach-deep);stroke:var(--peach-deep)"/>
          <ellipse cx="4" cy="14" rx="32" ry="20"/>
          <circle cx="-18" cy="-16" r="17"/>
          <circle cx="-23" cy="-20" r="3.6" style="fill:var(--ink);stroke:none"/>
        </g>
      </svg>`,
  },
];
