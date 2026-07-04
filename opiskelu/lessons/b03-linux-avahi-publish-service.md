# IoT-gateway pitää ilmoittaa HTTP-palvelu lähiverkkoon ilman staattista IP:tä. Ratkaisu?

## Tilanne

Raspberry Pi toimii IoT-gatewayna kotiverkossa. Se hostaa hallintapaneelin portissa 80, mutta IP vaihtuu DHCP:n myötä. Käyttäjä haluaa avata paneelin selaimessa nimellä `gateway.local` ilman reitittimen DNS-konfigurointia.

Gateway-ohjelmisto on minimaalinen eikä sisällä discovery-logiikkaa:

```bash
curl http://192.168.0.??/status
# IP tuntematon — reitittimen DHCP-loki ainoa vihje
```

Staattinen IP ei ole vaihtoehto, koska useampi laite jakaa saman aliverkon.

## Ratkaisu

Ilmoita HTTP-palvelu Avahilla **service file -määrittelyllä** tai **`avahi-publish-service` -komennolla**:

`/etc/avahi/services/gateway.service`:

```xml
<?xml version="1.0" standalone='no'?>
<service-group>
  <name>IoT Gateway</name>
  <service>
    <type>_http._tcp</type>
    <port>80</port>
  </service>
</service-group>
```

```bash
sudo systemctl reload avahi-daemon
avahi-browse -rt _http._tcp
```

Avahi publish rekisteröi palvelun lähiverkkoon mDNS-ilmoituksella — gateway löytyy ilman staattista IP:tä.

## Käytännössä

IoT-laitteissa pidä service-tiedosto versionhallinnassa ja deployaa Ansiblella. Lisää `<txt-record>version=1.2</txt-record>` client-sovelluksille. Tuotannossa harkitse myös TLS reverse proxyn kautta; mDNS itsessään ei salaa liikennettä.

[Lue lisää](https://www.avahi.org/docs/)
