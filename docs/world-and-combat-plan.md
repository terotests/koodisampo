# Koodisampo — maailma, sosiaalinen simulaatio ja selviytyminen

> Suunnitelmadokumentti. Tämä ei ole toteutusspec vaan jaettu suunta ja muistilista.
> Nykyinen peli: tarinat + karma-featuret (`docs/story-schema.md`).
> Tämä dokumentti kuvaa seuraavan suuren kerroksen.

## Visio yhdellä lauseella

**Corporate NetHack** — ASCII-labyrintti kuin NetHack, mutta “hirviöt” ovat **ihmisiä, rooleja ja organisaatioilmiöitä**. Painopiste: **sosiaalinen simulaatio + oppiminen + selviytyminen**, ei perinteinen RPG-taistelu. Osaaminen on valuuttaa; ihmiset ovat vaarallisempia kuin lohikäärmeet.

| Kerros | Teema |
|--------|-------|
| **Toimistolabyrintti** | Roolit, prosessit, organisaatio |
| **Tekninen osaaminen** | C++-kirjat, koodikatselmukset, feature-karma |

> Ei enää “opetuspeli” vaan peli jossa C++-kirjat, kohtaamiset, huumori, AI ja satiiri ovat **yksi mekaniikka**.

---

## 0. Peligenre ja maailman nimi

**Fiilis:** valtava **yrityslabyrintti**, jossa korkean tason “hirviöt” eivät ole goblineja vaan **kokous, asiakas, auditointi, tuotanto perjantaina klo 16:55**.

Työnnä nimeä vielä — ehdotuksia:

| Nimi | Sävy |
|------|------|
| **Corporate NetHack** | suora vertauskuva |
| **OfficeHack** | retro |
| **CorporateMUD** | MUD-perinne |
| **ProjectQuest** | quest + projekti |
| **Koodisampo** | yläbrändi |

---

## 0b. Suunnannmuutos — pois taistelusta

| ❌ Vanha painopiste | ✅ Uusi painopiste |
|--------------------|-------------------|
| RPG-taistelu, HP, “loitsu osuu” | **Sosiaalinen kohtaaminen** — valintoja ja seurauksia |
| Oppimiskysymys itsenäisenä | Oppiminen **palvelee** keskustelua ja selviytymistä |
| XP suoraan kirjasta | Kirja **avaa dialogivaihtoehtoja** |
| Vihollinen = monsteri | Vihollinen = **rooli + persoonallisuusluvut** |

**Perinteinen taistelu poistetaan lähes kokonaan.** Ei HP-palkkeja NPC:illä. Konflikti ratkeaa: perustelu, väistely, huumori, AI, pakoyritys — ja **Stamina** / **Karma** / **Suspicion**.

---

## Periaatteet (muista nämä päätöksenteossa)

| Periaate | Merkitys |
|----------|----------|
| **Ei tasoja** | Ei “level 3/5”. Osaaminen = feature-karma + inventaario. |
| **Positiivinen oppiminen** | Jokainen uusi feature on voitto; inventaario näyttää mitä osaat. |
| **Häviö ei nollaa kaikkea** | Kuolema = aloita liikkuminen maailmassa alusta; **kirjat, rahat, opitut featuret säilyvät**. |
| **Yllätys ≠ arvaamaton** | Taistelussa testataan jo opittua, mutta **eri kulmasta** kuin oppitunnilla. |
| **Guru ≠ pakollinen** | Oppitunnit ja tarinat toimivat itsenäisesti; guru tarjoaa **salaista** ja **vaihtoehtoisen esitystavan**. |
| **Asiakas on erikoistapaus** | Harvinainen; **yksi vakava virhe = välitön kuolema** (spawn, omaisuus säilyy) |
| **Roolit = huumori + oppiminen** | SM, arkkitehti jne. testaavat oikeita featureitä — ei pelkkää vitsiä |
| **Ei grindia ilman oppimista** | Jokainen vihollinen esittää **oikean kysymyksen**; oikea vastaus → karma/loot |
| **Kirja = oikea opetus** | **1–2 sivua tiukkaa asiaa** per kirja/ luku — C++ ensin; lukeminen antaa karmaa vasta kun sisäistetty |
| **Tekoäly ei korvaa oppimista** | AI-vastaus mahdollinen, mutta **vähemmän karmaa**; jää kiinni → **paha karma** |
| **Huumori voi ratkaista — tai räjäyttää** | Vitseillä voi yrittää välttää konfliktia; ei aina toimi |
| **Data ajettavissa** | Maailma, hahmot, esineet, kirjat, heittolauseet JSON:na |

> **Päivitetty suunta (Corporate NetHack):** alla olevat rivit korvataan asteittain — katso **§0b** ja **§0c**.

---

## 0c. Pelaajan ominaisuudet (ei STR/DEX)

Perinteisen RPG:n sijaan **sosiaalis-tekniset** statit (0–100 tai kasvava; ei "taso 5").

| Ominaisuus | Vaikutus |
|------------|----------|
| **Knowledge** | Tekninen osaaminen — mitä feature-id:jä / kirjoja hallitset |
| **Wisdom** | Oikeiden päätösten todennäköisyys; vähentää huonoja valintoja |
| **Humor** | Vitsien onnistuminen, tunnelman keventäminen |
| **Diplomacy** | Konfliktin rauhanomainen päätös, neuvottelu |
| **Courage** | Uskallus puhua suoraan (arkkitehti, CEO, asiakas) |
| **Focus** | Kyky opiskella kirjoja (nopeus / stamina-kustannus) |
| **Karma** | Maine maailmassa — avaa/sulkee ovia |
| **Stamina** | Kuinka monta **kohtaamista** jaksat per "päivä" / jakso |

**Knowledge** linkitetään käytännössä nykyiseen `features`-storeen + luettuihin kirjoihin. Muut statit oma store tai laskettu käyttäytymisestä.

---

## Nykytila (v1) — mitä on jo

```
[Tarinalista] → [Story JSON] → tehtävät → karma featureihin (IndexedDB)
```

- Feature-id:t: `cpp:auto`, `cpp:unique-ptr`, …
- Ei karttaa, inventaariota, kohtaamismoottoria, pelaajastatteja, rahaa

**Tarinat säilyvät** onboardingina / erillisenä tilana. Maailma on pääpeli — encounter-pohjainen.

---

## Kokonaisarkkitehtuuri (tuleva)

```
                    ┌─────────────────┐
                    │   Päävalikko    │
                    └────────┬────────┘
           ┌─────────────────┼─────────────────┐
           ▼                 ▼                 ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │  Tarinat    │   │  Maailma    │   │ Inventaario │
    │  (legacy)   │   │  (kartta)   │   │  + kirjat   │
    └──────┬──────┘   └──────┬──────┘   └──────▲──────┘
           │                 │                 │
           │          ┌──────▼──────┐          │
           │          │ Encounter   │          │
           │          │ (dialogi)   │          │
           │          └──────┬──────┘          │
           └──────── karma / features / stats ─┘
                         IndexedDB
```

---

## 1. Inventaario

### Mitä pelaaja näkee

- **Osaamani** — featuret joissa karma > 0 (jo olemassa, laajennetaan)
- **Puuttuu / heikko** — featuret joita maailma tai guru vaatii, mutta karma on 0 tai alle kynnysarvon
- **Esineet** — kulutettavat, pysyvät, ajoneuvot; buffit ja riskit (suklaapatukka → hampaat)
- **Rahat** — *hopeakolikko* / *budjettimerkki* (flavor vaihtelee kartalla)

### Käyttö kohtaamisissa

Inventaario ei ole vain lista — se **rajoittaa ja mahdollistaa** vastauksia:

| Tilanne | Esimerkki |
|---------|-----------|
| Osaat featuren | Näkyy **Perustele**-vaihtoehto (choice/code) |
| Et osaa | Vain väistely, huumori, AI tai pakoyritys |
| Kirja luettu + checkpoint | Uusi dialogivaihtoehto (ei näy ilman kirjaa) |
| Kahvi / esine | +Stamina tai +Focus yhden kohtaamisen ajaksi |

### Data (luonnos)

```typescript
// IndexedDB — laajennus
type Inventory = {
  coins: number;
  books: string[];
  scrolls: string[];
  items: { itemId: string; quantity: number; durability?: number }[];
  equipped?: {
    vehicle?: string;      // esim. sähköpyörä
    cloak?: string;        // näkymättömyysviitta
    accessory?: string;
  };
  statusEffects?: string[]; // esim. "hammas_kipea", "kofeiiniboost"
};

// Osaaminen = jo olemassa oleva features-store
```

### UI-luonnos

- Välilehdet: **Loitsut** (featuret) | **Kirjat** | **Tavarat** | **Tila** (buffit / haitat)
- Feature-chip: nimi + karma
- Harmaa haamu-chip: feature jota vastustaja käyttää, sinulla karma 0

---

## 1b. Hahmojen hierarkia ja roolit

### Uhkatasot (ei “tasoja” — kuvailee tilanteen vakavuutta)

| Taso | Nimi | Fiilis | Esimerkkejä |
|------|------|--------|-------------|
| 🟡 | **Arkinen vihollinen** | Satunnainen tehtävä | Työkaveri, testauspäällikkö |
| 🟡 | **Keskikova** | Ystävällinen tai vihamielinen | Middle manager (et tiedä ennen dialogia) |
| 🟠 | **Tekninen kova** | Feature-spesifi | Tietoturvaguru, arkkitehti |
| 🔴 | **Miniboss** | Erikoisloitsu, liikkumisen esto | Scrum Master, PO, lakimies, hankintapäällikkö |
| 🔴 | **Boss** | Monivaiheinen | Projektipäällikkö, CEO |
| 💀 | **Legendaarinen** | Instant death -riski | **Asiakas** |
| ☠️ | **Endgame-uhka** | “Oikea elämä” -vitsi, erittäin vaarallinen | Kokous, auditointi, prod perjantai 16:55 |

### Laajennetut `kind`-arvot

| kind | Kuvaus |
|------|--------|
| `guru` | Opettaa, myy, haastaa — C++ tai ala-guru |
| `role` | Toimistorooli (SM, PO, PM) — dialogi + erikoistaistelu |
| `coworker` | Pieni monsteri / satunnainen tehtävä |
| `middle_manager` | `alignment`: `friendly` \| `hostile` (kartta tai päiväarvo) |
| `customer` | **Instant death** -säännöt (alla) |
| `boss` | CEO, harvinaiset finaalit |
| `merchant` | Kauppa |
| `orc` | Geneerinen vihamielinen (C++-örkki) |
| `neutral` | Vihje, lore |
| `portal` / `shrine` | (kuten ennen) |

### ASCII-merkit ja värit (ehdotus)

| Merkki | Hahmo | Väri (CSS) |
|--------|-------|------------|
| `G` | C++ guru | kulta `#c9a227` |
| `S` | Scrum Master | oranssi `#e07b39` |
| `P` | Projektipäällikkö | tumma sininen `#3d5a80` |
| `O` | Product Owner | vihreä `#4a9b6d` |
| `M` | Middle manager | harmaa `#9a9588` (vaihtuu punertavaan jos hostile) |
| `L` | Lakimies | tumma violetti `#5a4a7b` |
| `H` | Hankintapäällikkö | oliivi `#6b7b4a` |
| `C` | **Asiakas** | purppura `#7b2d8e` — harvinainen |
| `$` | **CEO** | kulta + varjo, isompi dialogikehys |
| `A` | Arkkitehti | syaani `#2a8a9b` |
| `X` | Tietoturvaguru | punainen `#9b4a4a` |
| `c` | Työkaveri | vaaleanharmaa |
| `t` | Testauspäällikkö | keltainen |
| `d` | Toimistokoira | ruskea `#8b6914` |
| `r` | Aulasihteeri | vaaleansininen |
| `o` | C++ örkki | punainen |

---

## 1c. Bestiary — roolit, olennot ja flavor

> Jokainen kohtaaminen = **sosiaalinen tilanne** jossa osaaminen ratkaisee. Ei HP:tä — **persoonallisuusluvut** (0–100).

### Tavalliset roolit ja neutraalit

| Hahmo | Flavor | Kohtaaminen |
|-------|--------|-------------|
| **Työkaveri** (`c`) | Satunnainen tehtävä | Perustele / väistele; pieni karma |
| **Testauspäällikkö** (`t`) | *"Löysin yhden pienen bugin…"* | 1–3 kierrosta; assertit, testit |
| **Middle Manager** (`M`) | Vittumaisuus 85, Persistence 95 | *"Voitaisiin vielä nopeasti palata tähän asiaan."* — seuraa 15 vuoroa |
| **Tietoturvaguru** (`X`) | AI-awareness korkea | Havaitsee ChatGPT-vastaukset; *"Kirjoititko tämän itse?"* |
| **Arkkitehti** (`A`) | Knowledge 95, Ego 90, Humor 20 | Perustele / Vitsaile / Käytä AI:ta / Pakene |
| **Toimistokoira** (`d`) | Ei uhka | **Morale-buffi** |
| **Aulasihteeri** (`r`) | Ei uhka | Salaiset kulkureitit, kahvimyynti |

### Harvinaiset minibossit

| Hahmo | Erikoisloitsu | Mekaniikka |
|-------|---------------|------------|
| **Scrum Master** (`S`) | *"Pakollinen Daily Meeting"* | Estää liikkumisen N vuoroa |
| **Product Owner** (`O`) | *"Scope change"* | Muuttaa tehtävän vaatimuksia **kesken kohtaamisen** |
| **Lakimies** (`L`) | *"Dokumentaatiohyökkäys"* | Pitkä **tekstimuotoinen** tehtävä (GDPR, lisenssit) |
| **Hankintapäällikkö** (`H`) | *"Hankintalaki"* | Estää item-ostot; prosessikysymyksiä |

### Bossit

| Hahmo | Loitsu | Huomio |
|-------|--------|--------|
| **Projektipäällikkö** (`P`) | *"Aikatauluttaa kuolemasi"* | Lyhenevä aika joka kierroksella |
| **CEO** (`$`) | **"Strateginen Muutos"** | Loppukohtaus; monivaiheinen dialogi |

### Maailman vaarallisimmat olennot (ei asiakas ensisijaisesti)

| Uhka | Tyyppi | Profiili |
|------|--------|----------|
| **Legacy System** | `environment` / `boss` | Ikä 27 v, dokumentaatio puuttuu, omistaja tuntematon. Humor 0, Persistence 100, Vittumaisuus 100 |
| **Production Incident** | **maailmatapahtuma** (ei NPC) | Kaikki NPC:t aggressiivisiksi, asiakkaat spawn, CEO herää — selviytymiskauhu |
| **Asiakas** (`C`) | Harvinainen rooli | Edelleen instant death -riski väärällä vastauksella |

#### Legacy System

```text
Ikä: 27 vuotta
Dokumentaatio: puuttuu
Omistaja: tuntematon
Humor: 0
Persistence: 100
Vittumaisuus: 100
```

Ei "tapeta" HP:llä — pelaaja **selviytyy** lukemalla, refaktoroimalla (tehtävät), tai pakoon (harvinaista).

#### Production Incident

Kun spawnittaa:

- Kaikki NPC:t muuttuvat aggressiivisiksi (`vittumaisuus` +30 tilapäisesti)
- Asiakkaat ilmestyvät kartalle
- CEO herää
- Stamina-kulutus kaksinkertaistuu
- Musiikki / UI vaihtuu "hätätila"-teemaan

> Kokous, auditointi, prod perjantai 16:55 — edelleen endgame-uhkia saman **selviytymis**-kehyksen alla.

### C++-puoli (Kalevala-luolastot)

Raakamuistin örkki, NULL-haamu, Segfault-susi — sama moottori, eri flavor. Gurut = mentor-bossit + kirja.

```json
{
  "id": "entity-customer",
  "kind": "customer",
  "char": "C",
  "instantDeathOnWrong": true,
  "rarity": "legendary",
  "onSpawn": { "npcFlee": true, "music": "customer-theme" },
  "features": ["process:stakeholder", "soft:expectations"]
}
```

---

## 1d. Esineet (items)

### Periaate

- Esineet ovat **JSON-määriteltyjä** kuten entityt
- Tyypit: `consumable` | `equipment` | `vehicle` | `curse` (haitallinen mutta houkutteleva)
- Voivat vaikuttaa: liike, taistelu, wisdom (helpottaa tehtäviä), näkyvyys, HP

### Kulutustavarat

| Esine | Efekti | Riski |
|-------|--------|-------|
| ☕ Kahvikuppi | +Wisdom, +Focus | 3× → jitter |
| 🥤 Batterytölkki | +Speed taistelussa | Myöhemmin -Health (crash) |
| 🍫 Suklaapatukka | +Morale | `hammas_kipea` / hammaslääkärikäynti |
| 🍌 Banaani | Poistaa väsymystä | — |
| 🍕 Kylmä pizza | Palauttaa energiaa | — |

### Harvinaiset / legendaariset

| Esine | Efekti |
|-------|--------|
| 🦺 Näkymättömyysviitta | Vältä MM:t; **Asiakas näkee silti** taistelussa |
| 🚲 Sähköpyörä | Nopeampi liikkuminen; **akku loppuu** |
| 🎧 Vastamelukuulokkeet | Immuuni meetingeille; vähentää “kommunikointia” (flavor) |
| 💻 Legendaarinen läppäri | +ohjelmointi-buffi; kaatuu satunnaisesti Windows-päivitykseen |
| 🔑 VPN-avain | Avaa salaiset alueet |
| 🖨️ Tulostimen pyhä ajuri | **Harvinaisin** esine koko pelissä |

### Aiemmin listatut (säilyvät)

Kumiankka, post-it, CI-kello, kultainen avainkortti, hammasharja, refaktorointivasara, mekaaninen näppis, legacy-käärö…

### Esine-JSON (luonnos)

```json
{
  "id": "coffee-cup",
  "name": "Kahvikuppi",
  "type": "consumable",
  "char": "☕",
  "effects": {
    "wisdomBoost": 1,
    "hintCharges": 1,
    "durationTurns": 3
  },
  "overdose": {
    "afterStack": 3,
    "applyStatus": "jitter"
  }
}
```

### Wisdom (viisaus) — mekaniikka

- **Ei erillinen taso** — laskuri tai buffi inventaariosta
- Kahvi / kirjat / ystävällinen MM lisäävät `wisdom` tilapäisesti
- Vaikutus: näytä yksi väärä vastaus vähemmän, tai korosta oikeaa featurea inventaariossa
- Näkyy UI:ssa hiljainen kuvake, ei “LVL UP”

---

## 1f. Kiroukset ja debuffit (maailman “paha karma”)

Pelin omat **statuskiroukset** — erillään feature-karmasta, mutta vaikuttavat pelaamiseen.

| Kirous | Efekti | Lähde |
|--------|--------|-------|
| **Pakollinen Teams-palaveri** | Et voi liikkua 10 vuoroa | Scrum Master, satunnainen event |
| **Legacy-järjestelmä** | Kaikki tehtävät vaikeampia (piilota vihjeitä) | Vanha kartta-alue |
| **Tekninen velka** | Kasvaa passiivisesti; spawnaa uusia örkkejä jos ei “maksa” opiskelemalla | PO-loitsu, laiminlyönti |
| **Scope creep** | PO muuttaa aktiivisen questin | Product Owner |
| **MFA Required** | Ovi lukossa kunnes vastaat turvakysymykseen | Tietoturvaguru |
| **Strateginen muutos** | Sekoittaa karttaa / kysymyksiä | CEO |
| **Hammaslääkärikäynti** | Typo-riski kooditehtävissä | Suklaapatukka |

Tekninen velka voisi olla **näkyvä luku** inventaariossa — maksetaan pois suorittamalla related feature -tehtäviä (oppiminen, ei grind).

---

## 1e. Kartta-alueet (laajennus)

| Kartta-id | Teema | Tyypilliset hahmot |
|-----------|-------|-------------------|
| `corporate-hq` | Päätoimisto (3 kerrosta) | sihteeri, mentor, hissi |
| `open-office` | Avokonttori | työkaveri, PM, harhailija |
| `sprint-huone` | Agile | SM, PO, testauspäällikkö |
| `security-kerros` | Tietoturva | tietoturvaguru |
| `architecture-silta` | Arkkitehtuuri | arkkitehti |
| `paakonttori-huippu` | Finale | CEO (lukittu) |
| `event-asiakas` | Erikoistapahtuma | **Asiakas** (harvoin) |

---

## 2. Maailma ja kartta

### Esitystapa

- **ASCII-ruudukko** (esim. 40×20), selain + näppäimistö tai napautus
- Ruutu: maasto + mahdollinen hahmo
- Väri CSS-luokilla (ei pakko ANSI-termitä)

### Maastotyypit (esimerkkejä)

| Merkki | Tyyppi | Käyttäytyminen |
|--------|--------|----------------|
| `.` | lattia | kävellä |
| `#` | seinä | ei kävellä |
| `=` | työpöytä | kävellä |
| `E` | hissi | kerroksen vaihto (1–3) |
| `@` | pelaaja | — |
| `G` | mentor | NPC, oppitunti |
| `K` | kahvihuone | tauko, satunnainen kohtaaminen |
| `S` `P` `O` `M` `C` `$` | roolit | toimisto (ks. taulukko yllä) |
| `o` | häirikkö | vihamielinen / harhailija |
| `?` | tuntematon | paljastuu lähestyttäessä |

### Liikkuminen

- Nuolinäppäimet / WASD
- Jokainen siirto = yksi “askeleaika” (myöhemmin: nälkä, päiväkierto — **ei v1**)
- **Spawn-piste** maailman alussa tai viimeisestä turvatalosta

### Karttatiedosto (JSON-luonnos)

```json
{
  "id": "tuonela-ranta",
  "title": "Tuonelan ranta",
  "width": 48,
  "height": 24,
  "legend": { ".": "grass", "~": "water" },
  "rows": [
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    "~~~~~~~~~~~~~~~....T....~~~~~~~~~~~~~~~~~~~~~~~~",
    "..."
  ],
  "entities": [
    {
      "id": "guru-constexpr",
      "char": "G",
      "x": 12,
      "y": 8,
      "template": "guru-cpp-constexpr"
    }
  ],
  "spawn": { "x": 4, "y": 10 }
}
```

### Maailman luonti — vaiheet

1. **Käsin tehdyt kartat** JSON:na (nopein alku)
2. **Editori** myöhemmin (visuaalinen tai Tiled-tyylinen export)
3. **Proseduraalinen** osa — metsä, örkkejä satunnaisesti (myöhemmin)

---

## 3. ASCII-hahmot (entity template)

Jokaisella hahmolla on **template** — sama idea kuin story-solmut.

```json
{
  "id": "guru-cpp-constexpr",
  "kind": "guru",
  "char": "G",
  "color": "#c9a227",
  "name": "Constexpr-velho",
  "title": "C++ guru",
  "description": "Hänen partansa on compile-time.",
  "tags": ["cpp", "guru", "constexpr"],
  "personality": {
    "vittumaisuus": 40,
    "persistence": 20,
    "ego": 50,
    "humor": 60,
    "aiAwareness": 10,
    "behavior": "stationary"
  },
  "humorPool": "guru-cpp-constexpr",
  "onBump": "encounter-constexpr-intro",
  "offers": {
    "shop": ["book-constexpr-compact"],
    "duel": "encounter-guru-constexpr",
    "talk": "comm-constexpr-smalltalk"
  }
}
```

### Hahmoattribuutit (pakollinen jokaiselle entitylle) — **0–100**

| Attribuutti | Skaala | Vaikutus |
|-------------|--------|----------|
| **`vittumaisuus`** (Assholeness) | 0–100 | 0 = auttaa; 100 = aktiivisesti sabotoi |
| **`persistence`** (Takertuvuus) | 0–100 | 0 = unohtaa heti; 100 = seuraa kartan toiselle puolelle |
| **`ego`** | 0–100 | Korkea = kehuu, loukkaantuu helposti |
| **`humor`** (Huumorintaju) | 0–100 | Vaikuttaa toimiiko pelaajan vitsi |
| **`aiAwareness`** | 0–100 | Matala: *"Hienoa työtä!"* — Korkea: *"Kirjoittiko tämän ChatGPT?"* |
| **`behavior`** | enum | `stationary` · `patrol` · `wander` |

#### Esimerkkejä

| Hahmo | vittumaisuus | persistence | ego | humor | aiAwareness |
|-------|--------------|-------------|-----|-------|-------------|
| Toimistokoira | 5 | 80 | 10 | 40 | 0 |
| Middle Manager | 85 | 95 | 70 | 25 | 30 |
| Työkaveri | 30 | 10 | 40 | 50 | 20 |
| Arkkitehti | 60 | 60 | 90 | 20 | 40 |
| Tietoturvaguru | 50 | 70 | 60 | 15 | **95** |

#### Takertuvuus (esim. persistence 95)

- Kun huomaa pelaajan → flavor: *"Voitaisiin vielä nopeasti palata tähän asiaan."*
- Seuraa **N vuoroa** (esim. 15) riippuen `persistence`-arvosta
- Pako: näkymättömyysviitta, Diplomacy-onnistuminen, tai oikea vastaus encounterissa

### Hahmotyypit (`kind`) — lyhyt lista

Katso laajennetut tyypit kohdasta **1b**. Perus:

| kind | Käyttäytyminen |
|------|----------------|
| `guru` | Puhu / osta / haasta |
| `role` | SM, PO, PM, CEO |
| `middle_manager` | Friendly tai hostile (satunnainen) |
| `customer` | **Instant death** -säännöt |
| `coworker` | Pieni kohtaaminen / tehtävä |
| `merchant` | Kauppa |
| `orc` | C++-metafora (Memory Leak jne.) — encounter, ei taistelu |
| `environment` | Legacy System |
| `world_event` | Production Incident |
| `portal` / `shrine` | Siirtymä / spawn |

### "Bump" vs "interact"

- **Bump**: tunnistusteksti + encounter-valikko (Perustele / Väistele / …)
- **Ei automaattista taistelua** — vihamielisyys = dialogi, debuff, takertuminen

---

## 3b. Encounter — sosiaalinen kohtaaminen (ei taistelua)

Jokainen kohtaaminen on **encounter**. Nykyiset storyt **muutetaan** hahmokohtaisiksi encountereiksi.

### Esimerkki: Arkkitehti

```text
Knowledge: 95 (pelaajan tarvitsee kirjoja/featureitä)
Humor: 20
Persistence: 60
Ego: 90
```

Pelaajan valinnat:

| Valinta | Kuvaus |
|---------|--------|
| **Perustele** | choice/code — täysi knowledge gain jos oikein |
| **Väistele** | Diplomacy-check; vähentää konfliktia, ei opita |
| **Vitsaile** | Humor vs NPC humor — katso §3c |
| **Käytä AI:ta** | Katso alla |
| **Pakene** | Kuluttaa Staminaa; korkea persistence → seuraa |

```
┌─────────────────────────────────────┐
│  Arkkitehti (ego 90)                │
│  "Tämä ratkaisu on väliaikainen     │
│   samalla tavalla kuin Rooman       │
│   valtakunta oli väliaikainen."     │
├─────────────────────────────────────┤
│  [1] Perustele                      │
│  [2] Väistele                       │
│  [3] Vitsaile                       │
│  [4] Käytä AI:ta                    │
│  [5] Pakene                         │
└─────────────────────────────────────┘
```

| Tap | Knowledge / Karma | Riski |
|-----|-------------------|-------|
| **Oikea perustelu** | 100 % | Väärin → ego loukkaantuu, karma − |
| **Väistely** | 0–30 % | Tilanne jatkuu; persistence jatkaa seuraamista |
| **Huumori** | 30–70 % jos onnistuu | Korkea vittumaisuus → tilanne pahenee |
| **Tekoäly** | **`× 0.4`** normaalista | Suspicion + badKarma |
| **Pako** | 0 | Korkea persistence → seuraa N vuoroa |

### AI on oikea pelimekaniikka

AI voi kirjoittaa vastauksen, ratkaista tehtävän, ehdottaa arkkitehtuuria — mutta:

```text
knowledgeGainMultiplier = 0.4
```

**AI jää kiinni** jos vastauksessa:

- *"As a language model..."*
- liian täydellinen / geneerinen tyyli
- `aiAwareness` korkea NPC havaitsee → `+1 Suspicion`

Korkea Suspicion → Tietoturvaguru: *"Kirjoititko tämän itse?"*

### Karma (maine)

| Negatiivinen | Positiivinen |
|--------------|--------------|
| Valehtelu | Oikeat ratkaisut |
| AI:n väärinkäyttö | Auttaminen |
| Asiakkaan harhauttaminen | Vaikeiden ongelmien ratkaisu |

Erillinen `badKarma` / Suspicion store — **ei poista** opittua feature-karmaa.

### Nykyisten storyjen migraatio → encounterit

| Vanha story | Uusi muoto |
|-------------|------------|
| `modern-cpp-intro` | Constexpr-velho + Memory Leak -olento |
| `cpp-safety-*` | Guru/olento-pari per aihe |
| Tarinan `choice`-solmut | `encounter`-JSON:n `rounds` |

```json
{
  "id": "encounter-architect-raii",
  "entityTemplate": "architect",
  "modes": ["argue", "dodge", "humor", "aiAssist", "flee"],
  "unlockedOptions": [
    { "id": "explain-ownership", "requiresBook": "book-cpp-raii", "checkpoint": "ownership-understood" }
  ],
  "rounds": [{ "type": "choice", "feature": "cpp:unique-ptr", "tone": "condescending" }],
  "humorOutcomes": {
    "success": { "knowledgeMultiplier": 0.5, "message": "Hän hymyilee väkinäisesti." },
    "fail": { "vittumaisuusBoost": 20, "badKarma": 1 }
  },
  "aiAssist": { "knowledgeMultiplier": 0.4, "suspicionOnDetect": 1 }
}
```

---

## 3c. Heittolauseet ja vitsit (content-db) — **huumori aseena**

Huumori ei ole vain numero — **NPC-kohtaisia** rivejä `lines/`-kannasta.

### Esimerkkejä roolikohtaisista vitseistä

| Rooli | Esimerkki |
|-------|-----------|
| **Scrum Master** | *"Sprintti on kuin makkara. Kukaan ei halua nähdä miten se tehdään."* |
| **Arkkitehti** | *"Tämä ratkaisu on väliaikainen samalla tavalla kuin Rooman valtakunta oli väliaikainen."* |
| **Tietoturvaguru** | *"Salasana 'password123' on teknisesti salasana."* |

Onnistuminen: `player.Humor` × `entity.humor` × sopiva vitsi topicista → encounter helpottuu tai knowledge gain.

```
content/
  lines/
    cpp/auto.json
    cpp/nullptr.json
    process/scrum.json
    arch/layering.json
    humor/
      middle-manager-hostile.json
      testauspäällikkö.json
```

### Rivin rakenne

```json
{
  "id": "mm-joke-01",
  "topic": "process",
  "tags": ["deadline", "agile"],
  "speaker": "middle-manager",
  "vittumaisuus": ["ärsyyntynyt", "evil"],
  "type": "joke",
  "text": "Miksi Scrum Master ei käytä hissiä? — Koska sprintti on jo menossa.",
  "humorCheck": { "minHumorSetting": 0.4, "successChance": 0.6 }
}
```

| `type` | Käyttö |
|--------|--------|
| `joke` | Huumori-yritys |
| `bark` | Satunnainen huuto kartalla (`wander`) |
| `greeting` | Ensimmäinen bump |
| `threat` | Ennen konfliktia (korkea vittumaisuus) |
| `teach` | Kiltti guru selittää tiiviisti (linkki kirjaan) |

**Tavoite:** vähintään 10–20 riviä per major topic alussa; kasvaa iteratiivisesti.

---

## 4. Kohtaamisen tehtävätyypit (ei RPG-taistelua)

> **Vanha §4 (HP-taistelu) poistettu.** Tehtävät elävät encounterin sisällä — valinta "Perustele" avaa choice/code/text -kierroksen.

### Fiilis

Konflikti = **sosiaalinen tilanne** jossa osaaminen ratkaisee. Mitä vaarallisempi rooli tai tapahtuma (Legacy, Production Incident), sitä vaativampi tehtävä.

### Tehtävätyypit

| Tyyppi | `type` | Käyttö | Esimerkki |
|--------|--------|--------|-----------|
| **Monivalinta** | `choice` | Työkaveri, turvaguru | SQL Injection |
| **Koodin täydennys** | `code` | Memory Leak -olento | Täydennä `make_unique` |
| **Tekstivastaus** | `text` | Lakimies, prod-hätä | Kirjoita korjaava kysely |
| **Selitys** | `explain` | Arkkitehti, Legacy | Selitä ownership-malli (vaatii kirjan) |

```
Työkaveri        → choice
Arkkitehti       → choice + explain (jos book-cpp-raii luettu)
Tietoturvaguru   → choice + AI-suspicion
Legacy System    → explain + code (monivaiheinen)
Production Incident → text (hätä), aikaraja, Stamina-drain
```

### Kulku (ei vuoropohjaista HP:tä)

```
1. Bump → encounter-valikko
2. Pelaaja valitsee tavan (Perustele / Vitsaile / AI / …)
3. Tarvittaessa 1–N tehtäväkierrosta (choice/code/text)
4. Lopputulos: karma, knowledge, debuff, seuraaminen, tai "kuolema" (spawn)
```

### Häviön / epäonnistumisen seuraukset

| Tulos | Seuraus |
|-------|---------|
| Väärä perustelu | Karma −, ego/vittumaisuus pahenee |
| AI havaittu | +Suspicion, badKarma |
| Stamina 0 | Päivä ohi — pakko levätä / kahvi |
| Kriittinen virhe (Asiakas) | Välitön "kuolema" (spawn, omaisuus säilyy) |
| Onnistuminen | Feature-karma, mahdollinen loot, dialogi sulkeutuu |

### Encounter-tehtävä-JSON (luonnos)

```json
{
  "id": "round-architect-raii",
  "type": "choice",
  "requiresUnlock": "explain-ownership",
  "prompt": "Miksi raw pointer ei noudata referenssiarkkitehtuuria?",
  "choices": [
    { "id": "a", "text": "Ownership ei ole selvä", "correct": true },
    { "id": "b", "text": "Koska C++ on vanha" }
  ],
  "features": [{ "id": "cpp:unique-ptr" }]
}
```

## 5. Gurut, kauppa ja salainen tieto

### Vuorovaikutusvalikko (guru)

```
┌──────────────────────────────┐
│  Constexpr-velho             │
│  "Compile-time tai kuole."   │
├──────────────────────────────┤
│  [1] Keskustele              │
│  [2] Osta oppitunti (50 ₿)   │
│  [3] Haasta taisteloon       │
│  [4] Poistu                  │
└──────────────────────────────┘
```

### Kolme tiedon polkua

| Polku | Sisältö | Esitys |
|-------|---------|--------|
| **Tarinat / oppitunnit** | Perusfeaturet, lyhyet tehtävät | Nykyinen story-muoto |
| **Guru-kauppa** | Maksettu opetus, uusia feature-id:jä | Lyhyet dialogit + tehtävät |
| **Guru-salaisuus** | Vain voiton jälkeen tai korkea karma | **Kirja** + pitkät scrollit |
| **Onnistunut kohtaaminen** | Kirja / scrolli | Loot harvinaisesti |

### Kirjat — **oikea opetus, ei pelkkää flavoria**

> **Korjaus periaatteeseen:** kirja ei ole trofeo eikä “4 tunnin flavor”. Sen pitää sisältää **1–2 sivua tiukkaa, hyödyllistä asiaa**, jonka osaamisesta on **aidosti hyötyä** kohtaamisissa — avaa uusia dialogivaihtoehtoja.

**Alkufokus: C++** (moderni, cpp-best-practices -linjassa). Muut topicit myöhemmin samalla kaavalla.

#### Sisältövaatimukset per kirja

| Vaatimus | Kuvaus |
|----------|--------|
| Pituus | **~1–2 “sivua”** scrollattavaa (n. 400–900 sanaa + 2–4 koodiesimerkkiä) |
| Tiiviys | Ei jaarittelua — yksi käsite tai tiukka pari (esim. `unique_ptr` + `make_unique`) |
| Koodi | Ajantasainen C++17/20; kopioitavissa olevat esimerkit |
| Oppiminen | Luvun lopussa **1–3 tarkistuskysymystä** (choice/code) — karma vasta kun läpäiset |
| Yhteys peliin | `teachesFeatures` + `unlocks` — avaa dialogivaihtoehtoja encountereissa |

#### Esimerkki: oikea kirja vs väärä

| ❌ Väärin | ✅ Oikein |
|----------|----------|
| "Opiskelet 4 tuntia. +3 Intelligence." | 1 sivu: miksi `unique_ptr`, milloin `shared_ptr`, 3 koodiblokkia, 2 kysymystä |
| Pitkä tarina ilman syntaksia | Tiukka selitys + virheet joita näkee työssä |

#### Kirjoja luolastoista (C++ ensin)

| Kirja-id | Sisältö (tiukka) | ~sivut |
|----------|------------------|--------|
| `book-cpp-auto` | `auto`, type deduction, sudenkuopat | 1 |
| `book-cpp-nullptr-const` | `nullptr`, const-correctness, const& | 1.5 |
| `book-cpp-raii` | unique_ptr, make_unique, vector vs raw | 2 |
| `book-cpp-safety-casts` | static_cast, poikkeukset vs error codes | 1.5 |

**Tuleva laajennus** (vasta kun C++-kirjasto kunnossa):

| Kirja | Topic |
|-------|-------|
| SQL:n Kadonnut Tome | `sql` |
| Gitin Kielletty Käsikirja | `git` |
| … | … |

### Lukeminen → **avaa puheen** (ei suoraa XP:tä)

Kirjat ovat **tärkein oppimislähde**, mutta eivät anna kokemuspisteitä suoraan.

1. Pelaaja lukee **koko** tiiviin luvun (ei skip)
2. Vastaa lopun tarkistuskysymyksiin (checkpoint)
3. Checkpoint läpi → **unlock**-flagit (esim. `ownership-understood`)
4. Uudet **dialogivaihtoehdot** encountereissa — ilman kirjaa vaihtoehtoa **ei näy**

```
Luet "The RAII Codex" (2 sivua).

Checkpoint: milloin make_unique? → oikein
[✓] Ownership understood

Kohtaat Memory Leak -olennon:
  → uusi vaihtoehto: "Explain ownership model"
  (ilman kirjaa vaihtoehtoa ei listata)
```

Feature-karma tulee **oikeista vastauksista kohtaamisissa**, ei kirjojen lukemisesta itsessään — kirja pakottaa opiskelemaan jotta pystyt perustelemaan.

### Kirjan tekninen muoto

```json
{
  "id": "book-cpp-raii",
  "title": "RAII ja älykkäät osoittimet",
  "topic": "cpp",
  "pages": 2,
  "estimatedReadMinutes": 8,
  "teachesFeatures": ["cpp:unique-ptr", "cpp:make-unique", "cpp:std-vector"],
  "unlocks": [
    { "id": "ownership-understood", "dialogueOption": "explain-ownership" }
  ],
  "sections": [
    {
      "heading": "Älä jätä deleteä ihmisen vastuulle",
      "body": "Tiukka selitys (markdown)...",
      "codeSamples": [
        { "lang": "cpp", "code": "auto p = std::make_unique<Foo>();" }
      ]
    }
  ],
  "unlocks": [
    { "id": "ownership-understood", "dialogueOption": "explain-ownership" }
  ],
  "checkpoint": {
    "questions": [
      { "type": "choice", "prompt": "...", "feature": "cpp:make-unique" }
    ],
    "passRequired": true
  }
}
```

- UI: scrollattava lukunäkymä, koodiblokit syntaksivärillä
- Voidaan lukea **itsenäisesti** inventaariosta
- Taistelussa: “avaa kirja” kuluttaa vuoron

---

## 6. Talous (rahat)

- **Ansainta**: onnistuneet kohtaamiset, questit, auttaminen
- **Käyttö**: guru-opit, kauppiaat, mahdollinen “turvatalon” lepo
- **Ei pay-to-win**: raha ei osta karmaa suoraan, vain **sisältöä** (scrollit, vihjeitä)

Alkuarvo ja hinnat tasapainotetaan myöhemmin — dokumentoi testiarvot omaan taulukkoon kun toteutetaan.

---

## 7. Tekninen toteutus — ehdotettu jako

### Uudet tiedostotyypit

```
content/
  worlds/
  entities/         # personality, persistence, behavior, humorPool
  encounters/       # sosiaalinen kohtaaminen + tehtävät
  books/            # 1–2 sivun C++-oppikirjat + checkpoint
  lines/            # vitsit, barkit, uhkaukset
  items/
  world-events/   # Production Incident jne.
  question-banks/
```

### Uudet IndexedDB-storet

| Store | Sisältö |
|-------|---------|
| `features` | (olemassa) hyvä karma / osaaminen |
| `badKarma` / `suspicion` | AI kiinni, vale, epäonnistunut huumori |
| `playerStats` | Knowledge, Wisdom, Humor, Diplomacy, Courage, Focus, Stamina |
| `unlocks` | Kirjojen checkpoint-flagit → dialogivaihtoehdot |
| `inventory` | rahat, kirjat (luetut), esineet |
| `world-state` | kartta, NPC sijainnit, wander-polut |
| `encounter-log` | (valinnainen) |

### Uudet UI-komponentit (prioriteettijärjestys)

1. `WorldMapView` — ruudukko, liike, bump
2. `EntityDialog` — guru-valikko
3. `InventoryPanel` — laajennettu feature-näkymä
4. `EncounterView` — Perustele / Väistele / Vitsaile / AI / Pakene + tehtäväkierrokset
5. `BookReader` — **1–2 sivun** tiukka opetus + checkpoint (ei pelkkä scroll)

### Reititys (laajennus nykyiseen history-API:in)

```
/                    tarinalista
/play/:storyId/...   tarina (olemassa)
/world               maailman valinta
/world/:mapId        kartta (x, y query tai state)
/inventory           inventaario
/scroll/:scrollId    lukunäkymä
```

---

## 8. Toteutusvaiheet (roadmap)

### Vaihe A — Inventaario ja näkyvyys

- [ ] Inventaario: featuret + puuttuvat
- [ ] **Ensimmäinen oikea kirja** `book-cpp-auto` (1 sivu tiukkaa + checkpoint)
- [ ] `badKarma` store (valmiina, käyttö myöhemmin)

### Vaihe A2 — Story → encounter -migraatio (sisältö)

- [ ] Jaa nykyiset storyt hahmoille (`personality`, `vittumaisuus`)
- [ ] Luo `encounters/` nykyisten `choice`/`code`-solmujen pohjalta
- [ ] Aloita `lines/cpp/*.json` (min. 10 riviä / topic)

**Arvio**: 1–2 sessiota

### Vaihe B — Staattinen kartta + liike

- [ ] Yksi testikartta JSON:na
- [ ] Pelaaja `@`, törmäys seinään
- [ ] Bump NPC:hen → dialogi (teksti vain)
- [ ] World-state IndexedDB:hen
- [ ] Kuolema-konsepti: “palaa spawniin” ilman omaisuuden menetystä

**Arvio**: 2–3 sessiota

### Vaihe C — Entity-template + guru-valikko

- [ ] `entities/*.json`
- [ ] Valikko: puhu / osta / haasta
- [ ] Yksinkertainen kauppa (osta scroll-id rahalla)

**Arvio**: 2 sessiota

### Vaihe D — Encounter-prototyyppi (Arkkitehti)

- [ ] Yksi encounter: Arkkitehti + valintavalikko (ei HP)
- [ ] `playerStats` + Stamina kulutus
- [ ] AI-assist (`× 0.4`) + Suspicion
- [ ] Kirja `book-cpp-raii` → unlock `explain-ownership`

**Arvio**: 3–4 sessiota

### Vaihe E — Gurukohtaaminen + kirja

- [ ] Constexpr-velho: puhu / osta / haasta (encounter)
- [ ] Voitto / osto → kirja inventaarioon
- [ ] `BookReader` + checkpoint → `unlocks` store

**Arvio**: 2–3 sessiota

### Vaihe F — Sisältöä ja tasapaino

- [ ] question-banks featureittain
- [ ] Useampi kartta, portaalit
- [ ] Salainen guru-sisältö
- [ ] Toimistoroolit (SM, PO, MM alignment)
- [ ] Legacy System -encounter
- [ ] Production Incident -maailmatapahtuma (prototyyppi)
- [ ] Asiakas-event + CEO-kohtaus
- [ ] Esineet ja wisdom-buffit

**Arvio**: jatkuva

### Vaihe G — “Elävä toimisto” (myöhemmin)

- [ ] Toimistokoira, aulasihteeri, työkaveri-random encounter
- [ ] Suklaapatukka + hammas_kipea -status
- [ ] Sähköpyörä liikemechaniikkaan

**Arvio**: jatkuva

---

## 9. Avoimet kysymykset (päätettävä myöhemmin)

1. **Näppäimistö mobiilissa** — virtuaalinen D-pad vs. napauta ruutua?
2. **Taistelu reaaliaikainen vs. vuoro** — vuoro on helpompi alkuun
3. **Kuinka paljon karmaa häviöllä** — prosentti vs. kiinteä määrä?
4. **Sama feature useassa guruissa** — toistuva harjoittelu vai “mastered” -tila?
5. **Moninpeli** — ei nyt; dokumentoitu vain siksi ettei vahingossa suunnitella sisään
6. **Kieli rajat** — `cpp:*` ensin; myös `arch:*`, `security:*`, `process:*` roolihahmoille
7. **Asiakkaan spawn** — kiinteä event vs. satunnainen?
8. **CEO avaus** — kultainen avainkortti vs. guru-määrä?
9. **Middle manager alignment** — päivittäin vai per kartta?

---

## 10. Sisältöideat (backlog)

### C++ gurut (Kalevala)

- [ ] Constexpr-velho — `constexpr`, compile-time
- [ ] RAII-metsolan haltija — smart pointerit, poikkeukset
- [ ] Template-tuulikko — variadic templates, concepts
- [ ] Väinämöinen — finale

### Tekniset kovat vastustajat

- [ ] Tietoturvaguru (`X`) — `security:*`, haavoittuvuuskoodi
- [ ] Arkkitehti (`A`) — `arch:*`, kerrokset, riippuvuudet
- [ ] Raakamuistin örkki — `new`/`delete`
- [ ] NULL-haamu — `NULL` vs `nullptr`

### Toimisto & agile (laajennettu)

- [ ] Scrum Master — Daily Meeting, liike estetty
- [ ] PO — scope change kesken taistelun
- [ ] **Lakimies** (`L`) — tekstimuotoinen dokumentaatio
- [ ] **Hankintapäällikkö** (`H`) — estää ostot
- [ ] Projektipäällikkö — aikataulutus-boss
- [ ] Middle manager — friendly / hostile
- [ ] Työkaveri, testauspäällikkö, koira, aulasihteeri

### Bossit & erikoiset

- [ ] **Asiakas** — NPC pakos, musiikki, instant death
- [ ] **CEO** — Strateginen Muutos
- [ ] Endgame: kokous, auditointi, prod 16:55

### Esineet (toteutusjono)

- [ ] Kulutustavarat: kahvi, battery, suklaa, banaani, kylmä pizza
- [ ] Harvinaiset: viitta, pyörä, vastamelukuulokkeet, legendaarinen läppäri, VPN, **tulostimen ajuri**
- [ ] Hammasharja (counter suklaalle)

### Kiroukset

- [ ] Teams-palaveri, Legacy-järjestelmä, Tekninen velka

### Kirjat (C++ — oikea sisältö)

- [ ] `book-cpp-auto` — 1 sivu
- [ ] `book-cpp-nullptr-const` — 1.5 sivua
- [ ] `book-cpp-raii` — 2 sivua
- [ ] `book-cpp-safety-casts` — 1.5 sivua
- [ ] Myöhemmin: Python, SQL, Git…

### Encounter & lines

- [ ] `encounters/` skeema + humor/ai-haarat
- [ ] `lines/` vitsit ja barkit per rooli
- [ ] Entity `personality` kaikille boss/everyday NPC:ille

### Kartta-alueet

- [ ] Tuonelan ranta, Velhon metsä, Muistin loukko
- [ ] Open office, Sprint-huone
- [ ] Security-kerros, Architecture-silta
- [ ] Pääkonttori-huippu (CEO)
- [ ] Event: Asiakas

### Pitkät scrollit / kirjat

- [ ] C++-kirjat ensin (yllä) — **ei** erillisiä “flavor-only” -scrollja
- [ ] Myöhemmin: tietoturva, arkkitehtuuri topic-kirjat samalla 1–2 sivun kaavalla

---

## 11. Yhteys nykyiseen koodiin

| Nykyinen | Maailmassa hyödynnetään |
|----------|-------------------------|
| `features` store + karma | Osaaminen; täysi palkinto oikeasta vastauksesta |
| `teaches[]` storyssa | Inventaarion “puuttuu” -lista |
| Story `choice` / `code` | Encounter `rounds`; sama moottori |
| `gameHistory.ts` | Laajenna `/world/...` poluilla |
| Tarina (lineaarinen) | → hahmokohtainen **encounter** + kirja |
| `FeatureGarden` | Inventaario |

---

## 12. Muistilista seuraavaan sessioon

1. Lue tämä doc — **Corporate NetHack** -suunta: sosiaalinen simulaatio, ei taistelua
2. Kirjoita `content/books/book-cpp-raii.json` — checkpoint + `unlocks: ownership-understood`
3. Entity **Arkkitehti** (ego 90, humor 20) + `lines/` vitsejä
4. Yksi `encounters/architect-raii.json` — Perustele / Vitsaile / AI / Pakene
5. Memory Leak -olento: piilota "Explain ownership" ilman kirjaa
6. Älä tee karttaa ennen kuin kirja + encounter toimii

---

*Viimeksi päivitetty: Corporate NetHack -pivot — sosiaalinen simulaatio, 0–100 persoonallisuus, kirjat avaavat dialogia, AI ×0.4 + Suspicion, Legacy System + Production Incident.*
