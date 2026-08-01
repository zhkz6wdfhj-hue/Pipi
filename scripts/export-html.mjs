/**
 * Maakt een statische HTML-kopie van de winkel in /html-kopie.
 *
 * Waarvoor: om de site te bekijken of door te sturen zonder dat er Node,
 * npm of een server aan te pas komt. Je opent index.html en klikt gewoon
 * door de pagina's heen.
 *
 * Wat wél werkt: alle teksten, alle pagina's, de vormgeving, de lettertypen,
 * de foto's, de links tussen pagina's en de uitklapblokken.
 *
 * Wat NIET werkt: alles waar JavaScript voor nodig is — de winkelmand, het
 * afrekenen, het menu op mobiel, de zoekfunctie en de cookiemelding. Dat kan
 * ook niet: een losse map met bestanden heeft geen server om mee te praten.
 * Voor een werkende winkel publiceer je het project (zie README.md).
 *
 * Gebruik — eerst de site laten draaien, dan exporteren:
 *
 *   npm run build && npm run start      (in het ene terminalvenster)
 *   node scripts/export-html.mjs        (in het andere)
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BRON = process.env.EXPORT_ORIGIN ?? 'http://localhost:3000';
const DOEL = path.join(process.cwd(), 'html-kopie');

/**
 * Welke pagina's mee gaan, en in welk mapje ze belanden.
 * Sleutel = adres op de site, waarde = mapnaam in de kopie.
 */
const PAGINAS = {
  '/': '',
  '/collectie': 'collectie',
  '/collectie?categorie=jassen': 'collectie-jassen',
  '/collectie?categorie=blazers': 'collectie-blazers',
  '/product/duinjas': 'product/duinjas',
  '/product/havenjas': 'product/havenjas',
  '/product/kadejas': 'product/kadejas',
  '/product/veldjas': 'product/veldjas',
  '/product/lijnjas': 'product/lijnjas',
  '/product/grachtblazer': 'product/grachtblazer',
  '/product/atelierblazer': 'product/atelierblazer',
  '/product/zondagblazer': 'product/zondagblazer',
  '/winkelmand': 'winkelmand',
  '/afrekenen': 'afrekenen',
  '/over': 'over',
  '/contact': 'contact',
  '/zoeken': 'zoeken',
  '/klantenservice': 'klantenservice',
  '/service/verzending': 'service/verzending',
  '/service/retourneren': 'service/retourneren',
  '/service/betaalmethoden': 'service/betaalmethoden',
  '/service/maattabel': 'service/maattabel',
  '/service/onderhoud': 'service/onderhoud',
  '/juridisch/voorwaarden': 'juridisch/voorwaarden',
  '/juridisch/privacy': 'juridisch/privacy',
  '/juridisch/cookies': 'juridisch/cookies',
  '/juridisch/herroepingsrecht': 'juridisch/herroepingsrecht',
  '/deze-pagina-bestaat-niet': '404',
};

/** Bestanden die we naast de pagina's meenemen (stijl, lettertypen, foto's). */
const assets = new Set();

/** Hoeveel mapjes diep een pagina zit, voor de relatieve verwijzingen. */
function prefixVoor(map) {
  const diepte = map === '' ? 0 : map.split('/').length;
  return diepte === 0 ? './' : '../'.repeat(diepte);
}

async function haalOp(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} gaf ${response.status}`);
  return response;
}

/**
 * Haalt alle JavaScript eruit. Vanaf je eigen schijf kan de winkel toch niet
 * met een server praten, dus de scripts zouden alleen foutmeldingen opleveren.
 * Wat overblijft is nette HTML met opmaak: precies wat je wilt bekijken.
 */
function verwijderScripts(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
    // Preloads wijzen naar losse bestanden; in de kopie zit alles al in het
    // stijlbestand, dus die verwijzingen zouden alleen fouten opleveren.
    .replace(/<link[^>]+rel="preload"[^>]*\/?>/g, '');
}

/**
 * Zet de foto's van next/image terug naar het originele bestand in /images, en
 * maakt ze meteen zichtbaar. Op de echte site verschijnen ze met een zachte
 * overgang zodra ze geladen zijn; dat regelt JavaScript, en dat is hier weg.
 */
function herstelFotos(html) {
  return html
    .replace(
      /\/_next\/image\?url=([^"'\s&]+)(&amp;|&)[^"'\s]*/g,
      (_, bestand) => decodeURIComponent(bestand)
    )
    .replace(/(<img[^>]*?)\bopacity-0\b/g, '$1opacity-100');
}

/** Maakt van een adres op de site een pad naar het bestand in de kopie. */
function linkNaarBestand(href, prefix) {
  const schoon = href.split('#')[0];
  const anker = href.includes('#') ? `#${href.split('#')[1]}` : '';

  if (!(schoon in PAGINAS)) return null;

  const map = PAGINAS[schoon];
  return `${prefix}${map ? `${map}/` : ''}index.html${anker}`;
}

function herschrijfLinks(html, prefix) {
  return html.replace(/href="(\/[^"]*)"/g, (heel, href) => {
    // Stijlbestanden en dergelijke laten we met rust; die gaan hieronder mee.
    if (href.startsWith('/_next/') || href.startsWith('/images/') || href.endsWith('.svg')) {
      return heel;
    }
    const doel = linkNaarBestand(href, prefix);
    return doel ? `href="${doel}"` : heel;
  });
}

function verzamelAssets(html) {
  const patronen = [
    // Alleen stijl en lettertypen; JavaScript gaat niet mee.
    /(?:href|src)="(\/_next\/static\/css\/[^"]+)"/g,
    /(?:href|src|srcSet|srcset)="([^"]*\/images\/[^"]+)"/g,
    /(?:href|src)="(\/icon\.svg[^"]*)"/g,
  ];

  for (const patroon of patronen) {
    for (const match of html.matchAll(patroon)) {
      // Een srcset bevat meerdere paden achter elkaar; die splitsen we.
      for (const deel of match[1].split(',')) {
        const pad = deel.trim().split(' ')[0];
        if (pad.startsWith('/')) assets.add(pad.split('?')[0]);
      }
    }
  }
}

function herschrijfAssets(html, prefix) {
  return html
    .replace(/(href|src)="\/_next\//g, `$1="${prefix}_next/`)
    .replace(/(srcSet|srcset)="([^"]+)"/g, (heel, attribuut, waarde) => {
      const nieuw = waarde
        .split(',')
        .map((deel) => deel.trim().replace(/^\//, prefix))
        .join(', ');
      return `${attribuut}="${nieuw}"`;
    })
    .replace(/(href|src)="\/images\//g, `$1="${prefix}images/`)
    .replace(/(href|src)="\/icon\.svg/g, `$1="${prefix}icon.svg`);
}

/** Melding bovenaan elke pagina, zodat niemand zich afvraagt waarom de mand niet werkt. */
const MELDING = `
<div style="background:#F1ECE4;border-bottom:1px solid #E3DDD3;padding:10px 20px;font:14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#5B534B;text-align:center">
  Dit is een <strong style="color:#1F1B18;font-weight:600">statische kopie</strong> om de vormgeving en de teksten te bekijken. Klikken tussen pagina's werkt; de winkelmand, het afrekenen en de zoekfunctie werken alleen op de echte site.
</div>`;

async function main() {
  console.log(`HTML-kopie maken van ${BRON}\n`);

  for (const [adres, map] of Object.entries(PAGINAS)) {
    const response = await fetch(`${BRON}${adres}`);
    let html = await response.text();
    const prefix = prefixVoor(map);

    html = verwijderScripts(html);
    html = herstelFotos(html);
    verzamelAssets(html);
    html = herschrijfLinks(html, prefix);
    html = herschrijfAssets(html, prefix);
    html = html.replace(/<body([^>]*)>/, `<body$1>${MELDING}`);

    const doelmap = path.join(DOEL, map);
    await mkdir(doelmap, { recursive: true });
    await writeFile(path.join(doelmap, 'index.html'), html, 'utf8');
    console.log(`  ${map || 'index'}/index.html`);
  }

  console.log(`\n${assets.size} bestanden meenemen (stijl, lettertypen, foto's):`);

  for (const asset of assets) {
    try {
      const response = await haalOp(`${BRON}${asset}`);
      let inhoud = Buffer.from(await response.arrayBuffer());

      // De lettertypen bakken we in het stijlbestand zelf. Reden: browsers
      // weigeren een lettertype te laden dat vanaf de schijf uit een "ander"
      // bestand komt. Als data in het stijlbestand speelt dat niet, en dan
      // ziet de kopie er hetzelfde uit als de echte site.
      if (asset.endsWith('.css')) {
        let tekst = inhoud.toString('utf8');
        const lettertypen = [...tekst.matchAll(/url\(\/(_next\/static\/media\/[^)"']+\.woff2)\)/g)];

        for (const match of lettertypen) {
          const bestand = await haalOp(`${BRON}/${match[1]}`);
          const base64 = Buffer.from(await bestand.arrayBuffer()).toString('base64');
          tekst = tekst.replaceAll(`url(/${match[1]})`, `url(data:font/woff2;base64,${base64})`);
        }

        console.log(`  ${lettertypen.length} lettertypen in het stijlbestand gezet`);
        inhoud = Buffer.from(tekst, 'utf8');
      }

      const doel = path.join(DOEL, asset.replace(/^\//, ''));
      await mkdir(path.dirname(doel), { recursive: true });
      await writeFile(doel, inhoud);
    } catch (error) {
      console.warn(`  overgeslagen: ${asset} (${error.message})`);
    }
  }

  console.log(`\nKlaar. Open ${path.join(DOEL, 'index.html')} in je browser.`);
}

main().catch((error) => {
  console.error('\nHet exporteren is misgegaan:', error.message);
  console.error('Draait de site? Start hem met: npm run build && npm run start');
  process.exit(1);
});
