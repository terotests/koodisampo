# Kehityskone printer.local ei resolvdu. Avahi-työkalu joka testaa nimen?

## Tilanne

Kehityskoneella tulostin pitäisi löytyä nimellä `printer.local`. Selain ja curl epäonnistuvat:

```bash
curl http://printer.local:631
# curl: (6) Could not resolve host: printer.local
nslookup printer.local
# server can't find printer.local: NXDOMAIN
```

`nslookup` käyttää tavallista DNS:ää, ei mDNS:ää — se ei ole oikea testi. Tarvitaan työkalu joka testaa mDNS-resoluutiota suoraan.

## Ratkaisu

```bash
avahi-resolve -n printer.local
```

Onnistunut vastaus:

```
printer.local   192.168.1.100
```

`avahi-resolve` testaa mDNS-nimen resoluution erillään NSS/DNS-ketjusta. Jos se palauttaa IP:n, nimi on ilmoitettu oikein ja mDNS toimii — ongelma on client-päässä (libnss-mdns puuttuu). Jos se epäonnistuu, tulostin ei ilmoita nimeä tai olet eri verkossa.

## Käytännössä

`-a` resolve kaikki osoitteet IPv4/IPv6. Yhdistä browseen: `avahi-browse -r _ipp._tcp` näyttää hostname-kentän. Korjaa NSS: `/etc/nsswitch.conf` → `hosts: files mdns4_minimal [NOTFOUND=return] dns`.

[Lue lisää](https://www.avahi.org/doctest/)
