# App käynnistyy ennen verkkoa — DNS lookup epäonnistuu bootissa. Unit-riippuvuus?

## Tilanne

Boot-lokeissa toistuu:

```
app: dial api.example.com: lookup api.example.com on 127.0.0.53:53: server misbehaving
app: Exited with code 1
```

Sovellus käynnistyy ennen kuin verkko ja DNS ovat valmiit. `After=network.target` ei riitä — se tarkoittaa vain "verkkopinon alustettu", ei "verkko toimii".

## Ratkaisu

Lisää unit-tiedostoon **`After=network-online.target` + `Wants=network-online.target`**.

```ini
[Unit]
Description=App requiring external API
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/bin/app
Restart=on-failure
RestartSec=5s
```

Varmista wait-online -palvelu:

```bash
systemctl enable systemd-networkd-wait-online.service
# tai NetworkManager-wait-online
```

**network-online.target** on aktiivisesti odottava target: sen "online"-määritelmän antaa verkonhallintakerros (NetworkManager, systemd-networkd). Se **ei** tarkoita "internet toimii ikuisesti" tai "DNS vastaa varmasti kaikille nimille".

## Käytännössä

Testaa hidas DHCP ja offline-boot. `Requires=network-online.target` on liian kova jos verkko voi puuttua — prefer `Wants`.

**Älä luota pelkkään systemd-järjestykseen.** Sovelluksessa pitää silti olla retry DNS- ja TCP-yhteyksille, koska verkko voi katketa myös bootin jälkeen. Erottele boot-riippuvuus (systemd) vs. runtime-verkkokatko (sovellus).

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html#After=)
