# Toimiston tulostin pitäisi löytyä verkosta automaattisesti. Mikä työkalu listaa mDNS-palvelut?

## Tilanne

Toimistossa on useita verkkolaitteita: tulostimia, NAS-palvelimia ja kehityskoneita. IT-hallinta haluaa inventoida lähiverkon palvelut ilman IP-skannausta. Perinteinen `nmap`-skannaus on hidas ja ei tunnista palvelutyyppejä.

```bash
nmap -sn 192.168.1.0/24
# Nmap scan report for 192.168.1.1
# ... ei kerro onko kyseessä tulostin vai reititin
```

Tulostimen pitäisi ilmoittaa itsensä automaattisesti, mutta mikä työkalu näyttää mDNS-palvelut?

## Ratkaisu

**`avahi-browse -a`** listaa kaikki ilmoitetut mDNS-palvelut lähiverkossa:

```bash
avahi-browse -a -r
```

`-a` = all service types, `-r` = resolve hostname ja port. Tulostimet näkyvät tyyppeinä `_ipp._tcp`, `_printer._tcp` tai `_pdl-datastream._tcp`.

Esimerkki:

```
+ wlp2s0 IPv4 HP-Office _ipp._tcp local
= wlp2s0 IPv4 HP-Office local hostname = [HP-Office.local] port = [631]
```

`avahi-browse` skannaa mDNS-palvelut — se on Linuxin standardityökalu tähän tarkoitukseen.

## Käytännössä

Asenna `avahi-utils` ja varmista `avahi-daemon` käynnissä ennen browsea. Yhdistä tulostimen URI CUPS:iin: `ipp://HP-Office.local/ipp/print`. Enterprise-verkoissa mDNS voi olla rajattu — tarkista reitittimen asetukset.

[Lue lisää](https://www.avahi.org/doctest/)
