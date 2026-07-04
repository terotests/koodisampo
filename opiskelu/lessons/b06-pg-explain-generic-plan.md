# Prepared statement plan on hidas eri parametreilla. Miten näet generic plan?

## Tilanne

Sovellus käyttää prepared statementeja: `PREPARE s AS SELECT ... WHERE id = $1`. Ensimmäiset suoritukset ovat nopeita, mutta tietyillä parametreilla (esim. harvinainen `id` vs yleinen) suunnitelma on hidas. PostgreSQL voi käyttää **custom plan** (parametrikohtainen) tai **generic plan** (parametrit riippumaton).

Haluat nähdä generic planin ilman arvaamista.

## Ratkaisu

```sql
EXPLAIN (GENERIC_PLAN) EXECUTE s (123);
```

tai suoraan:

```sql
EXPLAIN (GENERIC_PLAN) PREPARE s AS SELECT * FROM orders WHERE customer_id = $1;
```

**GENERIC_PLAN** näyttää suunnitelman, jota planner käyttää, kun se on päättänyt generalisoida (yleensä after 5 custom plan executions, `plan_cache_mode`-asetuksesta riippuen). Vertaa:

```sql
EXPLAIN EXECUTE s (1);          -- custom plan tälle parametrille
EXPLAIN (GENERIC_PLAN) EXECUTE s (1);  -- generic plan
```

Jos generic plan on huono harvinaisille parametreille, harkitse `plan_cache_mode = force_custom_plan` istunnolle tai query-kohtaisia optimointeja.

## Taustaa

Prepared statementit säästävät parse-aikaa, mutta väärä generic plan voi hidastaa outlier-parametreja. GENERIC_PLAN on diagnostiikkatyökalu, ei tuotantoasetus.

[Lue lisää](https://www.postgresql.org/docs/current/sql-prepare.html)
