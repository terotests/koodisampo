# Prompt: lisää kysymyksiä Koodisampoon

Kopioi alla oleva **täytettävä pohja** uuteen chat-istuntoon (tai agentille). Täytä kohdat `[HAKASULUT]` ja lähetä.

---

## Kopioitava prompt (täytä ja lähetä)

```
Lisää Koodisampo-pelin encounter-kysymyksiä.

## Konteksti
- Repo: koodisampo — toimisto-oppimispeli, NPC-kohtaamisissa monivalintakysymyksiä
- Kysymykset: `content/question-banks/*.json`
- Lataus: `hosts/terminal/encounterQuestions.mjs` (lue olemassa olevat pankit ennen kirjoittamista)
- Inventaario: `npm run questions:list`
- Suunnitelma: `docs/question-bank-scale-plan.md`

## Pyyntö
- **Aihe / domain:** [esim. git, typescript, kubernetes, cmake, redis]
- **Lähteet (viralliset URL:t):** [esim. https://git-scm.com/doc, https://www.typescriptlang.org/docs/]
- **Luvut (chapter):** [esim. git-branch, git-rebase, git-merge — tai ehdota itse]
- **Määrä:** [esim. 15 kysymystä, vähintään 3 per luku]
- **Kieli:** promptit ja palaute suomeksi
- **Tyyli:** käytännön työtilanne (code review, prod-incident, sprint, debug) — ei kuivia definitsiokysymyksiä

## Skeema (noudata tarkasti)
Jokainen kysymys JSON-objektina:

{
  "id": "uniikki-kebab-case-koko-kokoelmassa",
  "chapter": "luku-joka-yhdistyy-npc-topic-kenttaan",
  "domain": "domain-avain",
  "difficulty": 1-5,
  "audiences": ["coworker", "guru"],  // vähintään yksi: coworker, guru, security, ceo, project-lead, secretary, hostile
  "prompt": "Kysymys suomeksi?",
  "choices": [
    { "text": "Oikea vastaus", "correct": true },
    { "text": "Harhaanjohtava A", "correct": false },
    { "text": "Harhaanjohtava B", "correct": false },
    { "text": "Harhaanjohtava C", "correct": false }
  ],
  "correctFeedback": "Miksi oikein — viittaa lähteeseen",
  "wrongFeedback": "Miksi väärin — ei sävyä joka paljastaa oikean",
  "sourceRef": "lahde/polku#ankkuri",
  "sourceUrl": "https://virallinen-dokumentaatio/...",
  "featureId": "domain:aihe-avain",
  "featurePoints": 2-5
}

Valinnainen diff 4–5: "studyNotes" — 2–4 lausetta AI-opetusnäkymään.

Pankkitaso:
{
  "id": "pankki-id",
  "domain": "domain-avain",
  "source": "https://paalähde/",
  "questions": [ ... ]
}

## Säännöt
1. `id` uniikki — tarkista `npm run questions:list -- --json` ettei ole duplikaatteja
2. Täsmälleen yksi `"correct": true` per kysymys
3. 4 valintaa (tai vähintään 2)
4. Väärät vastaukset uskottavia — ei pilkkaa tai ilmeisiä vitsejä
5. Älä kopioi lähdetekstiä sellaisenaan; kirjoita alkuperäinen skenaario
6. Vain julkisia, luotettavia lähteitä (virallinen docs, RFC, MDN, man-sivut)
7. `featureId` muodossa `domain:slug` (esim. `git:rebase`, `k8s:pod-restart`)

## Pelilogiikan päivitys (jos uusi domain tai luku)
Päivitä myös koodi — älä lisää vain JSONia:

1. `hosts/terminal/encounterQuestions.mjs`
   - `TOPIC_DOMAINS` — chapter → domain
   - `TOPIC_LABELS` — suomenkielinen nimi NPC-dialogissa
   - `VOICES.colleague` — domain-kohtainen kehys (jos uusi domain)
   - `jokesForQuestion` — valinnainen vitsipooli

2. `hosts/terminal/mapGenerator.mjs`
   - `DEV_TOPICS` tai vastaava — NPC:n `topic`-arvo
   - `ROOM_TOPIC_BIAS` — mitkä huonetyypit suosivat aihetta

3. `scripts/questions-list.mjs` — `EXPECTED_CHAPTERS`

4. `docs/question-bank-scale-plan.md` — lähteet ja taxonomy (jos merkittävä uusi aihe)

5. `test/encounter.test.mjs` — assert että domain latautuu ja topic-bias toimii

## Toimitus
- Lisää kysymykset olemassa olevaan pankkiin TAI luo `content/question-banks/[nimi].json`
- Aja `npm run questions:list` ja raportoi uudet määrät
- Aja `node test/encounter.test.mjs`
- Älä commitoi ellei pyydetä
```

---

## Esimerkkejä täytetystä pyynnöstä

### Esimerkki A — uusi domain (Git)

```
## Pyyntö
- **Aihe / domain:** git
- **Lähteet:** https://git-scm.com/doc , https://git-scm.com/book/en/v2
- **Luvut:** git-branch, git-merge, git-rebase, git-stash
- **Määrä:** 12 kysymystä (3 per luku)
```

### Esimerkki B — täydennä olemassa olevaa (PostgreSQL)

```
## Pyyntö
- **Aihe / domain:** postgres (olemassa oleva pankki postgresql-tuning.json)
- **Lähteet:** https://www.postgresql.org/docs/current/
- **Luvut:** pg-vacuum, pg-config (ohuet — alle 3 kpl)
- **Määrä:** 6 uutta kysymystä näihin lukuihin
- **Älä** luo uutta domainia
```

### Esimerkki C — uusi aliaihe olemassa olevassa domainissa (Qt Quick)

```
## Pyyntö
- **Aihe / domain:** qt (lisää qt-dev.json)
- **Lähteet:** https://doc.qt.io/qt-6/qtquick-index.html
- **Luvut:** qt-quick (uusi chapter — vaatii TOPIC_DOMAINS-päivityksen)
- **Määrä:** 5 kysymystä QML/Qt Quick -kohtaamisista
```

---

## Nopea inventaario ennen pyyntöä

Aja repossa:

```bash
cd /Users/terotolonen/proj/koodisampo
npm run questions:list
# tai täysi lista:
npm run questions:list -- --json | head -200
```

Liitä chatille tuloste tai kerro: *"Täydennä ohuita lukuja: pg-vacuum, qt-models, scrum-dor"*.

---

## Hyväksytyt domainit tällä hetkellä

| domain | pankki | Esimerkki-chapterit |
|--------|--------|---------------------|
| cpp | cpp-best-practices.json | tools, safety, style, … |
| scrum | scrum-best-practices.json | scrum-dod, scrum-sprint, … |
| linux | linux-ops.json | systemd, journald, avahi, … |
| docker | docker-ops.json | docker, docker-network |
| qt | qt-dev.json | qt-widgets, qt-shaders, qt-opengl, … |
| javascript | javascript-web.json | js-async, js-types, … |
| postgres | postgresql-tuning.json | pg-indexes, pg-explain, … |

Uusi domain (esim. `git`, `typescript`, `cmake`, `redis`, `kubernetes`) on OK — muista pelilogiikan päivityslistan kohdat.

---

## Vaikeusaste (ohje kirjoittajalle)

| Taso | Kuvaus |
|------|--------|
| 1–2 | Peruskäsite, aloittelija tunnistaa |
| 3 | Tyypillinen työpäivän ongelma |
| 4 | Diagnostiikka / trade-off / useampi vaihtoehto |
| 5 | Syvä osaaminen, tuotanto, reunatapaus |

Jakauma per erä: noin 20 % helppo, 40 % keskitaso, 30 % vaikea, 10 % expert.

---

## audiences — kuka kysyy

| audience | NPC-tyyppi | Sävy |
|----------|------------|------|
| coworker | työkaveri | code review, arkinen ongelma |
| guru | mentori | syvempi tekninen |
| security | turvallisuus/audit | compliance, riski |
| project-lead | Scrum/PL | sprint, prioriteetti |
| ceo | johto | strateginen, bisnesnäkökulma |
| secretary | sihteeri | prosessi, lomake |
| hostile | vihamielinen NPC | painostava, vaikeampi |

Vähintään `coworker` tai `guru` useimmissa kysymyksissä.
