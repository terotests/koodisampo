# Logissa 'database must be vacuumed within 10 million transactions' — mitä uhkaa?

## Tilanne

PostgreSQL lokittaa: *database must be vacuumed within 10 million transactions to avoid shutdown*. Tämä on viimeinen varoitus ennen **pakotettua shutdownia** — wraparound-suojaus aktivoituu, kun vanhimpia transaktio-ID:itä ei voida enää turvallisesti kierrättää.

## Ratkaisu

**Transaction ID wraparound** — kriittinen:

1. Varmista autovacuum käynnissä ja ei blokattu
2. Aja `VACUUM FREEZE` uhkaaville tauluille
3. Selvitä pitkät transaktiot (`pg_stat_activity`)

Jos varoitus eskaloituu *"database is not accepting commands"*, vain VACUUM auttaa — muut komennot hylätään. Ennaltaehkäisy: seuraa `age(datfrozenxid)` ja autovacuum freeze -asetukset.

## Taustaa

Wraparound ei liity levytilaan vaan XID-kiertoon. Se on harvinaisempi kuin bloat, mutta vakavampi.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND)
