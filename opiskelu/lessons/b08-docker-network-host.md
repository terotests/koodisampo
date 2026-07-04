# Kontti tarvitsee suoran pääsyn hostin verkkoon (multicast). Milloin network_mode: host?

## Tilanne

Palvelun löytöprotokolla (mDNS, SSDP, custom UDP multicast) ei toimi kontissa bridge-verkossa:

```yaml
services:
  discovery:
    image: discovery-agent:latest
    ports:
      - "5353:5353/udp"
```

Agentti liittyy multicast-ryhmään, mutta paketit eivät kulje oikein — muut laitteet LANissa eivät näe ilmoituksia. Bridge eristää L2-liikenteen (multicast/broadcast) hostin verkkostackista.

## Ratkaisu

**Host mode kun bridge/NAT ei riitä — jakaa network stackin, tietoturvariski mukana.** host network removes isolation.

```yaml
services:
  discovery:
    image: discovery-agent:latest
    network_mode: host
```

Kontti käyttää hostin multicast-liittymiä, IP-osoitteita ja portteja suoraan. Ei port mappingia eikä bridge-NAT:ia.

## Käytännössä

Host-mode on kompromissi: saat multicast/L2-toiminnallisuuden, mutta menetät verkkorajauksen. Rajoita käyttö tapauksiin, joissa bridge ei voi toimia (multicast, raw sockets, suora host-porttikuuntelu). Linux-only tuotantoon; dokumentoi poikkeus security baseline -dokumentissa.

[Lue lisää](https://docs.docker.com/engine/network/drivers/host/)
