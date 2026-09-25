# Postgres-volume pitää varmuuskopioida johdonmukaisesti. Käytännöllinen tapa?

## Tilanne

PostgreSQL pyörii Docker-verkossa `myapp_default`. Kontti on käynnissä, mutta haluat varmuuskopion ilman palvelun pysäyttämistä. Vaihtoehtoisesti kontti on pysäytetty, mutta named volume `pgdata` sisältää arvokasta dataa.

Et halua kopioida suoraan `/var/lib/docker/volumes/`-polusta — PostgreSQL vaatii johdonmukaisen tilan backupin aikana.

## Ratkaisu

**pg_dump apukontista käynnissä olevaa tietokantaa vasten tai volumen tar-pakkaus, kun tietokanta on pysäytetty:**

```bash
# pg_dump samassa verkossa (suositeltu tietokannoille)
docker run --rm --network myapp_default \
  -e PGPASSWORD=secret \
  postgres:16 \
  pg_dump -h db -U postgres mydb > backup.sql

# Tai tar-pakkaus volumesta — vain kun db-kontti on pysäytetty
docker run --rm \
  -v pgdata:/data:ro \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/pgdata.tar.gz -C /data .
```

Molemmat ovat dokumentoituja kuvioita, mutta raakakopio volumesta on johdonmukainen vain, kun PostgreSQL ei ole käynnissä. Käynnissä olevalle tietokannalle käytä `pg_dump`ia.

## Käytännössä

Automatisoi backup CronJobilla tai ulkoisella schedulerilla. Säilytä SQL-dumpit versionhallinnan ulkopuolella salattuna. Testaa restore: `docker run ... psql < backup.sql`. Mittaa backup-aika ja varmista että se mahtuu maintenance-ikkunaan.

[Lue lisää](https://docs.docker.com/engine/storage/volumes/#back-up-restore-or-migrate-data-volumes)
