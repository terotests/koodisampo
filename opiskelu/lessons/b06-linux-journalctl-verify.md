# Audit vaatii lokien eheyden tarkistuksen. Mitä journalctl tarjoaa?

## Tilanne

Turvallisuusauditissa vaaditaan todiste siitä, ettei järjestelmälokit ole muokattu jälkikäteen. Pelkkä lokien lukeminen `journalctl -u app` ei riitä — pitää voida varmistaa, että merkinnät ovat eheät ja ketju ei ole katkennut.

Tuotannossa epäilyttävä aukko lokitiedoissa (puuttuva aikaväli, outo reboot) herättää kysymyksen: onko dataa poistettu tai muokattu?

## Ratkaisu

`journalctl --verify` tarkistaa journal-tiedostojen eheyden:

```bash
journalctl --verify
journalctl --verify --file=/var/log/journal/...
```

Virheelliset tai korruptoituneet segmentit raportoidaan. Ennaltaehkäisyyn: **Forward Secure Sealing (FSS)** `journald.conf`:ssa:

```ini
[Journal]
Seal=yes
```

FSS sinetöi menneet merkinnät kryptografisesti — hiljainen muokkaus vanhoihin riveihin havaitaan. Auditissa yhdistä verify + FSS-asetus + lokien ulkoinen varmuuskopio.

## Käytännössä

`--verify` ajetaan ennen auditia tai epäilyttävän tapahtuman jälkeen. FSS vaatii pysyvän kellon (NTP) — väärä aika voi aiheuttaa varoituksia. Älä sekoita verifyä ja tavallista lokihakua — verify on eheystarkistus, ei suodatus.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journalctl.html#--verify)
