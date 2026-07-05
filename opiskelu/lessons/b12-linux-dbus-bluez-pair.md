# Bluetooth-kuulokkeet eivät yhdisty — BlueZ pyörii mutta laite on untrusted. CLI-korjaus ennen D-Bus-skriptiä?

## Tilanne

`systemctl status bluetooth` näyttää palvelun aktiivisena. Kuulokkeet näkyvät `bluetoothctl scan on` -haussa, mutta yhteys katkeaa tai paritus epäonnistuu. Laitteen tila on usein `untrusted` tai `not paired`.

BlueZ (`org.bluez`) hallitsee paritusta D-Bus-palvelun kautta. `bluetoothctl` on interaktiivinen wrapper samalle API:lle.

## Ratkaisu

```bash
bluetoothctl
scan on
pair AA:BB:CC:DD:EE:FF
trust AA:BB:CC:DD:EE:FF
connect AA:BB:CC:DD:EE:FF
```

Yhdellä rivillä:

```bash
bluetoothctl pair AA:BB:CC:DD:EE:FF && \
  bluetoothctl trust AA:BB:CC:DD:EE:FF && \
  bluetoothctl connect AA:BB:CC:DD:EE:FF
```

**pair + trust + connect** — BlueZ vaatii luottamuksen ennen automaattista uudelleenyhdistämistä.

## Käytännössä

Headless-palvelimella tarvitset usein agentin (`bluetooth-agent`) PIN-kyselyihin. D-Bus-skripteissä vastaavat kutsut menevät `org.bluez.Device1`-interfaceen. Tarkista `rfkill list bluetooth` — soft block estää skannauksen vaikka palvelu pyörii.

[Lue lisää](https://www.bluez.org/)
