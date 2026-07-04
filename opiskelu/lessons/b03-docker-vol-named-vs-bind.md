# Tuotantodata bind-mountataan suoraan host-polusta — deploy eri poluilla eri koneilla. Parempi?

## Tilanne

Tuotantodeploy käyttää bind mountia:

```yaml
services:
  api:
    volumes:
      - /opt/myapp/data:/var/lib/app/data
```

Staging-koneella data on polussa `/opt/myapp/data`, mutta tuotantopalvelimella polku on `/srv/app/data`. CI/CD-skriptit rikkoutuvat, koska polku on kovakoodattu compose-tiedostoon. Uudelle deploylla uudelle hostille täytyy manuaalisesti luoda oikea hakemisto ja siirtää data.

Bind mount sitoo datan hostin filesystem-polkuun — se ei skaalaudu usealle koneelle eikä siirry helposti.

## Ratkaisu

Käytä **named volumea** — Docker hallitsee sijaintia, ja volume on siirrettävä backupilla:

```yaml
services:
  api:
    volumes:
      - appdata:/var/lib/app/data

volumes:
  appdata:
```

Named volume decouplaa host-polun: sama compose toimii kaikilla koneilla. Siirto uudelle hostille: backup → `docker volume create` → restore. Tuotannossa harkitse NFS- tai cloud-driveria jaetulle storagelle.

## Käytännössä

Bind mount sopii dev-ympäristöön (lähdekoodi hostilta). Tuotantodata kuuluu named volumeen tai managed storageen (EBS, Azure Disk). Dokumentoi backup/restore-proseduuri osana deploy-runbookia — named volume ei poistu `docker compose down` -komennolla, mutta hostin vaihto vaatii eksplisiittisen datansiirron.

[Lue lisää](https://docs.docker.com/storage/volumes/)
