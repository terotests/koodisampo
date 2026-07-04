# Haluat listata lähiverkon _http._tcp-palvelut terminaalista. Komento?

## Tilanne

Kehitystiimi julkaisee useita paikallisia web-palveluja mDNS:llä: API (portti 8080), frontend (3000), mock-palvelin (4000). Kehittäjä haluaa nähdä kaikki HTTP-palvelut kerralla ilman tietoa IP-osoitteista:

```bash
ss -tlnp | grep LISTEN
# vain omat palvelut — ei näe muiden koneiden palveluja
curl http://????:8080
```

Tarvitaan komento joka listaa kaikki `_http._tcp`-palvelut lähiverkosta.

## Ratkaisu

```bash
avahi-browse -rt _http._tcp
```

Flagit:
- `-r` — resolve hostname ja portin
- `-t _http._tcp` — rajaa HTTP-palveluihin

Esimerkkitulos:

```
+ wlp2s0 IPv4 Dev API _http._tcp local
= wlp2s0 IPv4 Dev API local hostname = [devbox.local] port = [8080]
+ wlp2s0 IPv4 Frontend _http._tcp local
= wlp2s0 IPv4 Frontend local hostname = [laptop.local] port = [3000]
```

`avahi-browse` listaa mDNS-palvelut — `-rt` yhdistelmä on tavallisin tapa listata HTTP-palvelut resoluutiolla.

## Käytännössä

`-p` parsittu tulostus skripteille. `-a` listaa kaikki tyypit jos et tiedä service typea. Varmista `avahi-daemon` käynnissä ennen browsea. HTTPS-palvelut: `-t _https._tcp`.

[Lue lisää](https://manpages.ubuntu.com/manpages/jammy/man1/avahi-browse.1.html)
