# App-tason mutex kahden workerin välillä — ei taululock. Mitä PostgreSQL tarjoaa?

## Tilanne

Kaksi sovellus-workeria (tai kaksi instanssia) suorittaa kriittistä vaihetta, jota saa ajaa vain yksi kerrallaan — esim. tiedoston tuonti, laskutusajon trigger, cache-warmup. Taulurivien lukitus (`SELECT FOR UPDATE`) on väärä abstraktio: ei ole luontevaa riviä, jota lukita, ja lock jää helposti roikkumaan.

Tarvitset **sovellustason koordinaation** ilman uutta taulua ja ilman että lukko sidotaan tiettyyn dataan. PostgreSQL tarjoaa tähän erillisen mekanismin, joka toimii sessionin tai transaktion elinkaaren yli advisory-tunnisteilla.

## Ratkaisu

**pg_advisory_lock / pg_try_advisory_lock — sovellustason lukitus ilman taulua** perustuu 64-bit (tai kaksi 32-bit) avaimeen, jonka sovellus valitsee. Sama avain kaikissa instansseissa = globaali mutex.

```sql
SELECT pg_try_advisory_lock(42);  -- true jos saatu
-- kriittinen työ
SELECT pg_advisory_unlock(42);
```

`pg_try_advisory_lock` palauttaa heti false jos lock varattu — ei jono odotusta. `pg_advisory_lock` odottaa. Session-päätteinen lock vapautuu yhteyden katketessa.

Transaction-level variantit (`pg_advisory_xact_lock`) vapautuvat commit/rollbackissa.

## Taustaa

Advisory lockit eivät näy row-level lock -näkymässä samalla tavalla kuin `FOR UPDATE`. Dokumentaatio: Explicit Locking → Advisory Locks.

PgBouncer transaction pooling rikkoo session advisory lockit — käytä session poolingia tai xact-tason lockeja.
