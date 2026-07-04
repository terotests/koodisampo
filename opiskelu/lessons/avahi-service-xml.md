# Haluat julkaista HTTP-palvelun ilman koodimuutosta Avahilla. Minne static service -määrittely?

## Tilanne

Sisäinen dokumentaatiopalvelin pyörii nginxillä portissa 8080. Sovelluskoodiin ei haluta lisätä mDNS-kirjastoa — palvelu on jo valmis ja toimii. Kehittäjät haluavat löytää sen verkosta nimellä ilman staattista IP:tä tai hosts-tiedoston muokkausta.

Palvelu käynnistyy systemd-unitilla, mutta se ei ilmoita itseään mDNS-verkkoon. Tarvitaan deklaratiivinen tapa kertoa Avahille: "tämä kone tarjoaa HTTP:ää portissa 8080".

## Ratkaisu

Staattinen palvelumäärittely kuuluu tiedostoon **`/etc/avahi/services/*.service`** — XML-muotoinen service definition, jonka Avahi lukee käynnistyessään:

```xml
<?xml version="1.0" standalone='no'?>
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
  <name replace-wildcards="yes">Docs on %h</name>
  <service>
    <type>_http._tcp</type>
    <port>8080</port>
  </service>
</service-group>
```

Tallenna esim. `/etc/avahi/services/docs.service` ja lataa daemon uudelleen:

```bash
sudo systemctl reload avahi-daemon
```

Avahi lukee XML service definitionit `services`-hakemistosta automaattisesti — koodimuutoksia ei tarvita.

## Käytännössä

Käytä `<txt-record>`-kenttiä versio- ja polkutiedoille. Wildcard `%h` korvautuu koneen hostnameksi. Tuotantopalvelimilla mDNS on harvinaista, mutta kehitysympäristöissä ja IoT-gatewayeissa static service -tiedostot ovat selkein tapa ilmoittaa palvelu ilman ohjelmointia.

[Lue lisää](https://avahi.org/manpages.html)
