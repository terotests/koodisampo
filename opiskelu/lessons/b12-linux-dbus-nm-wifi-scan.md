# NetworkManager ei näytä uusia Wi-Fi-verkkoja GUI:ssa, vaikka radio on päällä. Miten pakotat skannauksen D-Bus-kautta?

## Tilanne

Kannettava on toimistolla, Wi-Fi-radio on päällä (`nmcli radio wifi` → enabled), mutta verkko listassa ei päivity. GUI ja `nmcli device wifi list` näyttävät vanhan listan. Epäilet että skannaus ei käynnistynyt automaattisesti.

NetworkManager tarjoaa D-Bus-rajapinnan system-busilla — skannaus voidaan pakottaa suoraan API:sta ilman palvelun uudelleenkäynnistystä.

## Ratkaisu

Selvitä ensin Wi-Fi-laitteen D-Bus-polku (`nmcli -t -f GENERAL.DBUS-PATH device show wlan0` tai `busctl tree org.freedesktop.NetworkManager`), koska `RequestScan` on laitekohtaisen `Device.Wireless`-rajapinnan metodi, ei ylätason `NetworkManager`-rajapinnan:

```bash
busctl call org.freedesktop.NetworkManager \
  /org/freedesktop/NetworkManager/Devices/3 \
  org.freedesktop.NetworkManager.Device.Wireless RequestScan a{sv} 0
```

Tarkista tulos:

```bash
nmcli device wifi list
```

**RequestScan ottaa parametrikseen tyhjän `a{sv}`-sanakirjan** (valinnainen `ssids`-suodatin), ei merkkijonotaulukkoa (`as`) — väärä signatuuri palauttaa D-Bus-virheen.

## Käytännössä

Käytä system-bus (`busctl`), ei session-bus, ja kohdista kutsu oikeaan laitepolkuun (`/org/freedesktop/NetworkManager/Devices/N`) ja `Device.Wireless`-rajapintaan. Skripteissä `nmcli device wifi rescan` on usein helpompi, mutta D-Bus-kutsu on hyödyllinen kun nmcli ei ole saatavilla tai automaatio käyttää jo `busctl`:ia. Jos skannaus epäonnistuu polkit-virheeseen, tarkista käyttäjän oikeudet NetworkManageriin.

[Lue lisää](https://networkmanager.dev/docs/api/latest/spec.html)
