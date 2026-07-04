# API sallii sorttaussarakkeen nimen. Turvallinen toteutus?

## Tilanne

REST-API listaa tuotteita ja sallii sorttauksen query-parametrilla:

```
GET /products?sort=price&order=desc
```

Kehittäjä liittää parametrin suoraan SQL:ään:

```javascript
// VAARALLINEN
const sql = `SELECT * FROM products ORDER BY ${req.query.sort} ${req.query.order}`;
```

Hyökkääjä lähettää `sort=price; DROP TABLE products--` tai `order=desc, (SELECT pg_sleep(10))`. ORDER BY -kohta ei parametrisoidu samalla tavalla kuin WHERE-arvot — `$1` ei kelpaa sarakkeen nimeen.

## Ratkaisu

**Whitelist** sallituista sarakkeista ja suuntauksista — käyttäjän syöte valitsee vain esivalidoitujen vaihtoehtojen joukosta:

```javascript
const ALLOWED_SORT = {
  price: 'price',
  name: 'name',
  created_at: 'created_at',
};
const ALLOWED_ORDER = { asc: 'ASC', desc: 'DESC' };

const sortCol = ALLOWED_SORT[req.query.sort] ?? 'created_at';
const sortDir = ALLOWED_ORDER[req.query.order?.toLowerCase()] ?? 'DESC';

const sql = `SELECT * FROM products ORDER BY ${sortCol} ${sortDir}`;
```

PostgreSQL-puolella vastaava:

```sql
-- sort_col ja sort_dir validoitu sovelluksessa ennen kyselyä
SELECT * FROM products ORDER BY price DESC;
```

Käyttäjä ei koskaan anna raakaa SQL-identifiointia — vain avaimen, joka mapataan kiinteään sarakkeen nimeen.

## Käytännössä

Dynaaminen ORDER BY, LIMIT OFFSET -sarakkeet ja taulun nimet vaativat whitelistin tai `quote_ident()` + tiukka validointi. Parametrisoidut kyselyt eivät riitä tunnisteisiin.

Dokumentoi API:ssa sallitut `sort`-arvot. Lisää testit, jotka varmistavat, että tuntematon arvo palauttaa oletuksen eikä virhettä, joka vuotaa skeemaa.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
