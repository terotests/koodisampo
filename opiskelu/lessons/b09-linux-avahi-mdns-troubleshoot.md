# Kehityskone ei löydä kollegan .local-palvelua — sama WiFi. Yleisin syy Linuxilla?

## Tilanne

Kaksi kehittäjää istuu samassa toimistossa samassa WiFi-verkossa. Kollegan kone ilmoittaa API:n `devbox.local`:ina — Mac-kollega yhdistää ongelmitta, mutta Linux-kone ei:

```bash
avahi-browse -rt _http._tcp
# (tyhjä tai ei näy devbox.local)
ping devbox.local
# Name or service not known
```

Verkko on sama, palomuuria ei ole erikseen konfiguroitu. Ongelma on Linux-koneella, ei palvelimella.

## Ratkaisu

Yleisin syy Linuxilla: **`avahi-daemon` ei pyöri** tai **palomuuri estää UDP 5353 multicastin**.

Tarkista daemon:

```bash
systemctl status avahi-daemon
sudo systemctl enable --now avahi-daemon
```

Tarkista palomuuri (ufw):

```bash
sudo ufw status
# salli mDNS:
sudo ufw allow mdns
# tai: sudo ufw allow 5353/udp
```

mDNS käyttää multicast-porttia 5353 — ilman avahi-daemonia ja avointa multicast-porttia `.local`-palvelut eivät toimi.

Testaa browse kollegan palveluun:

```bash
avahi-browse -a -r
avahi-resolve -n devbox.local
```

## Käytännössä

Toinen yleinen syy: `libnss-mdns` puuttuu (browse toimii, ping/curl ei). Kolmas: client isolation WiFi-reitittimessä estää laitteiden välisen liikenteen — testaa ping IP:llä. `iptables -L` tai `nft list ruleset` paljastaa custom-säännöt.

[Lue lisää](https://avahi.org/)
