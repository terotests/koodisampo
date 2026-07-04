# Mitä frozen xmin tarkoittaa PostgreSQL MVCC:ssä?

## Tilanne

Vacuum-lokit ja `pg_class.relfrozenxid` viittaavat "freeze"-operaatioon. Ymmärrä freeze, jotta wraparound-varoitukset eivät tule yllätyksenä — freeze on osa MVCC:n transaction ID -hallintaa.

## Ratkaisu

**Frozen rivi** on merkitty niin, että sen `xmin` (luontitransaktio-ID) ei enää vaadi XID-vertailua — rivi on "ikuisesti vanha" wraparound-näkökulmasta. Vacuum **FREEZE** -vaihe merkitsee vanhat rivit frozeniksi.

Käytännössä:

- Estää transaction ID wraparound -shutdownin
- `relfrozenxid` etenee vacuumin myötä
- Automaattinen autovacuum freeze hoitaa suurimman osan

```sql
SELECT relname, age(relfrozenxid) FROM pg_class WHERE relkind = 'r';
```

Korkea `age()` → wraparound-riski.

## Taustaa

Freeze ei poista rivejä — se muuttaa metadatan. Ero dead tuple -siivoukseen: freeze = XID-hallinta, vacuum = dead tuple -siivous.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND)
