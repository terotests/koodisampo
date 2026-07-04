# Wi-Fi katkeilee — haluat vaihtaa verkko profiilin CLI:stä. Komento?

## Tilanne

Kahvilassa yhteys on hidas. Toimistoverkon profiili `Office-WiFi` on tallennettu NetworkManageriin, mutta laite yrittää yhä heikkoa vierasta verkkoa. Haluat vaihtaa profiilin nopeasti terminaalista ilman GUI:ta.

```bash
nmcli device status
# wlan0  wifi  connected  Cafe-Guest
```

## Ratkaisu

```bash
nmcli connection up 'Office-WiFi'
```

Profiili aktivoidaan ja NM yhdistää oikeaan SSID:hen tallennetuilla tunnuksilla.

Listaa profiilit:

```bash
nmcli connection show
```

**nmcli hallitsee NetworkManager-profiileja** — `connection up` on oikea tapa vaihtaa, ei `iwconfig` tai manuaalinen `wpa_supplicant`.

## Käytännössä

Profiilinimissä välilyönnit vaativat lainausmerkit. Automaatiossa voit käyttää UUID:ta epäselvien nimien sijaan. Jos `up` epäonnistuu, `nmcli device wifi list` näyttää saatavilla olevat verkot — varmista että SSID on kuuluvilla.

[Lue lisää](https://man7.org/linux/man-pages/man1/nmcli.1.html)
