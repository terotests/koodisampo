# Haluat julkaista HTTP-palvelun portissa 8080 mDNS:llä. Mihin konfiguraatio kuuluu?

## Tilanne

Paikallisverkossa palvelu pyörii portissa 8080. Käyttäjät eivät halua muistaa IP:tä — haluat ilmoittaa palvelun nimellä (`myapp.local`) mDNS:llä (Bonjour/Avahi). Pelkkä palvelun käynnistys ei julkaise sitä automaattisesti verkossa.

## Ratkaisu

Avahi service -tiedosto hakemistossa `/etc/avahi/services/`:

```xml
<?xml version="1.0" standalone='no'?>
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
  <name replace-wildcards="yes">My App on %h</name>
  <service>
    <type>_http._tcp</type>
    <port>8080</port>
  </service>
</service-group>
```

Tallenna esim. `/etc/avahi/services/myapp.service` ja käynnistä Avahi uudelleen:

```bash
sudo systemctl restart avahi-daemon
```

Palvelu ilmoitetaan verkossa `_http._tcp.local` — selaimet ja discovery-työkalut löytävät sen.

## Käytännössä

mDNS toimii paikallisverkossa, ei internetissä. Tuotannossa julkinen DNS + reverse proxy on normaali ratkaisu; Avahi sopii kehitykseen, IoT:hen ja paikalliseen discoveryyn. Lisää `<txt-record>` versiotiedoille tarvittaessa.

[Lue lisää](https://www.avahi.org/manual.html)
