# Kysymyspankin skaalautumissuunnitelma — tavoite 1000+ kysymystä

Tämä dokumentti kuvaa miten Koodisampon encounter-kysymykset kasvatetaan nykyisestä ~50 kysymyksestä yli tuhaten ilman toistuvuutta pitkän pelin aikana.

## 1. Nykytila (maaliskuu 2026)

| Mittari | Arvo |
|---------|------|
| Kysymyksiä yhteensä | **1000** (9 expansion-erää + alkuperäiset) |
| Pankkeja | 7 (`content/question-banks/*.json`) |
| Domäänejä | `cpp`, `docker`, `linux`, `scrum`, `qt`, `javascript`, `postgres` |
| Lukuja (chapter) | 18 |
| Lataus | `encounterQuestions.mjs` → `loadAllQuestions()` |
| Inventaario | `listAllQuestions()` (testeissä; `npm run questions:list` suunniteltu) |

### Miten lähteitä hyödynnetään nyt

1. **Pankkitason `source`** — yksi URL tai kuvaus koko JSON-tiedostolle.
   - C++: [cpp-best-practices](https://github.com/cpp-best-practices/cppbestpractices)
   - Scrum: [scrum-best-practices](https://github.com/janpetzold/scrum-best-practices)
   - Linux: [avahi.org](https://avahi.org/) + systemd/journald
   - Docker: dokumentaatio (aiemmin vain teksti; päivitetty URL:ksi)

2. **Kysymystason palaute** — `correctFeedback` / `wrongFeedback` viittaavat lähteen käytäntöön sanallisesti (esim. "cpp-best-practices suosittelee…").

3. **Valinnainen `studyNotes`** — pidempi selitys AI-opetusnäkymään (`buildAiStudyText`). Käytössä harvoin (esim. Avahi, Rule of Zero).

4. **Tarinoissa `sourceRef`** — `content/stories/*.json` käyttää polkua tyyliin `cpp-best-practices/04-Considering_Safety.md#avoid-raw-memory-access`. **Encounter-kysymyksissä ei vielä pakollista `sourceRef`-kenttää** — tämä on ensimmäinen laajennus.

5. **`featureId`** — yhdistää kysymyksen karma-inventaarioon (`cpp:auto`, `scrum:definition-of-done`).

### Tunnetut ongelmat

- **`scrum-dod`-luku tyhjä** — NPC:t voivat kysyä DoD-aiheesta, mutta pankissa ei ollut `chapter: "scrum-dod"` -kysymyksiä → fallback laajempaan pooliin → toistot.
- **Pieni absoluuttinen määrä** — 47 kysymystä loppuu nopeasti; `quizHistory` sallii uudelleen näyttämisen kun pooli kuivuu.
- **Epätasainen jakautuminen** — C++ ~50 %, monet luvut 1–2 kysymystä.
- **Docker-pankin lähde** oli pelkkä teksti, ei URL.

---

## 2. Tavoitearkkitehtuuri

```
content/
  question-banks/           # julkaistavat pankit (JSON)
    cpp-best-practices.json
    cpp-core-guidelines.json   # uusi pankki
    docker-ops.json
    linux-ops.json
    scrum-best-practices.json
  question-sources/         # UUSI: lähderekisteri
    catalog.json            # id, url, license, domains, chapters
  question-bank-schema.json # UUSI: JSON Schema validointiin

scripts/
  questions-list.mjs        # inventaario + puuttuvat luvut
  questions-validate.mjs    # skeema, uniikit id:t, sourceRef
  questions-stats.mjs       # jakaumat domain/chapter/difficulty
```

### Laajennettu kysymys-skeema

Nykyisten kenttien lisäksi suositeltu:

```json
{
  "id": "safety-shared-ptr",
  "chapter": "safety",
  "domain": "cpp",
  "difficulty": 3,
  "audiences": ["coworker", "guru"],
  "prompt": "…",
  "choices": [ … ],
  "correctFeedback": "…",
  "wrongFeedback": "…",
  "sourceRef": "cpp-best-practices/04-Considering_Safety.md#use-smart-pointers",
  "sourceUrl": "https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md",
  "studyNotes": "Valinnainen pidempi selitys AI-näkymään.",
  "featureId": "cpp:shared-ptr",
  "featurePoints": 4,
  "tags": ["raii", "ownership"]
}
```

| Kenttä | Pakollinen | Kuvaus |
|--------|------------|--------|
| `id` | kyllä | Uniikki koko kokoelmassa |
| `chapter` | kyllä | Yhdistyy NPC `topic`-kenttään ja `TOPIC_DOMAINS` |
| `domain` | suositus | Yliajaa pankin domainin |
| `difficulty` | kyllä | 1–5 |
| `audiences` | kyllä | `coworker`, `guru`, `security`, `ceo`, `project-lead`, `secretary`, `hostile` |
| `sourceRef` | suositus → pakko 100+ kpl | Polku lähderekisterissä tai repo-polku |
| `sourceUrl` | suositus | Suora linkki lukijalle / AI-opetukseen |

`buildAiStudyText` voidaan päivittää näyttämään `sourceUrl` jos `bankSource` puuttuu.

---

## 3. Hyväksytyt lähteet (lähderekisteri)

Vain julkisia, vakaasti ylläpidettyjä lähteitä. Ei kopioida tekstiä sellaisenaan — kysymykset ovat **alkuperäisiä tiivistelmiä** käytännön tilanteista.

### C++ (~400 kysymystä tavoite)

| Lähde | URL | Arvioitu kysymysmäärä |
|-------|-----|----------------------|
| cpp-best-practices | https://github.com/cpp-best-practices/cppbestpractices | 150 |
| C++ Core Guidelines | https://isocpp.github.io/CppCoreGuidelines/ | 200 |
| cppreference (valikoitu) | https://en.cppreference.com/ | 50 |

Luvut: `tools`, `style`, `safety`, `maintainability`, `performance`, `portability`, `threadability`, `correctness` + uudet `memory`, `concurrency`, `templates`, `stl`.

### Scrum / Agile (~150)

| Lähde | URL | Arvioitu kysymysmäärä |
|-------|-----|----------------------|
| scrum-best-practices | https://github.com/janpetzold/scrum-best-practices | 80 |
| Scrum Guide 2020 | https://scrumguides.org/scrum-guide.html | 40 |
| Agile Manifesto (konteksti) | https://agilemanifesto.org/ | 30 |

Luvut: `scrum-dod`, `scrum-dor`, `scrum-sprint`, `scrum-estimation`, `scrum-team`, `scrum-product`, `scrum-events`.

### Linux / systemd (~200)

| Lähde | URL | Arvioitu kysymysmäärä |
|-------|-----|----------------------|
| systemd.io / man-sivut | https://www.freedesktop.org/wiki/Software/systemd/ | 80 |
| journald | https://www.freedesktop.org/software/systemd/man/systemd-journald.service.html | 40 |
| ip-route, nmcli | https://man7.org/linux/man-pages/ | 40 |
| Avahi | https://avahi.org/ | 40 |

Luvut: `systemd`, `journald`, `linux-network`, `avahi`, `permissions`, `firewall`, `packages`.

### Docker / kontit (~150)

| Lähde | URL | Arvioitu kysymysmäärä |
|-------|-----|----------------------|
| Docker Docs | https://docs.docker.com/ | 100 |
| Compose | https://docs.docker.com/compose/ | 50 |

Luvut: `docker`, `docker-network`, `docker-volumes`, `docker-build`, `docker-security`.

### Qt + OpenGL / shaderit (~120)

| Lähde | URL | Arvioitu kysymysmäärä |
|-------|-----|----------------------|
| Qt 6 Documentation | https://doc.qt.io/qt-6/ | 80 |
| QOpenGLWidget / Shader | https://doc.qt.io/qt-6/qopenglwidget.html | 40 |

Luvut: `qt-widgets`, `qt-signals`, `qt-threading`, `qt-models`, `qt-opengl`, `qt-shaders`.

Shaderit ja GL ohjelmointi **Qt-kontekstissa** (QOpenGLShaderProgram, VBO, makeCurrent) — ei irrallista raw OpenGL -pankkia erikseen.

### JavaScript (~100)

| Lähde | URL | Arvioitu kysymysmäärä |
|-------|-----|----------------------|
| MDN Web Docs | https://developer.mozilla.org/en-US/docs/Web/JavaScript | 100 |

Luvut: `js-async`, `js-types`, `js-modules`, `js-runtime`.

### PostgreSQL performance tuning (~100)

| Lähde | URL | Arvioitu kysymysmäärä |
|-------|-----|----------------------|
| PostgreSQL Docs | https://www.postgresql.org/docs/current/performance-tips.html | 100 |

Luvut: `pg-indexes`, `pg-explain`, `pg-vacuum`, `pg-config`.

### Tulevaisuus (~100+)

- Git / CI (`git`, `github-actions`)
- TypeScript (laajennus `javascript`-domainiin)
- Verkko- ja turvallisuus-perusteet

---

## 4. Aihetaxonomy ja tavoitemäärät (1000 kpl)

Jokaiselle `chapter`-arvolle minimi ja tavoite. NPC-generaattori (`mapGenerator.mjs`) käyttää näitä `topic`-kentissä — **uusi luku vaatii päivityksen sinne**.

| Domain | Chapter | Min nyt | Tavoite 1000 | Prioriteetti |
|--------|---------|---------|--------------|--------------|
| cpp | tools | 3 | 40 | korkea |
| cpp | style | 4 | 50 | korkea |
| cpp | safety | 7 | 80 | korkea |
| cpp | maintainability | 3 | 50 | keskitaso |
| cpp | performance | 2 | 40 | keskitaso |
| cpp | correctness | 2 | 40 | keskitaso |
| cpp | threadability | 2 | 40 | keskitaso |
| cpp | portability | 1 | 30 | matala |
| scrum | scrum-dod | 0→5 | 25 | **kriittinen** |
| scrum | scrum-dor | 2 | 20 | korkea |
| scrum | scrum-sprint | 3 | 25 | korkea |
| scrum | scrum-estimation | 2 | 20 | keskitaso |
| scrum | scrum-team | 1 | 20 | keskitaso |
| docker | docker | 2 | 40 | korkea |
| docker | docker-network | 5 | 40 | keskitaso |
| linux | systemd | 2 | 40 | korkea |
| linux | journald | 2 | 30 | keskitaso |
| linux | linux-network | 2 | 30 | keskitaso |
| linux | avahi | 2 | 20 | matala |
| qt | qt-widgets | 1 | 30 | korkea |
| qt | qt-signals | 1 | 25 | korkea |
| qt | qt-threading | 1 | 25 | keskitaso |
| qt | qt-models | 1 | 20 | keskitaso |
| qt | qt-opengl | 2 | 30 | korkea |
| qt | qt-shaders | 2 | 30 | korkea |
| javascript | js-async | 2 | 30 | korkea |
| javascript | js-types | 2 | 25 | keskitaso |
| javascript | js-modules | 1 | 20 | keskitaso |
| javascript | js-runtime | 1 | 25 | keskitaso |
| postgres | pg-indexes | 2 | 30 | korkea |
| postgres | pg-explain | 2 | 30 | korkea |
| postgres | pg-vacuum | 1 | 20 | keskitaso |
| postgres | pg-config | 1 | 20 | keskitaso |

**Yhteensä tavoite:** ~1200 (cpp+ops + qt/js/pg; uudet luvut dokumentoidaan ennen massatuotantoa).

---

## 5. Tuotantoputki: miten 1000 kysymystä syntyy

### Vaihe A — Perusta (nyt → 100 kysymystä)

- [x] Tämä suunnitelmadokumentti
- [x] Lisää 20–30 kysymystä käsin (puuttuvat luvut, erityisesti `scrum-dod`)
- [x] `sourceRef` + `sourceUrl` uusiin kysymyksiin
- [x] `npm run questions:list` — inventaario markdown/JSON
- [x] Uudet domainit: Qt, JavaScript, PostgreSQL tuning
- [ ] `npm run questions:validate` — uniikit id:t, pakolliset kentät

### Vaihe B — 100 → 300 kysymystä

- Jaa pankit domainin mukaan (esim. `cpp-core-guidelines.json`)
- Lähderekisteri `content/question-sources/catalog.json`
- Lukukohtainen backlog (GitHub issue / `content/question-backlog.md`)
- Semi-automaatio: skripti lukee lähteen otsikkorakenteen → ehdottaa `chapter` + `featureId` → ihminen kirjoittaa promptin
- Testi: jokaisella `chapter`-arvolla vähintään 3 kysymystä

### Vaihe C — 300 → 600 kysymystä

- LLM-avusteinen luonnos **lähteen ankkuroimana** (syöte: URL + kappale → luonnos → ihmisen review)
- Duplikaattitunnistus: embedding tai yksinkertainen prompt-similarity (>85 % → hylkää)
- Vaikeusjakauman tarkistus per luku (1:20 %, 2:25 %, 3:30 %, 4:15 %, 5:10 %)
- `studyNotes` kaikille diff 4–5 kysymyksille (AI-opetus)

### Vaihe D — 600 → 1000+ kysymystä

- Yhteisö-/PR-prosessi: CONTRIBUTING.md ohje kysymyksen lisäämiseen
- Pelin feedback-loop: väärät vastaukset → `studyBacklog` → priorisoi uudet kysymykset heikoista aiheista
- Käännös/lokalisointi: promptit suomeksi, `sourceUrl` englanniksi (nykyinen malli)
- Versiointi: `question-banks/v2/` jos skeema rikkoutuu

---

## 6. Laatu ja pelattavuus

### Validointisäännöt (automaattinen CI)

1. `id` uniikki kaikissa pankissa
2. Täsmälleen yksi `correct: true` per kysymys
3. Vähintään 2, enintään 4 valintaa
4. `audiences` ei tyhjä; vähintään yksi yhteensopiva NPC-tyypin kanssa
5. `chapter` on rekisteröity `TOPIC_DOMAINS` / `TOPIC_LABELS` -listassa TAI dokumentoitu uutena
6. `sourceRef` tai `sourceUrl` pakollinen uusille kysymyksille (vanhat migroidaan vähitellen)

### Toiston vähentäminen (pelilogiikka)

Nykyinen `pickQuestion` (3-portainen fallback) riittää kun pooli >200. Lisäehdotukset 500+ kysymyksellä:

- Nosta `getRecentQuestionIds` ikkunaa 20 → 50
- Painota kysymyksiä joita pelaaja ei ole koskaan nähnyt (`global.asked`)
- Kerroskohtainen "tuoreus" — eri kerroksilla eri painotukset domaineille

### Kysymystyypit (vain encounter toistaiseksi)

| Tyyppi | Kuvaus | Osuus tavoitteessa |
|--------|--------|-------------------|
| Käytännön skenaario | "Prod on punainen — …" | 70 % |
| Käsite | "Mitä X tarkoittaa?" | 20 % |
| Vertailu | "Miksi A parempi kuin B?" | 10 % |

---

## 7. Työjako ja arviot

| Vaihe | Kysymyksiä | Työmäärä | Tulos |
|-------|------------|----------|-------|
| A | 75–100 | 1–2 sessiota | Ei toistoja lyhyessä pelissä |
| B | 300 | 2–4 viikkoa | Rikkaat luvut, validointi |
| C | 600 | 1–2 kk | AI-luonnos + review |
| D | 1000+ | jatkuva | Ylläpito, yhteisö |

---

## 8. Seuraavat konkreettiset askeleet

1. **Täytä `scrum-dod`** vähintään 5 kysymyksellä (tehty osana ensimmäistä erää).
2. Lisää `scripts/questions-list.mjs` ja npm-skripti.
3. Päivitä `encounterQuestions.mjs` käyttämään kysymyskohtaista `sourceUrl` AI-opetuksessa.
4. Avaa backlog-taulukko puuttuville luvuille (`docker-volumes`, `scrum-product`, …).
5. Kun 100 kpl ylittyy — pakota `questions:validate` CI:hin (`test:engine`).

---

## Liite: NPC-topic ↔ chapter -kartta

Määritelty `encounterQuestions.mjs` (`TOPIC_DOMAINS`) ja `mapGenerator.mjs` (`CPP_TOPICS`, `OPS_TOPICS`). Uusi chapter vaatii päivityksen molempiin + vähintään 3 kysymystä ennen kuin NPC voi käyttää sitä luotettavasti.
