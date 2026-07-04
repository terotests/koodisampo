# Lähiverkossa pitäisi näkyä tulostin — miten listaat Avahi-palvelut terminaalista?

## Tilanne

Toimistossa on verkkotulostin, joka pitäisi löytyä automaattisesti. Linux-käyttäjä yrittää lisätä tulostimen CUPS:in kautta, mutta se ei näy listassa. IP-osoite on tuntematon, eikä `/etc/hosts`-tiedostossa ole merkintää.

```bash
lpinfo -v
# (tyhjä tai vain usb://)
nmap -sn 192.168.1.0/24
# hidasta ja epätarkkaa tulostimien tunnistamiseen
```

Tulostin ilmoittaa itsensä mDNS:llä, mutta käyttäjä ei tiedä miten nähdä ilmoitetut palvelut terminaalista.

## Ratkaisu

Listaa kaikki mDNS-palvelut:

```bash
avahi-browse -a -r
```

Tai suodata tulostimet IPP-protokollalla:

```bash
avahi-browse -t _ipp._tcp
```

`-a` näyttää kaikki palvelutyypit, `-r` resolvaa hostname ja portin, `-t` rajaa tiettyyn service typeen. `avahi-browse` skannaa mDNS-palvelut lähiverkossa.

Esimerkkitulos:

```
+ eth0 IPv4 HP-LaserJet _ipp._tcp local
= eth0 IPv4 HP-LaserJet local hostname = [printer.local] port = [631]
```

## Käytännössä

Asenna `avahi-utils`-paketti jos komento puuttuu. Jos browse ei näytä mitään, tarkista ensin `systemctl status avahi-daemon` ja palomuurin UDP 5353. `-p` tulostaa palvelut parsittavassa muodossa skripteille.

[Lue lisää](https://manpages.ubuntu.com/manpages/jammy/man1/avahi-browse.1.html)
