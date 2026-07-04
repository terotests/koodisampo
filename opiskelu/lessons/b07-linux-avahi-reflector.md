# Docker-kontti julkaisee mDNS-palvelun mutta host ei näe sitä. Tyypillinen syy?

## Tilanne

Kehittäjä julkaisee palvelun Docker-kontissa Avahilla:

```bash
docker run -d --name myapp myapp-image
# Kontissa: avahi-publish-service "App" _http._tcp 8080
```

Kontin sisällä browse toimii:

```bash
docker exec myapp avahi-browse -rt _http._tcp
# + docker0 IPv4 App _http._tcp local
```

Mutta host-koneelta ja muista lähiverkon koneista palvelu ei näy. Host pingaa konttia IP:llä, mutta mDNS-discovery epäonnistuu.

## Ratkaisu

**mDNS multicast ei ylitä Docker-verkkoa ilman reflector/bridge-asetusta.**

mDNS käyttää link-local multicastia (224.0.0.251, UDP 5353). Dockerin oletusbridge eristää multicast-liikenteen — kontin ilmoitukset eivät leviä hostin fyysiseen verkkoliittymään.

Ratkaisuvaihtoehdot:

**1. Julkaise hostilta, ohjaa liikenne konttiin:**

```bash
avahi-publish-service "App" _http._tcp 8080
# + port mapping docker run -p 8080:8080
```

**2. Ota reflector käyttöön** `/etc/avahi/avahi-daemon.conf`:

```ini
[server]
enable-reflector=yes
reflect-ipv=yes
```

```bash
sudo systemctl restart avahi-daemon
```

**3. Käytä host network modea** (varovasti): `docker run --network host`

mDNS on link-local multicast — se tarvitsee reflectorin eri verkkoliittymien välillä.

## Käytännössä

Reflector on yleisin korjaus kehitysympäristöissä. Tuotannossa mDNS konteissa on harvinaista — käytä service meshiä tai ingressiä. Testaa: browse hostilta ja kontista erikseen.

[Lue lisää](https://www.avahi.org/doctest/)
