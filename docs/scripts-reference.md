# Koodisampo — npm-skriptit ja CLI-valinnat

Generoitu: `npm run scripts:export` · 2026-06-21

Tämä tiedosto listaa `package.json`-skriptit ja niiden taustalla olevien Node-skriptien dokumentoidut valinnat.

## koodisampo

#### `build`

- **Komento:** `npm run build`
- **Tausta:** `npm run build --workspace=web`
- **Valinnat:** (ei Node-CLI:tä — delegoi toiseen npm-skriptiin tai työkaluun)

#### `build:ranger`

- **Komento:** `npm run build:ranger`
- **Tausta:** `node scripts/build-ranger.mjs`
- **Kuvaus:** Build Koodisampo Ranger lib → generated/es6/koodisampo.js
- **Valinnat:** (ei dokumentoituja CLI-valintoja)

#### `dev`

- **Komento:** `npm run dev`
- **Tausta:** `npm run dev --workspace=web`
- **Valinnat:** (ei Node-CLI:tä — delegoi toiseen npm-skriptiin tai työkaluun)

#### `dev:all`

- **Komento:** `npm run dev:all`
- **Tausta:** `concurrently "npm run dev" "npm run server"`
- **Valinnat:** (ei Node-CLI:tä — delegoi toiseen npm-skriptiin tai työkaluun)

#### `play`

- **Komento:** `npm run play`
- **Tausta:** `npm run build:ranger && node hosts/terminal/run.mjs`
- **Valinnat:** (ei dokumentoituja CLI-valintoja)

#### `play:web`

- **Komento:** `npm run play:web`
- **Tausta:** `npm run build:ranger && node hosts/debug/webPlay.mjs`
- **Kuvaus:** Web-debug-näkymä — pelaa selaimessa, näe tila JSONina, ei stdin-ongelmia. npm run play:web
- **Valinnat:** (ei dokumentoituja CLI-valintoja)

#### `preview`

- **Komento:** `npm run preview`
- **Tausta:** `npm run preview --workspace=web`
- **Valinnat:** (ei Node-CLI:tä — delegoi toiseen npm-skriptiin tai työkaluun)

### `questions:*`

#### `questions:apply-all`

- **Komento:** `npm run questions:apply-all`
- **Tausta:** `node scripts/apply-question-expansion.mjs --all`
- **Kuvaus:** Yhdistää expansion-erän question-bank JSON-tiedostoihin.
- **Valinnat:**
  - `npm run questions:apply-all -- [polku/expansion-batch-NN.mjs]`
- **Huom:** lisäargumentit välitetään npm:n kautta: `npm run questions:apply-all -- …`

#### `questions:apply-choices`

- **Komento:** `npm run questions:apply-choices`
- **Tausta:** `node scripts/choices-apply-rewrite.mjs`
- **Kuvaus:** Sovella aliagentin tuottamat valintauudistukset pankkiin.
- **Valinnat:**
  - `npm run questions:apply-choices -- scripts/data/choice-rewrites/cpp-batch-01.json`
  - `npm run questions:apply-choices -- scripts/data/choice-rewrites/*.json --dry-run`
- **Huom:** lisäargumentit välitetään npm:n kautta: `npm run questions:apply-choices -- …`

#### `questions:apply-expansion`

- **Komento:** `npm run questions:apply-expansion`
- **Tausta:** `node scripts/apply-question-expansion.mjs`
- **Kuvaus:** Yhdistää expansion-erän question-bank JSON-tiedostoihin.
- **Valinnat:**
  - `npm run questions:apply-expansion -- [polku/expansion-batch-NN.mjs]`
- **Huom:** lisäargumentit välitetään npm:n kautta: `npm run questions:apply-expansion -- …`

#### `questions:bias`

- **Komento:** `npm run questions:bias`
- **Tausta:** `node scripts/choices-bias-report.mjs`
- **Kuvaus:** Raportoi valintojen pituusvinouma.
- **Valinnat:**
  - `npm run questions:bias -- [--json] [--bank cpp-best-practices.json]`
- **Huom:** lisäargumentit välitetään npm:n kautta: `npm run questions:bias -- …`

#### `questions:export`

- **Komento:** `npm run questions:export`
- **Tausta:** `node scripts/questions-export-md.mjs`
- **Kuvaus:** Generoi markdown-koosteen kaikista kysymyksistä.
- **Valinnat:**
  - `npm run questions:export -- [tiedosto]`
- **Huom:** lisäargumentit välitetään npm:n kautta: `npm run questions:export -- …`

#### `questions:export-choices`

- **Komento:** `npm run questions:export-choices`
- **Tausta:** `node scripts/choices-export-rewrite-batch.mjs`
- **Kuvaus:** Vie kysymykset aliagentin uudelleenkirjoitusta varten.
- **Valinnat:**
  - `npm run questions:export-choices -- --bank cpp-best-practices.json`
  - `npm run questions:export-choices -- --bank cpp-best-practices.json --offset 0 --limit 40`
  - `npm run questions:export-choices -- --all --only-biased`
- **Huom:** lisäargumentit välitetään npm:n kautta: `npm run questions:export-choices -- …`

#### `questions:list`

- **Komento:** `npm run questions:list`
- **Tausta:** `node scripts/questions-list.mjs`
- **Kuvaus:** Tulostaa kysymyspankin inventaarion: määrät, luvut, puuttuvat topicit.
- **Valinnat:**
  - `npm run questions:list -- [--json]`
- **Huom:** lisäargumentit välitetään npm:n kautta: `npm run questions:list -- …`

#### `questions:validate`

- **Komento:** `npm run questions:validate`
- **Tausta:** `node scripts/questions-validate.mjs`
- **Kuvaus:** Validoi kysymyspankki. Exit 1 jos kriittisiä ongelmia.
- **Valinnat:**
  - `npm run questions:validate -- [--strict]`
- **Huom:** lisäargumentit välitetään npm:n kautta: `npm run questions:validate -- …`

#### `scripts:export`

- **Komento:** `npm run scripts:export`
- **Tausta:** `node scripts/scripts-export-md.mjs`
- **Kuvaus:** Generoi markdown-koosteen kaikista npm-skripteistä ja niiden CLI-valinnoista.
- **Valinnat:**
  - `npm run scripts:export -- [tiedosto]`
- **Huom:** lisäargumentit välitetään npm:n kautta: `npm run scripts:export -- …`

#### `server`

- **Komento:** `npm run server`
- **Tausta:** `npm run start --workspace=server`
- **Valinnat:** (ei Node-CLI:tä — delegoi toiseen npm-skriptiin tai työkaluun)

#### `test:engine`

- **Komento:** `npm run test:engine`
- **Tausta:** `npm run build:ranger && node test/story_engine.test.mjs && node test/player_save.test.mjs && node test/quiz_history.test.mjs && node test/study_backlog.test.mjs && node test/shuffle_choices.test.mjs && node test/stdin_hub.test.mjs && node test/map_generator.test.mjs && node test/world_map.test.mjs && node test/intro_world.test.mjs && node test/floor_access.test.mjs && node test/staff_roster.test.mjs && node test/encounter.test.mjs`
- **Valinnat:** (ei dokumentoituja CLI-valintoja)

## server

#### `start`

- **Komento:** `npm run start --workspace=server`
- **Tausta:** `node index.js`
- **Valinnat:** (ei Node-CLI:tä — delegoi toiseen npm-skriptiin tai työkaluun)

## web

#### `build`

- **Komento:** `npm run build --workspace=web`
- **Tausta:** `vite build`
- **Valinnat:** (ei Node-CLI:tä — delegoi toiseen npm-skriptiin tai työkaluun)

#### `dev`

- **Komento:** `npm run dev --workspace=web`
- **Tausta:** `vite`
- **Valinnat:** (ei Node-CLI:tä — delegoi toiseen npm-skriptiin tai työkaluun)

#### `preview`

- **Komento:** `npm run preview --workspace=web`
- **Tausta:** `vite preview`
- **Valinnat:** (ei Node-CLI:tä — delegoi toiseen npm-skriptiin tai työkaluun)

## Muut Node-skriptit (ei npm-skriptissä)

### `scripts/backfill-source-urls.mjs`

Lisää sourceUrl/sourceRef alkuperäisiin kysymyksiin joilta ne puuttuvat.

- (ei dokumentoituja valintoja)

### `scripts/export-question-ids.mjs`


- (ei dokumentoituja valintoja)

### `scripts/merge-intro-upper-floors.mjs`

Rakenna intro-maailman kerrokset 3–9 ja päivitä kerrokset 0–2 + 10 aikatauluilla.

- (ei dokumentoituja valintoja)

