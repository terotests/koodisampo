# Valintojen uudelleenkirjoitus — työsuunnitelma

## Tausta

~94 % kysymyksistä: oikea vastaus oli pisin. Mekaaninen täyttö ei riitä — älykäs uudelleenkirjoitus aliagenteilla.

## Työkalut

| Komento | Kuvaus |
|---------|--------|
| `npm run questions:bias` | Vinoumaraportti pankittain |
| `npm run questions:export-choices -- --bank FILE --only-biased` | Vie erä aliagentille |
| `npm run questions:apply-choices -- scripts/data/choice-rewrites/X.json` | Sovella (käytä `--dry-run` ensin) |
| `npm run questions:validate` | Skeemavalidointi |

Ohje: **`docs/question-bank-choice-rewrite-prompt.md`**

## Edistyminen

| Pankki | bias % | huom |
|--------|--------|------|
| backend-ops | **0%** | valmis |
| git-ci | **0%** | valmis |
| web-security | **0%** | valmis |
| cpp-best-practices | **22.5%** | ~274 jäljellä pankissa |
| linux-ops | **25.7%** | |
| javascript-web | **26.1%** | |
| scrum-best-practices | **26.1%** | |
| docker-ops | **27.5%** | |
| postgresql-tuning | **28.2%** | |
| qt-dev | **35.1%** | suurin jäljellä |
| **Yhteensä** | **26.7%** | oli **~94%** |

Rewrite-tiedostot: `scripts/data/choice-rewrites/*.json`

## Jäljellä (~274 kysymystä)

Aja `npm run questions:bias` ja käsittele vielä vinoutuneet:

```bash
npm run questions:export-choices -- --bank qt-dev.json --only-biased
# aliagentti → choice-rewrites/qt-dev-remaining.json
npm run questions:apply-choices -- scripts/data/choice-rewrites/qt-dev-remaining.json
```

Sama kaava muille pankeille kun bias > 20 %.

## Aliagentin prompt

```
Lue docs/question-bank-choice-rewrite-prompt.md
Käsittele scripts/data/choice-rewrite-batches/{PANKKI}-....json (30–70 kpl)
Kirjoita scripts/data/choice-rewrites/{PANKKI}-{erä}.json
npm run questions:apply-choices -- ... --dry-run
npm run questions:apply-choices -- ...
npm run questions:bias -- --bank {PANKKI}
```
