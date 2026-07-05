# Haluat listata NetworkManagerin D-Bus-metodit terminaalista ennen automaatiota. Ensimmäinen komento?

## Tilanne

Rakennat skriptin, joka kytkee Wi-Fi-verkon tai muuttaa IP-asetuksia NetworkManagerin kautta. Ennen `busctl call` -kutsuja tarvitset tietää oikeat interfacen nimet, metodit ja parametrit.

`nmcli` piilottaa D-Bus-yksityiskohdat — suora bus-tason debug alkaa introspektiosta.

## Ratkaisu

```bash
busctl introspect org.freedesktop.NetworkManager \
  /org/freedesktop/NetworkManager
```

Syvempi polku laitteelle:

```bash
busctl tree org.freedesktop.NetworkManager
busctl introspect org.freedesktop.NetworkManager \
  /org/freedesktop/NetworkManager/Devices/1 \
  org.freedesktop.NetworkManager.Device.Wireless
```

**busctl introspect listaa metodit, signaalit ja propertyt** — D-Bus-skeeman lukeminen ilman dokumentaatiota.

## Käytännössä

Sama toimii BlueZ:lle (`org.bluez`) ja ModemManagerille (`org.freedesktop.ModemManager1`). Tallenna introspect-tulos versionhallintaan jos rakennat CI-automaatiota — API voi muuttua distrojen välillä. `busctl monitor` seuraa reaaliaikaisia viestejä debugatessa.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/busctl.html)
