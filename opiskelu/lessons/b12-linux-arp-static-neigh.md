# Gatewayn MAC vaihtuu harvoin ja aiheuttaa katkoja — haluat kiinteän ARP-merkinnän. Komento?

## Tilanne

Palvelin käyttää staattista reittiä gatewayn kautta. Jossain tapauksissa kernel poistaa vanhan ARP-merkinnän ja yhteys katkeaa kunnes uusi ARP-vastaus saadaan — esimerkiksi HA-ympäristössä tai kun gateway vaihtaa MAC:ia harvoin.

Ratkaisu on staattinen neighbor-merkintä, jota kernel ei poista timeoutin jälkeen.

## Ratkaisu

```bash
ip neigh add 192.168.1.1 lladdr aa:bb:cc:dd:ee:ff dev eth0 nud permanent
```

Tarkista:

```bash
ip neigh show dev eth0
```

Poista tarvittaessa:

```bash
ip neigh del 192.168.1.1 dev eth0
```

**nud permanent** pitää merkinnän kiinteänä — ip-neighbour man.

## Käytännössä

Staattinen ARP on riski jos gatewayn MAC todella vaihtuu — liikenne menee väärään laitteeseen. Käytä vain kun MAC on dokumentoitu vakaa. Vanha `arp -s` toimii joissain distrossa, mutta `ip neigh` on iproute2-standardi. Automatisoi NetworkManager/systemd-networkd:llä jos mahdollista.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html)
