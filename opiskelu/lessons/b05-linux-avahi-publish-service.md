# Kehityspalvelu portissa 3000 pitäisi löytyä mDNS:llä ilman manuaalista hosts-tiedostoa. Miten?

## Tilanne

React + Express -sovellus pyörii kehityskoneella portissa 3000. Tiimi haluaa testata mobiililaitteilla samassa WiFi-verkossa ilman hosts-tiedoston muokkausta jokaisella laitteella:

```bash
# Mobiilissa selaimessa:
http://192.168.1.23:3000   # IP vaihtuu DHCP:llä
```

`/etc/hosts` kaikilla koneilla ei skaalaudu. Tarvitaan automaattinen palveluhaku mDNS:llä.

## Ratkaisu

Ilmoita palvelu Avahilla **service definition XML:llä** tai **`avahi-publish-service` -komennolla**:

`/etc/avahi/services/devapp.service`:

```xml
<?xml version="1.0" standalone='no'?>
<service-group>
  <name replace-wildcards="yes">Dev App on %h</name>
  <service>
    <type>_http._tcp</type>
    <port>3000</port>
  </service>
</service-group>
```

```bash
sudo systemctl reload avahi-daemon
```

Tai kehityksen ajaksi:

```bash
avahi-publish-service "Dev App" _http._tcp 3000
```

Avahi publish ilmoittaa palvelun mDNS:llä — service XML format on pysyvä ratkaisu.

## Käytännössä

Varmista että Express kuuntelee `0.0.0.0`, ei `127.0.0.1`. Mobiilissa `.local`-nimi toimii vain jos laite tukee mDNS:ää (iOS/Android usein kyllä selaimessa suoraan IP:llä). Kehityksessä `avahi-publish-service` riittää; CI/CD-deployissa käytä XML-tiedostoa.

[Lue lisää](https://www.avahi.org/doctest/)
