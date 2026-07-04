# Laatuarvio: postgres / pg-config (33 oppituntia)

> Aja uudelleen: `node scripts/check-lesson-quality.mjs pg-config postgres`

## Yhteenveto

| Mittari | Tulos |
|---------|-------|
| Tiedostoja | 33/33 ✅ |
| Rakenne (≥3 osiota) | 33/33 ✅ |
| "Miksi muut" -osiota | 0 ✅ |
| ≥2 prosa-kappaletta/osio | 33/33 ✅ |
| ≥250 sanaa (tavoite) | 1/33 (vain `b03-pg-config-statements-ext`) |
| Keskimäärin sanoja | ~170 |

**Johtopäätös:** Erä on **julkaisukelpoinen luonnos** — rakenne ja sisältö oikein, mutta useimmat ovat lyhyempiä kuin tavoite (2–4 kappaletta × syvä selitys). Vertaa referenssiin `b03-pg-config-statements-ext.md` (~470 sanaa, 5 osiota).

## Vahvuudet

- Oikea vastaus ja GUC/työkalu kunkin kysymyksen kontekstissa
- Yhtenäinen rakenne: Tilanne → Ratkaisu → Tuotannossa/Taustaa
- Ei duplikaatti-promptia Docusauruksessa (synkki + `#`-otsikko)
- Ei turhaa "Miksi muut eivät kelpaa?" -listaa
- Koodiesimerkit (`postgresql.conf`, `SET work_mem`) olennaisissa kohdissa
- Viralliset lähteet linkitetty synkissä (`sourceUrl`)

## Heikkoudet / parannettavaa

### 1. Toistuvat aiheet (kysymyspankin luonne)

Sama konsepti useassa kysymyksessä — oppitunnit toistavat osin samaa:

| Teema | Kpl | Esimerkit |
|-------|-----|-----------|
| `shared_buffers` ~25 % RAM | 8 | b02-shared-14, b05/b07/b08/b09/b10, exp-shared-buffers |
| `work_mem` sort/hash spill | 9 | b02-work-mem-13, b05/b07/b08/b09, exp/pg-config-work-mem |
| `log_min_duration_statement` | 4 | b04/b05, b07-log-slow |
| PgBouncer / connections | 4 | b02-connections, b08-max-conn, b09-pgbouncer, exp-max-conn |
| `effective_cache_size` | 2 | b03/b04-effective-cache |

**Ehdotus:** Säilytä erilliset tiedostot (eri kysymys-id), mutta lisää 1 lause ristiviittauksesta: *"Ks. myös `b05-pg-config-shared-buffers` — sama GUC, eri skenaario."*

### 2. Pituus alle tavoitteen

Useimmat ~130–220 sanaa. Tavoite oli 2–4 **syvää** kappaletta per osio. Nykyinen: typically 2 kappaletta × 3 osiota = riittää minimitarkistukseen, ei referenssitasoa.

**Prioriteetti laajennukseen** (lyhimmät):

- `b09-pg-config-work-mem` (129 sanaa)
- `b09-pg-config-pgbouncer-pool` (133)
- `b08-pg-config-max-connections` (144)
- `b06-pg-config-track-io-timing` (140)

### 3. Referenssitaso

`b03-pg-config-statements-ext.md` — hyvä malli: Käyttöönotto-vaiheet, SQL-esimerkki top-10-listalle, tuotanto-/turvallisuushuomiot.

Muut voisi nostaa samalle tasolle lisäämällä yhden konkreettisen esimerkin (conf-rivi, `EXPLAIN`-tulkinta tai mittauskomento) per oppitunti.

## Hyväksyntäehdotus

| Vaihtoehto | Toimenpide |
|------------|------------|
| **A — Merge nyt** | OK oppimateriaaliksi; laajennus erissä |
| **B — Laajenna ensin** | Nosta 10 lyhintä ≥300 sanaan ennen mergeä |
| **C — Referenssi + linkit** | Lisää ristiviittaukset toistuviin teemoihin, merge |

## Tarkistuskomennot

```bash
node scripts/check-lesson-quality.mjs pg-config postgres
npm run study:todo
npm run study:sync
node test/study_lesson_todo.test.mjs
```
