# Kysymyspankin review (1000 kpl)

Päivitetty: 2026-06-21

## Yhteenveto

| Mittari | Tulos |
|---------|--------|
| Kysymyksiä | **1000** |
| Skeemavirheet | **0** (validate OK) |
| `sourceUrl` | **1000/1000** (47 alkuperäistä täytetty) |
| Identtiset promptit | **0** (2 duplikaattia korjattu) |
| chapter/domain -ristiriidat | **0** |

**Kokonaisarvio:** Pelattavissa ja teknisesti kunnossa. Erät `b02`–`b09` ovat generoituja — laatu on vaihtelevaa mutta hyväksyttävää; osa kysymyksistä testaa samaa käsitettä eri sanoin (`featureId`-päällekkäisyys).

---

## Automaattinen tarkistus

```bash
npm run questions:validate
npm run questions:list
```

`scripts/questions-validate.mjs` tarkistaa: uniikit id:t ja promptit, pakolliset kentät, yksi oikea vastaus, chapter↔domain, vaikeusaste 1–5.

---

## Korjatut ongelmat (tämä review)

1. **2 identtistä prompttia** — uudelleenkirjoitettu (b07-js-async-debounce, b05-scrum-retro-action).

2. **47 puuttuvaa `sourceUrl`** — backfill alkuperäisiin.

3. **Faktakorjaukset (2026-06-21)** — käyttäjän review-lista:
   - `b02-cpp-correct-signed-14` — size_t >= 0 on aina tosi
   - `correct-signed-unsigned` — ei väitä UB:ta
   - `b07-cpp-endian-portable` — C++20 vs C++23 byteswap
   - `b08-cpp-span-bounds` — ei span::at()
   - `b08-cpp-initializer-list-trap` — vector-overload -ansa
   - `b04-cpp-smart-ptr-make-shared` — custom deleter vs make_shared
   - `b04-cpp-init-list-initializer` — narrowing, ei sekoitettu MVP:hen
   - JS: `exp-js-types-strict-equality`, `b07-js-types-strict-equality`, `b08-js-types-strict-equals` — falsy vs == null
   - Typot: polymorfiselle, paikallisesti, destruktorit, jne.

---

## Havainnot (ei kriittisiä)

### featureId-päällekkäisyys

Sama `featureId` useassa kysymyksessä (~40 featureId:tä joilla ≥5 kysymystä). Tämä on OK karma-järjestelmälle (sama taito, eri kulma), mutta pelissä tuntuu toistolta jos kysymykset ovat liian samanlaisia.

Esimerkkejä:

| featureId | Kpl |
|-----------|----:|
| postgres:work-mem | 7 |
| postgres:shared-buffers | 7 |
| scrum:definition-of-done | 7 |
| docker:healthcheck | 6 |

**Suositus:** Pelaa 20–30 kohtaamista per domain; merkitse tylsät id:t `review/QUESTION-BANK-REVIEW.md` -listaan poistettavaksi.

### Vaikeusjakauma

| Taso | Kpl | % |
|------|----:|--:|
| 1 | 4 | 0 % |
| 2 | 206 | 21 % |
| 3 | 446 | 45 % |
| 4 | 307 | 31 % |
| 5 | 37 | 4 % |

Painottuu tasolle 3–4 — sopii coworker-NPC:ille (min difficulty 3).

### Audiences

33 kysymystä ilman `coworker`/`guru` (vain ceo, hostile, security, project-lead). Tarkoituksellista roolikohtaisille NPC:ille.

### Muoto

- ~40 prompttia alkaa pienellä kirjaimella (työtilanne-tyyli) — ei virhe.
- `tools-nullptr`: väärä vastaus `"0"` on lyhyt mutta **tarkoituksellinen** (nullptr vs nolla).
- ~71 kysymystä joissa jokin väärä vastaus on hyvin lyhyt (<12 merkkiä) — usein tarkoituksellinen (esim. `0`, `Ei`).

### Eräkohtainen laatu

| Erä | Kpl | Kommentti |
|-----|----:|-----------|
| original + exp-100 | 196 | Käsin kuratoitu, paras tyyli |
| b02–b09 | 800 | Skenaariopohjaiset, hyvä vaihtelu; satunnainen terminologiasekoitus (suomi/englanti) |
| b10 | 4 | Täydennys 1000 rajaan |

Otannassa (b06–b09) kysymykset ovat **käytännöllisiä** eivätkä irrallisia tietovisailuja.

---

## Tunnetut pelilogiikka-asiat (ei pankkivirhe)

- `encounter.test.mjs`: police-chase -haara flaky (ei liity kysymyksiin).
- `review/ISSUES.md`: avoimet kysymykset — vihje vasta väärän jälkeen (UI, ei pankki).

---

## Seuraavat parannukset (valinnainen)

1. **Satunnaisotanta** — 50 kysymystä ihmisreview (`npm run questions:list -- --json`).
2. **studyNotes** — lisää diff 5 -kysymyksiin AI-opetusta varten.
3. **CI** — `questions:validate` osaksi `test:engine`.
4. **Dedup featureId** — yhdistä liian samanlaiset kysymykset samassa featureId:ssä.

---

## Poistettavaksi / uudelleenkirjoitettavaksi ehdotuslista

Täytä pelatessa. Tällä hetkellä automaattista poistolistaa ei ole — vain 2 duplikaattia korjattu.

| id | syy |
|----|-----|
| — | — |
