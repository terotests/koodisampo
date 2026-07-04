# Batch-prosessi ei tarvitse verkkoa — minimoi attack surface. network_mode?

## Tilanne

Kontti ajaa kertaluonteisen datan käsittelyn — CSV-muunnos, raportin generointi — ilman ulkoisia riippuvuuksia:

```yaml
services:
  etl:
    image: myetl:latest
    volumes:
      - ./data:/data
```

Turvallisuusreview vaatii verkkoliittymien poistamista: batch-prosessi ei tarvitse HTTP:ää, DNS:ää eikä ulospäin menevää liikennettä. Oletusbridge antaa kontin outbound-internetin.

## Ratkaisu

**`network_mode: none`** poistaa verkkoliittymät ja minimoi attack surfacen. None network driver — kontilla ei ole verkkoa lainkaan.

```yaml
services:
  etl:
    image: myetl:latest
    network_mode: none
    volumes:
      - ./data:/data
```

```bash
docker run --rm --network none -v ./data:/data myetl:latest
```

Kontti voi lukea/kirjoittaa volumeja, mutta ei muodosta verkkoyhteyksiä.

## Käytännössä

`none` estää myös embedded DNS:n — hyvä batch-tehtäville, huono jos prosessi tarvitsee S3/API-kutsuja. CI/CD-putkissa eristetyt build-stepit (esim. linter) hyötyvät none-verkosta. Yhdistä read-only root filesystem + none-verkko maksimaaliseen eristykseen.

[Lue lisää](https://docs.docker.com/engine/network/drivers/none/)
