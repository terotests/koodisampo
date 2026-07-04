# Sovellus avaa 500 suoraa PG-yhteyttä — CPU context switch helvetti. Arkkitehtuurikorjaus?

## Tilanne

Sovellus (tai 500 instanssia × yksi yhteys) avaa suoraan PostgreSQLiin satoja backend-yhteyksiä. Jokainen yhteys on erillinen prosessi muistineen. CPU käyttää aikaa kontekstinvaihtoihin, `pg_stat_activity` täyttyy, ja latenssi kasvaa — vaikka yksittäiset kyselyt olisivat nopeita.

PostgreSQL skaalaa huonosti tuhansiin samanaikaisiin yhteyksiin. `max_connections = 500` pahentaa ongelmaa: enemmän prosesseja, enemmän overheadia. Ratkaisu on arkkitehtuurinen, ei pelkkä konfig-nosto.

## Ratkaisu

**Connection pooler (PgBouncer) — pidä max_connections kohtuullisena** on oikea korjaus. PgBouncer multiplexaa monen sovellusyhteyden alleen harvempaan backend-yhteyteen PostgreSQLiin.

```
App (500 conn) → PgBouncer (50 backend conn) → PostgreSQL
```

Transaction pooling vapauttaa backend-yhteyden heti transaktion jälkeen. `max_connections` PostgreSQLissä asetetaan poolerin kapasiteetin mukaan (esim. 100–200), ei sovellusinstanssien määrän mukaan.

PostgreSQL connection establishment -dokumentaatio korostaa poolauksen merkitystä.

## Tuotannossa

PgBouncer-konfig: `pool_mode`, `default_pool_size`, `max_client_conn`. Prepared statements ja session-tila vaativat usein session poolingia.

Monitoroi poolerin jonotus ja PostgreSQLin `numbackends`. `too many connections` → pooleri ensin, ei `max_connections = 10000`.
