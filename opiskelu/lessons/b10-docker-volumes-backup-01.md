# Named volume pitää varmuuskopioida ilman kontin käynnistämistä. Tyypillinen tapa?

## Tilanne

Tuotantopalvelu on pysäytetty huollon ajaksi. Named volume `appdata` sisältää viikkojen käyttäjädataa, mutta palvelukonttia ei haluta käynnistää pelkän varmuuskopion takia — se voisi triggeröidä migraatioita tai lähettää virheellisiä metriikoita.

Hostilla volume sijaitsee Dockerin hallitsemassa polussa. Tarvitset luotettavan tavan arkistoida sisältö tiedostoksi.

## Ratkaisu

**Väliaikainen kontti mounttaa volumen ja archivoi tiedostot host-polkuun:**

```bash
docker run --rm \
  -v appdata:/data:ro \
  -v $(pwd)/backups:/backup \
  alpine \
  sh -c 'tar czf /backup/appdata-$(date +%Y%m%d).tar.gz -C /data .'
```

Sidecar-/helper-kontti volume-mountilla on yleinen backup-kuvio. Apukontti ei vaadi alkuperäisen palvelun käynnistämistä — se mounttaa saman volumen read-only ja pakkaa datan. Palautus:

```bash
docker run --rm \
  -v appdata:/data \
  -v $(pwd)/backups:/backup \
  alpine \
  tar xzf /backup/appdata-20260704.tar.gz -C /data
```

## Käytännössä

Automatisoi cronilla tai CI-pipelineen. Säilytä varmuuskopiot off-site (S3, GCS) salattuna. Tietokannoille suosi loogista dumpia (`pg_dump`) raa'an tar-kopion sijaan. Testaa restore kuukausittain — backup ilman testattua palautusta ei ole varmuuskopio.

[Lue lisää](https://docs.docker.com/storage/volumes/)
