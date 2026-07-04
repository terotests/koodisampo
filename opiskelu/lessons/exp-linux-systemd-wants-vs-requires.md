# App.service riippuu tietokannasta. DB kaatuu — haluat appin pysähtyvän. Mikä riippuvuus?

## Tilanne

Tuotantosovellus tallentaa kaiken PostgreSQLiin. Unit-tiedostossa on vain pehmeä riippuvuus:

```ini
[Unit]
Wants=postgresql.service
After=postgresql.service
```

Kun tietokanta kaatuu kesken yön, `app.service` jää pyörimään — se palauttaa 500-virheitä, täyttää lokia ja systemd pitää sen `active (running)` -tilassa. Monitorointi ei hälytä, koska prosessi on teknisesti elossa.

Haluttu käyttäytyminen: jos tietokanta ei ole saatavilla, sovellus ei saa teeskentellä normaalia toimintaa — systemd pysäyttää sen.

## Ratkaisu

Käytä **`Requires=db.service` — kova riippuvuus**.

```ini
[Unit]
Description=Application server
Requires=postgresql.service
After=postgresql.service

[Service]
ExecStart=/usr/bin/myapp
Restart=on-failure
```

**Requires pysäyttää riippuvaisen yksikön jos vaatimus kaatuu.** Kun `postgresql.service` menee failed-tilaan tai pysähtyy, systemd pysäyttää myös `app.service`:n.

Tarkista:

```bash
systemctl show app.service -p Requires
```

## Käytännössä

Kova riippuvuus sopii oikeasti pakollisiin komponentteihin. Yhdistä se `Restart=on-failure` -asetukseen vain jos haluat automaattisen palautumisen DB:n palattua — muuten sovellus jää odottamaan manuaalista startia.

Dokumentoi arkkitehtuuri: load balancer voi reitata liikenteen pois ennen kuin app kaatuu kokonaan. `Requires` on systemd-tason turvaventtiili, ei korvike health checkille.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html#Requires=)
