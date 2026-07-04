# Unit A tarvitsee verkon ennen käynnistystä mutta ei saa kaatua jos B epäonnistuu. Mikä riippuvuus?

## Tilanne

`sync.service` hakee dataa ulkoisesta API:sta heti bootissa. Verkko ei ole vielä valmis — DNS lookup epäonnistuu. Kehittäjä lisää `Requires=network-online.target`, mutta boot kaatuu kokonaan kun wait-online -palvelu timeouttaa erillisessä testiympäristössä.

```ini
[Unit]
Requires=network-online.target   # liian kova — koko sync kaatuu
After=network-online.target
```

Haluttu käyttäytyminen: odota verkkoa jos se tulee, mutta älä kaada koko unitia jos verkko-target epäonnistuu. Järjestys ja kovuus ovat systemd:ssä eri asioita.

## Ratkaisu

Käytä **`After=network-online.target` ilman `Requires`-riippuvuutta**. Pehmeään aktivointiin riittää usein myös `Wants=`:

```ini
[Unit]
Description=Data sync
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/sync.sh
```

**After vain järjestää — Requires/Wants määrittää kovuuden.** `After=` ei aktivoi verkkoa; se sanoo vain "älä käynnistä minua ennen kuin target on käynnistetty". `Wants=` yrittää aktivoida targetin, mutta epäonnistuminen ei pysäytä sync:ia.

## Käytännössä

Boot-riippuvuuksia suunnitellessa erottele aina kysymykset: (1) missä järjestyksessä? → `After=`/`Before=`, (2) onko riippuvuus pakollinen? → `Requires=` vs `Wants=`. Verkko, NTP ja metadata-palvelut ovat tyypillisesti `After` + `Wants`, ei `Requires`.

Testaa offline-boot ja hidas DHCP — ne paljastavat liian kovat riippuvuudet ennen tuotantoa.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
