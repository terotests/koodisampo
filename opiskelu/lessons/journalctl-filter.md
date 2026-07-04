# Nginx kaatui viime yönä klo 02–04. Nopein tapa rajata lokit?

## Tilanne

PagerDuty herättää sinut: nginx on ollut alhaalla. Kollega sanoo kaatuneen joskus yön aikana klo 02–04. Palvelimella pyörii kymmeniä palveluita, ja raaka lokivirta on valtava:

```bash
journalctl --since "02:00" --until "04:00" | wc -l
# 847392
```

Sekoittuvat mukaan kernel-viestit, ssh-yritykset ja muut unitit. Tarvitset nopeasti vain nginx-palvelun rivit juuri tuolta aikaväliltä.

## Ratkaisu

Yhdistä unit-suodatin ja aikaväli yhteen komentoon:

```bash
journalctl -u nginx --since 02:00 --until 04:00
```

Voit tarkentaa unit-nimen:

```bash
journalctl -u nginx.service --since "2024-03-15 02:00" --until "2024-03-15 04:00"
```

journalctl ymmärtää unit-nimen ja aikaleimat — ei tarvitse greppiä tai erillistä lokitiedostoa.

Virheiden nopeaan tarkistukseen:

```bash
journalctl -u nginx --since 02:00 --until 04:00 -p err --no-pager
```

## Käytännössä

Incident-triagessa kirjoita aika heti `--since`/`--until`-muodossa; se on nopeampi kuin `-b` jos reboot tapahtui myöhemmin yön aikana. Tallenna tuloste tiedostoon ennen analyysiä: `journalctl -u nginx --since 02:00 --until 04:00 -o json-pretty > incident.json`.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html)
