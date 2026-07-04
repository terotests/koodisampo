# Yhteys toimii pingillä mutta ARP-taulu näyttää incomplete. Mitä komento tarkistaa?

## Tilanne

Palvelin pingaa gatewayn onnistuneesti, mutta naapuriverkon laitteeseen yhteys epäonnistuu. ARP-taulussa epäilyttäviä rivejä:

```bash
arp -a
# 192.168.1.50  (incomplete) on eth0
```

Ongelma voi olla L2-segmentissä, väärässä VLANissa tai duplicate IP:ssä.

## Ratkaisu

```bash
ip neigh show
# tai tietylle rajapinnalle:
ip neigh show dev eth0
```

Esimerkki:

```
192.168.1.50 dev eth0 lladdr aa:bb:cc:dd:ee:ff REACHABLE
192.168.1.99 dev eth0 FAILED
192.168.1.100 dev eth0 INCOMPLETE
```

**ip neigh show — näyttää ARP- ja neighbor cache -taulun** (IPv4 ja IPv6).

Tyhjennä epäilyttävä merkintä:

```bash
ip neigh flush dev eth0
```

## Käytännössä

INCOMPLETE tarkoittaa että kernel ei saanut ARP-vastausta. Tarkista kaapeli, kytkinportti, VLAN-tagging ja IP-konfliktit. IPv6:ssa vastaava on `ip -6 neigh show`. Tuotannossa älä flushaa koko taulua ilman syytä — se aiheuttaa lyhyen katkon kaikille naapureille.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-neighbour.8.html)
