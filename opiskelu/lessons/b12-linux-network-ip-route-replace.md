# Oletusreitti pitää vaihtaa uuteen gatewayhin ilman että vanha jää roikkuun. iproute2-komento?

## Tilanne

Gateway vaihtui `10.0.0.254` → `10.0.0.1`. Vanha oletusreitti on yhä taulussa:

```bash
ip route show default
default via 10.0.0.254 dev eth0
```

`ip route add default via 10.0.0.1` voi epäonnistua (`File exists`) tai jättää kaksi oletusreittiä metric-eroilla.

## Ratkaisu

```bash
ip route replace default via 10.0.0.1 dev eth0
```

Tarkista:

```bash
ip route get 8.8.8.8
```

**replace** päivittää olemassa olevan reitin tai luo uuden — idempotentti skripteissä.

## Käytännössä

Pysyvään konfiguraatioon käytä NetworkManageria, netplania tai systemd-networkd:ä — `ip route` on väliaikainen. Policy routing -ympäristöissä oletusreitti voi olla eri taulussa (`table main`). Vanha `route`-komento on deprecated — käytä aina iproute2:ta.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-route.8.html)
