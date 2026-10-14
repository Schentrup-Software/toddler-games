// Pictures for Paint. Each picture is drawn on a 1000 x 750 page. The game adds
// the page's rounded border and hides whatever is drawn past it, so draw right
// up to the edges.
//
// `name` labels the picture on the picker and `art` is the drawing. In it,
// anything with the class "p" is a part to paint. Parts start out white, and
// are drawn in order with later ones covering earlier ones, so a part is
// whatever is left showing of its shape. A <g> can be one part made of several
// shapes: touching any of them paints them all.
//
// Every part needs its colour (see css/base.css): "p c-<name>" is painted with
// that palette colour, and "p d c-<name>" with its deeper tone.
//
// Everything else is detail drawn on top that can't be touched: "l" is a line
// (smiles, window panes), "k" is solid (eyes) and "w" stays white.
//
// Keep parts big. Much under 70 units across is hard for a small finger.

const num = (n) => Number(n.toFixed(1));

// A chubby five-pointed star, `r` from its centre to its points.
function star(x, y, r) {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const reach = i % 2 ? r * 0.5 : r;
    const turn = (Math.PI * i) / 5;
    points.push(`${num(x + Math.sin(turn) * reach)} ${num(y - Math.cos(turn) * reach)}`);
  }
  return `M${points.join('L')}Z`;
}

// Three puffs with a flat bottom, `w` wide, sitting on the point (x, y): a
// cloud, and also the top of a tree.
function puffs(x, y, w) {
  const k = w / 90;
  const at = (px, py) => `${num(x + px * k)} ${num(y + py * k)}`;
  const r = (size) => `A${num(size * k)} ${num(size * k)} 0 0 1 `;
  return `M${at(-28, 0)}${r(18)}${at(-27.7, -36)}${r(24)}${at(18.9, -39.3)}A${num(20 * k)} ${num(20 * k)} 0 1 1 ${at(24, 0)}Z`;
}

// A sun with rays. The rays are too thin to hit, so it is all one part.
function sun(x, y, r) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315]
    .map((turn) => `<rect x="${x - 12}" y="${y - r - 54}" width="24" height="42" rx="12" transform="rotate(${turn} ${x} ${y})"/>`)
    .join('');
  return `<g class="p d c-butter">${rays}<circle cx="${x}" cy="${y}" r="${r}"/></g>`;
}

// One band of the rainbow: half a ring around the middle of the page.
function band(outer, inner) {
  return `M${500 - outer} 660A${outer} ${outer} 0 0 1 ${500 + outer} 660H${500 + inner}A${inner} ${inner} 0 0 0 ${500 - inner} 660Z`;
}

const fish = {
  name: 'Fish',
  art: `
    <rect class="p c-sky" width="1000" height="750"/>
    <path class="p d c-mint" d="M150 720Q30 520 150 320Q270 520 150 720Z"/>
    <path class="p c-mint" d="M250 720Q160 590 250 450Q340 590 250 720Z"/>
    <path class="p c-butter" d="M0 625Q170 580 340 612T680 606T1000 596V750H0Z"/>
    <path class="p d c-pink" d="${star(810, 668, 62)}"/>
    <path class="p c-lilac" d="M725 350 885 225Q840 350 885 475Z"/>
    <path class="p c-lilac" d="M420 240Q540 20 650 245Z"/>
    <path class="p c-lilac" d="M460 480Q540 700 620 470Z"/>
    <ellipse class="p d c-peach" cx="520" cy="350" rx="230" ry="150"/>
    <path class="p c-butter" d="M440 209.4A230 150 0 0 1 520 200Q560 350 520 500A230 150 0 0 1 440 490.6Q480 350 440 209.4Z"/>
    <path class="p c-butter" d="M590 207.1A230 150 0 0 1 660 231Q695 350 660 469A230 150 0 0 1 590 492.9Q630 350 590 207.1Z"/>
    <circle class="w" cx="375" cy="312" r="27"/>
    <circle class="k" cx="369" cy="315" r="12"/>
    <path class="l" d="M318 400Q345 428 378 408"/>
    <circle class="p c-aqua" cx="210" cy="225" r="50"/>
    <circle class="p c-aqua" cx="120" cy="115" r="42"/>`,
};

// The left wings of the butterfly; the right ones are these in a mirror.
const WINGS = `
  <path class="p c-pink" d="M480 330C430 120 150 60 110 230C80 360 300 430 480 390Z"/>
  <path class="p c-lilac" d="M480 380C300 400 180 480 230 590C280 690 450 620 485 430Z"/>
  <circle class="p d c-butter" cx="285" cy="250" r="52"/>
  <circle class="p d c-sky" cx="345" cy="520" r="38"/>`;

const butterfly = {
  name: 'Butterfly',
  art: `
    <rect class="p c-mint" width="1000" height="750"/>
    ${WINGS}
    <g transform="matrix(-1 0 0 1 1000 0)">${WINGS}</g>
    <path class="l" d="M482 190Q445 110 395 105M518 190Q555 110 605 105"/>
    <circle class="k" cx="395" cy="105" r="11"/><circle class="k" cx="605" cy="105" r="11"/>
    <ellipse class="p d c-lilac" cx="500" cy="395" rx="34" ry="140"/>
    <circle class="p d c-peach" cx="500" cy="225" r="48"/>
    <circle class="k" cx="484" cy="218" r="6.5"/><circle class="k" cx="516" cy="218" r="6.5"/>
    <path class="l" d="M486 238Q500 252 514 238"/>`,
};

const house = {
  name: 'House',
  art: `
    <rect class="p c-sky" width="1000" height="750"/>
    ${sun(150, 145, 62)}
    <path class="p c-pink" d="${puffs(770, 230, 220)}"/>
    <path class="p c-mint" d="M0 560Q250 515 500 545T1000 535V750H0Z"/>
    <path class="p c-peach" d="M455 570H545L620 750H380Z"/>
    <rect class="p d c-peach" x="832" y="400" width="46" height="170" rx="6"/>
    <path class="p d c-mint" d="${puffs(855, 445, 230)}"/>
    <rect class="p d c-lilac" x="572" y="140" width="72" height="150"/>
    <rect class="p c-butter" x="330" y="320" width="340" height="250"/>
    <path class="p d c-coral" d="M290 330 500 150 710 330Z"/>
    <path class="p d c-sky" d="M455 570V470A45 45 0 0 1 545 470V570Z"/>
    <circle class="k" cx="525" cy="505" r="7"/>
    <rect class="p c-aqua" x="350" y="362" width="86" height="86" rx="6"/>
    <rect class="p c-aqua" x="564" y="362" width="86" height="86" rx="6"/>
    <path class="l" d="M393 362V448M350 405H436M607 362V448M564 405H650"/>`,
};

const car = {
  name: 'Car',
  art: `
    <rect class="p c-sky" width="1000" height="750"/>
    ${sun(850, 140, 62)}
    <path class="p c-pink" d="${puffs(250, 210, 240)}"/>
    <path class="p c-mint" d="M0 470Q250 380 520 450T1000 420V750H0Z"/>
    <rect class="p c-lilac" y="600" width="1000" height="150"/>
    <path class="l" d="M40 695H960" stroke-dasharray="90 70"/>
    <path class="p c-coral" d="M300 420Q340 270 420 265H620Q690 270 740 420Z"/>
    <path class="p c-aqua" d="M345 405Q370 305 425 300H490V405Z"/>
    <path class="p c-aqua" d="M520 300H615Q665 305 700 405H520Z"/>
    <path class="p d c-coral" d="M150 560V470Q150 430 190 425L300 410H760Q850 415 860 480V560Q860 580 840 580H170Q150 580 150 560Z"/>
    <path class="l" d="M540 455H590"/>
    <ellipse class="p c-butter" cx="836" cy="480" rx="34" ry="42"/>
    <circle class="p d c-lilac" cx="310" cy="580" r="78"/>
    <circle class="p c-butter" cx="310" cy="580" r="40"/>
    <circle class="p d c-lilac" cx="700" cy="580" r="78"/>
    <circle class="p c-butter" cx="700" cy="580" r="40"/>`,
};

const rocket = {
  name: 'Rocket',
  art: `
    <rect class="p c-lilac" width="1000" height="750"/>
    <path class="p c-butter" d="${star(165, 155, 72)}"/>
    <path class="p c-butter" d="${star(835, 125, 60)}"/>
    <path class="p c-butter" d="${star(150, 560, 62)}"/>
    <ellipse class="p c-peach" cx="820" cy="520" rx="150" ry="42" transform="rotate(-18 820 520)"/>
    <circle class="p d c-pink" cx="820" cy="520" r="88"/>
    <path class="l" d="M739.4 555.4A150 42 0 0 0 900.6 555.4" transform="rotate(-18 820 520)"/>
    <path class="p d c-butter" d="M458 575Q430 660 500 725Q570 660 542 575Z"/>
    <path class="p d c-coral" d="M425 400Q335 450 325 585L430 520Z"/>
    <path class="p d c-coral" d="M575 400Q665 450 675 585L570 520Z"/>
    <path class="p d c-coral" d="M420 265Q425 150 500 85Q575 150 580 265Z"/>
    <path class="p c-aqua" d="M420 255H580Q605 400 575 530H425Q395 400 420 255Z"/>
    <path class="p d c-lilac" d="M440 530H560L545 575H455Z"/>
    <circle class="p d c-sky" cx="500" cy="350" r="50"/>`,
};

const rainbow = {
  name: 'Rainbow',
  art: `
    <rect class="p c-sky" width="1000" height="750"/>
    <circle class="p d c-butter" cx="70" cy="70" r="120"/>
    <path class="p c-pink" d="${puffs(820, 180, 230)}"/>
    <path class="p c-lilac" d="${puffs(430, 150, 170)}"/>
    <path class="p d c-coral" d="${band(410, 355)}"/>
    <path class="p d c-peach" d="${band(355, 300)}"/>
    <path class="p d c-butter" d="${band(300, 245)}"/>
    <path class="p d c-mint" d="${band(245, 190)}"/>
    <path class="p d c-sky" d="${band(190, 135)}"/>
    <path class="p d c-lilac" d="${band(135, 80)}"/>
    <path class="p c-mint" d="M0 630Q250 600 500 625T1000 615V750H0Z"/>`,
};

export const PICTURES = [fish, butterfly, house, car, rocket, rainbow];
