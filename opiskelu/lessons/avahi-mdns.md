# Mitä Avahi tarjoaa lähiverkossa ilman keskitettyä DNS:ää?

## Tilanne

Kehitystiimi asentaa Raspberry Pi -laitteita toimistoon. Jokaisella laitteella on dynaaminen IP DHCP:stä, eikä paikalliseen reitittimeen ole konfiguroitu sisäistä DNS-zoonia. Kehittäjä yrittää yhdistää palveluun:

```bash
curl http://192.168.1.47:8080/api/health
```

IP vaihtuu rebootin jälkeen, ja `/etc/hosts` pitäisi päivittää käsin jokaisella koneella. Tiimi haluaa löytää palvelut nimellä (`sensor.local`) ilman keskitettyä nimipalvelinta.

Samassa verkossa Mac-koneet löytävät tulostimet automaattisesti Bonjourilla, mutta Linux-koneet eivät näe mitään ilman erillistä ratkaisua.

## Ratkaisu

Avahi tarjoaa **mDNS/DNS-SD-palvelujen löytämisen** `.local`-verkossa — Zeroconf/Bonjour-tyyppisen palveluilmoituksen Linuxilla.

Kun `avahi-daemon` pyörii, laite ilmoittaa oman hostnameensa (`devbox.local`) ja halutut palvelut (esim. `_http._tcp`) multicastilla lähiverkkoon. Muut koneet kuuntelevat samaa protokollaa ja löytävät palvelut ilman keskitettyä DNS:ää:

```bash
sudo systemctl enable --now avahi-daemon
avahi-browse -a -r
```

Avahi = Linux-toteutus mDNS:lle (RFC 6762) ja DNS-SD:lle (RFC 6763). Se korvaa tarpeen staattisille DNS-merkinnöille pienessä paikallisverkossa.

## Käytännössä

mDNS toimii linkkikerroksella — se ei korvaa yrityksen DNS:ää tai julkisia nimiä. Tuotannossa julkinen DNS + TLS on norma; Avahi sopii kehitykseen, IoT:hen, tulostimiin ja paikalliseen palveluhakuun. Varmista että palomuuri sallii UDP 5353 multicastin.

[Lue lisää](https://avahi.org/)
