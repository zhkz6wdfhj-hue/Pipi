/**
 * Maakt de placeholderfoto's in /public/images.
 *
 * De bestanden die dit script maakt zijn bewust rustig en abstract: ze houden
 * de juiste verhouding (4:5 voor producten, 3:2 voor sfeerbeelden) en de juiste
 * kleur, zodat de vormgeving klopt zolang de echte foto's er nog niet zijn.
 *
 * Vervang ze door je eigen foto's uit Instagram — zie README.md, hoofdstuk
 * "Foto's vervangen". Je hoeft dit script daarna niet meer te draaien.
 *
 *   node scripts/generate-images.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.join(process.cwd(), 'public', 'images');

const BG = '#FAF8F4';
const LINE = '#E3DDD3';

const COLORS = {
  kameel: { base: '#B99770', dark: '#9C7B57', light: '#CBAE8B' },
  ecru: { base: '#E7DCC8', dark: '#D2C4AB', light: '#F2EADB' },
  houtskool: { base: '#4B4C50', dark: '#3A3B3F', light: '#63646A' },
  taupe: { base: '#9A8E7E', dark: '#82766A', light: '#B0A596' },
  donkergroen: { base: '#3F4C40', dark: '#313C33', light: '#546254' },
};

/* -------------------------------------------------------------------------- */
/* Silhouetten                                                                 */
/* -------------------------------------------------------------------------- */

/** Elke tekening krijgt eigen gradient-ID's, anders kleuren ze elkaar over. */
let uidCounter = 0;
function nextUid() {
  uidCounter += 1;
  return `g${uidCounter}`;
}

function defs(color, uid) {
  return `
    <defs>
      <linearGradient id="stof-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${color.light}" />
        <stop offset="55%" stop-color="${color.base}" />
        <stop offset="100%" stop-color="${color.dark}" />
      </linearGradient>
      <linearGradient id="mouw-${uid}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${color.dark}" />
        <stop offset="100%" stop-color="${color.base}" />
      </linearGradient>
      <radialGradient id="grond-${uid}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#CFC7BA" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#CFC7BA" stop-opacity="0" />
      </radialGradient>
    </defs>`;
}

/** Lange jas, van voren. */
function coatFront(color, { hem = 1330, shoulderY = 330 } = {}) {
  const uid = nextUid();
  return `
    ${defs(color, uid)}
    <ellipse cx="600" cy="${hem + 20}" rx="330" ry="46" fill="url(#grond-${uid})" />
    <path d="M 448 ${shoulderY} L 336 ${shoulderY + 24} L 252 980 L 356 998 L 430 520 Z" fill="url(#mouw-${uid})" />
    <path d="M 752 ${shoulderY} L 864 ${shoulderY + 24} L 948 980 L 844 998 L 770 520 Z" fill="url(#mouw-${uid})" />
    <path d="M 448 ${shoulderY} C 500 ${shoulderY - 46}, 700 ${shoulderY - 46}, 752 ${shoulderY}
             L 862 ${hem} L 338 ${hem} Z" fill="url(#stof-${uid})" />
    <path d="M 600 ${shoulderY + 118} L 512 ${shoulderY - 16} C 552 ${shoulderY - 42}, 648 ${shoulderY - 42}, 688 ${shoulderY - 16} Z"
          fill="${BG}" opacity="0.92" />
    <path d="M 600 ${shoulderY + 118} L 600 ${hem}" stroke="${color.dark}" stroke-width="3" opacity="0.5" />
    ${[0, 1, 2, 3]
      .map(
        (i) =>
          `<circle cx="600" cy="${shoulderY + 230 + i * 195}" r="11" fill="${color.dark}" opacity="0.75" />`
      )
      .join('')}`;
}

/** Lange jas, van opzij. */
function coatSide(color) {
  const uid = nextUid();
  return `
    ${defs(color, uid)}
    <ellipse cx="600" cy="1350" rx="250" ry="42" fill="url(#grond-${uid})" />
    <path d="M 512 300 C 560 262, 664 262, 700 306
             L 786 1330 L 430 1330 Z" fill="url(#stof-${uid})" />
    <path d="M 700 316 L 790 348 L 852 984 L 754 1000 L 688 520 Z" fill="url(#mouw-${uid})" />
    <path d="M 512 300 C 486 372, 478 520, 486 700" stroke="${color.dark}" stroke-width="4" fill="none" opacity="0.4" />`;
}

/** Detailopname: kraag, knoop en weefsel groot in beeld. */
function coatDetail(color) {
  const uid = nextUid();
  return `
    ${defs(color, uid)}
    <rect x="0" y="0" width="1200" height="1500" fill="url(#stof-${uid})" />
    <path d="M 0 250 L 470 610 L 470 1500 L 0 1500 Z" fill="${color.dark}" opacity="0.35" />
    <path d="M 470 610 L 470 1500" stroke="${color.light}" stroke-width="5" opacity="0.5" />
    <circle cx="700" cy="880" r="52" fill="${color.dark}" />
    <circle cx="700" cy="880" r="52" fill="none" stroke="${color.light}" stroke-width="3" opacity="0.6" />
    <circle cx="686" cy="866" r="7" fill="${color.light}" opacity="0.7" />
    <circle cx="714" cy="866" r="7" fill="${color.light}" opacity="0.7" />
    <circle cx="686" cy="894" r="7" fill="${color.light}" opacity="0.7" />
    <circle cx="714" cy="894" r="7" fill="${color.light}" opacity="0.7" />
    ${Array.from({ length: 26 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="1200" y2="${i * 60 + 90}" stroke="${color.light}" stroke-width="1" opacity="0.13" />`).join('')}`;
}

/** Draagbeeld: jas met een broek eronder, verder uitgezoomd. */
function coatWorn(color) {
  const uid = nextUid();
  return `
    ${defs(color, uid)}
    <ellipse cx="600" cy="1400" rx="290" ry="44" fill="url(#grond-${uid})" />
    <path d="M 496 1060 L 596 1060 L 588 1392 L 508 1392 Z" fill="#2F2C29" opacity="0.8" />
    <path d="M 604 1060 L 704 1060 L 692 1392 L 612 1392 Z" fill="#2F2C29" opacity="0.8" />
    <path d="M 470 360 L 372 386 L 300 962 L 392 978 L 456 540 Z" fill="url(#mouw-${uid})" />
    <path d="M 730 360 L 828 386 L 900 962 L 808 978 L 744 540 Z" fill="url(#mouw-${uid})" />
    <path d="M 470 360 C 520 318, 680 318, 730 360 L 826 1180 L 374 1180 Z" fill="url(#stof-${uid})" />
    <path d="M 600 470 L 524 348 C 560 326, 640 326, 676 348 Z" fill="${BG}" opacity="0.9" />
    <path d="M 600 470 L 600 1180" stroke="${color.dark}" stroke-width="3" opacity="0.45" />`;
}

/** Blazer, van voren: korter, bredere revers. */
function blazerFront(color) {
  const uid = nextUid();
  return `
    ${defs(color, uid)}
    <ellipse cx="600" cy="1180" rx="290" ry="42" fill="url(#grond-${uid})" />
    <path d="M 452 372 L 344 398 L 274 940 L 372 958 L 440 560 Z" fill="url(#mouw-${uid})" />
    <path d="M 748 372 L 856 398 L 926 940 L 828 958 L 760 560 Z" fill="url(#mouw-${uid})" />
    <path d="M 452 372 C 504 330, 696 330, 748 372 L 812 1152 L 388 1152 Z" fill="url(#stof-${uid})" />
    <path d="M 600 700 L 496 348 C 534 330, 566 340, 600 372 Z" fill="${color.light}" opacity="0.55" />
    <path d="M 600 700 L 704 348 C 666 330, 634 340, 600 372 Z" fill="${color.light}" opacity="0.55" />
    <path d="M 600 372 L 600 700" stroke="${color.dark}" stroke-width="2" opacity="0.35" />
    <circle cx="600" cy="782" r="12" fill="${color.dark}" opacity="0.75" />
    <circle cx="600" cy="900" r="12" fill="${color.dark}" opacity="0.75" />
    <path d="M 430 900 L 520 900" stroke="${color.dark}" stroke-width="3" opacity="0.4" />
    <path d="M 680 900 L 770 900" stroke="${color.dark}" stroke-width="3" opacity="0.4" />`;
}

function blazerSide(color) {
  const uid = nextUid();
  return `
    ${defs(color, uid)}
    <ellipse cx="600" cy="1200" rx="230" ry="40" fill="url(#grond-${uid})" />
    <path d="M 516 350 C 562 312, 660 312, 696 354 L 762 1168 L 452 1168 Z" fill="url(#stof-${uid})" />
    <path d="M 696 362 L 782 392 L 838 944 L 744 962 L 684 560 Z" fill="url(#mouw-${uid})" />
    <path d="M 516 350 C 492 420, 486 560, 494 720" stroke="${color.dark}" stroke-width="4" fill="none" opacity="0.38" />
    <path d="M 606 1168 L 606 900" stroke="${color.dark}" stroke-width="3" opacity="0.3" />`;
}

function blazerWorn(color) {
  const uid = nextUid();
  return `
    ${defs(color, uid)}
    <ellipse cx="600" cy="1390" rx="270" ry="42" fill="url(#grond-${uid})" />
    <path d="M 498 1000 L 596 1000 L 588 1380 L 510 1380 Z" fill="#2F2C29" opacity="0.8" />
    <path d="M 604 1000 L 702 1000 L 690 1380 L 612 1380 Z" fill="#2F2C29" opacity="0.8" />
    <path d="M 470 400 C 520 358, 680 358, 730 400 L 790 1060 L 410 1060 Z" fill="url(#stof-${uid})" />
    <path d="M 470 400 L 380 424 L 320 930 L 408 948 L 462 570 Z" fill="url(#mouw-${uid})" />
    <path d="M 730 400 L 820 424 L 880 930 L 792 948 L 738 570 Z" fill="url(#mouw-${uid})" />
    <path d="M 600 700 L 512 380 C 548 362, 574 372, 600 400 Z" fill="${color.light}" opacity="0.5" />
    <path d="M 600 700 L 688 380 C 652 362, 626 372, 600 400 Z" fill="${color.light}" opacity="0.5" />`;
}

/* -------------------------------------------------------------------------- */
/* Renderen                                                                    */
/* -------------------------------------------------------------------------- */

function portrait(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1500" viewBox="0 0 1200 1500">
    <rect width="1200" height="1500" fill="${BG}" />
    ${inner}
  </svg>`;
}

/** Open Graph-beeld, 1200 x 630, met de merknaam erin. */
function ogImage() {
  const c = COLORS.kameel;
  const d = COLORS.houtskool;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${BG}" />
    <g transform="translate(660,-120) scale(0.42)">${coatFront(c)}</g>
    <g transform="translate(900,-60) scale(0.36)">${coatSide(d)}</g>
    <text x="80" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="86" fill="#1F1B18" letter-spacing="2">Melin</text>
    <text x="330" y="300" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#6B5B47" letter-spacing="4">clo</text>
    <text x="82" y="360" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#5B534B">Lange wollen jassen en blazers</text>
    <line x1="80" y1="404" x2="470" y2="404" stroke="${LINE}" stroke-width="2" />
    <text x="82" y="452" font-family="Helvetica, Arial, sans-serif" font-size="21" fill="#5B534B" letter-spacing="2">KLEINE OPLAGES  ·  GEMAAKT IN PORTUGAL</text>
  </svg>`;
}

function landscape(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1200" viewBox="0 0 1800 1200">
    <rect width="1800" height="1200" fill="${BG}" />
    ${inner}
  </svg>`;
}

async function write(name, svg) {
  const buffer = await sharp(Buffer.from(svg))
    .jpeg({ quality: 86, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toBuffer();
  await writeFile(path.join(OUT, name), buffer);
  console.log(`  ${name}`);
}

/** Twee jassen naast elkaar, voor de sfeerbeelden. */
function sceneTwo(a, b) {
  return `
    <g transform="translate(180,-40) scale(0.78)">${coatFront(a)}</g>
    <g transform="translate(760,10) scale(0.72)">${coatSide(b)}</g>
    <line x1="0" y1="1080" x2="1800" y2="1080" stroke="${LINE}" stroke-width="2" />`;
}

function sceneRail(colors) {
  return `
    <line x1="150" y1="230" x2="1650" y2="230" stroke="#B9AE9C" stroke-width="10" stroke-linecap="round" />
    ${colors
      .map((c, i) => {
        const x = 210 + i * 300;
        return `
        <line x1="${x + 120}" y1="230" x2="${x + 120}" y2="330" stroke="#B9AE9C" stroke-width="6" />
        <g transform="translate(${x},250) scale(0.30)">${coatFront(c, { hem: 1330 })}</g>`;
      })
      .join('')}`;
}

function sceneDetail(color) {
  const uid = nextUid();
  return `
    ${defs(color, uid)}
    <rect width="1800" height="1200" fill="url(#stof-${uid})" />
    <path d="M 0 0 L 1800 0 L 1800 380 L 0 640 Z" fill="${BG}" />
    <path d="M 0 640 L 1800 380" stroke="${LINE}" stroke-width="3" />
    ${Array.from({ length: 20 }, (_, i) => `<line x1="0" y1="${640 + i * 40}" x2="1800" y2="${380 + i * 40}" stroke="${color.light}" stroke-width="1" opacity="0.12" />`).join('')}
    <circle cx="1280" cy="900" r="60" fill="${color.dark}" />
    <circle cx="1280" cy="900" r="60" fill="none" stroke="${color.light}" stroke-width="3" opacity="0.55" />`;
}

const productImages = [
  { slug: 'jas-duinjas-kameel', color: 'kameel', kind: 'coat' },
  { slug: 'jas-havenjas-houtskool', color: 'houtskool', kind: 'coat' },
  { slug: 'jas-kadejas-ecru', color: 'ecru', kind: 'coat' },
  { slug: 'jas-veldjas-donkergroen', color: 'donkergroen', kind: 'coat' },
  { slug: 'jas-lijnjas-taupe', color: 'taupe', kind: 'coat' },
  { slug: 'blazer-grachtblazer-houtskool', color: 'houtskool', kind: 'blazer' },
  { slug: 'blazer-atelierblazer-ecru', color: 'ecru', kind: 'blazer' },
  { slug: 'blazer-zondagblazer-kameel', color: 'kameel', kind: 'blazer' },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log('Foto’s maken in /public/images:');

  for (const item of productImages) {
    const color = COLORS[item.color];
    const views =
      item.kind === 'coat'
        ? [coatFront(color), coatSide(color), coatDetail(color), coatWorn(color)]
        : [blazerFront(color), blazerSide(color), coatDetail(color), blazerWorn(color)];

    for (let i = 0; i < views.length; i += 1) {
      await write(`${item.slug}-0${i + 1}.jpg`, portrait(views[i]));
    }
  }

  // Sfeerbeelden in 3:2 voor de homepage en Open Graph.
  await write('sfeer-collectie-01.jpg', landscape(sceneTwo(COLORS.kameel, COLORS.houtskool)));
  await write(
    'sfeer-atelier-01.jpg',
    landscape(sceneRail([COLORS.ecru, COLORS.kameel, COLORS.taupe, COLORS.donkergroen, COLORS.houtskool]))
  );
  await write('sfeer-wol-01.jpg', landscape(sceneDetail(COLORS.kameel)));

  // Beeld voor het delen op sociale media en in appjes.
  await write('og-melin-clo.jpg', ogImage());

  console.log('Klaar.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
