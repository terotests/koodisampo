# `ip neigh show` näyttää gatewaylle tilan FAILED — ping ulospäin ei mene. Ensimmäinen toimenpide?

## Tilanne

```bash
ip neigh show
192.168.1.1 dev eth0 FAILED
```

Gatewayn ARP-yritykset epäonnistuivat — kernel merkitsi neighborin FAILED-tilaan. Ping gatewaylle ja ulospäin epäonnistuu, vaikka IP-osoite ja oletusreitti näyttävät oikeilta.

## Ratkaisu

1. **Tarkista L2:** kaapeli, kytkinportti, VLAN-tagging, bond/slave-oikea jäsen
2. **Poista FAILED-merkintä** ja pakota uusi ARP:

```bash
ip neigh del 192.168.1.1 dev eth0
ping -c 1 192.168.1.1
ip neigh show dev eth0
```

3. Jos ongelma toistuu: IP-konflikti (`arping -D`), väärä VLAN, tai gateway poissa

**FAILED = ARP-kerros ei saanut vastausta** — reititys ja TCP eivät auta ennen L2-korjausta.

## Käytännössä

INCOMPLETE tarkoittaa odottavaa ARP:ia; FAILED tarkoittaa että yritykset loppuivat. Älä lisää staattista reittiä ilman toimivaa neighbor-MAC:ia. Cloud-ympäristössä tarkista security group ja L2-segmentti ennen kernel-tason debugia.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html)
