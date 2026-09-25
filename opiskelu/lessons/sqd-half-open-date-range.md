# Kuukausiraportti: `WHERE created_at BETWEEN '2024-03-01' AND '2024-03-31'`, ja created_at on timestamptz. Osa 31.3. tehdyistä tilauksista puuttuu. Miksi ja miten korjaat?

## Tilanne

Maaliskuun myyntiraportti:

```sql
SELECT SUM(total)
FROM orders
WHERE created_at BETWEEN '2024-03-01' AND '2024-03-31';
```

Kirjanpito huomaa, että 31.3. päivän kauppa puuttuu lähes kokonaan.

## Ratkaisu

Käytä **puoliavointa väliä**: alaraja mukaan, yläraja ei.

```sql
WHERE created_at >= '2024-03-01'
  AND created_at <  '2024-04-01'
```

## Taustaa

`BETWEEN a AND b` on suljettu väli (`>= a AND <= b`). Kun sarake on aikaleima, pelkkä päivämäärä `'2024-03-31'` tarkoittaa **31.3. klo 00.00.00**, joten kaikki sen päivän myöhemmät tapahtumat jäävät pois.

Puoliavoin väli toimii mille tahansa tarkkuudelle (päivä, tunti, mikrosekunti), peräkkäiset jaksot eivät mene päällekkäin eivätkä jätä aukkoja, ja ehto käyttää `created_at`-indeksiä. Muunnos `created_at::date BETWEEN ...` antaisi oikean tuloksen, mutta funktio sarakkeella estää tavallisen indeksin käytön.

[Lue lisää](https://www.postgresql.org/docs/current/functions-datetime.html)
