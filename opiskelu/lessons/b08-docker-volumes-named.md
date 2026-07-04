# Postgres-data katoaa kontti poistossa — käytit bind mountia väärään polkuun. Parempi tuotantokäytäntö?

## Tilanne

Tuotantodeploy käytti bind mountia:

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - /var/lib/postgres-data:/var/lib/postgresql/data
```

Uudelle hostille deployattaessa polku `/var/lib/postgres-data` puuttui — kontti käynnistyi tyhjällä tietokannalla. Vanhalla hostilla data oli eri polussa. Bind mount sitoo datan tiettyyn host-polkuun, joka vaihtelee ympäristöittäin.

Kontti poistettiin vahingossa `docker rm` -komennolla — data jäi host-polkuun, mutta kukaan ei tiennyt missä.

## Ratkaisu

Käytä **named volumea** — Docker hallitsee polkua ja helpottaa backup/restore -käytäntöä:

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Named volume säilyttää datan konttien elinkaaren yli. Docker tietää volumen sijainnin (`docker volume inspect pgdata`). Backup ja siirto uudelle hostille on dokumentoitu prosessi eikä riipu host-polusta.

## Käytännössä

Bind mount sopii dev-ympäristöön ja erityistapauksiin (legacy-polku). Tuotantodata kuuluu named volumeen tai managed storageen. Dokumentoi volume-nimi ja backup-proseduuri — älä luota siihen, että "joku muistaa host-polun".

[Lue lisää](https://docs.docker.com/engine/storage/volumes/)
