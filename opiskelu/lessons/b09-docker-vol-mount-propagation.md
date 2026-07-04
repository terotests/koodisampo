# Bind mount host-kansiosta ei näy muutoksia nested mountissa. Propagation-asetus?

## Tilanne

Kontti mounttaa host-hakemiston ja ajaa skriptin, joka luo nested mountin:

```bash
docker run -d -v /host/monitoring:/monitoring prom/node-exporter
```

Kontin sisällä bindataan `/monitoring/proc` uudelleen. Hostilla nested mount ei näy — `/host/monitoring/proc` ei päivity kontissa tehtyjen mount-muutosten mukaisesti. Oletusarvoinen mount propagation (`rprivate`) eristää mount-näkymän.

## Ratkaisu

Säädä **bind propagation** arvoon `rshared` tai `rslave`:

```yaml
services:
  monitor:
    volumes:
      - type: bind
        source: /host/monitoring
        target: /monitoring
        bind:
          propagation: rshared
```

Mount propagation controls visibility — `rshared` jakaa mount-muutokset hostin ja kontin välillä molempiin suuntiin. `rslave` jakaa host → kontti -suunnassa. Nested mount -näkyvyys vaatii tietoisen propagation-asetuksen.

## Käytännössä

Tämä on edistynyt skenaario — useimmat sovellukset eivät tarvitse propagation-muutoksia. Väärä asetus voi avata turvallisuusaukkoja (kontti vaikuttaa hostin mount-näkymään). Käytä vain kun skenaario vaatii sen (esim. monitoring-agentit, storage-pluginit). Testaa aina Linux-hostilla.

[Lue lisää](https://docs.docker.com/engine/storage/bind-mounts/#configure-bind-propagation)
