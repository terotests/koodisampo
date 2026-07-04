# Named volume backup ilman container downtimea — suositeltu tapa?

## Tilanne

PostgreSQL pyörii named volumessa `pgdata`. Palvelu on tuotannossa 24/7 — et halua pysäyttää konttia varmuuskopiota varten. Downtime tarkoittaisi käyttäjille katkoa ja SLA-rikkomusta.

Tarvitset tavan kopioida volumen sisältö turvallisesti ilman palvelun keskeyttämistä.

## Ratkaisu

**Sidecar-kontti mounttaa volumen backupiin** — suositeltu tapa ilman downtimea:

```bash
docker run --rm \
  -v pgdata:/data:ro \
  -v $(pwd):/backup \
  alpine \
  tar czf /backup/vol.tar.gz -C /data .
```

`-v pgdata:/data:ro` mounttaa saman volumen vain luku -tilassa. Apukontti pakkaa datan hostin nykyiseen hakemistoon. PostgreSQLille täsmällisempi tapa on `pg_dump` erillisessä kontissa samassa verkossa:

```bash
docker run --rm --network myapp_default \
  -e PGPASSWORD=secret \
  postgres:16 \
  pg_dump -h db -U postgres mydb > backup.sql
```

## Käytännössä

Tietokannoille suosi loogista dumpia (`pg_dump`, `mysqldump`) raa'an tiedostojärjestelmä-kopion sijaan — se on yhteensopivampi versioiden välillä. Automatisoi backup ja testaa restore kuukausittain. Säilytä varmuuskopiot erillisessä storage-tilassa, ei samalla hostilla.

[Lue lisää](https://docs.docker.com/engine/storage/volumes/#back-up-restore-or-migrate-data-volumes)
