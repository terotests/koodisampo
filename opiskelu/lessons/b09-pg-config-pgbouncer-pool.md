# 500 microservice-instanssia avaa oman PG-yhteyden — `too many connections`. Ratkaisu?

## Tilanne

Microservice-arkkitehtuurissa jokainen pod avaa oman connection poolin suoraan PostgreSQLiin. 500 instanssia × useita yhteyttä = tuhansia backend-prosesseja. PostgreSQL palauttaa `too many connections` tai instanssi muuttuu hitaaksi CPU:n ja muistin hallinnan takia.

Jokainen PostgreSQL-yhteys on raskas: erillinen backend-prosessi, muisti, kontekstinvaihdot. Ongelma ei ratkea nostamalla `max_connections` rajattomasti — se pahentaa tilannetta. Tarvitaan kerros sovellusten ja PostgreSQLin väliin.

## Ratkaisu

**PgBouncer connection pooling — transaction/session pool yhteyksille** on standardiratkaisu.

```
500 microservices → PgBouncer (max_client_conn=5000) → PostgreSQL (max_connections=100)
```

PgBouncer pitää PostgreSQLiin vain poolin verran oikeita yhteyksiä. Transaction mode vapauttaa backend-yhteyden nopeasti; session mode säilyttää session-tilan (prepared statements, advisory locks).

PgBouncer usage -dokumentaatio kuvaa pool mode -valinnan vaikutukset.

## Tuotannossa

Konfiguroi `default_pool_size`, `reserve_pool_size`, `max_db_connections`. Monitoroi poolerin `SHOW POOLS` ja PostgreSQLin `pg_stat_activity`.

Sovellus yhdistää pooleriin, ei suoraan PostgreSQLiin. SSL terminaatio poolerissa tai PG:ssä riippuen arkkitehtuurista.
