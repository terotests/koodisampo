# Wi-Fi katkesi toimistossa. Miten nmcli:llä yhdistät tunnetun profiilin?

## Tilanne

Kannettava herää unesta tai Wi-Fi katkeaa hetkeksi. Verkko-ikoni näyttää disconnected. Profiili `Office-WiFi` on tallennettu aiemmin — tarvit vain aktivoida sen uudelleen.

```bash
nmcli device status
# wlan0  wifi  disconnected
```

## Ratkaisu

```bash
nmcli connection up 'Office-WiFi'
```

**nmcli hallitsee NetworkManager-yhteyksiä** — profiili sisältää SSID:n, salasanan ja turva-asetukset.

Varmista yhteys:

```bash
nmcli device status
ping -c 2 internal-gateway.corp
```

## Käytännössä

Automaatiossa käytä UUID:ta jos profiilinimi muuttuu. `nmcli connection up` voi epäonnistua jos SSID ei ole näkyvissä — silloin `nmcli device wifi rescan` ennen uutta yritystä. Roaming-ongelmat toimistossa voivat vaatia `802-11-wireless.powersave disable` profiilissa.

[Lue lisää](https://networkmanager.dev/docs/api/latest/nmcli.html)
