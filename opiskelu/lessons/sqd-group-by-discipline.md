# Raportti: summa per alue. SELECT-listassa vain group-by-sarakkeet ja aggregaatit. Miksi?

## Tilanne

Myyntiraportti näyttää aluekohtaiset summat:

```sql
SELECT region, product_name, sum(amount)
FROM sales
GROUP BY region;
```

PostgreSQL hylkää kyselyn: `product_name` ei ole GROUP BY -listassa eikä aggregaatin sisällä. Kehittäjä ihmettelee — "haluanhan näyttää tuotteen nimen raportissa".

Ongelma on relaatiomallin johdonmukaisuus: jos ryhmittelet `region`-mukaan, yhdellä alueella voi olla satoja eri `product_name`-arvoja. SQL ei tiedä, kumman nimen valita — ensimmäisen, viimeisen, satunnaisen?

## Ratkaisu

**Vältä funktioimattomia sarakkeita ilman GROUP BY — PostgreSQL vaatii johdonmukaisuuden:**

Oikea malli riippuu tarkoituksesta:

```sql
-- Summa per alue (ei tuotenimiä)
SELECT region, sum(amount) AS total
FROM sales
GROUP BY region;

-- Summa per alue JA tuote
SELECT region, product_name, sum(amount) AS total
FROM sales
GROUP BY region, product_name;
```

GROUP BY -sääntö pakottaa selkeän aggregointimallin: jokainen ei-agregoitu sarake SELECT-listassa täytyy olla GROUP BY:ssä. Tämä estää hiljaiset virheet, joissa raportti näyttää "mielivaltaisen" tuotteen nimen per alue.

## Käytännössä

Jos tarvitset yhden edustavan arvon per ryhmä (esim. suosituin tuote alueella), käytä ikkunafunktiota tai erillistä alikyselyä — älä jätä saraketta GROUP BY:n ulkopuolelle.

PostgreSQL 9.1+ sallii funktionaaliset riippuvuudet (`GROUP BY region, product_name` vs pelkkä `product_id`), mutta periaate pysyy: määrittele eksplisiittisesti aggregointitaso.

Code reviewssa tarkista: "Voiko tämä sarake vaihdella saman ryhmän sisällä?" Jos kyllä, se kuuluu GROUP BY:hun tai aggregaattiin (`max()`, `string_agg()`).

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
