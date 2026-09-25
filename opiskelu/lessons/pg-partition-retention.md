# Lokitaulusta poistetaan joka yö yli 90 päivää vanhat rivit DELETEllä. Taulu paisuu, eikä autovacuum ehdi. Kestävämpi rakenne?

## Tilanne

`app_logs` saa kymmeniä miljoonia rivejä kuukaudessa. Yöajo poistaa yli 90 päivää vanhat:

```sql
DELETE FROM app_logs WHERE created_at < now() - interval '90 days';
```

Jokainen ajo tuottaa miljoonia dead tupleja, taulu paisuu, autovacuum pyörii tuntikausia, ja replikointiviive kasvaa.

## Ratkaisu

**Osioi taulu aikaleiman mukaan** ja poista vanhat tiedot kokonaisina osioina:

```sql
CREATE TABLE app_logs (
  id bigint GENERATED ALWAYS AS IDENTITY,
  created_at timestamptz NOT NULL,
  message text
) PARTITION BY RANGE (created_at);

CREATE TABLE app_logs_2024_03 PARTITION OF app_logs
  FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

-- säilytysajan jälkeen:
ALTER TABLE app_logs DETACH PARTITION app_logs_2023_12 CONCURRENTLY;
DROP TABLE app_logs_2023_12;
```

Uudet osiot luodaan etukäteen ajastetulla jobilla (tai esim. pg_partman-laajennuksella).

## Taustaa

Osion pudotus on metatietomuutos: dead tupleja ei synny, vacuumia ei tarvita ja levytila vapautuu heti. Kyselyt, joissa on aikarajaus, lukevat vain tarvittavat osiot (partition pruning).

`VACUUM FULL` lukitsisi koko taulun, indeksi ei vähennä DELETEn tuottamia dead tupleja, eikä `TRUNCATE` tue WHERE-ehtoa, vaikka yksittäisen osion voi kyllä tyhjentää TRUNCATElla.

[Lue lisää](https://www.postgresql.org/docs/current/ddl-partitioning.html)
