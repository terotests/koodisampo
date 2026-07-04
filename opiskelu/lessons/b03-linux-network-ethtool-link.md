# 1 Gbps linkki neuvottelee 100 Mbps — throughput romahtaa. Ensimmäinen tarkistus?

## Tilanne

Palvelimen ja kytkimen välillä pitäisi olla gigabit-yhteys, mutta tiedonsiirto on ~95 Mbps. `iperf3` vahvistaa pullonkaulan. Epäilet autonegotiation-ongelmaa tai väärää kaapelia.

```bash
iperf3 -c backup-server
# ~95 Mbits/sec
```

## Ratkaisu

```bash
ethtool eth0
```

Tai lyhyesti link-tila:

```bash
ethtool eth0 | grep -E 'Speed|Duplex|Link detected'
```

Esimerkki ongelmasta:

```
Speed: 100Mb/s
Duplex: Full
Link detected: yes
```

**ethtool näyttää fyysisen linkin parametrit** — neuvoteltu nopeus, duplex ja link status.

## Käytännössä

100 Mbps full duplex viittaa usein Cat5-kaapeliin, vialliseen porttiin tai autoneg-failureen. Älä pakota 1000 Mbps ilman varmistusta, että kaapeli ja vastapää tukevat sitä — se voi katkaista linkin kokonaan. Dokumentoi `ethtool`-tulos ennen ja jälkeen kaapelinvaihdon. Virtuaalisissa NIC:eissä (`virtio`, `vmxnet3`) tarkista hypervisorin port group -asetukset.

[Lue lisää](https://man7.org/linux/man-pages/man8/ethtool.8.html)
