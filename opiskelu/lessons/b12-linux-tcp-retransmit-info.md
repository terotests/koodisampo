# Korkea latenssi tuotannossa — epäilet TCP-uudelleenlähetyksiä. ss-lippu sisäisiin timer-tietoihin?

## Tilanne

API-vastausajat kasvoivat ilman selvää CPU-kuormaa. Epäilet pakettihäviöitä ja TCP-retransmitteja — wireshark ei ole käytettävissä tuotantopalvelimella.

`ss` voi näyttää socket-tason RTT:n ja retransmit-laskurit suoraan kernelistä.

## Ratkaisu

```bash
ss -ti
ss -ti dst 10.0.0.5:443
```

Esimerkkikentät tulosteessa:

```
rtt:45.2/12.5 retrans:3/5 cwnd:10
```

**ss -ti** (TCP info) paljastaa RTT, retrans, cwnd — ss man internal timers.

## Käytännössä

`-s` antaa vain yhteenvedon. `tcpdump` näyttää paketit mutta ei socket metadataa yhtä tiiviisti. Korkea `retrans` viittaa häviöihin tai ruuhkaan — yhdistä `ip -s link` ja `ethtool -S` L2-statistiikkaan. UDP-ongelmiin `-ti` ei auta — käytä `-u` ja tcpdump.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)
