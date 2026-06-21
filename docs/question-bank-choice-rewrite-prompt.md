# Aliagentti: kysymysvaihtoehtojen uudelleenkirjoitus

Tämä dokumentti ohjaa järjestelmällistä **valintojen** (choices) uudelleenkirjoitusta. **Älä muuta** `prompt`, `id`, `correctFeedback`, `wrongFeedback` tai muita kenttiä — vain `choices[].text`.

## Ongelma

~94 % kysymyksistä: oikea vastaus on **pidempin** ja **spesifisin**. Pelaaja arvaa oikein valitsemalla pisimmän vaihtoehdon.

Esimerkki (huono):

```
[1] std::visit(visitor, variant) — overload setti lambdailla   ← oikea, selvästi pisin
[2] variant.get<int>() aina
[3] union korvaa variantin
[4] dynamic_cast variantille
```

## Tavoite

Jokainen vaihtoehto:

1. **Samanpituisia** (±30 % merkkimäärästä, tavoite 35–90 merkkiä)
2. **Yhtä uskottavia** — väärät eivät saa olla pilkkana tai absurdeja
3. **Sama rakenne** — esim. kaikki alkaa API-nimellä tai kaikki ovat täysiä lauseita
4. **Ei paljasta oikeaa** — vältä "aina", "koskaan", ilmeisiä virheitä vain väärissä
5. **Säilyttää pedagogisen pisteen** — oikea vastaus pysyy faktuaalisesti oikeana

## Kirjoitussäännöt

### Tee

- Kirjoita **kaikki neljä** vaihtoehtoa uudestaan, älä vain lyhennä oikeaa
- Käytä **samanlaista terminologiaa** kaikissa (esim. kaikki mainitsevat `std::variant` tai vastaavan)
- Tee vääristä **realistisia työpaikkavirheitä** (colleague valitsisi reviewissa)
- Vaihtele mikä on lyhin/pisin — **oikea ei saa olla selvästi pisin**
- Säilytä `correct: true/false` merkinnät oikeissa paikoissa

### Älä tee

- Älä lyhennä oikeaa vastausta yhdeksi sanaksi ja jätä muita pitkinä
- Älä käytä pilkkaavia väärän vastauksen muotoja ("bugi kääntäjässä", "union korvaa")
- Älä lisää uusia faktoja jotka muuttavat oikean vastauksen sisältöä
- Älä muuta kysymyksen aihetta
- Älä käytä mekaanista täyttöä (" — kääntäjä hoitaa automaattisesti" kaikille)

## Hyvä esimerkki (sama kysymys uudelleen)

**Prompt:** std::variant<int, string> — switch-tyylinen käsittely ilman visitor-luokkaa. Moderni tapa?

```json
"choices": [
  { "text": "std::visit + overloadattu lambda-setti käsittelee jokaisen alternative-tyypin", "correct": true },
  { "text": "std::get<int> riittää kun aktiivinen tyyppi vaihtelee ajonaikaisesti", "correct": false },
  { "text": "dynamic_cast std::variant-olioon valitsee oikean haaran kuten perinnössä", "correct": false },
  { "text": "C-tyylinen union korvaa variantin kun tyypit mahtuvat samaan muistiin", "correct": false }
]
```

Huomaa: pituudet lähellä toisiaan, kaikki kuulostavat ammattimaisilta, vain yksi on oikea.

## Työnkulku

1. Lue erä: `scripts/data/choice-rewrite-batches/{pankki}-o{offset}-l{limit}.json`
2. Kirjoita tulos: `scripts/data/choice-rewrites/{pankki}-o{offset}.json`:

```json
{
  "bank": "cpp-best-practices.json",
  "rewrites": [
    {
      "id": "b08-cpp-variant-visit",
      "choices": [
        { "text": "...", "correct": true },
        { "text": "...", "correct": false },
        { "text": "...", "correct": false },
        { "text": "...", "correct": false }
      ]
    }
  ]
}
```

3. Validoi: `node scripts/choices-apply-rewrite.mjs scripts/data/choice-rewrites/FILE.json --dry-run`
4. Sovella: `node scripts/choices-apply-rewrite.mjs scripts/data/choice-rewrites/FILE.json`
5. Tarkista vinouma: `node scripts/choices-bias-report.mjs --bank cpp-best-practices.json`

## Laatukriteeri (itsearviointi per kysymys)

Ennen tallennusta, jokaiselle kysymykselle:

- [ ] Oikea vastaus ei ole selvästi pisin (max 1.25× väärän keskiarvosta)
- [ ] Kaikki neljä vaihtoehtoa voisi sanoa ääneen kollegalle ilman naurua
- [ ] Väärät vastaukset ovat eri virheitä, eivät sama idea eri sanoin
- [ ] Faktuaalinen oikea vastaus säilyy (tarkista correctFeedback jos epäilet)

## Erät pankkikohtaisesti

| Pankki | kysymyksiä | suositeltu eräkoko |
|--------|------------|-------------------|
| cpp-best-practices.json | ~178 | 35–45 |
| docker-ops.json | ~142 | 35 |
| linux-ops.json | ~140 | 35 |
| postgresql-tuning.json | ~142 | 35 |
| scrum-best-practices.json | ~142 | 35 |
| javascript-web.json | ~134 | 35 |
| qt-dev.json | ~134 | 35 |
| backend-ops.json | ~5 | koko pankki |
| git-ci.json | ~4 | koko pankki |
| web-security.json | ~4 | koko pankki |

Käytä `--only-biased` viedessä vain vinoutuneita kysymyksiä, jos haluat keskittyä ongelmiin.
