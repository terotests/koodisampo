# Haluat varmuuskopioida named volumen ilman konttia käynnissä. Miten?

## Tilanne

Tuotantopalvelu käyttää named volumea `pgdata` PostgreSQL-datalle. Kontti on pysäytetty ylläpitoa varten — et halua käynnistää sitä uudelleen vain varmuuskopiota varten. Hostilla ei ole suoraa polkua volumeen, koska Docker hallitsee sen sijaintia (`/var/lib/docker/volumes/...`).

Tarvitset luotettavan tavan pakata volumen sisältö tiedostoksi, joka voidaan siirtää toiseen ympäristöön.

## Ratkaisu

Käytä **apukonttia**, joka mounttaa volumen ja pakkaa datan host-polkuun:

```bash
docker run --rm \
  -v pgdata:/data:ro \
  -v $(pwd):/backup \
  alpine \
  tar czf /backup/pgdata-$(date +%F).tar.gz -C /data .
```

Apukontti mounttaa volumen ja pakkaa datan — tämä on Dockerin suositeltu kuvio volume-varmuuskopiointiin. `:ro` estää vahingossa kirjoittamisen backupin aikana. Palautus:

```bash
docker run --rm \
  -v pgdata:/data \
  -v $(pwd):/backup \
  alpine \
  tar xzf /backup/pgdata-2026-07-04.tar.gz -C /data
```

## Käytännössä

Automatisoi backup cronilla tai CI-jobilla. Tietokannoille `pg_dump` on usein parempi kuin raaka tiedostojärjestelmä-kopio — mutta sidecar-tar-kuvio toimii kaikille volume-tyypeille. Testaa palautus säännöllisesti erillisessä ympäristössä.

[Lue lisää](https://docs.docker.com/storage/volumes/)
