# Planner arvioi 100 riviä — todellisuudessa 100000. Ensimmäinen toimenpide?

## Tilanne

`EXPLAIN` näyttää `rows=100` mutta `EXPLAIN ANALYZE` paljastaa `actual rows=100000`. Planner valitsee seq scanin tai nested loopin, koska se luulee kyselyn olevan halpa. Todellisuudessa suunnitelma on väärä — kysely on 1000× hitaampi kuin arvio.

Tämä ei ole planner-bugi vaan **vanhentuneet tilastot**. Bulk load, massapäivitykset tai uusi indeksi ilman ANALYZE:a jättävät `pg_stats`-arvot vanhoiksi.

## Ratkaisu

Aja ensin:

```sql
ANALYZE table_name;
```

tai koko skeemalle `ANALYZE schema_name;`. ANALYZE päivittää rivimäärä- ja jakauma-arviot, joita planner käyttää cost-laskennassa.

Vasta ANALYZE:n jälkeen arvioi suunnitelma uudelleen `EXPLAIN (ANALYZE, BUFFERS)`:lla. `REINDEX` ei korjaa tilastoja — se rakentaa indeksin uudelleen. `VACUUM FULL` ei korvaa ANALYZE:a tilastojen päivitykseen.

## Taustaa

Autovacuum voi ajaa ANALYZE:a automaattisesti, mutta bulk loadin jälkeen manuaalinen ANALYZE on usein pakollinen. Extended statistics (`CREATE STATISTICS`) auttaa korreloituneissa sarakkeissa, jos yksinkertainen ANALYZE ei riitä.

[Lue lisää](https://www.postgresql.org/docs/current/sql-analyze.html)
