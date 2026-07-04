# Tuotanto I/O spike joka 5 min — checkpoint aiheuttaa. Mitä säätät?

## Tilanne

Levy-I/O graafissa näkyy säännöllinen piikki noin viiden minuutin välein. `pg_stat_bgwriter` ja loki viittaavat checkpointiin: PostgreSQL kirjoittaa likaiset sivut levylle WALin yhteydessä varmistaakseen crash recovery -kyvykkyyden.

Aggressiivinen `checkpoint_timeout` (oletus 5 min) pakottaa checkpointin aikataulun mukaan, vaikka WAL ei olisi täynnä. Kaikki dirty pages kirjoitetaan lyhyessä ikkunassa → I/O-spike, latenssi kasvaa, muut kyselyt jonottavat.

Tavoite on levittää checkpoint-kirjoitukset pidemmälle ajanjaksolle ja säätää WAL-kokoa niin, ettei checkpoint laukea liian usein.

## Ratkaisu

**checkpoint_timeout ja max_wal_size — levittävät checkpoint I/O:n tasaisemmaksi**. Nosta `max_wal_size` (ja `min_wal_size`) antamaan WALille tilaa ennen pakotettua checkpointia. Säädä `checkpoint_timeout` pidemmäksi jos spike on liian tiheä (esim. 15min–30min).

```ini
max_wal_size = 4GB
checkpoint_timeout = 15min
checkpoint_completion_target = 0.9
```

`checkpoint_completion_target = 0.9` (0.0–1.0) levittää dirty page -kirjoitukset niin, että 90 % ajasta on käytetty ennen seuraavaa deadlinea — pehmentää piikkiä.

## Taustaa

WAL-konfiguraatio on PostgreSQL docs -osion ydin. Liian harva checkpoint kasvattaa recovery-aikaa kaatumisen jälkeen — tasapaino spike vs recovery.

Monitoroi ` checkpoints_req` vs ` checkpoints_timed` bgwriter-statistiikassa.
