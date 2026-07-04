# Alert: taulu lähestyy transaction ID wraparoundia — autovacuum ei ehdi. Toimenpide?

## Tilanne

Monitoring hälyttää: taulu `age(relfrozenxid)` lähestyy `autovacuum_freeze_max_age` -rajaa. Autovacuum workers ovat kiireisiä muissa tauluissa — wraparound ja bloat yhdistyvät kriittiseksi alertiksi.

## Ratkaisu

1. **`VACUUM (FREEZE)`** uhkaaville tauluille — manuaalinen kickstart
2. **Autovacuum tuning:** `autovacuum_max_workers`, `autovacuum_freeze_max_age`, taulukohtaiset parametrit
3. **Pitkät transaktiot** pois — ne blokkaavat freeze

Wraparound-shutdown on estettävä ennen kuin se tapahtuu — alert on viimeinen mahdollisuus ennen pakotettua VACUUM-only-tilaa.

## Taustaa

Bloat ja wraparound jakavat autovacuum-resurssit — kiireinen taulu voi jäädä jälkeen molemmissa.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND)
