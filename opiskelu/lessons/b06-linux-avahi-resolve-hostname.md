# Tulostin ilmoittaa hostname.local mutta ping epäonnistuu. Miten testaat resoluution?

## Tilanne

Verkkotulostin on konfiguroitu ilmoittamaan nimensä `printer.local`. CUPS ei löydä tulostinta, ja perustestit epäonnistuvat:

```bash
ping printer.local
# ping: printer.local: Name or service not known
curl http://printer.local:631
# curl: (6) Could not resolve host: printer.local
```

`avahi-browse -t _ipp._tcp` näyttää tulostimen olemassaolon, mutta nimen resoluutio ei toimi. Ongelma on erotettava: onko palvelu ilmoitettu vs. resolvautuuko nimi?

## Ratkaisu

Testaa mDNS-nimen resoluutio suoraan Avahi-työkalulla:

```bash
avahi-resolve -n printer.local
```

Onnistunut tulos:

```
printer.local   192.168.1.55
```

Jos `avahi-resolve` toimii mutta `ping` ei, NSS-mdns puuttuu (`libnss-mdns`). Jos molemmat epäonnistuvat, tulostin ei ilmoita hostnamea oikein tai olet eri aliverkossa.

`avahi-resolve` testaa mDNS-nimen resoluution erikseen yleisestä DNS:stä.

## Käytännössä

`-a` flagilla resolve kaikki osoitteet: `avahi-resolve -a printer.local`. Vertaa `getent hosts printer.local` — jos resolve toimii mutta getent ei, korjaa `/etc/nsswitch.conf`. Ping käyttää ICMP:ää, joka voi olla estetty tulostimessa vaikka HTTP toimii.

[Lue lisää](https://manpages.ubuntu.com/manpages/jammy/man1/avahi-resolve.1.html)
