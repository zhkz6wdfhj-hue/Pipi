/**
 * Maakt één los HTML-bestand van de hele winkel: preview.html.
 *
 * Anders dan de map uit export-html.mjs is dit precies één bestand. Alles zit
 * erin — de opmaak, de lettertypen en alle foto's — dus je kunt het mailen,
 * in een chat plakken of op een usb-stick zetten en het werkt overal.
 *
 * De foto's worden hiervoor flink verkleind; het bestand moet immers als geheel
 * verstuurd kunnen worden. Beoordeel de vormgeving hierop, niet de scherpte.
 *
 * Je klikt gewoon door de pagina's heen: de links zijn omgezet naar verwijzingen
 * binnen hetzelfde bestand. Wat een server nodig heeft — de winkelmand, het
 * afrekenen, zoeken — staat als schermafbeelding op een eigen pagina, zodat je
 * ook dat kunt zien.
 *
 * Gebruik — eerst de site laten draaien, dan bouwen:
 *
 *   npm run build && npm run start      (in het ene terminalvenster)
 *   npm run preview                     (in het andere)
 */

import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const BRON = process.env.EXPORT_ORIGIN ?? 'http://localhost:3000';
const DOEL = path.join(process.cwd(), 'preview.html');
const AFBEELDINGEN = path.join(process.cwd(), 'public', 'images');
const SCHERMAFBEELDINGEN = process.env.PREVIEW_SHOTS ?? '';

/** Elke pagina krijgt een eigen verwijzing binnen het bestand. */
const PAGINAS = [
  ['/', 'home', 'Home'],
  ['/collectie', 'collectie', 'Collectie'],
  ['/collectie?categorie=jassen', 'collectie-jassen', 'Collectie — jassen'],
  ['/collectie?categorie=blazers', 'collectie-blazers', 'Collectie — blazers'],
  ['/product/duinjas', 'product-duinjas', 'Duinjas'],
  ['/product/havenjas', 'product-havenjas', 'Havenjas'],
  ['/product/kadejas', 'product-kadejas', 'Kadejas'],
  ['/product/veldjas', 'product-veldjas', 'Veldjas'],
  ['/product/lijnjas', 'product-lijnjas', 'Lijnjas'],
  ['/product/grachtblazer', 'product-grachtblazer', 'Grachtblazer'],
  ['/product/atelierblazer', 'product-atelierblazer', 'Atelierblazer'],
  ['/product/zondagblazer', 'product-zondagblazer', 'Zondagblazer'],
  ['/over', 'over', 'Over Mèlin'],
  ['/contact', 'contact', 'Contact'],
  ['/klantenservice', 'klantenservice', 'Klantenservice'],
  ['/service/verzending', 'service-verzending', 'Verzending'],
  ['/service/passen-en-aanpassen', 'service-passen', 'Passen en aanpassen'],
  ['/service/betaalmethoden', 'service-betaalmethoden', 'Betaalmethoden'],
  ['/service/op-maat', 'service-op-maat', 'Op maat gemaakt'],
  ['/service/onderhoud', 'service-onderhoud', 'Onderhoud van wol'],
  ['/juridisch/voorwaarden', 'juridisch-voorwaarden', 'Algemene voorwaarden'],
  ['/juridisch/privacy', 'juridisch-privacy', 'Privacyverklaring'],
  ['/juridisch/cookies', 'juridisch-cookies', 'Cookiebeleid'],
  ['/juridisch/herroepingsrecht', 'juridisch-herroepingsrecht', 'Herroepingsrecht'],
  ['/deze-pagina-bestaat-niet', 'niet-gevonden', 'Pagina niet gevonden'],
];

/** Pagina's die alleen met een server werken; die tonen we als schermafbeelding. */
const OPNAMES = [
  ['lade.png', 'De winkelmand als zijlade', 'Schuift open zodra je iets toevoegt, met het aantal, het subtotaal en hoeveel er nog te gaan is tot gratis verzending.'],
  ['winkelmand.png', 'De winkelmand als pagina', 'Met de kortingscode MELIN10 toegepast. Je kiest hier ook het bezorgland, waardoor de verzendkosten meteen meebewegen.'],
  ['afrekenen.png', 'Afrekenen, stap drie van drie', 'Contact en bezorging zijn afgerond en staan samengevat; alleen de betaalmethode moet nog. Rechts blijft de bestelling zichtbaar.'],
  ['validatie.png', 'Foutmeldingen', 'Elk veld wordt gecontroleerd zodra je het verlaat, en de melding noemt een voorbeeld in plaats van alleen "ongeldig".'],
  ['bedankt.png', 'De bedankpagina', 'Ordernummer, samenvatting, verwachte bezorging en wat er nu gebeurt. Tegelijk gaat de bevestigingsmail eruit.'],
  ['mobiel-home.png', 'Op de telefoon', 'Dezelfde pagina op 390 pixels breed. De foto blijft in dezelfde verhouding, de tekst blijft even rustig.'],
  ['mobiel-menu.png', 'Het menu op de telefoon', 'Achter de knop linksboven, met dezelfde haarlijnen als de rest.'],
  ['mobiel-product.png', 'Een productpagina op de telefoon', 'Kleur en maat kiezen, met de uitverkochte maat doorgestreept maar zichtbaar.'],
];

/* -------------------------------------------------------------------------- */

async function haal(pad) {
  const response = await fetch(`${BRON}${pad}`);
  // 404 hoort erbij: die pagina halen we juist op om hem te kunnen laten zien.
  if (!response.ok && response.status !== 404) {
    throw new Error(`${pad} gaf ${response.status}`);
  }
  return response.text();
}

function tussen(html, tag) {
  const start = html.indexOf(`<${tag}`);
  const eind = html.indexOf(`</${tag}>`);
  if (start === -1 || eind === -1) return '';
  return html.slice(start, eind + tag.length + 3);
}

function binnenin(html, tag) {
  const blok = tussen(html, tag);
  return blok.slice(blok.indexOf('>') + 1, blok.length - (tag.length + 3));
}

/**
 * Zet /_next/image?url=%2Fimages%2Fx.jpg&w=… terug naar /images/x.jpg, en maakt
 * de foto's meteen zichtbaar. Op de echte site verschijnen ze met een zachte
 * overgang zodra ze geladen zijn; dat regelt JavaScript, en dat zit hier niet in.
 */
function herstelFotoPaden(html) {
  return html
    .replace(/\/_next\/image\?url=([^"'\s&]+)(&amp;|&)[^"'\s]*/g, (_, bestand) =>
      decodeURIComponent(bestand)
    )
    .replace(/(<img[^>]*?)\bopacity-0\b/g, '$1opacity-100');
}

/* -------------------------------------------------------------------------- */

const fotoCache = new Map();

async function alsDataUri(bestandsnaam, breedte) {
  const sleutel = `${bestandsnaam}@${breedte}`;
  if (fotoCache.has(sleutel)) return fotoCache.get(sleutel);

  const buffer = await sharp(path.join(AFBEELDINGEN, bestandsnaam))
    .resize({ width: breedte, withoutEnlargement: true })
    .jpeg({ quality: 62, mozjpeg: true })
    .toBuffer();

  const uri = `data:image/jpeg;base64,${buffer.toString('base64')}`;
  fotoCache.set(sleutel, uri);
  return uri;
}

/**
 * Vervangt elke verwijzing naar een foto door de foto zelf. De srcset gaat er
 * eerst uit: die zou anders dezelfde foto acht keer in het bestand zetten.
 */
async function bakFotosIn(html) {
  let resultaat = html.replace(/\s(?:srcSet|srcset)="[^"]*"/g, '');

  const namen = new Set(
    [...resultaat.matchAll(/\/images\/([a-z0-9-]+\.jpg)/g)].map((match) => match[1])
  );

  for (const naam of namen) {
    const breedte = naam.startsWith('sfeer') || naam.startsWith('og') ? 820 : 400;
    const uri = await alsDataUri(naam, breedte);
    resultaat = resultaat.replaceAll(`/images/${naam}`, uri);
  }

  return resultaat;
}

/** Lettertypen in de stijl bakken, en de tekensets die we niet nodig hebben eruit. */
async function stijlMetLettertypen(html) {
  const pad = html.match(/href="(\/_next\/static\/css\/[^"]+)"/)?.[1];
  if (!pad) throw new Error('Geen stijlbestand gevonden.');

  let css = await haal(pad);

  // Alleen Latijnse tekensets; Cyrillisch, Grieks en Vietnamees hebben we niet
  // nodig en zouden het bestand onnodig zwaar maken.
  css = css.replace(/@font-face\s*\{[^}]*\}/g, (blok) => {
    const bereik = blok.match(/unicode-range:([^;]+);/)?.[1] ?? '';
    const latijns = /U\+0000-00FF|U\+0100-02(BA|4F)|U\+0000-00ff/i.test(bereik);
    return bereik && !latijns ? '' : blok;
  });

  for (const match of [...css.matchAll(/url\(\/(_next\/static\/media\/[^)"']+\.woff2)\)/g)]) {
    const response = await fetch(`${BRON}/${match[1]}`);
    const base64 = Buffer.from(await response.arrayBuffer()).toString('base64');
    css = css.replaceAll(`url(/${match[1]})`, `url(data:font/woff2;base64,${base64})`);
  }

  return css;
}

/* -------------------------------------------------------------------------- */

const naarVerwijzing = new Map(PAGINAS.map(([pad, sleutel]) => [pad, `#p-${sleutel}`]));

function herschrijfLinks(html) {
  return html.replace(/href="(\/[^"]*)"/g, (heel, href) => {
    if (href.startsWith('/_next/') || href.startsWith('data:')) return heel;
    const doel = naarVerwijzing.get(href.split('#')[0]);
    return doel ? `href="${doel}"` : 'href="#p-home"';
  });
}

/* -------------------------------------------------------------------------- */

async function opnamesPagina() {
  if (!SCHERMAFBEELDINGEN) return '';

  const beschikbaar = new Set(await readdir(SCHERMAFBEELDINGEN).catch(() => []));
  const blokken = [];

  for (const [bestand, titel, uitleg] of OPNAMES) {
    if (!beschikbaar.has(bestand)) continue;

    const buffer = await sharp(path.join(SCHERMAFBEELDINGEN, bestand))
      .resize({ width: 720, withoutEnlargement: true })
      .jpeg({ quality: 62, mozjpeg: true })
      .toBuffer();

    blokken.push(`
      <figure class="voorbeeld">
        <img src="data:image/jpeg;base64,${buffer.toString('base64')}" alt="${titel}" loading="lazy" />
        <figcaption>
          <h3>${titel}</h3>
          <p>${uitleg}</p>
        </figcaption>
      </figure>`);
  }

  return `
    <div class="container-page py-10 lg:py-16">
      <header class="mb-10 lg:mb-14">
        <h1 class="display-xl">Zo werkt bestellen</h1>
        <p class="mt-5 max-w-2xl text-lead leading-relaxed text-ink-soft">
          De winkelmand, het afrekenen en de bedankpagina hebben een server nodig en kunnen in dit
          losse bestand dus niet werken. Hieronder staan ze als opname, zodat je toch ziet hoe ze
          eruitzien en wat er gebeurt.
        </p>
      </header>
      <div class="voorbeelden">${blokken.join('')}</div>
    </div>`;
}

/* -------------------------------------------------------------------------- */

const BALK = `
<div class="voorbeeldbalk">
  <p>
    <strong>Voorbeeld van de webshop.</strong>
    Je klikt hier door de echte pagina&rsquo;s. Bestellen kan niet: daar is een server voor nodig.
  </p>
  <a href="#p-zo-werkt-bestellen">Zo ziet bestellen eruit &rarr;</a>
</div>`;

const EIGEN_STIJL = `
.voorbeeldbalk {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem 1.25rem;
  padding: 0.75rem 1.25rem;
  background: #F1ECE4;
  border-bottom: 1px solid #E3DDD3;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #5B534B;
  text-align: center;
}
.voorbeeldbalk strong { font-weight: 600; color: #1F1B18; }
.voorbeeldbalk a {
  color: #6B5B47;
  text-decoration: underline;
  text-underline-offset: 0.25em;
  text-decoration-color: #CDC4B6;
  white-space: nowrap;
}
.voorbeeldbalk a:hover { text-decoration-color: #8A7A66; }

/*
 * Bladeren zonder JavaScript. De browser toont de sectie waarvan het id
 * overeenkomt met wat er achter het hekje in de adresbalk staat (:target).
 * Staat er niets — of iets onbekends — dan zie je de homepage.
 */
[data-pagina] { display: none; }
[data-pagina]:target { display: block; }
body:not(:has([data-pagina]:target)) [data-pagina="home"] { display: block; }

.voorbeelden { display: grid; gap: 4rem; }
.voorbeeld { margin: 0; }
.voorbeeld img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid #E3DDD3;
  background: #fff;
}
.voorbeeld figcaption { margin-top: 1rem; max-width: 60ch; }
.voorbeeld h3 {
  font-family: var(--font-cormorant), Georgia, serif;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  margin-bottom: 0.375rem;
}
.voorbeeld p { font-size: 0.9375rem; line-height: 1.6; color: #5B534B; }
@media (min-width: 900px) {
  .voorbeeld { display: grid; grid-template-columns: 1.6fr 1fr; gap: 2.5rem; align-items: start; }
  .voorbeeld figcaption { margin-top: 0; position: sticky; top: 6rem; }
}
`;

/*
 * Alleen een extraatje: het bladeren zelf doet CSS. Dit zorgt er nog voor dat je
 * bovenaan de nieuwe pagina begint en dat de titel in het tabblad meeloopt.
 * Werkt dit niet, dan werkt de kopie nog steeds.
 */
const SCRIPT = `
(function () {
  function bij() {
    var pagina = document.querySelector('[data-pagina]:target') ||
                 document.querySelector('[data-pagina="home"]');
    if (!pagina) return;
    document.title = (pagina.dataset.titel || 'Mèlin') + ' \\u2014 Mèlin';
    scrollTo(0, 0);
  }
  addEventListener('hashchange', bij);
  bij();
})();
`;

/* -------------------------------------------------------------------------- */

async function main() {
  console.log(`Voorbeeldbestand maken van ${BRON}\n`);

  const home = await haal('/');
  const css = await stijlMetLettertypen(home);

  // next/font zet de namen van de lettertypen in variabelen op <html>. Zonder die
  // klasse is var(--font-cormorant) leeg, en dan vervalt de hele font-family —
  // ook de reservenamen erachter. De klasse gaat dus mee.
  const htmlKlasse = home.match(/<html[^>]*class="([^"]*)"/)?.[1] ?? '';

  const kop = herschrijfLinks(herstelFotoPaden(tussen(home, 'header')));
  const voet = herschrijfLinks(herstelFotoPaden(tussen(home, 'footer')));

  const secties = [];

  for (const [pad, sleutel, titel] of PAGINAS) {
    const html = await haal(pad);
    let inhoud = binnenin(html, 'main');
    inhoud = herstelFotoPaden(inhoud);
    inhoud = herschrijfLinks(inhoud);
    inhoud = await bakFotosIn(inhoud);

    secties.push(
      `<section id="p-${sleutel}" data-pagina="${sleutel}" data-titel="${titel}">${inhoud}</section>`
    );
    console.log(`  ${titel}`);
  }

  const opnames = await opnamesPagina();
  if (opnames) {
    secties.push(
      `<section id="p-zo-werkt-bestellen" data-pagina="zo-werkt-bestellen" data-titel="Zo werkt bestellen">${opnames}</section>`
    );
    console.log('  Zo werkt bestellen');
  }

  const document = `<!doctype html>
<html lang="nl" class="${htmlKlasse}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>Mèlin — voorbeeld van de webshop</title>
<style>${css}</style>
<style>${EIGEN_STIJL}</style>
</head>
<body class="flex min-h-dvh flex-col">
${BALK}
${await bakFotosIn(kop)}
<main class="flex-1">
${secties.join('\n')}
</main>
${await bakFotosIn(voet)}
<script>${SCRIPT}</script>
</body>
</html>`;

  await writeFile(DOEL, document, 'utf8');

  const mb = (Buffer.byteLength(document) / 1024 / 1024).toFixed(1);
  console.log(`\nKlaar: preview.html (${mb} MB). Open het in je browser.`);
}

main().catch((error) => {
  console.error('\nHet bouwen is misgegaan:', error.message);
  console.error('Draait de site? Start hem met: npm run build && npm run start');
  process.exit(1);
});
