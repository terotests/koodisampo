# Haluat julkaista koneen HTTP-palvelun Bonjour/Avahi-discoveryyn. Mihin konfiguraatio kuuluu?

## Tilanne

Paikallisverkossa palvelu pyörii portissa 8080. Haluat julkaista sen DNS-SD-palveluna `_http._tcp`, jotta selaimet ja discovery-työkalut löytävät sen ilman staattista IP:tä — ei pelkkänä porttina IP-osoitteen takana.

Huom: service XML ei automaattisesti tee hostnimestä `myapp.local`. `.local`-hostname tulee koneen hostnamesta / mDNS-nimijulkaisusta; XML ilmoittaa palveluinstanssin.

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

Palvelu ilmoitetaan verkossa `_http._tcp` DNS-SD-palveluna — selaimet ja discovery-työkalut löytävät sen.

Jos hostnimen pitää olla `myapp.local`, konfiguroi hostname erikseen:

```bash
sudo hostnamectl set-hostname myapp
sudo systemctl restart avahi-daemon
avahi-resolve -n myapp.local
```

## Käytännössä

mDNS toimii paikallisverkossa, ei internetissä. Tuotannossa julkinen DNS + reverse proxy on normaali ratkaisu; Avahi sopii kehitykseen, IoT:hen ja paikalliseen discoveryyn. Lisää `<txt-record>` versiotiedoille tarvittaessa.

[Lue lisää](https://www.avahi.org/manual.html)
