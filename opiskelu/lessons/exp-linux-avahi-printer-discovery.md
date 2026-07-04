# Toimiston tulostin pitäisi löytyä automaattisesti LANissa ilman staattista IP:tä. Mikä protokolla?

## Tilanne

Uusi toimistotulostin kytketään WiFi-verkkoon. IT-tiimi ei halua varata staattista IP:tä tai ylläpitää DNS-merkintää jokaiselle tulostimelle. Mac-käyttäjät lisäävät tulostimen suoraan "Lisää tulostin" -valikosta, mutta Linux-käyttäjät eivät näe laitetta.

```bash
lpstat -p
# lp: Error: No destinations added.
ping printer.office.local
# ping: printer.office.local: Name or service not known
```

Tulostimen IP on tuntematon, ja manuaalinen konfigurointi jokaiselle työasemalle ei skaalaudu.

## Ratkaisu

**mDNS / Avahi** julkaisee `.local`-palvelun LANissa — tulostin ilmoittaa itsensä protokollalla kuten `_ipp._tcp` tai `_printer._tcp`, ja clientit löytävät sen automaattisesti.

Linux-koneella:

```bash
sudo systemctl enable --now avahi-daemon
avahi-browse -t _ipp._tcp
```

Avahi toteuttaa mDNS/DNS-SD paikalliseen palveluhakuun. Tulostin näkyy nimellä `HP-LaserJet.local` ilman staattista IP:tä tai keskitettyä DNS:ää.

## Käytännössä

Useimmat modernit verkkotulostimet tukevat Bonjour/mDNS natiivisti. Varmista että `avahi-daemon` ja `libnss-mdns` ovat asennettu client-koneilla, jotta `.local`-nimet resolvautuvat. Enterprise-verkoissa mDNS voi vaatia VLAN-reflectorin.

[Lue lisää](https://www.avahi.org/)
