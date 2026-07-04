# Kaksi oletusreittiä — liikenne menee väärää VPN:ää pitkin. Miten näet reitit ja metriikat?

## Tilanne

Koneella on kaksi VPN-yhteyttä ja tavallinen ethernet. Osa liikenteestä menee henkilökohtaiseen VPN:ään, vaikka pitäisi mennä yrityksen tunneliin:

```bash
curl ifconfig.me
# odottamaton ulospäin näkyvä IP
```

`ip route` näyttää kaksi `default`-riviä.

## Ratkaisu

```bash
ip route show
```

Esimerkki:

```
default via 192.168.1.1 dev eth0 metric 100
default via 10.8.0.1 dev tun0 metric 50
default via 10.9.0.1 dev tun1 metric 200
```

**ip route näyttää metric-arvot — pienempi metric = korkeampi prioriteetti.** Yllä olevassa tapauksessa `tun0` (50) voittaa `eth0`:n (100).

Testaa polku:

```bash
ip route get 8.8.8.8
```

## Käytännössä

Metric-arvoja voi säätää NM-profiilissa (`ipv4.route-metric`) tai VPN-clientin asetuksissa. Dokumentoi tarkoitus: split-tunnel vs backup-reitti. `ip rule` voi ohittaa metric-logiikan — tarkista `ip rule list` jos metric ei selitä käytöstä.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-route.8.html)
