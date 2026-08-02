# Mèlin — webshop

De webshop van Mèlin: lange wollen jassen en blazers, na de bestelling op maat
gemaakt. Deze
site vervangt het bestellen via Instagram.

Gebouwd met Next.js (App Router), TypeScript en Tailwind CSS. Er is geen CMS en
geen database nodig: de producten staan in één bestand, de bestellingen worden
lokaal weggeschreven. Alles is in het Nederlands, inclusief foutmeldingen en
e-mails.

---

## Inhoud

1. [Installeren](#1-installeren)
2. [Wat waar staat](#2-wat-waar-staat)
3. [Producten aanpassen](#3-producten-aanpassen)
4. [Foto's vervangen](#4-fotos-vervangen)
5. [Prijzen, verzendkosten en kortingscodes](#5-prijzen-verzendkosten-en-kortingscodes)
6. [Betalingen live zetten](#6-betalingen-live-zetten)
7. [E-mail instellen](#7-e-mail-instellen)
8. [Bestellingen bewaren](#8-bestellingen-bewaren)
9. [Publiceren op Vercel](#9-publiceren-op-vercel)
10. [Een statische kopie maken](#10-een-statische-kopie-maken)
11. [Nog te doen voor livegang](#11-nog-te-doen-voor-livegang)

---

## 1. Installeren

Je hebt Node.js 20 of nieuwer nodig.

```bash
npm install
npm run dev
```

De site draait daarna op <http://localhost:3000>.

Wil je met eigen sleutels werken (betalingen, e-mail), kopieer dan het
voorbeeldbestand:

```bash
cp .env.example .env.local
```

Zonder sleutels werkt alles gewoon: de checkout gaat in **simulatiemodus** en
e-mails verschijnen in je terminal in plaats van in een inbox. Je kunt dus de
hele bestelstroom doorlopen — van winkelmand tot bedankpagina — voordat je één
account aanmaakt.

### Andere commando's

| Commando            | Wat het doet                                            |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Ontwikkelserver met automatische herlading               |
| `npm run build`     | Bouwt de site voor productie                            |
| `npm run start`     | Draait de gebouwde site                                 |
| `npm run typecheck` | Controleert alle types zonder te bouwen                 |
| `npm run lint`      | Controleert de code op fouten                           |
| `npm run images`    | Maakt de placeholderfoto's opnieuw (zie hoofdstuk 4)     |
| `npm run export-html` | Maakt een statische HTML-kopie (map met pagina's)       |
| `npm run preview`   | Maakt één los HTML-bestand met de hele winkel erin       |

---

## 2. Wat waar staat

```
src/
  app/                      Pagina's en API-routes (App Router)
    page.tsx                Home
    collectie/              Rasteroverzicht met filters in de URL
    product/[slug]/         Productpagina
    winkelmand/             Winkelmand als eigen pagina
    afrekenen/              Afrekenen in drie stappen
      afronden/             Terugkeer uit het betaalscherm
      simulatie/            Nagebootst betaalscherm (zonder Mollie-sleutel)
    bestelling/[id]/        Bedankpagina
    over/  contact/  zoeken/
    klantenservice/  service/…    Klantenservice
    juridisch/…             Voorwaarden, privacy, cookies, herroepingsrecht
    api/…                   Afrekenen, webhook, contact, nieuwsbrief
  components/               Interface, opgedeeld per gebied
  context/cart-context.tsx  De winkelmand (React Context met reducer)
  data/                     Producten, prijzen, verzendkosten, bedrijfsgegevens
  lib/                      Rekenwerk, validatie, e-mail, Mollie, SEO
public/images/              Alle foto's
scripts/generate-images.mjs Maakt de placeholderfoto's
```

Twee bestanden waar je het vaakst in zult zijn:

- **`src/data/products.ts`** — het assortiment. Bovenaan staat uitgelegd hoe je
  een product toevoegt.
- **`src/data/site.ts`** — je bedrijfsgegevens: e-mailadres, KvK, btw,
  retouradres, levertijden.

---

## 3. Producten aanpassen

Alles staat in `src/data/products.ts`. Bovenin dat bestand staat een uitleg in
zes stappen; hier de korte versie.

### Een product toevoegen

Kopieer een bestaand blok, plak het onderaan de lijst en pas aan:

```ts
{
  slug: 'duinjas',        // wordt /product/duinjas — kleine letters, koppeltekens
  name: 'Duinjas',
  category: 'jassen',     // 'jassen' of 'blazers'
  price: 38900,           // HELE CENTEN: 38900 = € 389,00
  tagline: 'Eén zin voor het overzicht.',
  description: '40 tot 70 woorden over stof, pasvorm, lengte en draagmoment.',
  colors: ['kameel', 'ecru'],
  variants: [ … ],        // één regel per kleur, met een artikelnummer
  images: [ … ],          // pad, alt-tekst, breedte en hoogte
  specs: { … },           // samenstelling, voering, sluiting, lengte, onderhoud
  featured: true,         // op de homepage? De eerste vier worden getoond
  releasedAt: '2025-09-12', // bepaalt de sortering "Nieuwste eerst"
}
```

### Alles wordt op maat gemaakt

Er zijn geen confectiematen en geen voorraad. De klant kiest een model en een
kleur; de maten neem je zelf op nadat de bestelling binnen is. In `variants`
staat daarom één regel per kleur, met een artikelnummer — meer niet.

Wat daaruit volgt, zit overal in de site verwerkt: er staat nergens
"uitverkocht", de levertijd is {weeksMin} tot {weeksMax} weken uit
`src/data/site.ts`, en op de bedankpagina en in de bevestigingsmail staat dat je
binnen twee werkdagen contact opneemt voor de maten.

Welke maten je opneemt staat in `src/data/measurements.ts`. Pas die lijst aan als
je atelier andere maten nodig heeft; de pagina /service/op-maat en het blok op de
productpagina volgen vanzelf.

> **Let op bij de juridische teksten.** Omdat het maatwerk is, vervalt het
> wettelijke herroepingsrecht van veertien dagen. Dat staat zo uitgelegd op
> /juridisch/herroepingsrecht en in de algemene voorwaarden. Ga je later tóch
> confectiematen verkopen, dan moeten die teksten terug — laat ze dan opnieuw
> nakijken.

### Een kleur toevoegen

Voeg een regel toe aan `COLORS` bovenin hetzelfde bestand, met een label en een
kleurstaal. De kleur verschijnt daarna vanzelf in de filters van de
collectiepagina.

### Later naar een CMS

De rest van de site praat nooit rechtstreeks met de lijst, maar via de functies
onderaan `products.ts` (`getAllProducts`, `getProductBySlug`, …). Stap je later
over op Sanity of Shopify, dan vervang je alleen de inhoud van die functies en
laat je het `Product`-type intact. Geen enkele pagina hoeft dan aangepast te
worden.

---

## 4. Foto's vervangen

In `public/images/` staan nu foto's die uit schermafbeeldingen van het
Instagram-raster zijn gesneden. Ze tonen de echte kleding, maar ze zijn
**ongeveer een derde van de resolutie die je nodig hebt** — goed genoeg om de
site te beoordelen, niet goed genoeg om mee te verkopen. Vervang ze door de
originelen:

### De foto's uit Instagram halen

1. Open je profiel op <https://www.instagram.com/melin_clo/> op een computer.
2. Vraag je gegevens op via **Instellingen → Accountscentrum → Je informatie en
   machtigingen → Je informatie downloaden**. Kies **JSON** of **HTML** en de
   hoogste beeldkwaliteit. Je krijgt binnen een paar uur een zipbestand met alle
   foto's in originele resolutie — beter dan wat je met rechtermuisknop opslaat.
3. Zoek in het zipbestand de map met je berichten.

### Bijsnijden

De vormgeving rekent op twee verhoudingen:

| Soort         | Verhouding | Aanbevolen formaat | Waar het gebruikt wordt        |
| ------------- | ---------- | ------------------ | ------------------------------ |
| Productfoto   | **4 : 5**  | 1200 × 1500 px     | Collectie, productpagina, mand |
| Sfeerbeeld    | **3 : 2**  | 1800 × 1200 px     | Homepage, overpagina           |
| Deelafbeelding| 1200 × 630 | 1200 × 630 px      | Delen op sociale media         |

Snij centraal uit en zorg dat hoofd en zoom in beeld blijven. De foto wordt met
`object-fit: cover` getoond, dus hij wordt nooit uitgerekt — maar wat buiten de
verhouding valt, valt weg. Sla op als JPG met kwaliteit 80–85.

### In de map zetten

Gebruik beschrijvende namen, in hetzelfde stramien als nu:

```
jas-duinjas-kameel-01.jpg
jas-duinjas-kameel-02.jpg
blazer-grachtblazer-houtskool-01.jpg
sfeer-collectie-01.jpg
```

Overschrijf de bestaande bestanden met dezelfde naam, dan hoef je verder niets
aan te passen. Kies je andere namen, werk dan `images` bij in `products.ts` —
en schrijf meteen een goede **alt-tekst**: die wordt voorgelezen door
schermlezers en is dus geen bijzaak. Beschrijf wat je ziet, bijvoorbeeld
"Kameelkleurige lange wollen jas, recht model, van voren gefotografeerd".

### De placeholders opnieuw maken

Er staat nog een script klaar dat abstracte tekeningen maakt in de juiste
kleuren en verhoudingen — handig als je tijdelijk zonder foto's zit:

```bash
npm run images
```

**Let op:** dit overschrijft alles in `public/images/`. Doe het niet nadat je je
eigen foto's erin hebt gezet.

---

## 5. Prijzen, verzendkosten en kortingscodes

### Prijzen

In `src/data/products.ts`, veld `price`, in **hele centen**. € 389,00 schrijf je
als `38900`. Bestellingen die al geplaatst zijn bewaren hun eigen prijs, dus
lopende bestellingen veranderen niet mee.

### Verzendkosten

In `src/data/shipping.ts`:

```ts
export const FREE_SHIPPING_THRESHOLD = 15000; // € 150,00
export const SHIPPING_RATES = {
  NL: 495, // € 4,95
  BE: 795, // € 7,95
};
```

Pas je deze aan, dan volgen de winkelmand, het afrekenen, de bevestigingsmail en
de teksten die het bedrag noemen automatisch mee. De teksten op de
klantenservicepagina's noemen de bedragen wel met de hand — kijk die dus even na.

### Kortingscodes

In `src/data/discounts.ts`. Er staat één werkende code klaar: **`MELIN10`** geeft
10% korting. Een code toevoegen:

```ts
{
  code: 'WINTER25',
  type: 'bedrag',        // 'percentage' of 'bedrag'
  value: 2500,           // 25% bij percentage, € 25,00 bij bedrag (in centen)
  minimumSubtotal: 15000, // pas geldig vanaf € 150
  label: '€ 25 korting op je bestelling',
  active: true,          // op false zetten schakelt hem tijdelijk uit
}
```

Codes worden hoofdletterongevoelig vergeleken en worden ook op de server opnieuw
gecontroleerd, dus er valt niet mee te knoeien.

---

## 6. Betalingen live zetten

De winkel gebruikt **Mollie** (iDEAL, Bancontact, creditcard). Er zijn drie
standen, bepaald door één variabele:

| `MOLLIE_API_KEY` | Wat er gebeurt                                                        |
| ---------------- | --------------------------------------------------------------------- |
| leeg             | Simulatiemodus — je doorloopt de hele bestelstroom zonder betaalaccount |
| `test_…`         | Echte Mollie-omgeving, geen echt geld                                  |
| `live_…`         | Echte betalingen                                                       |

### Stap voor stap

1. **Account aanmaken** op <https://www.mollie.com>. Je hebt je KvK-nummer en een
   zakelijke rekening nodig. De controle duurt meestal één tot enkele werkdagen.
2. **Testsleutel ophalen** onder *Ontwikkelaars → API-sleutels*. Zet hem in
   `.env.local`:

   ```
   MOLLIE_API_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Testen.** Doorloop een bestelling. Je komt nu in het echte Mollie-scherm,
   waar je zelf kiest of de betaling slaagt, mislukt of geannuleerd wordt.
   Controleer daarna of de bedankpagina klopt en of de bevestigingsmail is
   verstuurd.
4. **Betaalmethoden aanzetten** in je Mollie-dashboard onder *Instellingen →
   Betaalmethoden*. iDEAL en Bancontact staan meestal meteen aan; creditcard
   vraagt om een extra controle.
5. **Live gaan.** Zet de live sleutel in Vercel (Settings → Environment
   Variables), **niet** in een bestand dat je commit. Zet ook
   `NEXT_PUBLIC_SITE_URL` op je echte domein.
6. **De webhook controleren.** Zodra de site op een publiek domein staat, meldt
   de winkel bij elke betaling automatisch het adres
   `https://jouwdomein.nl/api/mollie/webhook` aan bij Mollie. Daar hoef je niets
   voor in te stellen. Op localhost wordt de webhook overgeslagen; de betaalstatus
   wordt dan opgehaald zodra de klant terugkeert uit het betaalscherm.
7. **Eén echte proefbestelling** doen met een klein bedrag, en daarna
   terugstorten via je Mollie-dashboard.

### Liever Stripe?

Alle koppeling zit in `src/lib/mollie.ts`, achter twee functies: `createPayment`
en `getPayment`. Vervang de inhoud daarvan door Stripe-aanroepen en laat de
handtekeningen intact; de rest van de site merkt er niets van.

---

## 7. E-mail instellen

Zonder `RESEND_API_KEY` worden e-mails niet verstuurd maar netjes in je terminal
getoond — handig tijdens het bouwen. Voor livegang:

1. Maak een account op <https://resend.com>.
2. Voeg je domein toe en zet de DNS-records die Resend je geeft (SPF, DKIM en
   DMARC) bij je domeinprovider. Zonder die records komen je mails in de
   spamfolder.
3. Zet de sleutel in Vercel:

   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
   ```

4. Pas de adressen aan in `src/data/site.ts`:

   ```ts
   email:         'hallo@melin-clo.nl',            // waar klanten je bereiken
   emailFrom:     'Mèlin <hallo@melin-clo.nl>', // afzender van de mails
   emailInternal: 'bestellingen@melin-clo.nl',      // waar het besteloverzicht heen gaat
   ```

Er gaan vier soorten mail de deur uit: de bevestiging aan de klant, het interne
besteloverzicht, het bericht uit het contactformulier en de bevestigingsmail van
de nieuwsbrief. De sjablonen staan in `src/lib/email/templates.ts` en zijn in
dezelfde stijl opgemaakt als de site.

Liever je eigen SMTP-server? Vervang dan alleen de functie `deliver` in
`src/lib/email/send.ts`.

---

## 8. Bestellingen bewaren

Bestellingen worden weggeschreven als JSON in `.data/orders.json`. Dat is genoeg
om de winkel te draaien en om de bedankpagina en de bevestigingsmail te vullen,
zonder dat je een database hoeft op te tuigen.

> **Let op bij Vercel:** het bestandssysteem daar is tijdelijk. Bestellingen die
> je op die manier bewaart, verdwijnen bij de volgende publicatie. Je e-mails
> blijven wél gewoon werken, dus je mist geen bestelling — maar de bedankpagina
> kan een oude bestelling niet meer terugvinden.

Voor livegang zijn er twee routes:

- **Klein houden.** Vertrouw op de bevestigingsmails en het interne
  besteloverzicht, en houd je administratie daarbuiten bij. Bij een paar
  bestellingen per week werkt dat prima.
- **Een database koppelen.** Bijvoorbeeld Vercel Postgres, Supabase of Neon. Je
  hoeft dan alleen de vijf functies onderaan `src/lib/orders.ts` te vervangen:
  `createOrder`, `getOrder`, `getOrderByPaymentId`, `updateOrder` en
  `updateOrderStatus`. De rest van de site raak je niet aan.

---

## 9. Publiceren op Vercel

1. Zet de code in een Git-repository (GitHub, GitLab of Bitbucket).
2. Ga naar <https://vercel.com>, kies **Add New → Project** en selecteer de
   repository. Vercel herkent Next.js zelf; je hoeft niets in te stellen bij
   build-commando of uitvoermap.
3. Zet onder **Settings → Environment Variables** de variabelen uit
   `.env.example`:

   | Variabele              | Waarde                        |
   | ---------------------- | ----------------------------- |
   | `NEXT_PUBLIC_SITE_URL` | `https://www.melin-clo.nl`    |
   | `MOLLIE_API_KEY`       | je live of test sleutel       |
   | `RESEND_API_KEY`       | je Resend-sleutel             |
   | `NEWSLETTER_SECRET`    | uitkomst van `openssl rand -hex 32` |

4. Klik **Deploy**. Na een minuut staat de site online op een
   `.vercel.app`-adres.
5. **Eigen domein koppelen** onder *Settings → Domains*. Vercel geeft je de
   DNS-records die je bij je domeinprovider moet zetten; het https-certificaat
   regelt Vercel zelf.
6. Zet `NEXT_PUBLIC_SITE_URL` op je eigen domein en publiceer opnieuw, zodat de
   canonieke URL's, de sitemap en de links in e-mails naar het juiste adres
   wijzen.
7. Meld de site aan bij Google Search Console en geef
   `https://jouwdomein.nl/sitemap.xml` door.

---

## 10. Een statische kopie maken

Wil je de winkel laten zien aan iemand die geen Node of npm heeft — of wil je
hem zelf rustig doorbladeren zonder een server te starten — dan maak je een map
met kale HTML-bestanden:

```bash
npm run build && npm run start      # in het ene terminalvenster
npm run export-html                 # in het andere
```

Je krijgt een map `html-kopie/`. Open daarin `index.html` en je klikt door de
hele site. De vormgeving, de lettertypen, de foto's en de links werken;
de winkelmand, het afrekenen, de zoekfunctie en de cookiemelding niet, want
daar is een server voor nodig. Bovenaan elke pagina staat een balkje dat dat
uitlegt.

Handig om door te sturen, of om de teksten na te lezen zonder afleiding. Voor
een winkel waar echt besteld kan worden, publiceer je het project (hoofdstuk 9).

### Alles in één bestand

Wil je liever één bestand dat je kunt mailen of appen:

```bash
npm run build && npm run start
npm run preview
```

Dat maakt `preview.html`: de hele winkel in één bestand, inclusief de opmaak,
de lettertypen en alle foto's. Je klikt er gewoon doorheen. De winkelmand en het
afrekenen staan erin als opname, op een eigen pagina, want die hebben een server
nodig.

---

## 11. Nog te doen voor livegang

De volledige lijst staat in **[LIVEGANG.md](LIVEGANG.md)**. In het kort:

- [ ] KvK-nummer en btw-nummer invullen in `src/data/site.ts`
- [ ] Echt e-mailadres en retouradres invullen in `src/data/site.ts`
- [ ] Juridische teksten laten nakijken (voorwaarden, privacy, cookies,
      herroepingsrecht)
- [ ] Mollie-account aanmaken en de live sleutel plaatsen
- [ ] Resend-account koppelen en de DNS-records zetten
- [ ] Instagram-foto's plaatsen in `public/images/`
- [ ] Voorraad controleren in `src/data/products.ts`
- [ ] Eén proefbestelling doen met een echte betaling
