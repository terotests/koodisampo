# UDP multicast ei toimi bridge-verkossa. Milloin host network mode?

## Tilanne

Kontti kuuntelee UDP-multicastia (esim. palvelun löytö, streaming, IoT-protokolla). Bridge-verkossa paketit eivät kulje odotetusti — kontti ei näe multicast-ryhmiä tai broadcasteja samalla tavalla kuin host. DNS-SD, mDNS ja monet reaaliaikaiset protokollat kärsivät tästä.

Ongelma on verkkoeristyksessä: Dockerin oletusbridge luo oman L2-verkon NAT:in takana.

## Ratkaisu

Käytä **host network mode** kun kontin täytyy jakaa hostin verkkostack:

```yaml
services:
  discovery:
    network_mode: host
```

Tai `docker run --network host`. Kontti käyttää hostin IP:tä, portteja ja multicast-liittymiä suoraan — ei bridge-NAT:ia eikä port-mappingia.

## Milloin ei

Host-mode heikentää eristystä: kontti näkee hostin verkkoliikenteen ja portit. Käytä vain kun multicast/broadcast tai suora host-porttikuuntelu on pakollinen. Muuten bridge + eksplisiittinen port mapping on turvallisempi oletus.

## Ero `docker-host-network`-teemaan

`docker-host-network` painottaa tiettyä porttia (esim. 53) ilman NAT:ia. Tämä kysymys painottaa **multicast/L2**-rajoitusta bridgessä.

[Lue lisää](https://docs.docker.com/engine/network/drivers/host/)
