# Sama parametrikysely ajetaan miljoonia kertoja. Hyöty prepared statementista?

## Tilanne

API-endpoint hakee tilauksen ID:llä — sama kysely, eri parametri jokaisella HTTP-pyynnöllä:

```sql
SELECT id, status, total, created_at
FROM orders
WHERE id = $1;
```

Sovellus avaa uuden yhteyden tai lähettää raakatekstin joka kerta. PostgreSQL joutuu parsemaan ja suunnittelemaan kyselyn uudelleen — parseri ja suunnittelija kuluttavat CPU:a, vaikka SQL-teksti on identtinen.

Miljoonalla pyynnöllä päivässä parse/plan -kuorma on mitattavissa. Erityisesti monimutkaisissa JOIN-kyselyissä suunnittelukustannus on merkittävä.

## Ratkaisu

**Prepared statement — parse/plan cache, vakaa suunnitelma:**

```sql
PREPARE get_order (bigint) AS
  SELECT id, status, total, created_at
  FROM orders
  WHERE id = $1;

EXECUTE get_order(12345);
```

Sovelluskerroksessa (JDBC, pgx, node-pg) prepared statement on oletus tai yksi rivi:

```javascript
await client.query({
  name: 'get-order',
  text: 'SELECT id, status, total, created_at FROM orders WHERE id = $1',
  values: [orderId]
});
```

Prepared statements ovat design + performance -käytäntö: vähemmän parserikuormaa, suunnitelma cachettuu istunnossa (tai globaalisti `plan_cache_mode`-asetuksilla). Parametrisoitu kysely estää myös SQL-injektion.

## Käytännössä

PgBouncer transaction pooling -tilassa prepared statementit vaativat huomiota (`DEALLOCATE ALL`, `max_prepared_statements`). Session pooling säilyttää prepared statementit luontevasti.

`pg_stat_statements` näyttää saman query-patternin yhtenä rivinä parametreineen — helpottaa seurantaa.

Vältä prepared statement -kierron luomista dynaamisella SQL:llä (`WHERE id = $1 AND optional_filter = $2` vs erilliset kyselyt) — liian monta eri plania tyhjentää cachen hyödyn.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
