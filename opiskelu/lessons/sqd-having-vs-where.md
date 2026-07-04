# Haluat rivit joissa `status = 'active'` ennen ryhmittelyä. Mihin ehto kuuluu?

## Tilanne

Raportti laskee aktiivisten tilausten summat asiakaskohtaisesti. Kehittäjä kirjoittaa:

```sql
SELECT customer_id, sum(total) AS revenue
FROM orders
GROUP BY customer_id
HAVING status = 'active';
```

Kysely saattaa antaa virheen (`status must appear in GROUP BY`) tai tuottaa väärän tuloksen, riippuen PostgreSQLin asetuksista ja siitä, miten aggregointi tulkitaan. Ongelma on järjestyksessä: `HAVING` suodattaa aggregoinnin *jälkeen* muodostuneita ryhmiä, ei yksittäisiä rivejä ennen ryhmittelyä.

Jos taulussa on sekä aktiivisia että peruutettuja tilauksia samalle asiakkaalle, väärä ehto voi sisällyttää peruutettujen rivien summia tai jättää asiakkaan kokonaan pois.

## Ratkaisu

**`WHERE status = 'active'` ennen `GROUP BY` — suodata rivit ennen aggregointia:**

```sql
SELECT customer_id, sum(total) AS revenue
FROM orders
WHERE status = 'active'
GROUP BY customer_id;
```

`WHERE` suodattaa rivejä ennen ryhmittelyä; `HAVING` suodattaa ryhmiä aggregoinnin jälkeen (esim. `HAVING sum(total) > 1000`). Aktiivisuus on rivitason attribuutti — se kuuluu `WHERE`:een.

Muistisääntö: jos ehto viittaa yksittäiseen riviin ilman aggregaattia, se on `WHERE`:ssä. Jos ehto viittaa aggregaatin tulokseen (`count(*) > 5`), se on `HAVING`:ssä.

## Käytännössä

Ennen kuin lisäät `HAVING`-ehdon, kysy: "Voiko tämän tarkistaa yhdelle riville ennen GROUP BY:tä?" Jos kyllä, käytä `WHERE`. Se antaa optimoijalle mahdollisuuden käyttää indeksiä `status`-sarakkeella ja vähentää aggregoitavien rivien määrää.

Raporttikyselyissä dokumentoi kommenteilla, miksi ehto on WHERE:ssä tai HAVING:ssa — se estää myöhemmät "korjaukset", jotka siirtävät ehtoa väärään paikkaan.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
