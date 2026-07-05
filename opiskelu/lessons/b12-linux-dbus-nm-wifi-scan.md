# NetworkManager ei näytä uusia Wi-Fi-verkkoja GUI:ssa, vaikka radio on päällä. Miten pakotat skannauksen D-Bus-kautta?

## Tilanne

Kannettava on toimistolla, Wi-Fi-radio on päällä (`nmcli radio wifi` → enabled), mutta verkko listassa ei päivity. GUI ja `nmcli device wifi list` näyttävät vanhan listan. Epäilet että skannaus ei käynnistynyt automaattisesti.

NetworkManager tarjoaa D-Bus-rajapinnan system-busilla — skannaus voidaan pakottaa suoraan API:sta ilman palvelun uudelleenkäynnistystä.

## Ratkaisu

```bash
busctl call org.freedesktop.NetworkManager \
  /org/freedesktop/NetworkManager \
  org.freedesktop.NetworkManager RequestScan as
```

Tarkista tulos:

```bash
nmcli device wifi list
```

**RequestScan on NetworkManagerin virallinen D-Bus-metodi** — vastaa `nmcli device wifi rescan` -komennon taustalla olevaa kutsua.

## Käytännössä

Käytä system-bus (`busctl`), ei session-bus. Skripteissä `nmcli device wifi rescan` on usein helpompi, mutta D-Bus-kutsu on hyödyllinen kun nmcli ei ole saatavilla tai automaatio käyttää jo `busctl`:ia. Jos skannaus epäonnistuu polkit-virheeseen, tarkista käyttäjän oikeudet NetworkManageriin.

[Lue lisää](https://networkmanager.dev/docs/api/latest/spec.html)
