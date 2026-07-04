# Plan muuttui yllättäen huonoksi bulk loadin jälkeen — row estimate väärä. Korjaus?

## Tilanne

Yöllinen ETL latasi 50M riviä tauluun. Aamulla samat kyselyt, jotka eilen olivat nopeita, käyttävät nested loopia tai seq scania — `EXPLAIN` näyttää `rows=1000`, `actual rows=5000000`. Suunnitelma muuttui, vaikka kyselyteksti on identtinen.

Bulk load ei päivitä planner-tilastoja automaattisesti riittävän nopeasti kaikissa tapauksissa — erityisesti jos autovacuum/ANALYZE ei ole vielä ajettu.

## Ratkaisu

```sql
ANALYZE loaded_table;
```

**ANALYZE päivittää statistics bulk loadin jälkeen** — rivimäärät, null-fraciot ja arvioidut jakaumat `pg_stats`-näkymään. Vasta sen jälkeen planner valitsee taas järkevät join- ja scan-strategiat.

Isoissa bulk load -projekteissa aja ANALYZE manuaalisesti loadin jälkeen (tai `VACUUM ANALYZE`), älä odota autovacuumia kriittisissä tauluissa.

## Taustaa

`EXPLAIN` ennen ANALYZE:a bulk loadin jälkeen on harhaanjohtava — se heijastaa vanhaa maailmaa. Tämä on yksi yleisimmistä "PostgreSQL hidastui yllättäen" -juurisyistä.

[Lue lisää](https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-STATISTICS)
