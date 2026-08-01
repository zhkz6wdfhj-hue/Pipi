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
| Straat en postcode | `INVULLEN-…`             | Retouradres; staat op de retourpagina en in het herroepingsformulier    |
| E-mailadres        | `hallo@melin-clo.nl`     | Waar klanten je bereiken; staat overal waar contact wordt aangeboden    |
| Afzenderadres      | `hallo@melin-clo.nl`     | Afzender van de bevestigingsmail                                        |
| Intern adres       | `bestellingen@melin-clo.nl` | Waar het besteloverzicht per bestelling naartoe gaat                 |

Deze waarden staan op één plek en worden overal vandaan gelezen — je hoeft ze dus
maar één keer aan te passen.

---

## 2. Juridische teksten laten nakijken — reken op een week

De vier pagina's onder `/juridisch/` bevatten volledige Nederlandse
conceptteksten, geschreven naar Nederlands en Europees consumentenrecht:

- Algemene voorwaarden
- Privacyverklaring
- Cookiebeleid
- Herroepingsrecht, met het officiële modelformulier

Ze zijn **niet door een jurist opgesteld**. Bovenaan elke pagina staat daarom een
zichtbare notitie. Laat de teksten nakijken door een jurist of gebruik een
gecontroleerde modeltekst (Thuiswinkel.org en de Consumentenbond hebben die), en
haal daarna de notitie weg. Die staat in
`src/components/layout/page-header.tsx`, in het onderdeel `LegalNotice` — je
verwijdert de aanroep `<LegalNotice />` van de vier pagina's.

Let bij het nakijken in elk geval op: je exacte bedenktijd, de retourkosten die
je noemt, de bewaartermijnen in de privacyverklaring en de lijst met partijen
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

## 6. Voorraad en prijzen controleren — 15 minuten

Loop `src/data/products.ts` door en controleer per model:

- klopt de prijs;
- klopt de voorraad per kleur en maat;
- klopt de samenstelling en de lengte;
- staat het juiste viertal op `featured: true` voor de homepage.

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
- **Automatisch afboeken van voorraad.** Bij deze aantallen werkt handmatig
  bijwerken prima. Het interne besteloverzicht herinnert je eraan.
- **Bestellingen in een database.** Ze staan nu in `.data/orders.json`. Op Vercel
  is dat bestandssysteem tijdelijk; zie README.md hoofdstuk 8 voor de stap naar
  een echte database.
- **Statistieken.** De cookiemelding heeft de knop al; het script zelf staat leeg
  in `src/components/layout/cookie-banner.tsx`, in de functie
  `laadStatistieken`.
- **Meerdere talen.** De hele site is Nederlands.
