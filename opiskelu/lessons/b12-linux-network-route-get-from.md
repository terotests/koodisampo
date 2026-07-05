# Split-horizon: paketti kohteeseen 172.16.5.10 lähteestä 10.0.1.5 menee väärään tunneliin. Diagnostiikka?

## Tilanne

Palvelimella on useita reititystauluja ja VPN-tunneli. Liikenne kohteeseen `172.16.5.10` menee väärää polkua riippuen siitä, mistä lähde-IP:stä paketti lähtee. `traceroute` näyttää polun, mutta ei simuloi kernelin päätöstä tietystä lähde-IP:stä.

## Ratkaisu

```bash
ip route get 172.16.5.10 from 10.0.1.5 iif eth0
```

Esimerkkituloste:

```
172.16.5.10 from 10.0.1.5 via 10.8.0.1 dev tun0 table 100 uid 0
```

**ip route get simuloi reitityspäätöksen** lähde-IP:llä ja saapumisrajapinnalla — policy routing debug.

## Käytännössä

Yhdistä `ip rule list` ja `ip route show table all`. `from` vaatii että lähde-IP on konfiguroitu johonkin rajapintaan (`iif`). Split-horizon DNS-ongelmissa sama logiikka: reititys ja resolver ovat erillisiä — route get ei korjaa DNS:ää.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-route.8.html)
