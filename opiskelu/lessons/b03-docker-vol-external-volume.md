# Compose-projekti uudelleenkäynnistyy eri nimellä — vanha named volume jää orphaniksi. Käytäntö?

## Tilanne

Tiimi kehitti compose-projektia nimellä `myapp_dev`. Docker loi volumet automaattisesti etuliitteellä `myapp_dev_pgdata`. Myöhemmin projekti nimettiin uudelleen `myapp_staging` — uusi volume `myapp_staging_pgdata` luotiin tyhjänä, mutta vanha `myapp_dev_pgdata` jäi levytilaa kuluttamaan.

`docker volume ls` näyttää kymmeniä orphan-volumeta eri projektinimistä. Kukaan ei muista mikä volume sisältää oikean datan.

## Ratkaisu

Käytä **external volumea** tai **yhtenäistä project namea** projektien yli:

```yaml
# docker-compose.yml
volumes:
  pgdata:
    external: true
    name: myapp_pgdata   # jaettu kaikille ympäristöille

services:
  db:
    volumes:
      - pgdata:/var/lib/postgresql/data
```

Luo volume kerran:

```bash
docker volume create myapp_pgdata
```

Tai pakota sama projektinimi:

```bash
docker compose -p myapp up -d
```

External volume tai consistent naming estää orphan-volumet — sama data säilyy projektin uudelleennimeyksestä huolimatta.

## Käytännössä

Tuotannossa nimeä volumet eksplisiittisesti (`name:`), älä luota compose-projektin automaattiseen etuliitteeseen. Dokumentoi volume-nimet infra-koodissa. `docker volume ls -f dangling=true` auttaa siivoamaan vanhat orphanit — varmista ensin ettei niissä ole arvokasta dataa.

[Lue lisää](https://docs.docker.com/compose/compose-file/volumes/)
