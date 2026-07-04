# Lähiverkon tulostin pitäisi löytyä ilman staattista IP:tä. Protokolla?

## Tilanne

Pienessä toimistossa tulostin kytketään suoraan WiFi-reitittimeen. IT ei ylläpidä sisäistä DNS:ää, eikä jokaiselle laitteelle ole varattu staattista IP:tä. Uusi työntekijä yrittää lisätä tulostimen:

```bash
lpinfo -v | grep -i ipp
# (ei tuloksia)
```

Mac- ja Windows-koneet löytävät tulostimen automaattisesti, Linux-kone tarvitsee protokollan joka toimii ilman keskitettyä nimipalvelinta.

## Ratkaisu

**mDNS/Avahi** — `.local`-palvelunimi lähiverkon discoveryyn.

Tulostin ilmoittaa itsensä mDNS-multicastilla (UDP 5353) nimellä kuten `HP-Printer.local` ja service typellä `_ipp._tcp`. Linux-koneet löytävät sen Avahilla:

```bash
sudo systemctl enable --now avahi-daemon
avahi-browse -r _ipp._tcp
```

Avahi toteuttaa mDNS/DNS-SD — Zeroconf-palveluhaku ilman staattista IP:tä tai DNS-palvelinta.

## Käytännössä

Varmista client-koneilla `libnss-mdns`, jotta `.local`-nimet resolvautuvat sovelluksille. Enterprise-verkoissa mDNS voi olla estetty VLAN-eristyksellä — silloin tarvitaan DNS-SD proxy tai staattinen DNS.

[Lue lisää](https://avahi.org/)
