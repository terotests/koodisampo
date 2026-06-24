# Koodisampo

**Corporate NetHack** — toimisto-ASCII-peli, jossa selviydyt kokouksista, koodikatselmuksista ja legacy-koodista opiskelemalla modernia C++:ää. Kartalla liikut aulassa, kahvihuoneessa ja hissillä kerrosten välillä; kohtaamiset avautuvat NPC:iden kautta.

Ensimmäinen aihealue: **moderni C++** vanhoille C++-konkareille, pohjautuen [C++ Best Practices — Considering Safety](https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md) -lukuun.

## Pelaa selaimessa

**Corporate NetHack** (ASCII-kartta, NPC-kohtaamiset) julkaistaan GitHub Pagesiin automaattisesti kun `main` päivittyy.

- **Osoite:** https://terotests.github.io/koodisampo/
- Staattinen build (`web-game/`) — ei Node-backendia; tallennus IndexedDB:hen
- Erillinen tarinakokeilu: `web/` (React-tarinavalitsin), `npm run dev:stories`

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

### Web — Corporate NetHack (staattinen, GitHub Pages)

```bash
npm install
npm run build:ranger   # compile .rgr → generated/es6/koodisampo.cjs (uses npm ranger-compiler)
npm run dev            # http://localhost:5173 — web-game/
npm run build          # web-game/dist → Pages
npm run preview
```

Cloud agents: see **[AGENTS.md](AGENTS.md)** — no sibling `../agent/Ranger` checkout needed.

Node-debug (sama peli, paikallinen API): `npm run play:web`

### Web — tarinakokeilu (React)

```bash
npm run dev:stories    # web/ — tarinalista ilman karttaa
```

### Terminaaliversio (Ranger)

```bash
npm install
npm run build:ranger   # npm package ranger-compiler (tai ../agent/Ranger paikallisesti)
npm run play           # aloita suoraan Corporate HQ -kartalla
npm run test:engine    # headless-testi
```

Kartta: `content/worlds/corporate-hq.json`. Tarinat: `content/stories/`.

Osaaminen (feature-karma) ja kuolemat tallentuvat tiedostoon `~/.koodisampo/player.json` — säilyvät pelisession välillä.

## CI/CD — GitHub Pages (GitHub Actions)

Workflow: [`.github/workflows/pages.yml`](.github/workflows/pages.yml)

- `main`-push → buildaa `web-game/` (`PAGES_BASE=/koodisampo/`) → julkaisee GitHub Pagesiin
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
  web-game/      Corporate NetHack — staattinen selainbuild (GitHub Pages)
  web/           React-tarinavalitsin (kehitys / legacy)
  hosts/         Terminaali- ja Node-debug-hostit + jaettu pelilogiikka
  lib/           Ranger-pelilogiikka (.rgr)
  generated/     Ranger-käännös (koodisampo.cjs CI:hin)
  content/       Maailmat, kysymykset, tarinat
  docs/          Skeemat ja suunnitelmat
  opiskelu/      Opiskelumuistiinpanot ja -opas
  editor/        Maailmaneditori (kehitystyökalu)
```

## Seuraavat askeleet

Katso [docs/world-and-combat-plan.md](docs/world-and-combat-plan.md) — roadmap vaiheittain (inventaario → kartta → guru → taistelu).
