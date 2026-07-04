# Palvelimella pitää vaihtaa staattinen IP ilman GUI:ta NetworkManagerilla. Työkalu?

## Tilanne

Palvelin siirtyy staattiseen IP:hen DHCP:stä. Et voi käyttää graafista NetworkManager-käyttöliittymää — pääsy on vain SSH:lla.

Nykyinen profiili `Wired connection 1` hakee osoitteen automaattisesti, mutta uusi verkko vaatii `10.0.5.20/24` gatewaylla `10.0.5.1`.

## Ratkaisu

```bash
nmcli con mod 'Wired connection 1' \
  ipv4.method manual \
  ipv4.addresses 10.0.5.20/24 \
  ipv4.gateway 10.0.5.1 \
  ipv4.dns "10.0.5.53"

nmcli con up 'Wired connection 1'
```

**nmcli con mod 'Wired' ipv4.addresses ... ipv4.method manual** — NM tallentaa muutokset profiiliin pysyvästi.

Tarkista:

```bash
ip -br a
nmcli con show 'Wired connection 1'
```

## Käytännössä

Varmista profiilin nimi `nmcli con show`:lla ennen modifiointia — UUID on turvallisempi skripteissä. Väärä gateway voi katkaista SSH-yhteyden; pidä toinen sessio auki tai käytä serial console -pääsyä. cloud-init/netplan voi ylikirjoittaa NM-asetukset bootissa — synkronoi IaC ja NM-profiili.

[Lue lisää](https://networkmanager.dev/docs/api/latest/nmcli.html)
