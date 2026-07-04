# RHEL-host: bind mount permission denied vaikka chmod 777. Todennäköisin syy?

## Tilanne

RHEL-palvelimella mounttaat sovellusdatan:

```bash
docker run -d \
  -v /srv/appdata:/data \
  myapp:latest
```

Host-kansiossa oikeudet ovat avoimet:

```bash
chmod -R 777 /srv/appdata
ls -laZ /srv/appdata
# drwxrwxrwx. root root unconfined_u:object_r:user_home_t:s0
```

Silti kontissa:

```
Permission denied: /data/upload/file.pdf
```

Unix-oikeudet eivät auta — ongelma ei ole chmod, vaan RHEL:n SELinux-konteksti.

## Ratkaisu

**SELinux estää kirjoituksen — käytä `:Z` tai `:z` volume-flagia relabelille:**

```bash
docker run -d \
  -v /srv/appdata:/data:Z \
  myapp:latest
```

- `:Z` — relabelaa volume yksityiseksi (yksi kontti)
- `:z` — relabelaa jaettavaksi (useampi kontti)

SELinux volume labels — flag kertoo SELinux:lle sallia kontin prosessin kirjoittaa mountattuun hakemistoon. Varmista konteksti: `ls -Z /srv/appdata` pitäisi näyttää `container_file_t` relabelin jälkeen.

## Käytännössä

RHEL/CentOS/Fedora-ympäristöissä SELinux on oletuksena enforcing — testaa aina bind mount -oikeudet SELinux-kontekstilla, ei pelkällä chmodilla. Tuotannossa `:Z` yksittäiselle palvelulle, `:z` jaetuille volumeille. Dokumentoi relabel-käytäntö infra-koodissa.

[Lue lisää](https://docs.docker.com/engine/storage/bind-mounts/#configure-the-selinux-label)
