# Et muista paketin tarkkaa nimeä mutta tiedät sen liittyvän JSON-käsittelyyn. Miten etsit?

## Tilanne

Node.js-skripti tarvitsee komentorivityökalun JSON-tiedostojen muotoiluun. Muistat, että Debianissa on `jq`-niminen työkalu, mutta et ole varma — ehkä paketti on `jsonpp`, `python3-json.tool` tai jokin muu. `apt install jq` toimii vain jos nimi osuu oikein.

Pelkkä arvaaminen on hidasta:

```bash
sudo apt install json-formatter
# E: Unable to locate package json-formatter

sudo apt install jq-tool
# E: Unable to locate package jq-tool
```

Tarvitset haun, joka katsoo sekä pakettinimiä että kuvauksia — ei vain tarkkaa nimeä.

## Ratkaisu

Etsi paketteja avainsanalla:

```bash
apt search json
```

Tai vanhempi, yhteensopiva muoto:

```bash
apt-cache search json
```

Molemmat etsivät pakettinimistä ja kuvauksista kaikista saatavilla olevista paketeista. Tulosteesta löydät esimerkiksi:

```
jq/jammy 1.6-2.1ubuntu3 amd64
  lightweight and flexible command-line JSON processor
```

Kun oikea paketti on tunnistettu, tarkista lisätiedot ennen asennusta:

```bash
apt show jq
sudo apt install jq
```

`apt search` on interaktiivinen ja värikkäämpi; `apt-cache search` toimii skripteissä ja vanhemmissa ympäristöissä samalla tavalla.

## Käytännössä

Rajaa hakua tarvittaessa: `apt search '^jq'` etsii vain nimen alusta. Tuotantopalvelimella asenna paketit vain tarpeen mukaan — `apt search` on löytämistä varten, ei asennuslistaa. Dokumentoi löydetyt paketinimet infrastruktuurikoodiin, jotta seuraava kehittäjä ei joudu hakemaan uudelleen.

[Lue lisää](https://manpages.debian.org/bookworm/apt/apt-cache.8.en.html)
