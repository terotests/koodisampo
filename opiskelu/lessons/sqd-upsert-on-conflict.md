# Import-ajo lisää tuotteita: uusi SKU lisätään, olemassa olevan hinta päivitetään. Koodi tekee SELECTin ja sitten INSERTin tai UPDATEn, ja rinnakkaiset ajot kaatuvat unique-virheeseen. Ratkaisu?

## Tilanne

Tuotetuonti ajetaan neljällä rinnakkaisella workerilla. Jokainen tekee rivikohtaisesti:

```sql
SELECT 1 FROM products WHERE sku = $1;
-- jos ei löydy:
INSERT INTO products (sku, name, price) VALUES ($1, $2, $3);
-- muuten:
UPDATE products SET price = $3 WHERE sku = $1;
```

Ajot kaatuvat satunnaisesti virheeseen `duplicate key value violates unique constraint`.

## Ratkaisu

Tee tarkistus ja kirjoitus yhdellä atomisella lauseella:

```sql
INSERT INTO products (sku, name, price)
VALUES ($1, $2, $3)
ON CONFLICT (sku) DO UPDATE
  SET price = EXCLUDED.price,
      name  = EXCLUDED.name;
```

Jos olemassa olevaa riviä ei haluta muuttaa, `ON CONFLICT (sku) DO NOTHING`.

## Taustaa

SELECT-sitten-INSERT on klassinen kilpailutilanne: kaksi workeria voi nähdä saman puuttuvan rivin ennen kuin kumpikaan on lisännyt sitä. `ON CONFLICT` nojaa unique-indeksiin ja ratkaisee törmäyksen tietokannan sisällä. `EXCLUDED` viittaa riviin, jota yritettiin lisätä.

Upsert vaatii unique-rajoitteen tai -indeksin konfliktisarakkeille. Rajoitteen poistaminen "virheiden välttämiseksi" tuottaisi duplikaattituotteita.

[Lue lisää](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT)
