# 500 microservice instanssia × 10 connection = pool explosion. Ratkaisu?

## Tilanne

Microservice-arkkitehtuurissa jokainen pod tai prosessi avaa oman connection poolin PostgreSQLiin. Kun instansseja on 500 ja jokainen pitää vaikkapa kymmentä yhteyttä auki, tarvitset teoreettisesti 5000 backend-yhteyttä. PostgreSQL on suunniteltu satojen, ei tuhansien samanaikaisten yhteyksien malliin.

Jokainen `max_connections`-yhteys on erillinen backend-prosessi muistineen ja kontekstinvaihtoineen. CPU käyttää aikaa prosessien hallintaan, `pg_stat_activity` täyttyy, ja yksittäinen hidas query voi tukkia koko instanssin. Ongelma ei ratkea nostamalla `max_connections` rajattomasti — se pahentaa tilannetta.

Ratkaisu on arkkitehtuurinen: vähennä suoria yhteyksiä PostgreSQLiin ja keskitä ne pooleriin, joka multiplexaa vähän backend-yhteyttä monelle sovellusistunnolle.

## Ratkaisu

**Connection pooler (PgBouncer) + alenna max_connections tarpeen mukaan** on oikea valinta. PgBouncer istuu sovellusten ja PostgreSQLin välissä: sovellukset avaavat satoja tai tuhansia kevyitä yhteyksiä pooleriin, mutta pooleri pitää PostgreSQLiin vain esimerkiksi 50–200 oikeaa backend-yhteyttä.

Transaction pooling -tilassa yhteys vapautuu heti transaktion jälkeen, jolloin sama backend-yhteys palvelee seuraavaa pyyntöä. Näin 500 microservice-instanssia × 10 pool-slottia ei tarkoita 5000 PostgreSQL-prosessia.

`max_connections` kannattaa asettaa poolerin kapasiteetin mukaan (plus marginaali admin-yhteyksille), ei instanssien lukumäärän mukaan. PostgreSQLin dokumentaatio korostaa, että liian monta yhteyttä kuormittaa palvelinta enemmän kuin hyödyttää.

## Tuotannossa

PgBouncer on erillinen palvelu — konfiguroi `default_pool_size`, `max_client_conn` ja pool mode (`transaction` vs `session`) workloadin mukaan. Prepared statements ja advisory lockit vaativat usein session poolingia.

Monitoroi: `pg_stat_activity` backend-count, poolerin queue-loki, connection wait -ajat. Jos näet `too many connections`, ensimmäinen askel on pooleri, ei `max_connections = 10000`.
