# Kysely palauttaa odottamattoman monta riviä: 1000 × 1000. Todennäköisin virhe?

## Tilanne

Raportti yhdistää tuotteet ja toimittajat. Odotettu tulos on noin tuhat tuotetta — mutta kysely palauttaa miljoona riviä ja ajaa loppumuistiin.

```sql
SELECT p.name, s.supplier_name
FROM products p, suppliers s;
```

Tai eksplisiittisemmin:

```sql
SELECT p.name, s.supplier_name
FROM products p
JOIN suppliers s;
```

Huomaatko mitä puuttuu? `ON`-ehto. Ilman join-ehtoa jokainen tuote yhdistyy jokaiseen toimittajaan: 1000 × 1000 = 1 000 000 riviä. Tämä on karteesinen tulo (Cartesian product).

Sama tapahtuu, jos join-ehto viittaa väärään sarakkeeseen tai on aina tosi (`ON 1=1` vahingossa).

## Ratkaisu

**Puuttuva tai väärä JOIN-ehto — karteesinen tulo kahdesta taulusta.**

Korjaus:

```sql
SELECT p.name, s.supplier_name
FROM products p
JOIN suppliers s ON s.id = p.supplier_id;
```

Tarkista aina `FROM`/`JOIN ON` -ehdot, kun rivimäärä "räjähtää". Odotettu rivimäärä ≈ suurempi taulu (inner join) tai summa (outer join) — ei taulujen kertolasku.

Legacy `FROM a, b WHERE ...` -syntaksi vaatii saman tarkistuksen: puuttuva WHERE-ehto tuottaa saman karteesisen tulon.

## Käytännössä

Ennen raportin tuotantoon vientiä aja `SELECT count(*)` ilman sarakelistaa — vertaa odotettuun. Jos luku on miljoonissa ja tauluissa tuhansia rivejä, etsi puuttuva `ON`.

SQL-linterit (sqlfluff, pg_query) ja code review -checklist voivat vaatia eksplisiittisen `JOIN ... ON` jokaiselle liitokselle. Vältä implisiittisiä pilkkujoinia — ne piilottavat virheet helpommin.

`EXPLAIN` näyttää `Nested Loop` miljoonilla riveillä ja `rows`-estimate kertoo karkeasti odotetun koon ennen varsinaista ajoa.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
