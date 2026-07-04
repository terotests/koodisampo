# Uusi .service-tiedosto lisätty — palvelu ei näy verkossa. Mitä teet ensin?

## Tilanne

Kehittäjä loi uuden Avahi service -tiedoston:

```bash
sudo cp myapp.service /etc/avahi/services/myapp.service
cat /etc/avahi/services/myapp.service
# XML näyttää oikealta — _http._tcp port 8080
```

Palvelu pyörii paikallisesti, mutta `avahi-browse -rt _http._tcp` toiselta koneelta ei näytä sitä. Daemon on käynnissä jo tuntien ajan — uutta tiedostoa ei ole luettu.

## Ratkaisu

Lataa uudet service definitionit ilman täyttä uudelleenkäynnistystä:

```bash
sudo systemctl reload avahi-daemon
```

Tai vaihtoehtoisesti:

```bash
sudo avahi-daemon -k && sudo systemctl start avahi-daemon
```

Tarkista:

```bash
avahi-browse -rt _http._tcp
journalctl -u avahi-daemon -n 20
```

`avahi-daemon` reloads service files — se lukee `/etc/avahi/services/*.service` uudelleen reload-komennolla.

## Käytännössä

XML-syntaksivirhe estää koko tiedoston latautumisen — tarkista loki virheistä. `reload` on kevyempi kuin `restart` tuotannossa. Automaatisoi deploy-skriptissä: kopioi tiedosto → `systemctl reload avahi-daemon` → verify browse.

[Lue lisää](https://manpages.ubuntu.com/manpages/jammy/man8/avahi-daemon.8.html)
