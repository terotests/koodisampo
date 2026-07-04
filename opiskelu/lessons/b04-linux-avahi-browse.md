# Lähiverkossa pitäisi näkyä mDNS-palvelu mutta se ei löydy. Diagnostiikkakomento?

## Tilanne

Kehittäjä julkaisi HTTP-palvelun Avahi service -tiedostolla. Palvelu pyörii paikallisesti:

```bash
curl http://localhost:8080/health
# {"status": "ok"}
```

Mutta toiselta koneelta palvelua ei löydy. IP-osoite toimii, mutta mDNS-nimi ja service discovery eivät. Epäilet ongelmaa ilmoituksessa, et itse palvelussa.

## Ratkaisu

Diagnostisoi mDNS-verkko browse-komennolla:

```bash
avahi-browse -a
```

Tai kohdennetusti HTTP-palveluihin resoluutiolla:

```bash
avahi-browse -rt _http._tcp
```

`-r` resolvaa hostname ja portin, `-t` rajaa tiettyyn service typeen. Jos palvelu ei näy listassa, ongelma on julkaisussa (Avahi daemon, XML-tiedosto, palomuuri). Jos näkyy, ongelma on client-päässä (NSS-mdns, eri aliverkko).

`avahi-browse` listaa mDNS-palvelut — se on ensimmäinen askel kun palvelu "pitäisi näkyä" mutta ei näy.

## Käytännössä

Aja browse sekä palvelinkoneella että client-koneella. Jos palvelin näkee oman palvelunsa mutta client ei, etsi verkkosegmentointia, VLAN-eristystä tai palomuuria (UDP 5353). `-p` parsittu tulostus helpottaa skriptausta.

[Lue lisää](https://manpages.ubuntu.com/manpages/jammy/man1/avahi-browse.1.html)
