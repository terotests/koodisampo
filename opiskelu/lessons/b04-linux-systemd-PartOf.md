# Kun `web.target` pysähtyy, worker-prosessit jäävät roikkumaan. Miten sidot workerit targetiin?

## Tilanne

Arkkitehtuurissa on `web.target`, joka kokoaa web-stackin:

```bash
systemctl start web.target   # käynnistää nginx + worker@1 + worker@2
systemctl stop web.target    # nginx pysähtyy
ps aux | grep worker         # worker-prosessit yhä käynnissä!
```

Worker-unitit on linkitetty targetiin `WantedBy=` tai `PartOf`-puuttuu. Pelkkä `Wants=` targetista workeriin ei tarkoita, että worker pysähtyy kun target pysähtyy — tarvitaan käänteinen sidonta.

## Ratkaisu

Lisää worker-unitiin **`PartOf=web.target`** — **worker pysähtyy kun target pysähtyy**.

`worker@.service`:

```ini
[Unit]
Description=Web worker %i
PartOf=web.target
After=web.target

[Service]
ExecStart=/usr/bin/worker --id=%i
```

`web.target`:

```ini
[Unit]
Description=Web stack
Wants=worker@1.service worker@2.service nginx.service
After=worker@1.service worker@2.service nginx.service
```

**PartOf luo inverse dependency** — kun `web.target` pysähtyy tai restartataan, kaikki `PartOf=web.target` -unitit pysähtyvät mukana. systemd.unit(5) dokumentoi PartOf.

## Käytännössä

Erottele `PartOf=` (elinkaaren sidonta) ja `Requires=` (kovuus). Target on hyvä tapa ryhmätellä palveluita — dokumentoi stackin koostumus yhdessä target-tiedostossa.

Testaa: `systemctl stop web.target && systemctl is-active worker@1` pitäisi olla `inactive`. Ilman PartOf:ia orphan-prosessit kuluttavat resursseja ja aiheuttavat portti-konflikteja uudelleenkäynnistyksessä.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
