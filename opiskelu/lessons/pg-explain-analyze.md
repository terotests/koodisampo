# Kysely hidastui tuotannossa. Ennen konfiguraation säätöä: miten näet todelliset ajat ja rivimäärät turvallisesti?

## Tilanne

Tuotantokysely hidastui yllättäen. Tiimi ehdottaa heti `work_mem`-nostoa, uutta indeksiä tai `shared_buffers`-säätöä — mutta kukaan ei ole mitannut, mikä solmu suunnitelmassa on kallisin tai paljonko rivejä todella palautuu.

Pelkkä `EXPLAIN` ilman `ANALYZE`-lippua näyttää vain plannerin *arvion* (`rows`, `cost`), ei todellisia aikoja. `EXPLAIN ANALYZE` tuotannossa puolestaan suorittaa kyselyn oikeasti: se muuttaa cache-tilaa, lisää kuormaa ja voi lukita rivejä pitkään kestävissä transaktioissa.

## Ratkaisu

Aja **`EXPLAIN (ANALYZE, BUFFERS)`** kopiossa tuotantodatasta — staging-, shadow- tai restore-ympäristössä, jossa kysely on turvallista suorittaa:

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

Tuloste vertaa `rows estimate` vs `actual rows` jokaisella solmulla ja näyttää todellisen execution timen. `BUFFERS` erottaa cache-osumat levyluvuista. Näin ymmärrät pullonkaulan ennen kuin kosket GUC-parametreihin tai indekseihin.

Jos staging ei ole saatavilla, rajoita tuotantotesti lyhyeen, matalan riskin SELECT-kyselyyn ruuhka-ajan ulkopuolella — mutta kopio on aina turvallisempi vaihtoehto.

## Työjärjestys

1. Hae hidas query-pattern (esim. `pg_stat_statements`).
2. Aja `EXPLAIN (ANALYZE, BUFFERS)` kopiossa samoilla parametreilla.
3. Etsi suurin `actual time` ja riveihin liittyvät arvio-virheet.
4. Korjaa juurisyy (indeksi, stats, join-järjestys) — vasta sitten harkitse GUC-säätöä.

[Lue lisää](https://www.postgresql.org/docs/current/sql-explain.html)
