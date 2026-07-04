# autovacuum ei ehdi — transaction id wraparound varoitus. Ensimmäinen tarkistus?

## Tilanne

Wraparound-varoitus aktivoituu — autovacuum ei ole pitänyt XID-ikää kurissa. Ensireaktio voi olla `VACUUM FREEZE`, mutta ensin kannattaa ymmärtää *miksi* autovacuum epäonnistui.

## Ratkaisu

Tarkista järjestyksessä:

1. **`pg_stat_activity`** — pitkät transaktiot blokkaavat freeze/vacuum
2. **Autovacuum-asetukset** — `autovacuum = on`, riittävä `autovacuum_max_workers`, freeze-max-age
3. **`pg_stat_progress_vacuum`** — onko vacuum jumissa
4. **`pg_stat_user_tables`** — `last_autovacuum`, `n_dead_tup`, `relfrozenxid`

Vasta sitten manuaalinen `VACUUM FREEZE`. Ilman juurisyyn korjausta ongelma toistuu.

## Taustaa

Wraparound ja bloat jakavat saman mekanismin — autovacuum — mutta eri kiireellisyystaso.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html)
