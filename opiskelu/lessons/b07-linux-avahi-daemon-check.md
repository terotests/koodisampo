# Lähiverkon palvelut eivät ilmesty — epäilet Avahia. Ensimmäinen tarkistus?

## Tilanne

Kehityskoneella mikään `.local`-palvelu ei toimi. Tulostin, NAS ja kollegan kehityspalvelin ovat näkymättömiä:

```bash
avahi-browse -a
# (tyhjä tai timeout)
curl http://devbox.local:3000
# Could not resolve host
ping sensor.local
# Name or service not known
```

Ongelma vaikuttaa kaikkeen mDNS:ään koneella — ei yksittäiseen palveluun. Epäilet Avahi-daemonia.

## Ratkaisu

Ensimmäinen tarkistus:

```bash
systemctl status avahi-daemon
```

Jos palvelu ei ole active (running):

```bash
sudo systemctl enable --now avahi-daemon
```

Onnistunut tila:

```
● avahi-daemon.service - Avahi mDNS/DNS-SD Stack
     Active: active (running)
```

`avahi-daemon` must be running for mDNS — ilman sitä browse, resolve ja `.local`-nimet eivät toimi ollenkaan.

Seuraavat askeleet vasta daemonin jälkeen: palomuuri (UDP 5353), `libnss-mdns`, verkkoliittymä.

## Käytännössä

Minimal-asennuksissa Avahi ei ole oletuksena päällä. `systemctl is-enabled avahi-daemon` varmistaa autostartin. Jos daemon kaatuu loopissa, tarkista `journalctl -u avahi-daemon` konfiguraatiovirheistä `/etc/avahi/avahi-daemon.conf`:issa.

[Lue lisää](https://www.avahi.org/doctest/)
