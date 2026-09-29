# App service pitää käynnistyä vain jos network-online.target on valmis. Unit-riippuvuus?

## Tilanne

Sovellus käynnistyy bootissa heti `network.target`:in jälkeen — verkko-rajapinta on olemassa, mutta DHCP tai routing ei ole valmis. Sovellus yrittää yhdistää ulkoiseen API:in, epäonnistuu ja systemd käynnistää sen uudelleen crash loopissa.

`network.target` ≠ verkko oikeasti käyttövalmis.

## Mikä `network-online.target` oikeasti on?

Se on **systemd:n target-unit** — boot-grafin **synkronointipiste**, ei verkkorajapinta.

| Ei ole | On |
|--------|-----|
| `nmcli`-yhteyden tai -laitteen nimi | systemd-unit, tiedosto `network-online.target` |
| `eth0` / `wlan0` tms. rajapinta | looginen “virstanpylväs”: verkko konfiguroitu ja käytettävissä |
| NetworkManagerin CLI-komento `nm-online` | target, jota wait-online -palvelut aktivoi |

Target-unitit eivät tee itse työtä. Ne kokoavat riippuvuuksia: kun kaikki vaaditut yksiköt ovat valmiit, target siirtyy `active`-tilaan. Muut unitit voivat odottaa sitä `After=` / `Wants=` -rivillä.

Verkkotargetit bootissa (karkeasti):

```
network-pre.target  →  network.target  →  network-online.target
     (alustus)         (pino ylhäällä)      (IP, reitit, DNS valmiit)
```

## Mistä se löytyy?

Unit-tiedosto tulee systemd-paketista — **älä muokkaa sitä suoraan** app-palvelua varten.

```bash
systemctl cat network-online.target
# tai
cat /usr/lib/systemd/system/network-online.target
```

Tarkista tila ja kuka vetää targetin mukaan:

```bash
systemctl is-active network-online.target
systemctl list-dependencies network-online.target
systemctl show network-online.target -p Wants -p After -p Description
```

App-palvelun riippuvuus kirjoitetaan **omaan** unit-tiedostoon (`/etc/systemd/system/myapp.service` tai `*.service.d/override.conf`), ei `network-online.target`:iin.

## Miten se on määritelty?

Itse target on **minimaalinen staattinen unit**. Esimerkki (systemd 255):

```ini
[Unit]
Description=Network is Online
Documentation=man:systemd.special(7)
Documentation=https://systemd.io/NETWORK_ONLINE
After=network.target
```

Huomaa: tiedostossa **ei ole** `[Service]`-osiota, DHCP-kutsuja eikä rajapintanimiä. Target odottaa passiivisesti, kunnes jokin muu unit ilmoittaa verkon valmiiksi.

Varsinainen “odota kunnes verkko toimii” -logiikka on **wait-online -palveluissa**:

| Verkkopino | Palvelu | Rooli |
|------------|---------|-------|
| NetworkManager | `NetworkManager-wait-online.service` | odottaa konfiguroitua yhteyttä |
| systemd-networkd | `systemd-networkd-wait-online.service` | odottaa konfiguroituja rajapintoja |

Typillinen wait-online -palvelu on `Type=oneshot`: se blokkaa bootin, kunnes verkko on käytettävissä, ja linkittyy targetiin esim. `Before=network-online.target` + `Wants=network-online.target`. Kun wait-online valmistuu, `network-online.target` aktivoituu.

**Ilman käytössä olevaa wait-online -palvelua** `network-online.target` voi aktivoitua liian aikaisin — appin `Wants=network-online.target` ei silloin auta.

## Ratkaisu

Unit-tiedostossa:

```ini
[Unit]
Description=My App
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/bin/myapp
```

- **`After=`** — käynnistysjärjestys: app vasta kun target on aktivoitu.
- **`Wants=`** — systemd yrittää aktivoida `network-online.target`:in (ja sitä kautta wait-online -ketjun).

Varmista että wait-online -palvelu on käytössä:

```bash
# NetworkManager
systemctl enable NetworkManager-wait-online.service

# tai systemd-networkd
systemctl enable systemd-networkd-wait-online.service
```

## Huomio

`Requires=` on kovempi kuin `Wants=` — epäonnistuminen pysäyttää appin. `Wants` riittää useimmiten. Älä käytä pelkkää `After=network.target` jos sovellus tarvitsee ulkoisen yhteyden heti käynnistyksessä.

`After=` ilman `Wants=` / `Requires=` ei aktivoi targetia — se vain sanoo “jos target joskus aktivoituu, käynnistä minut sen jälkeen”. Ilman `Wants=` targetia ei välttämättä koskaan vedetä mukaan.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/latest/systemd.special.html)
