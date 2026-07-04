# Postgres-data named volumessa — tarvitset varmuuskopion ilman konttia. Miten?

## Tilanne

PostgreSQL-kontti on pysäytetty ylläpitoa varten. Named volume `pgdata` sisältää kaiken tuotantodatan, mutta kontti ei ole käynnissä — et voi ajaa `pg_dump`-komentoa suoraan kontin sisältä.

Hostilla volume sijaitsee Dockerin hallitsemassa polussa, jota ei kannata kopioida suoraan tiedostojärjestelmätasolla (PostgreSQL vaatii johdonmukaisen tilan).

## Ratkaisu

**Apukontti mounttaa volumen ja pakkaa datan host-polkuun tar-komennolla:**

```bash
docker run --rm \
  -v pgdata:/data:ro \
  -v $(pwd)/backups:/backup \
  alpine \
  tar czf /backup/pgdata-$(date +%F).tar.gz -C /data .
```

Mount volume to helper container — Dockerin suositeltu backup-kuvio. PostgreSQLille parempi vaihtoehto on looginen dump konttia vastaan samassa verkossa:

```bash
docker run --rm --network myapp_default \
  postgres:16 pg_dump -h db -U postgres -d myapp \
  > backups/myapp-$(date +%F).sql
```

## Käytännössä

Aja backup säännöllisesti cronilla tai Kubernetes CronJobilla. Säilytä varmuuskopiot off-site (S3, GCS). Testaa restore prosessi kuukausittain — backup jota ei ole testattu ei ole varmuuskopio.

[Lue lisää](https://docs.docker.com/engine/storage/volumes/)
