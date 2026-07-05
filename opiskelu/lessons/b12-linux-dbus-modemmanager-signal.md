# LTE-modemi hidastuu — epäilet heikkoa signaalia. ModemManagerin D-Bus-CLI tarkistukseen?

## Tilanne

Reititin tai kannettava käyttää WWAN-modemia (`wwan0` tai `cdc-wdm0`). Yhteys on päällä mutta throughput romahtaa. `ip link show wwan0` kertoo vain linkkitilan — ei signaalivoimakkuutta.

ModemManager (`org.freedesktop.ModemManager1`) tarjoaa D-Bus-API:n modeemin hallintaan. `mmcli` on sen komentorivityökalu.

## Ratkaisu

```bash
mmcli -L
mmcli -m 0 --signal-get
mmcli -m 0 --location-get
```

Esimerkkituloste:

```
signal quality: 45% (recent)
```

**mmcli lukee signaalin, operaattorin ja APN-asetukset** ModemManagerin D-Bus-palvelusta.

## Käytännössä

Modemin indeksi (`-m 0`) löytyy `mmcli -L`:stä. NetworkManager voi hallita samaa modemia profiileilla (`nmcli connection show --active`). Jos signaali on hyvä mutta yhteys hidas, tarkista APN ja `journalctl -u ModemManager`. D-Bus-debug: `busctl introspect org.freedesktop.ModemManager1 /org/freedesktop/ModemManager1/Modem/0`.

[Lue lisää](https://www.freedesktop.org/software/ModemManager/doc/latest/mmcli.8.html)
