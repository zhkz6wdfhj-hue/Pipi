# Wat er nog handmatig moet gebeuren

De winkel is af en draait. Wat hieronder staat kan alleen jij doen: het gaat om
gegevens en accounts die niet te verzinnen zijn. Loop de lijst van boven naar
beneden door; elk punt zegt waar je moet zijn en waarom het nodig is.

---

## 1. Je bedrijfsgegevens invullen — 10 minuten

**Waar:** `src/data/site.ts`. Zoek in dat bestand op `INVULLEN`.

| Wat                | Nu                       | Waarom het nodig is                                                     |
| ------------------ | ------------------------ | ----------------------------------------------------------------------- |
| KvK-nummer         | `INVULLEN-KVK-NUMMER`    | Wettelijk verplicht op een webwinkel; staat in de footer en de voorwaarden |
| Btw-nummer         | `INVULLEN-BTW-NUMMER`    | Wettelijk verplicht; staat in de footer, de voorwaarden en de facturen  |
| Straat en postcode | `INVULLEN-…`             | Adres voor aanpassingen; staat op passen-en-aanpassen en in de voorwaarden |
| E-mailadres        | `hallo@melin-clo.nl`     | Waar klanten je bereiken; staat overal waar contact wordt aangeboden    |
| Afzenderadres      | `hallo@melin-clo.nl`     | Afzender van de bevestigingsmail                                        |
| Intern adres       | `bestellingen@melin-clo.nl` | Waar het besteloverzicht per bestelling naartoe gaat                 |

Deze waarden staan op één plek en worden overal vandaan gelezen — je hoeft ze dus
maar één keer aan te passen.

---

## 2. Juridische teksten laten nakijken — reken op een week

De vier pagina's onder `/juridisch/` bevatten volledige Nederlandse
conceptteksten, geschreven naar Nederlands en Europees consumentenrecht.

**Laat vooral het herroepingsrecht nakijken.** Omdat alles op maat wordt
gemaakt, gaan de teksten ervan uit dat de wettelijke uitzondering geldt: goederen
die volgens de specificaties van de consument zijn vervaardigd (artikel 6:230p
BW). Er is dus geen bedenktijd van veertien dagen. Dat is verdedigbaar en
gebruikelijk bij maatwerk, maar het is precies het soort bepaling waar een
jurist naar moet kijken — zeker omdat een verkeerde toepassing je duur kan komen
te staan. Laat meteen meekijken of onze eigen belofte ("kosteloos aanpassen tot
het past") staat zoals je hem bedoelt.

De pagina's:

- Algemene voorwaarden
- Privacyverklaring
- Cookiebeleid
- Herroepingsrecht, met de uitzondering voor maatwerk

Ze zijn **niet door een jurist opgesteld**. Bovenaan elke pagina staat daarom een
zichtbare notitie. Laat de teksten nakijken door een jurist of gebruik een
gecontroleerde modeltekst (Thuiswinkel.org en de Consumentenbond hebben die), en
haal daarna de notitie weg. Die staat in
`src/components/layout/page-header.tsx`, in het onderdeel `LegalNotice` — je
verwijdert de aanroep `<LegalNotice />` van de vier pagina's.

Let bij het nakijken in elk geval op: het beroep op de maatwerkuitzondering, het
moment waarop annuleren niet meer kan, de termijn van dertig dagen voor
aanpassingen, de bewaartermijnen in de privacyverklaring en de lijst met partijen
waarmee je gegevens deelt.

---

## 3. Betaalaccount aanmaken — 1 tot 5 werkdagen

1. Account aanmaken op <https://www.mollie.com>. Je hebt je KvK-nummer, een
   zakelijke rekening en een identiteitsbewijs nodig.
2. Wachten op de controle door Mollie.
3. Betaalmethoden aanzetten: iDEAL, Bancontact en eventueel creditcard.
4. De **testsleutel** (`test_…`) in `.env.local` zetten en een paar bestellingen
   doorlopen.
5. De **live sleutel** (`live_…`) in Vercel zetten, niet in een bestand dat je
   commit.

De uitgebreide uitleg staat in README.md, hoofdstuk 6.

---

## 4. E-mail koppelen — 1 dag (wachten op DNS)

1. Account aanmaken op <https://resend.com>.
2. Je domein toevoegen en de SPF-, DKIM- en DMARC-records bij je domeinprovider
   zetten. Zonder die records belanden je bevestigingsmails in de spamfolder.
3. `RESEND_API_KEY` in Vercel zetten.
4. Een proefbestelling doen en controleren of de mail aankomt — kijk ook even in
   Gmail én in Outlook, die gedragen zich verschillend.

---

## 5. Je eigen foto's plaatsen — een dagdeel

In `public/images/` staan nu placeholdertekeningen. Vervang ze door de foto's uit
Instagram; README.md hoofdstuk 4 legt uit hoe je ze in originele kwaliteit
downloadt en op welke verhouding je moet bijsnijden (4:5 voor producten, 3:2 voor
sfeerbeelden).

Vergeet de **alt-teksten** niet: die staan bij elke foto in
`src/data/products.ts` en worden voorgelezen door schermlezers.

---

## 6. Producten en levertijd controleren — 15 minuten

Loop `src/data/products.ts` door en controleer per model:

- klopt de prijs (alles staat nu op € 400);
- kloppen de kleuren;
- klopt de samenstelling, de voering en de standaardlengte;
- staat het juiste viertal op `featured: true` voor de homepage.

Controleer daarna in `src/data/site.ts`:

- **de levertijd** — die staat op vier tot zes weken. Overleg met je atelier of
  dat haalbaar is; hij staat op de productpagina, bij het afrekenen, op de
  bedankpagina en in de bevestigingsmail;
- **binnen hoeveel werkdagen je contact opneemt** voor de maten — nu twee;
- **binnen hoeveel dagen een klant een aanpassing moet melden** — nu dertig.

En in `src/data/measurements.ts`: de zeven maten die je opneemt. Vraagt je
atelier er meer of andere, pas de lijst dan aan.

---

## 7. Domein en publiceren — een halve dag

1. Project op Vercel zetten (README.md, hoofdstuk 9).
2. Eigen domein koppelen en het https-certificaat laten aanmaken.
3. `NEXT_PUBLIC_SITE_URL` op je echte domein zetten en opnieuw publiceren.
4. Site aanmelden bij Google Search Console en de sitemap doorgeven.

---

## 8. Eén echte proefbestelling — 15 minuten

Met de live sleutel, een echt bedrag en je eigen bankrekening. Controleer:

- [ ] De betaling komt binnen in je Mollie-dashboard.
- [ ] De bevestigingsmail komt aan bij de klant.
- [ ] Het interne besteloverzicht komt aan bij jou.
- [ ] De bedankpagina toont het juiste ordernummer en de juiste levertermijn.
- [ ] Storneer of stort het bedrag daarna terug.

---

## Wat je bewust nog niet hebt

Deze dingen zitten er niet in, en dat is een keuze — geen omissie. Wil je ze
alsnog, dan is het duidelijk waar je moet beginnen:

- **Klantaccounts.** Bestellen kan zonder account. Dat scheelt de klant gedoe en
  jou een berg persoonsgegevens.
- **Maten invullen tijdens het bestellen.** Je hebt gekozen om de maten ná de
  bestelling op te nemen, dus het bestelscherm vraagt er niet naar. Wil je dat
  later toch, dan komen er velden bij in stap twee van het afrekenen.
- **Voorraadbeheer.** Niet nodig: er wordt niets vooruit gemaakt.
- **Bestellingen in een database.** Ze staan nu in `.data/orders.json`. Op Vercel
  is dat bestandssysteem tijdelijk; zie README.md hoofdstuk 8 voor de stap naar
  een echte database.
- **Statistieken.** De cookiemelding heeft de knop al; het script zelf staat leeg
  in `src/components/layout/cookie-banner.tsx`, in de functie
  `laadStatistieken`.
- **Meerdere talen.** De hele site is Nederlands.
