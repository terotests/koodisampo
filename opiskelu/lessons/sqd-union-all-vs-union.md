# Yhdistät kahden alueen myyntirivit; duplikaatteja ei pitäisi syntyä. Valinta?

## Tilanne

Konserniraportti yhdistää Pohjois- ja Etelä-Euroopan myyntidatan. Jokainen alue on oma taulunsa — alueet eivät jaa asiakkaita eikä tilausnumeroita:

```sql
-- Pohjoinen alue
SELECT region, product_id, amount FROM sales_north;

-- Eteläinen alue
SELECT region, product_id, amount FROM sales_south;
```

Kehittäjä yhdistää:

```sql
SELECT region, product_id, amount FROM sales_north
UNION
SELECT region, product_id, amount FROM sales_south;
```

`UNION` (ilman ALL) deduplikoi tulokset — se sorttaa ja vertaa rivejä, vaikka päällekkäisyyttä ei voi syntyä alueiden erillisyyden vuoksi. Miljoonan rivin raportissa deduplikointi on turhaa työtä.

## Ratkaisu

**`UNION ALL` kun joukot ovat erillisiä — nopeampi, ei deduplikointia:**

```sql
SELECT region, product_id, amount FROM sales_north
UNION ALL
SELECT region, product_id, amount FROM sales_south;
```

`UNION ALL` liittää result setit suoraan yhteen. Käytä tavallista `UNION`:ia vain kun duplikaatit ovat mahdollisia ja ne pitää poistaa — tai kun et ole varma joukkojen erillisyydestä.

## Käytännössä

Ennen `UNION ALL`:ia varmista liiketoimintalogiikalla, ettei sama rivi voi tulla molemmista lähteistä. Jos lähteet voivat päivittää historiatietoa päällekkäin, `UNION` tai eksplisiittinen deduplikointi on turvallisempi.

`EXPLAIN ANALYZE` näyttää `Append` + `UNION ALL`:lle vs ylimääräisen `HashAggregate`/`Unique` -vaiheen `UNION`:lle.

Dokumentoi raportin kommenttiin: "UNION ALL — alueet disjoint". Se estää jonkun "korjaamasta" sen `UNION`:iksi turvallisuussyistä ilman analyysiä.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
