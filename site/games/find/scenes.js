// Scenes for Find It. Each scene is drawn on a 1000 x 750 canvas.
//
// `name` labels the scene on the picker. `back` is scenery nobody is asked to
// find, so keep it plain: a child will tap anything that looks like a thing.
//
// Each entry in `things` is one findable word. Its `art` is drawn around its
// own centre in a box roughly
// 100 units across, then placed with `at` (where that centre goes on the
// canvas) and `scale`. The game says "Find the <word>", so words are singular.
//
// Colour classes (see game.css): "c-<name> f" fills with a palette colour and
// outlines it in the deeper tone, "fd" fills with the deeper tone, "s" is an
// outline only, "w" is white, "k" is ink (eyes, noses), "l" is an ink line
// (smiles, whiskers). "bg" and "bgd" are the same fills without an outline.

const eyes = (y, gap = 9, x = 0) =>
  `<circle class="k" cx="${x - gap}" cy="${y}" r="3.4"/><circle class="k" cx="${x + gap}" cy="${y}" r="3.4"/>`;

const smile = (y, w = 6, x = 0) => `<path class="l" d="M${x - w} ${y}q${w} ${w} ${w * 2} 0"/>`;

// Three puffs with a flat bottom: a cloud, and also the top of the tree.
const PUFFS = 'M-28 20A18 18 0 0 1-27.7-16A24 24 0 0 1 18.9-19.3A20 20 0 1 1 24 20Z';

const garden = {
  name: 'Garden',
  back: `
    <rect class="c-sky bg" x="-3000" y="-3000" width="7000" height="3440" opacity=".55"/>
    <ellipse class="c-mint bgd" cx="230" cy="462" rx="380" ry="88" opacity=".5"/>
    <ellipse class="c-mint bgd" cx="800" cy="470" rx="430" ry="104" opacity=".5"/>
    <rect class="c-mint bg" x="-3000" y="440" width="7000" height="4000"/>
    <rect class="c-lilac bg" x="-3000" y="462" width="7000" height="52" opacity=".8"/>
    <path d="M-3000 488H4000" style="fill:none;stroke:var(--surface);stroke-width:5;stroke-dasharray:26 22"/>
    <ellipse class="c-aqua f" cx="830" cy="668" rx="150" ry="52"/>`,
  things: [
    {
      word: 'sun',
      at: [105, 95],
      scale: 1.3,
      art: `
        <g class="c-butter fd">${[0, 45, 90, 135, 180, 225, 270, 315]
          .map((turn) => `<rect x="-5" y="-52" width="10" height="16" rx="5" transform="rotate(${turn})"/>`)
          .join('')}</g>
        <circle class="c-butter f" r="30"/>
        ${eyes(-3, 10)}${smile(6, 7)}`,
    },
    {
      word: 'cloud',
      at: [400, 95],
      scale: 1.9,
      art: `<path class="w" d="${PUFFS}"/>${eyes(1, 8, -2)}${smile(8, 5, -2)}`,
    },
    {
      word: 'bird',
      at: [660, 170],
      scale: 1.3,
      art: `
        <path class="c-coral f" d="M-20 2-42-10-38 14Z"/>
        <path class="c-peach fd" d="M22-8 40-1 22 6Z"/>
        <ellipse class="c-coral f" rx="26" ry="21"/>
        <path class="c-coral fd" d="M-13 2Q-16-28 8-36Q10-14-2 6Z"/>
        <circle class="k" cx="12" cy="-6" r="3.4"/>`,
    },
    {
      word: 'tree',
      at: [170, 320],
      scale: 2.5,
      art: `
        <rect class="c-peach fd" x="-8" y="-10" width="16" height="60" rx="4"/>
        <path class="c-mint fd" transform="translate(0 -22)" d="${PUFFS}"/>
        <circle class="c-mint bg" cx="-16" cy="-26" r="5"/>
        <circle class="c-mint bg" cx="6" cy="-38" r="6"/>
        <circle class="c-mint bg" cx="22" cy="-18" r="5"/>`,
    },
    {
      word: 'house',
      at: [800, 335],
      scale: 2.4,
      art: `
        <rect class="c-coral fd" x="20" y="-42" width="11" height="24" rx="2"/>
        <rect class="c-butter f" x="-36" y="-8" width="72" height="54" rx="3"/>
        <path class="c-coral fd" d="M-46-6 0-46 46-6Z"/>
        <rect class="c-lilac fd" x="-9" y="14" width="18" height="32" rx="3"/>
        <circle class="c-butter f" cx="4" cy="31" r="2"/>
        <rect class="c-sky f" x="-30" y="6" width="15" height="15" rx="2"/>
        <rect class="c-sky f" x="15" y="6" width="15" height="15" rx="2"/>`,
    },
    {
      word: 'car',
      at: [480, 440],
      scale: 1.7,
      art: `
        <path class="c-pink f" d="M-26 2-16-20H14L28 2Z"/>
        <path class="c-sky f" d="M-17 0-11-13H-2V0ZM3 0V-13H11L19 0Z"/>
        <rect class="c-pink f" x="-46" y="0" width="92" height="26" rx="10"/>
        <circle class="c-butter f" cx="40" cy="10" r="4"/>
        <circle class="k" cx="-24" cy="27" r="11"/><circle class="w" cx="-24" cy="27" r="4"/>
        <circle class="k" cx="24" cy="27" r="11"/><circle class="w" cx="24" cy="27" r="4"/>`,
    },
    {
      word: 'ball',
      at: [95, 655],
      scale: 1.15,
      art: `
        <g transform="rotate(15)">
          <circle class="w" r="40"/>
          <path class="c-coral f" d="M0 0 40 0A40 40 0 0 1 20 34.6Z"/>
          <path class="c-butter f" d="M0 0-20 34.6A40 40 0 0 1-40 0Z"/>
          <path class="c-sky f" d="M0 0-20-34.6A40 40 0 0 1 20-34.6Z"/>
          <circle class="w" r="7"/>
        </g>`,
    },
    {
      word: 'flower',
      at: [245, 630],
      scale: 1.6,
      art: `
        <rect class="c-mint fd" x="-3" y="-20" width="6" height="70" rx="3"/>
        <ellipse class="c-mint fd" cx="-12" cy="28" rx="12" ry="6" transform="rotate(25 -12 28)"/>
        <ellipse class="c-mint fd" cx="12" cy="20" rx="12" ry="6" transform="rotate(-25 12 20)"/>
        <g class="c-pink f" transform="translate(0 -24)">
          <circle cx="15" r="11"/><circle cx="7.5" cy="13" r="11"/><circle cx="-7.5" cy="13" r="11"/>
          <circle cx="-15" r="11"/><circle cx="-7.5" cy="-13" r="11"/><circle cx="7.5" cy="-13" r="11"/>
        </g>
        <circle class="c-butter f" cy="-24" r="10"/>`,
    },
    {
      word: 'cat',
      at: [420, 632],
      scale: 1.5,
      art: `
        <path d="M16 42q28 2 22-26" style="fill:none;stroke:var(--lilac-deep);stroke-width:7"/>
        <ellipse class="c-lilac f" cy="28" rx="21" ry="22"/>
        <path class="c-lilac f" d="M-23-20-19-44-4-32ZM23-20 19-44 4-32Z"/>
        <circle class="c-lilac f" cy="-12" r="24"/>
        <path class="c-pink fd" d="M-3-9h6l-3 4Z"/>
        <path class="l" d="M-6-3q3 4 6 0q3 4 6 0"/>
        <path class="l" style="stroke-width:1.6" d="M-15-7h-13M-15-3-27 1M15-7h13M15-3 27 1"/>
        ${eyes(-15, 9)}
        <ellipse class="c-lilac f" cx="-8" cy="48" rx="7" ry="5"/>
        <ellipse class="c-lilac f" cx="8" cy="48" rx="7" ry="5"/>`,
    },
    {
      word: 'dog',
      at: [600, 628],
      scale: 1.6,
      art: `
        <path d="M18 40q22-4 18-24" style="fill:none;stroke:var(--peach-deep);stroke-width:7"/>
        <ellipse class="c-peach f" cy="28" rx="21" ry="22"/>
        <ellipse class="c-peach f" cy="-12" rx="25" ry="23"/>
        <ellipse class="c-peach fd" cx="-25" cy="-8" rx="9" ry="17" transform="rotate(12 -25 -8)"/>
        <ellipse class="c-peach fd" cx="25" cy="-8" rx="9" ry="17" transform="rotate(-12 25 -8)"/>
        <ellipse class="w" cy="-3" rx="13" ry="10"/>
        <ellipse class="k" cy="-8" rx="5" ry="3.6"/>
        <path class="l" d="M0-4v3M-5 0q5 5 10 0"/>
        ${eyes(-18, 10)}
        <ellipse class="c-peach f" cx="-9" cy="48" rx="8" ry="5"/>
        <ellipse class="c-peach f" cx="9" cy="48" rx="8" ry="5"/>`,
    },
    {
      word: 'duck',
      at: [825, 632],
      scale: 1.5,
      art: `
        <path class="c-butter f" d="M28 8 46-8 38 18Z"/>
        <path class="c-peach fd" d="M-32-20-49-14-32-9Z"/>
        <ellipse class="c-butter f" cx="4" cy="14" rx="32" ry="20"/>
        <circle class="c-butter f" cx="-18" cy="-16" r="17"/>
        <ellipse class="c-butter fd" cx="10" cy="14" rx="15" ry="9"/>
        <circle class="k" cx="-23" cy="-20" r="3.4"/>
        <path d="M-36 34q9-6 18 0t18 0 18 0 18 0" style="fill:none;stroke:var(--aqua-deep)"/>`,
    },
  ],
};

const bedroom = {
  name: 'Bedroom',
  back: `
    <rect class="c-peach bg" x="-3000" y="-3000" width="7000" height="3480" opacity=".45"/>
    <rect class="c-peach bgd" x="-3000" y="480" width="7000" height="4000" opacity=".45"/>
    <rect x="-3000" y="472" width="7000" height="12" style="fill:var(--surface);stroke:none" opacity=".8"/>
    <rect class="w" x="222" y="62" width="216" height="216" rx="12"/>
    <rect class="c-lilac bg" x="238" y="78" width="184" height="184" rx="5"/>
    <g class="c-butter bg">
      <circle cx="266" cy="108" r="4"/><circle cx="396" cy="116" r="5"/>
      <circle cx="278" cy="234" r="4"/><circle cx="400" cy="226" r="3"/>
    </g>
    <ellipse class="c-aqua f" cx="400" cy="645" rx="260" ry="62"/>
    <rect class="c-butter f" x="470" y="370" width="180" height="130" rx="8"/>
    <rect class="c-butter s" x="486" y="392" width="148" height="40" rx="5"/>
    <circle class="c-butter fd" cx="560" cy="412" r="6"/>`,
  things: [
    {
      word: 'door',
      at: [95, 330],
      scale: 3,
      art: `
        <rect class="c-mint f" x="-22" y="-50" width="44" height="100" rx="3"/>
        <rect class="c-mint s" x="-14" y="-41" width="28" height="34" rx="2"/>
        <rect class="c-mint s" x="-14" y="5" width="28" height="36" rx="2"/>
        <circle class="c-butter f" cx="14" cy="-1" r="3.2"/>`,
    },
    {
      word: 'moon',
      at: [330, 170],
      scale: 1.3,
      art: `
        <path class="c-butter f" d="M4.2-37.8A38 38 0 1 0 32.7 19.3A32 32 0 1 1 4.2-37.8Z"/>
        <path class="l" d="M-30-4q4 4 8 0M-28 10q5 5 10 0"/>`,
    },
    {
      word: 'clock',
      at: [560, 130],
      scale: 1.3,
      art: `
        <circle class="c-sky fd" r="42"/>
        <circle class="w" r="33"/>
        <circle class="k" cy="-25" r="2.4"/><circle class="k" cx="25" r="2.4"/>
        <circle class="k" cy="25" r="2.4"/><circle class="k" cx="-25" r="2.4"/>
        <path class="l" d="M0 0V-19M0 0 13 8"/>
        <circle class="k" r="3.4"/>`,
    },
    {
      word: 'lamp',
      at: [515, 300],
      scale: 1.5,
      art: `
        <rect class="c-peach fd" x="-3" y="-8" width="6" height="46" rx="2"/>
        <ellipse class="c-peach fd" cy="41" rx="18" ry="6"/>
        <path class="c-butter f" d="M-15-44H15L27-6H-27Z"/>`,
    },
    {
      word: 'cup',
      at: [602, 331],
      scale: 1.5,
      art: `
        <ellipse class="c-aqua s" cx="24" rx="12" ry="13" style="stroke-width:6"/>
        <path class="c-aqua f" d="M-22-24H22L17 26H-17Z"/>
        <path class="c-pink fd" d="M0 6c-10-7-10-15-4-15 2 0 3 1 4 3 1-2 2-3 4-3 6 0 6 8-4 15Z"/>`,
    },
    {
      word: 'bed',
      at: [810, 400],
      scale: 2.9,
      art: `
        <rect class="c-peach fd" x="-48" y="26" width="7" height="10" rx="2"/>
        <rect class="c-peach fd" x="41" y="26" width="7" height="10" rx="2"/>
        <rect class="c-peach fd" x="-50" y="-34" width="12" height="62" rx="5"/>
        <rect class="c-peach fd" x="40" y="-8" width="10" height="36" rx="4"/>
        <rect class="w" x="-40" y="2" width="82" height="22" rx="4"/>
        <rect class="w" x="-36" y="-14" width="28" height="16" rx="7"/>
        <rect class="c-sky f" x="-8" y="-4" width="50" height="28" rx="5"/>
        <rect class="c-sky fd" x="-8" y="-4" width="9" height="28" rx="4"/>`,
    },
    {
      word: 'chair',
      at: [250, 440],
      scale: 2,
      art: `
        <rect class="c-lilac fd" x="-25" y="4" width="8" height="42" rx="3"/>
        <rect class="c-lilac fd" x="17" y="4" width="8" height="42" rx="3"/>
        <rect class="c-lilac f" x="-23" y="-48" width="46" height="44" rx="7"/>
        <rect class="c-lilac fd" x="-28" y="-8" width="56" height="14" rx="6"/>`,
    },
    {
      word: 'bear',
      at: [400, 598],
      scale: 1.6,
      art: `
        <circle class="c-peach f" cx="-19" cy="-33" r="10"/><circle class="c-peach f" cx="19" cy="-33" r="10"/>
        <circle class="c-peach fd" cx="-19" cy="-33" r="4.5"/><circle class="c-peach fd" cx="19" cy="-33" r="4.5"/>
        <ellipse class="c-peach f" cx="-25" cy="20" rx="8" ry="13" transform="rotate(25 -25 20)"/>
        <ellipse class="c-peach f" cx="25" cy="20" rx="8" ry="13" transform="rotate(-25 25 20)"/>
        <ellipse class="c-peach f" cy="26" rx="22" ry="23"/>
        <circle class="c-peach f" cx="-14" cy="45" r="11"/><circle class="c-peach f" cx="14" cy="45" r="11"/>
        <circle class="c-peach fd" cx="-14" cy="45" r="5"/><circle class="c-peach fd" cx="14" cy="45" r="5"/>
        <circle class="c-peach f" cy="-13" r="24"/>
        <ellipse class="w" cy="-6" rx="11" ry="9"/>
        <ellipse class="k" cy="-10" rx="4.4" ry="3.2"/>
        <path class="l" d="M0-7v3M-4-3q4 4 8 0"/>
        ${eyes(-19, 9)}`,
    },
    {
      word: 'book',
      at: [190, 662],
      scale: 1.4,
      art: `
        <rect class="c-mint fd" x="-48" y="-18" width="96" height="46" rx="4"/>
        <path class="w" d="M0-16Q-22-28-44-20V20Q-22 12 0 24Z"/>
        <path class="w" d="M0-16Q22-28 44-20V20Q22 12 0 24Z"/>
        <path class="l" style="opacity:.4" d="M-36-9q12-5 26 1M-36 1q12-5 26 1M10-8q14-6 26-1M10 2q14-6 26-1"/>`,
    },
    {
      word: 'sock',
      at: [640, 655],
      scale: 1.25,
      art: `
        <path class="c-pink f" d="M-14-40H12V2Q14 10 24 16L36 22Q48 30 42 42 36 50 22 46L-2 38Q-14 34-14 20Z"/>
        <rect class="c-pink fd" x="-17" y="-46" width="32" height="13" rx="4"/>
        <path class="c-pink s" d="M-14-20H12M-14-8H12"/>`,
    },
    {
      word: 'shoe',
      at: [845, 655],
      scale: 1.4,
      art: `
        <path class="c-coral f" d="M-42 20V-14Q-42-24-32-24H-16Q-9-24-4-16L8-2Q14 4 26 6 46 10 46 20Z"/>
        <path class="c-coral fd" d="M24 6Q46 10 46 20H22Z"/>
        <rect class="w" x="-45" y="18" width="92" height="12" rx="6"/>
        <path d="M-8-8 2-14M0 0 10-6M9 6 18 0" style="fill:none;stroke:var(--surface)"/>`,
    },
  ],
};

const farm = {
  name: 'Farm',
  back: `
    <rect class="c-sky bg" x="-3000" y="-3000" width="7000" height="3440" opacity=".55"/>
    <ellipse class="c-mint bgd" cx="300" cy="462" rx="420" ry="80" opacity=".5"/>
    <ellipse class="c-mint bgd" cx="850" cy="470" rx="380" ry="96" opacity=".5"/>
    <rect class="c-mint bg" x="-3000" y="440" width="7000" height="4000"/>
    <ellipse class="c-peach bgd" cx="540" cy="712" rx="100" ry="20" opacity=".55"/>`,
  things: [
    {
      word: 'barn',
      at: [200, 310],
      scale: 2.8,
      art: `
        <rect class="c-coral f" x="-40" y="-10" width="80" height="56" rx="2"/>
        <path class="c-coral fd" d="M-46-8-34-34 0-50 34-34 46-8Z"/>
        <rect class="w" x="-9" y="-32" width="18" height="15" rx="2"/>
        <rect class="w" x="-16" y="12" width="32" height="34" rx="2"/>
        <path class="c-coral s" d="M-16 12 16 46M16 12-16 46"/>`,
    },
    {
      word: 'tractor',
      at: [790, 362],
      scale: 2,
      art: `
        <rect class="c-sky f" x="-38" y="-38" width="36" height="46" rx="5"/>
        <rect class="w" x="-31" y="-31" width="22" height="20" rx="3"/>
        <rect class="c-peach fd" x="26" y="-24" width="6" height="20" rx="2"/>
        <rect class="c-sky f" x="-8" y="-6" width="52" height="26" rx="5"/>
        <circle class="k" cx="-22" cy="20" r="22"/><circle class="c-butter f" cx="-22" cy="20" r="9"/>
        <circle class="k" cx="30" cy="29" r="13"/><circle class="c-butter f" cx="30" cy="29" r="5"/>`,
    },
    {
      word: 'fence',
      at: [480, 402],
      scale: 1.9,
      art: `
        <rect class="c-peach fd" x="-50" y="-11" width="100" height="7" rx="3"/>
        <rect class="c-peach fd" x="-50" y="8" width="100" height="7" rx="3"/>
        <g class="c-peach f">
          <path d="M-44 24V-14l6-10 6 10V24Z"/><path d="M-19 24V-14l6-10 6 10V24Z"/>
          <path d="M7 24V-14l6-10 6 10V24Z"/><path d="M32 24V-14l6-10 6 10V24Z"/>
        </g>`,
    },
    {
      word: 'bee',
      at: [450, 140],
      scale: 1.5,
      art: `
        <ellipse class="w" cx="-5" cy="-17" rx="10" ry="14" transform="rotate(-20 -5 -17)"/>
        <ellipse class="w" cx="9" cy="-17" rx="10" ry="14" transform="rotate(15 9 -17)"/>
        <path class="k" d="M-23-4-33 0-23 4Z"/>
        <ellipse class="c-butter f" rx="24" ry="17"/>
        <path class="k" d="M-12-14.7Q-7 0-12 14.7L-5 16.6Q0 0-5-16.6Z"/>
        <path class="k" d="M1-17Q6 0 1 17L8 16Q13 0 8-16Z"/>
        <circle class="k" cx="15" cy="-4" r="3"/>
        <path class="l" d="M12 4q3 3 6 0"/>`,
    },
    {
      word: 'chicken',
      at: [470, 505],
      scale: 1.3,
      art: `
        <path d="M-4 30v12m-5 0h9M10 30v12m-5 0h9" style="fill:none;stroke:var(--peach-deep)"/>
        <path class="w" d="M24 2Q40-22 44-18 44 4 34 18Z"/>
        <g class="c-coral fd">
          <circle cx="-24" cy="-30" r="4.5"/><circle cx="-18" cy="-33" r="5"/><circle cx="-12" cy="-30" r="4.5"/>
        </g>
        <path class="c-peach fd" d="M-31-20-44-15-31-10Z"/>
        <ellipse class="w" cx="4" cy="12" rx="28" ry="22"/>
        <circle class="w" cx="-18" cy="-16" r="15"/>
        <ellipse class="c-coral fd" cx="-29" cy="-4" rx="3.5" ry="5"/>
        <ellipse class="w" cx="8" cy="13" rx="14" ry="9"/>
        <circle class="k" cx="-22" cy="-19" r="3.2"/>`,
    },
    {
      word: 'rabbit',
      at: [615, 500],
      scale: 1.25,
      art: `
        <circle class="w" cx="20" cy="38" r="7"/>
        <ellipse class="w" cx="-10" cy="-40" rx="7" ry="18" transform="rotate(-8 -10 -40)"/>
        <ellipse class="w" cx="10" cy="-40" rx="7" ry="18" transform="rotate(8 10 -40)"/>
        <ellipse class="c-pink bg" cx="-10" cy="-40" rx="3" ry="12" transform="rotate(-8 -10 -40)"/>
        <ellipse class="c-pink bg" cx="10" cy="-40" rx="3" ry="12" transform="rotate(8 10 -40)"/>
        <ellipse class="w" cy="28" rx="19" ry="20"/>
        <circle class="w" cy="-12" r="21"/>
        <path class="c-pink fd" d="M-3-9h6l-3 4Z"/>
        <path class="l" d="M-5-3q2.5 3 5 0q2.5 3 5 0"/>
        ${eyes(-16, 8)}
        <ellipse class="w" cx="-9" cy="47" rx="8" ry="5"/><ellipse class="w" cx="9" cy="47" rx="8" ry="5"/>`,
    },
    {
      word: 'cow',
      at: [120, 625],
      scale: 1.75,
      art: `
        <ellipse class="w" cy="28" rx="23" ry="23"/>
        <ellipse class="k" cx="10" cy="30" rx="8" ry="10" opacity=".4"/>
        <ellipse class="k" cx="-14" cy="20" rx="6" ry="7" opacity=".4"/>
        <ellipse class="c-butter f" cx="-14" cy="-38" rx="4" ry="8" transform="rotate(-20 -14 -38)"/>
        <ellipse class="c-butter f" cx="14" cy="-38" rx="4" ry="8" transform="rotate(20 14 -38)"/>
        <ellipse class="w" cx="-28" cy="-20" rx="10" ry="6" transform="rotate(-15 -28 -20)"/>
        <ellipse class="w" cx="28" cy="-20" rx="10" ry="6" transform="rotate(15 28 -20)"/>
        <ellipse class="w" cy="-14" rx="24" ry="22"/>
        <ellipse class="k" cx="10" cy="-28" rx="6" ry="4" opacity=".4"/>
        <ellipse class="c-pink f" cy="-3" rx="16" ry="11"/>
        <ellipse class="k" cx="-6" cy="-4" rx="2.2" ry="3"/><ellipse class="k" cx="6" cy="-4" rx="2.2" ry="3"/>
        ${eyes(-19, 10)}
        <ellipse class="w" cx="-10" cy="50" rx="8" ry="5"/><ellipse class="w" cx="10" cy="50" rx="8" ry="5"/>`,
    },
    {
      word: 'horse',
      at: [330, 612],
      scale: 1.85,
      art: `
        <path d="M17 42q20-2 17-24" style="fill:none;stroke:var(--peach-deep);stroke-width:7"/>
        <ellipse class="c-peach f" cy="32" rx="20" ry="21"/>
        <path class="c-peach f" d="M-17-36-14-56-4-42ZM17-36 14-56 4-42Z"/>
        <g class="c-peach fd">
          <circle cx="-17" cy="-26" r="7"/><circle cx="-20" cy="-14" r="7"/><circle cx="-20" cy="-2" r="7"/><circle cx="-17" cy="9" r="6"/>
        </g>
        <ellipse class="c-peach f" cy="-14" rx="18" ry="28"/>
        <path class="c-peach fd" d="M-9-40Q0-52 9-40 5-28 0-31-5-28-9-40Z"/>
        <ellipse class="c-peach fd" cy="4" rx="13" ry="10"/>
        <ellipse class="k" cx="-5" cy="3" rx="2" ry="3"/><ellipse class="k" cx="5" cy="3" rx="2" ry="3"/>
        ${eyes(-18, 8)}
        <ellipse class="c-peach fd" cx="-9" cy="52" rx="8" ry="5"/><ellipse class="c-peach fd" cx="9" cy="52" rx="8" ry="5"/>`,
    },
    {
      word: 'pig',
      at: [540, 640],
      scale: 1.6,
      art: `
        <path d="M22 36q12-2 10-10-2-6-8-2-2 7 6 6" style="fill:none;stroke:var(--pink-deep);stroke-width:4"/>
        <ellipse class="c-pink f" cy="28" rx="24" ry="22"/>
        <path class="c-pink fd" d="M-22-26-27-45-8-34ZM22-26 27-45 8-34Z"/>
        <circle class="c-pink f" cy="-12" r="25"/>
        <ellipse class="c-pink fd" cy="-5" rx="12" ry="9"/>
        <ellipse class="k" cx="-4.5" cy="-5" rx="2" ry="3"/><ellipse class="k" cx="4.5" cy="-5" rx="2" ry="3"/>
        <path class="l" d="M-5 8q5 4 10 0"/>
        ${eyes(-19, 11)}
        <ellipse class="c-pink fd" cx="-10" cy="49" rx="8" ry="5"/><ellipse class="c-pink fd" cx="10" cy="49" rx="8" ry="5"/>`,
    },
    {
      word: 'sheep',
      at: [735, 628],
      scale: 1.7,
      art: `
        <rect class="c-peach fd" x="-14" y="44" width="8" height="12" rx="3"/>
        <rect class="c-peach fd" x="6" y="44" width="8" height="12" rx="3"/>
        <path class="w" transform="translate(0 30)" d="${PUFFS}"/>
        <ellipse class="c-peach fd" cx="-22" cy="-17" rx="9" ry="5" transform="rotate(15 -22 -17)"/>
        <ellipse class="c-peach fd" cx="22" cy="-17" rx="9" ry="5" transform="rotate(-15 22 -17)"/>
        <ellipse class="c-peach f" cy="-15" rx="17" ry="20"/>
        <g class="w"><circle cx="-11" cy="-33" r="9"/><circle cx="11" cy="-33" r="9"/><circle cy="-38" r="10"/></g>
        ${eyes(-14, 7)}${smile(-5, 5)}`,
    },
    {
      word: 'mouse',
      at: [905, 655],
      scale: 1.4,
      art: `
        <path d="M14 32q24 4 26-16" style="fill:none;stroke:var(--pink-deep);stroke-width:3"/>
        <circle class="c-lilac f" cx="-17" cy="-22" r="13"/><circle class="c-lilac f" cx="17" cy="-22" r="13"/>
        <circle class="c-pink bg" cx="-17" cy="-22" r="7"/><circle class="c-pink bg" cx="17" cy="-22" r="7"/>
        <ellipse class="c-lilac f" cy="24" rx="17" ry="15"/>
        <circle class="c-lilac f" cy="-3" r="20"/>
        <circle class="c-pink fd" cy="3" r="3"/>
        <path class="l" style="stroke-width:1.4" d="M-8 3h-13M-8 6-20 10M8 3h13M8 6 20 10"/>
        <path class="l" d="M-4 9q4 3 8 0"/>
        ${eyes(-7, 7)}
        <ellipse class="c-lilac f" cx="-8" cy="38" rx="6" ry="4"/><ellipse class="c-lilac f" cx="8" cy="38" rx="6" ry="4"/>`,
    },
  ],
};

const kitchen = {
  name: 'Kitchen',
  back: `
    <rect class="c-aqua bg" x="-3000" y="-3000" width="7000" height="3460" opacity=".4"/>
    <path class="c-peach fd" d="M130 284v28l28-28ZM870 284v28l-28-28Z"/>
    <rect class="c-peach fd" x="60" y="270" width="880" height="16" rx="6"/>
    <rect class="c-lilac bg" x="-3000" y="448" width="7000" height="4000" opacity=".55"/>
    <rect class="c-lilac bgd" x="-3000" y="448" width="7000" height="12" opacity=".5"/>`,
  things: [
    {
      word: 'milk',
      at: [150, 198],
      scale: 1.8,
      art: `
        <rect class="w" x="-18" y="-20" width="36" height="60" rx="2"/>
        <ellipse class="k" cx="-7" cy="-2" rx="7" ry="5" opacity=".35"/>
        <ellipse class="k" cx="8" cy="14" rx="6" ry="7" opacity=".35"/>
        <ellipse class="k" cx="-8" cy="29" rx="6" ry="4" opacity=".35"/>
        <path class="c-sky f" d="M-18-20-9-38H9L18-20Z"/>
        <rect class="c-sky fd" x="-9" y="-45" width="18" height="7" rx="2"/>`,
    },
    {
      word: 'bread',
      at: [370, 229],
      scale: 1.7,
      art: `
        <path class="c-peach f" d="M-44 10Q-46-22-10-24H10Q46-22 44 10 44 24 34 24H-34Q-44 24-44 10Z"/>
        <path class="c-peach s" d="M-22-14l7 13M-3-17l7 15M16-14l7 13"/>`,
    },
    {
      word: 'cheese',
      at: [600, 233],
      scale: 1.7,
      art: `
        <path class="c-butter f" d="M-42 22V-2L40-24V22Z"/>
        <g class="c-butter fd">
          <circle cx="-24" cy="10" r="6"/><circle cy="4" r="8"/><circle cx="24" cy="10" r="5"/><circle cx="22" cy="-10" r="4"/>
        </g>`,
    },
    {
      word: 'cake',
      at: [830, 207],
      scale: 1.65,
      art: `
        <ellipse class="w" cy="33" rx="42" ry="5"/>
        <rect class="c-pink f" x="-34" y="-6" width="68" height="38" rx="5"/>
        <path class="w" d="M-34 2V-6Q-34-12-28-12H28Q34-12 34-6V2Q28 11 22 2 16 11 10 2 4 11-2 2-8 11-14 2-20 11-26 2-30 9-34 2Z"/>
        <rect class="c-sky f" x="-3" y="-30" width="6" height="18" rx="2"/>
        <ellipse class="c-peach fd" cy="-36" rx="4" ry="6"/>`,
    },
    {
      word: 'apple',
      at: [130, 545],
      scale: 1.5,
      art: `
        <path class="c-coral f" d="M0-18Q-10-28-24-22-40-12-34 12-28 34-12 34-4 34 0 30 4 34 12 34 28 34 34 12 40-12 24-22 10-28 0-18Z"/>
        <path d="M0-18Q0-30 6-34" style="fill:none;stroke:var(--peach-deep);stroke-width:4"/>
        <ellipse class="c-mint fd" cx="15" cy="-30" rx="10" ry="5" transform="rotate(-25 15 -30)"/>
        <ellipse cx="-19" cy="-4" rx="4" ry="8" transform="rotate(20 -19 -4)" style="fill:var(--surface);stroke:none" opacity=".7"/>`,
    },
    {
      word: 'spoon',
      at: [315, 550],
      scale: 1.5,
      art: `
        <g transform="rotate(-35)">
          <rect class="w" x="-4" y="-14" width="8" height="60" rx="4"/>
          <ellipse class="w" cy="-28" rx="13" ry="18"/>
        </g>`,
    },
    {
      word: 'bowl',
      at: [500, 548],
      scale: 1.8,
      art: `
        <rect class="c-sky fd" x="-14" y="26" width="28" height="8" rx="3"/>
        <path class="c-sky f" d="M-40-8H40Q40 28 14 30H-14Q-40 28-40-8Z"/>
        <ellipse class="c-sky f" cy="-8" rx="40" ry="9"/>
        <ellipse class="w" cy="-8" rx="33" ry="6"/>
        <path class="c-sky s" d="M-36 8Q0 20 36 8"/>`,
    },
    {
      word: 'fork',
      at: [685, 550],
      scale: 1.5,
      art: `
        <g transform="rotate(35)">
          <rect class="w" x="-4" y="-12" width="8" height="58" rx="4"/>
          <path class="w" d="M-12-44V-20Q-12-8 0-8 12-8 12-20V-44H7V-24H2.5V-44H-2.5V-24H-7V-44Z"/>
        </g>`,
    },
    {
      word: 'banana',
      at: [865, 540],
      scale: 1.6,
      art: `
        <path class="c-butter f" d="M-38-18Q-34 24 6 26 32 26 42-4L37-9Q26 8 6 8-18 6-30-22Z"/>
        <path class="c-peach fd" d="M-38-18-30-22-31-28-39-25Z"/>
        <circle class="k" cx="40" cy="-7" r="2.5" opacity=".5"/>`,
    },
    {
      word: 'carrot',
      at: [225, 668],
      scale: 1.5,
      art: `
        <g transform="rotate(50)">
          <g class="c-mint fd">
            <ellipse cy="-30" rx="5" ry="12"/>
            <ellipse cx="-9" cy="-27" rx="5" ry="11" transform="rotate(-30 -9 -27)"/>
            <ellipse cx="9" cy="-27" rx="5" ry="11" transform="rotate(30 9 -27)"/>
          </g>
          <path class="c-peach fd" d="M-14-18Q0-26 14-18L3 40Q0 44-3 40Z"/>
          <path class="l" style="opacity:.3" d="M-6-4h8M-2 10h6M-3 24h5"/>
        </g>`,
    },
    {
      word: 'egg',
      at: [700, 678],
      scale: 1.5,
      art: `
        <path class="w" d="M-34 2Q-40-22-16-26 0-36 16-26 40-24 36 0 40 22 16 24 0 34-14 24-38 24-34 2Z"/>
        <circle class="c-butter fd" cx="2" cy="-2" r="13"/>
        <ellipse cx="-3" cy="-7" rx="3" ry="4" style="fill:var(--surface);stroke:none" opacity=".7"/>`,
    },
  ],
};

const beach = {
  name: 'Beach',
  back: `
    <rect class="c-sky bg" x="-3000" y="-3000" width="7000" height="3250" opacity=".55"/>
    <rect class="c-aqua bg" x="-3000" y="250" width="7000" height="230"/>
    <path d="M-130 310q12-9 24 0t24 0M40 292q12-9 24 0t24 0M250 302q12-9 24 0t24 0M560 292q12-9 24 0t24 0M920 300q12-9 24 0t24 0M1090 315q12-9 24 0t24 0M-90 440q12-9 24 0t24 0M60 446q12-9 24 0t24 0M270 432q12-9 24 0t24 0M600 436q12-9 24 0t24 0M800 444q12-9 24 0t24 0M1060 432q12-9 24 0t24 0" style="fill:none;stroke:var(--surface);stroke-width:5" opacity=".8"/>
    <rect class="c-butter bg" x="-3000" y="470" width="7000" height="4000" opacity=".75"/>
    <path d="M-3000 470H4000" style="fill:none;stroke:var(--surface);stroke-width:10"/>`,
  things: [
    {
      word: 'kite',
      at: [150, 122],
      scale: 1.6,
      art: `
        <path d="M0 34q9 6 0 12t0 10" style="fill:none;stroke:var(--coral-deep)"/>
        <path class="c-coral f" d="M0-40 26-6 0 34-26-6Z"/>
        <path class="c-butter f" d="M0-40 26-6H0Z"/>
        <path class="c-butter f" d="M0 34-26-6H0Z"/>
        <path class="c-coral s" d="M0-40V34M-26-6H26"/>`,
    },
    {
      word: 'boat',
      at: [400, 213],
      scale: 2,
      art: `
        <rect class="c-peach fd" x="-2.5" y="-44" width="5" height="60" rx="2"/>
        <path class="w" d="M7-40 34 8H7Z"/>
        <path class="c-butter f" d="M-7-28V8H-30Z"/>
        <path class="c-coral f" d="M-42 14H42L30 34H-30Z"/>`,
    },
    {
      word: 'whale',
      at: [770, 345],
      scale: 1.9,
      art: `
        <path d="M-14-26V-36M-14-36Q-22-46-27-37M-14-36Q-6-46-1-37" style="fill:none;stroke:var(--surface)"/>
        <path class="c-sky f" d="M38-12Q26-18 22-32 36-30 40-20 46-30 56-28 52-14 38-12Z"/>
        <path class="c-sky f" d="M-46 4Q-46-24-12-24 16-24 30-6L40-16Q46 4 32 16 20 28-6 28-46 28-46 4Z"/>
        <path d="M-42 12Q-20 20 22 17 10 27-6 27-38 27-42 12Z" style="fill:var(--surface);stroke:none" opacity=".85"/>
        <circle class="k" cx="-28" r="3.4"/>
        <path class="l" d="M-43 9q7 5 14 1"/>`,
    },
    {
      word: 'fish',
      at: [140, 372],
      scale: 1.6,
      art: `
        <path class="c-peach fd" d="M20 0 42-16V16Z"/>
        <path class="c-peach fd" d="M-10-16Q2-30 12-15Z"/>
        <ellipse class="c-peach f" cx="-4" rx="28" ry="18"/>
        <path class="c-peach s" d="M2-12Q8 0 2 12"/>
        <circle class="k" cx="-18" cy="-4" r="3.4"/>
        <path class="l" d="M-30 4q4 3 8 0"/>
        <circle class="w" cx="-40" cy="-16" r="3.5"/>`,
    },
    {
      word: 'octopus',
      at: [450, 392],
      scale: 1.45,
      art: `
        <g style="fill:none;stroke:var(--pink-deep);stroke-width:8">
          <path d="M-18 6q-8 16-20 16"/><path d="M-9 10q-4 18-12 26"/><path d="M0 12v26"/>
          <path d="M9 10q4 18 12 26"/><path d="M18 6q8 16 20 16"/>
        </g>
        <ellipse class="c-pink f" cy="-12" rx="26" ry="24"/>
        ${eyes(-12, 9)}${smile(-3, 5)}`,
    },
    {
      word: 'turtle',
      at: [875, 505],
      scale: 1.55,
      art: `
        <ellipse class="c-mint f" cx="-17" cy="14" rx="8" ry="7"/><ellipse class="c-mint f" cx="22" cy="14" rx="8" ry="7"/>
        <path class="c-mint f" d="M34 4 46 9 34 12Z"/>
        <ellipse class="c-mint f" cx="-37" rx="12" ry="10"/>
        <path class="c-mint fd" d="M-28 10Q-28-26 4-26 36-26 36 10Z"/>
        <g class="c-mint bg">
          <circle cx="-10" cy="-6" r="6"/><circle cx="8" cy="-12" r="6"/><circle cx="20" r="5"/><circle cx="2" cy="2" r="4"/>
        </g>
        <circle class="k" cx="-41" cy="-2" r="2.8"/>
        <path class="l" d="M-46 4q3 2 6 0"/>`,
    },
    {
      word: 'umbrella',
      at: [135, 580],
      scale: 2,
      art: `
        <g transform="rotate(10)">
          <rect class="c-peach fd" x="-2.5" y="-44" width="5" height="92" rx="2"/>
          <path class="c-coral f" d="M-46-8Q-46-46 0-46 46-46 46-8 38-16 30.7-8 23-16 15.3-8 7.7-16 0-8-7.7-16-15.3-8-23-16-30.7-8-38-16-46-8Z"/>
          <path class="w" d="M0-46-30.7-8Q-23-16-15.3-8Z"/>
          <path class="w" d="M0-46 15.3-8Q23-16 30.7-8Z"/>
          <circle class="c-coral fd" cy="-47" r="3"/>
        </g>`,
    },
    {
      word: 'castle',
      at: [370, 612],
      scale: 1.9,
      art: `
        <rect class="c-peach f" x="-40" y="2" width="80" height="34" rx="2"/>
        <path class="c-peach f" d="M-40 36V-22h6v6h8v-6h6V36Z"/>
        <path class="c-peach f" d="M20 36V-22h6v6h8v-6h6V36Z"/>
        <path class="c-peach f" d="M-12 36V-36h6v6h12v-6h6V36Z"/>
        <path class="c-peach fd" d="M-7 36V22Q-7 14 0 14 7 14 7 22V36Z"/>
        <path d="M0-36V-50" style="fill:none;stroke:var(--peach-deep)"/>
        <path class="c-coral fd" d="M0-50 14-45 0-40Z"/>`,
    },
    {
      word: 'bucket',
      at: [560, 640],
      scale: 1.55,
      art: `
        <path d="M-26-20Q0-58 26-20" style="fill:none;stroke:var(--sky-deep)"/>
        <path class="c-sky f" d="M-26-18H26L20 32H-20Z"/>
        <rect class="c-sky fd" x="-29" y="-24" width="58" height="10" rx="4"/>
        <path d="M0-4 3.5 4 12 5 5.5 10.5 7.5 19 0 14.5-7.5 19-5.5 10.5-12 5-3.5 4Z" style="fill:var(--surface);stroke:none"/>`,
    },
    {
      word: 'crab',
      at: [730, 600],
      scale: 1.5,
      art: `
        <g style="fill:none;stroke:var(--coral-deep);stroke-width:4">
          <path d="M-24 14l-13 6M-27 7l-14 1M-19 20l-10 9M24 14l13 6M27 7l14 1M19 20l10 9"/>
          <path d="M-20-6Q-33-12-32-22M20-6Q33-12 32-22M-8-10V-21M8-10V-21"/>
        </g>
        <circle class="c-coral f" cx="-33" cy="-29" r="10"/><circle class="c-coral f" cx="33" cy="-29" r="10"/>
        <path class="c-coral s" d="M-33-29-39-40M33-29 39-40"/>
        <ellipse class="c-coral f" cy="6" rx="28" ry="18"/>
        <circle class="w" cx="-8" cy="-24" r="5.5"/><circle class="w" cx="8" cy="-24" r="5.5"/>
        <circle class="k" cx="-8" cy="-24" r="2.6"/><circle class="k" cx="8" cy="-24" r="2.6"/>
        ${smile(8, 6)}`,
    },
    {
      word: 'shell',
      at: [905, 655],
      scale: 1.4,
      art: `
        <rect class="c-pink fd" x="-10" y="22" width="20" height="10" rx="3"/>
        <path class="c-pink f" d="M-6 28-36-4Q-38-32 0-34 38-32 36-4L6 28Z"/>
        <path class="c-pink s" d="M0 26V-34M-3 26-20-29M3 26 20-29M-5 26-33-14M5 26 33-14"/>`,
    },
  ],
};

export const SCENES = [garden, bedroom, farm, kitchen, beach];
