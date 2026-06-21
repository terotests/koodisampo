# Koodisampo

**Corporate NetHack** — toimisto-ASCII-peli, jossa selviydyt kokouksista, koodikatselmuksista ja legacy-koodista opiskelemalla modernia C++:ää. Kartalla liikut aulassa, kahvihuoneessa ja hissillä kerrosten välillä; kohtaamiset avautuvat NPC:iden kautta.

Ensimmäinen aihealue: **moderni C++** vanhoille C++-konkareille, pohjautuen [C++ Best Practices — Considering Safety](https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md) -lukuun.

## Pelaa selaimessa

Web-versio julkaistaan GitHub Pagesiin automaattisesti kun `main` päivittyy.

- **Osoite:** https://terotests.github.io/koodisampo/
- Staattiset tarinat toimivat ilman backend-palvelinta; edistyminen tallentuu selaimen IndexedDB:hen.

## Tarinat

| Tarina | Opittavat patternit |
|--------|---------------------|
| Legacy herää | auto, nullptr, range-for, const |
| Const code review | const &, pass-by-value, const-metodi |
| Muistivuodot standupissa | unique_ptr, make_unique, vector |
| Turvallinen refaktorointi | static_cast, poikkeukset |
| Template-kokous | variadic template, typeturvallisuus |
| CTO:n koodikatselmus | make_unique |

Ei tasoja — vain kasvava **karma** featureittain (esim. `cpp:auto · 23`).

## Ominaisuudet

- **Toimistokartta** (terminaali): kerrokset, hissi, huoneet, NPC-kohtaamiset
- Tarinat JSON-muodossa (haarautuva tarina)
- Monivalinta + koodin täydennys
- Ranger `@process` -peliohjain (`GameSession`) + ohut Node-host
- Edistyminen IndexedDB:llä (web) tai `~/.koodisampo/player.json` (terminaali)

## Käynnistys

### Web (kehitys)

```bash
npm install
npm run dev          # http://localhost:5173
npm run server       # story API http://localhost:3847 (valinnainen)
npm run dev:all      # molemmat
```

Tuotantobuild (sama kuin CI):

```bash
PAGES_BASE=/koodisampo/ npm run build
npm run preview
```

### Terminaaliversio (Ranger)

```bash
npm install
npm run build:ranger   # vaatii ../agent/Ranger -kääntäjän
npm run play           # aloita suoraan Corporate HQ -kartalla
npm run test:engine    # headless-testi
```

Kartta: `content/worlds/corporate-hq.json`. Tarinat: `content/stories/`.

Osaaminen (feature-karma) ja kuolemat tallentuvat tiedostoon `~/.koodisampo/player.json` — säilyvät pelisession välillä.

## CI/CD — GitHub Pages (GitHub Actions)

Workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml)

- `main`-push → buildaa `web/` (`PAGES_BASE=/koodisampo/`) → julkaisee GitHub Pagesiin
- Manuaalinen ajo: Actions → *Deploy web to GitHub Pages* → Run workflow

**Kerran GitHubissa:** Settings → Pages → Build and deployment → Source → **GitHub Actions** (ei *Deploy from a branch*).

Ensimmäisen onnistuneen ajon jälkeen sivu on osoitteessa https://terotests.github.io/koodisampo/

## Tarinan lisääminen

1. Luo `web/src/stories/uusi-tarina.json` skeeman mukaan → [docs/story-schema.md](docs/story-schema.md)
2. Lisää import `web/src/services/storyLoader.ts` → `STATIC_STORIES`
3. Valinnainen: kopioi sama tiedosto `server/stories/` paikallista palvelinta varten

## Story-palvelin

Palvelin lukee JSON-tiedostot kansiosta `server/stories/` (tai `STORIES_DIR`-ympäristömuuttujasta).

```bash
STORIES_DIR=/polku/omiin/tarinoihin npm run server
```

Web-sovelluksessa vaihda lähde: **Vaihda** → Paikallinen palvelin. Vite proxy ohjaa `/api` → `localhost:3847`.

## Dokumentaatio

- [Story JSON -skeema](docs/story-schema.md) — nykyiset tarinat ja featuret
- [Maailma, inventaario ja taistelu](docs/world-and-combat-plan.md) — tuleva kartta, gurut, taistelu
- [Opiskeluopas](opiskelu/opiskelu-opas.md) — kertaus C++/Scrum/backend-aiheista

## Rakenne

```
koodisampo/
  web/           React + Vite -peli (julkaistaan GitHub Pagesiin)
  server/        Valinnainen Express story-API
  hosts/         Terminaali- ja debug-hostit (Ranger)
  lib/           Ranger-pelilogiikka (.rgr)
  content/       Maailmat, kysymykset, tarinat
  docs/          Skeemat ja suunnitelmat
  opiskelu/      Opiskelumuistiinpanot ja -opas
  editor/        Maailmaneditori (kehitystyökalu)
```

## Seuraavat askeleet

Katso [docs/world-and-combat-plan.md](docs/world-and-combat-plan.md) — roadmap vaiheittain (inventaario → kartta → guru → taistelu).
