# Kehität paikallista HTTP-palvelua — haluat sen löytyvän `_http._tcp`. Miten?

## Tilanne

Node.js-sovellus pyörii kehityskoneella portissa 3000. Kollegat samassa verkossa haluavat testata sitä ilman IP-osoitteen jakamista Slackissa. Sovellus ei sisällä mDNS-kirjastoa, eikä kehittäjä halua lisätä riippuvuutta juuri tätä varten.

```bash
npm run dev
# Listening on http://localhost:3000
# Kollega: curl http://??? — mikä osoite?
```

Palvelu kuuntelee vain localhostia tai tiettyä IP:tä, eikä se ilmoita itseään `_http._tcp`-palveluna verkossa.

## Ratkaisu

Rekisteröi palvelu Avahilla joko **service XML -tiedostolla** tai **`avahi-publish-service` -komennolla**:

Staattinen määrittely `/etc/avahi/services/myapp.service`:

```xml
<service-group>
  <name>My Dev App</name>
  <service>
    <type>_http._tcp</type>
    <port>3000</port>
  </service>
</service-group>
```

Tai väliaikainen julkaisu kehityksen ajaksi:

```bash
avahi-publish-service "My Dev App" _http._tcp 3000
```

Vaihtoehtoisesti systemd-unit voi käynnistää Avahi-julkaisun osana palvelua. `avahi-publish-service` rekisteröi palvelun mDNS-verkkoon.

## Käytännössä

Kehityksessä `avahi-publish-service` on nopein tapa. Pysyvään julkaisuun käytä XML-tiedostoa ja `systemctl reload avahi-daemon`. Varmista että sovellus kuuntelee `0.0.0.0:3000`, ei pelkkää `127.0.0.1`.

[Lue lisää](https://manpages.ubuntu.com/manpages/jammy/man5/avahi.service.5.html)
