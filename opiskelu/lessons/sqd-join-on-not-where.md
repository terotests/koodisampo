# ANSI-tyylinen join: ulkoiset suodattimet vs join-ehdot. Missä `orders.status = 'open'` jos se määrittää matchin?

## Tilanne

Raportti listaa avoimet tilaukset asiakkaineen. Kehittäjä kirjoittaa:

```sql
SELECT c.name, o.order_id, o.total
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'open';
```

Inner joinissa `status = 'open'` ON-ehdossa tai WHERE:ssa tuottaa usein saman suunnitelman — PostgreSQL voi työntää ehdon joinin alle. Mutta luettavuus ja outer join -tapaukset vaativat erottelua:

- **Match-ehto**: mikä yhdistää rivit (`customer_id`)
- **Suodatin**: mikä rajoittaa tuloksia (`status = 'open'`)

Kun liität LEFT JOIN:lla ja haluat säilyttää asiakkaat ilman avoimia tilauksia, WHERE vs ON eroaa ratkaisevasti.

## Ratkaisu

**Erottele match-ehto ja raporttisuodatin — inner joinissa WHERE on ok, outer joinissa status ON-ehtoon:**

Inner join (selkeä jako):

```sql
SELECT c.name, o.order_id, o.total
FROM customers c
JOIN orders o
  ON o.customer_id = c.id
 AND o.status = 'open';
```

Tai vastaavasti WHERE:ssa inner joinissa — mutta pidä match-ehto (`customer_id`) ON:ssa aina.

Erottele match-ehto ja raporttisuodatin — luettavuus on tavoite. ON-ehdossa match-logiikka, WHERE:ssa ulkoiset suodattimet (esim. `c.region = 'FI'`), jotka eivät muuta join-tyyppiä.

## Käytännössä

Code review -sääntö: `ON` = miten taulut liittyvät toisiinsa; `WHERE` = mitä rivejä halutaan lopputulokseen (inner join) tai mitä vasemman puolen rivejä (outer join suodatus).

Dokumentoi kommentilla `# match` ja `# filter` monimutkaisissa raporteissa. Tiimin style guide estää `status`-ehdon sekoittamisen `customer_id`-matchiin.

`EXPLAIN` ei aina paljasta eroa inner joinissa — tarkista erityisesti LEFT JOIN -kyselyissä, ettei WHERE muuta joinia inneriksi.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
