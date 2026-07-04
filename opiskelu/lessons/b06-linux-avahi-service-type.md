# Julkaiset sisäisen API:n mDNS:llä kehitysympäristössä. Mitä service type käytät?

## Tilanne

Sisäinen REST API pyörii kehityskoneella portissa 8443. Kehittäjä haluaa ilmoittaa sen mDNS-verkkoon, jotta muut tiimin jäsenet ja testityökalut löytävät sen automaattisesti. Service XML -tiedosto on luonnosvaiheessa:

```xml
<service>
  <type>???</type>
  <port>8443</port>
</service>
```

Väärä service type tarkoittaa, ettei browse-komennot löydä palvelua oikealla suodattimella.

## Ratkaisu

HTTP-pohjaiselle API:lle käytä **`_http._tcp`** tai vastaavaa **IANA service typea** Avahi XML:ssä:

```xml
<?xml version="1.0" standalone='no'?>
<service-group>
  <name>Internal API</name>
  <service>
    <type>_http._tcp</type>
    <port>8443</port>
    <txt-record>path=/api/v1</txt-record>
  </service>
</service-group>
```

HTTPS:lle: `_https._tcp`. Muut protokollat: `_ssh._tcp`, `_smb._tcp` jne. — IANA DNS-SD registry määrittelee tyypit.

Tarkista julkaisu:

```bash
avahi-browse -rt _http._tcp
```

Avahi service types — katso `avahi.service(5)` man-sivu täydellisestä listasta.

## Käytännössä

`<txt-record>` kentillä voit ilmoittaa API-version, polun ja muut metatiedot. Client-sovellukset suodattavat browse-tuloksia service typen mukaan — valitse oikea IANA-tyyppi, älä keksi omia. Kehityksessä `_http._tcp` riittää lähes aina.

[Lue lisää](https://manpages.ubuntu.com/manpages/jammy/man5/avahi.service.5.html)
