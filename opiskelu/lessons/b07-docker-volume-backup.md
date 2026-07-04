# Postgres volume pitää varmuuskopioida ilman konttia samassa verkossa. Käytännöllinen tapa?

## Tilanne

PostgreSQL pyörii Docker-verkossa `myapp_default`. Kontti on käynnissä, mutta haluat varmuuskopion ilman palvelun pysäyttämistä. Vaihtoehtoisesti kontti on pysäytetty, mutta named volume `pgdata` sisältää arvokasta dataa.

Et halua kopioida suoraan `/var/lib/docker/volumes/`-polusta — PostgreSQL vaatii johdonmukaisen tilan backupin aikana.

## Ratkaisu

**Apukontti mounttaa saman volumen ja ajaa pg_dump tai käyttää `--volumes-from`:**

```bash
# pg_dump samassa verkossa (suositeltu tietokannoille)
docker run --rm --network myapp_default \
  -e PGPASSWORD=secret \
  postgres:16 \
  pg_dump -h db -U postgres mydb > backup.sql

# Tai sidecar tar-kuvio volumelle
docker run --rm \
  -v pgdata:/data:ro \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/pgdata.tar.gz -C /data .
```

Sidecar or temp container for volume backup — molemmat ovat Dockerin dokumentoituja kuvioita. `pg_dump` on turvallisempi käynnissä olevalle tietokannalle.

## Käytännössä

Automatisoi backup CronJobilla tai ulkoisella schedulerilla. Säilytä SQL-dumpit versionhallinnan ulkopuolella salattuna. Testaa restore: `docker run ... psql < backup.sql`. Mittaa backup-aika ja varmista että se mahtuu maintenance-ikkunaan.

[Lue lisää](https://docs.docker.com/engine/storage/volumes/#back-up-restore-or-migrate-data-volumes)
