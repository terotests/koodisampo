# Raportti: kaikki asiakkaat, myös ilman tilauksia. Join-tyyppi?

## Tilanne

Myyntitiimi haluaa asiakaslistauksen, jossa näkyy jokainen rekisteröitynyt asiakas — myös ne, jotka eivät ole vielä tilanneet mitään. Raporttiin tulee asiakkaan nimi, sähköposti ja viimeisin tilaus (tai tyhjä, jos ei tilauksia).

Kehittäjä aloittaa:

```sql
SELECT c.id, c.name, o.order_id, o.total
FROM customers c
JOIN orders o ON o.customer_id = c.id;
```

Inner join palauttaa vain asiakkaat, joilla on vähintään yksi tilaus. Uudet rekisteröityneet ilman ostoksia katoavat raportista — liiketoiminta huomaa sen vasta kuukausittaisessa tarkistuksessa.

## Ratkaisu

**`LEFT JOIN orders` — säilytä vasemman puolen rivit vaikka oikea puoli puuttuu:**

```sql
SELECT c.id, c.name, c.email, o.order_id, o.total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
```

LEFT JOIN säilyttää kaikki `customers`-rivit. Jos tilauksia ei ole, `order_id` ja `total` ovat NULL. Jos asiakkaalla on useita tilauksia, rivit moninkertaistuvat — silloin tarvitaan erillinen deduplikointi (esim. viimeisin tilaus ikkunafunktiolla).

LEFT JOIN säilyttää orphan-asiakkaat — juuri tämän raportin vaatimus.

## Käytännössä

Kun raportissa sanotaan "kaikki X, myös ilman Y", oletus on LEFT JOIN X → Y (X vasemmalla). Inner join on oletus vain kun puuttuvat matchit ovat virhe.

Jos tarvitset yhden rivin per asiakas + viimeisin tilaus, älä jätä LEFT JOIN + DISTINCT -yhdistelmää — käytä `DISTINCT ON` tai LATERAL top-1.

`count(*)` LEFT JOINissa laskee matchit — `count(o.order_id)` laskee vain oikeat tilaukset (NULL ei laske).

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
