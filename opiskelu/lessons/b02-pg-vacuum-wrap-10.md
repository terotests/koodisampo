# Varoitus: database approaching transaction ID wraparound. Kiireellinen toimenpide?

## Tilanne

PostgreSQL varoittaa: tietokanta lähestyy **transaction ID wraparound** -rajaa. Jos autovacuum ei ehdi **freeze**-operaatiota, PostgreSQL voi pakotetusti sulkea tietokannan estääkseen datakorruption — kriittisin ylläpitohälytys.

## Ratkaisu

**VACUUM FREEZE** — autovacuum freeze tai manuaalinen:

```sql
VACUUM FREEZE;           -- koko DB (varovasti)
VACUUM FREEZE verbose_table;
```

Autovacuum ajaa freeze automaattisesti `autovacuum_freeze_max_age` -rajan lähestyessä. Kiireellisessä tilanteessa: varmista autovacuum ei ole blokattu (pitkät transaktiot, `autovacuum = off`), aja manuaalinen VACUUM tarvittaessa.

## Taustaa

Wraparound liittyy 32-bit transaction ID -kiertoon. Freeze merkitsee rivit "ikuisesti vanhoiksi" — ei vaadi enää XID-vertailua. Seuraa `pg_database.datfrozenxid`.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND)
