# Palvelimelle halutaan automaattiset tietoturvapäivitykset ilman manuaalista ylläpitoa. Mikä ratkaisu?

## Tilanne

Kymmenen Debian-palvelimen ylläpito on hoidettu ad hoc -tyylillä: joku muistaa ajaa `apt update && apt upgrade` kerran kuussa. CVE-tiedote tulee perjantaina, mutta korjaus asentuu vasta seuraavalla viikolla — tai ei koskaan, jos vastuuhenkilö on lomalla.

Manuaalinen malli ei skaalaudu. Cron-ajastettu `apt upgrade -y` ilman rajauksia on riskialtinen: se asentaa kaikki päivitykset, myös major-versiopäivitykset, jotka voivat rikkoa palvelun yöllä.

Tarvitaan virallinen, konfiguroitavissa oleva ratkaisu, joka asentaa automaattisesti vain tietoturvapäivitykset ja jättää muut odottamaan.

## Ratkaisu

Debianin ja Ubuntun virallinen ratkaisu on **unattended-upgrades**:

```bash
sudo apt install unattended-upgrades apt-listchanges
sudo dpkg-reconfigure -plow unattended-upgrades
```

Konfiguraatio tiedostossa `/etc/apt/apt.conf.d/50unattended-upgrades`:

```conf
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
};

Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Mail "admin@example.com";
```

Varmista että ajastin on käytössä (`/etc/apt/apt.conf.d/20auto-upgrades`):

```conf
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```

Näin järjestelmä ajaa `apt update` ja tietoturvapäivitykset automaattisesti päivittäin. `unattended-upgrades` on Debianin/Ubuntun virallinen ratkaisu turvapäivitysten automatisointiin — ei cron-skripti ilman rajauksia.

## Käytännössä

Testaa konfiguraatio ennen tuotantoon viemistä: `sudo unattended-upgrades --dry-run --debug`. Ota automaattinen uudelleenkäynnistys (`Automatic-Reboot`) käyttöön vain jos palvelu kestää sen — esim. kernel-päivitykset vaativat rebootin. Seuraa lokista `/var/log/unattended-upgrades/` mitä on asennettu, ja yhdistä hälytykset monitoringiin, jotta reboot tai epäonnistunut päivitys ei jää huomaamatta.

[Lue lisää](https://wiki.debian.org/UnattendedUpgrades)
