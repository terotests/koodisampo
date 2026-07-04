# IO-spike joka 5 min — checkpoint_completion_target ja checkpoint_timeout. Tavoite?

## Tilanne

Levy-I/O -monitoroinnissa näkyy säännöllinen piikki noin viiden minuutin välein. PostgreSQL suorittaa checkpointin — kirjoittaa likaiset sivut levylle WALin ja crash recovery -vaatimusten vuoksi. Oletus `checkpoint_timeout = 5min` pakottaa aikapohjaisen checkpointin tiheään.

Kun kaikki dirty pages kirjoitetaan lyhyessä ikkunassa, levy ja muut kyselyt kärsivät. Tavoite ei ole poistaa checkpointeja (se olisi vaarallista), vaan **levittää kirjoitukset tasaisemmin** ajan yli.

## Ratkaisu

**Levitä checkpoint I/O — completion_target ~0.9, säätö timeout/max_wal** on oikea lähestymistapa.

```ini
checkpoint_completion_target = 0.9
checkpoint_timeout = 15min
max_wal_size = 4GB
```

`checkpoint_completion_target` (0.0–1.0) pyytää checkpointeria aloittamaan kirjoitukset aikaisemmin, jotta 90 % checkpoint-jaksosta on käytetty ennen deadlinea — pehmentää piikkiä. Pidempi `checkpoint_timeout` ja suurempi `max_wal_size` vähentävät turhien pakotettujen checkpointien tiheyttä.

PostgreSQL WAL configuration -dokumentaatio kuvaa näiden yhteisvaikutusta.

## Tuotannossa

Monitoroi `pg_stat_bgwriter`: `checkpoints_timed` vs `checkpoints_req`. Liian harva checkpoint pitkittää recoverya kaatumisen jälkeen — tasapaino spike vs recovery-aika.

`checkpoint_completion_target` vaatii PG 9.2+; nykyversioissa yleensä oletus 0.9.
