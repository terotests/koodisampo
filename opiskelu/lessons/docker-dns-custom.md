# Kontti ei resolvaa sisäistä `corp.internal` -DNS:ää. Ensimmäinen tarkistus?

## Tilanne

Sisäinen API on nimellä `payments.corp.internal`. Kontissa sovellus kaatuu:

```
getaddrinfo ENOTFOUND payments.corp.internal
```

Hostilla `dig payments.corp.internal @10.0.0.53` toimii — corporate DNS on `10.0.0.53`. Kontti käyttää kuitenkin Dockerin injektoimaa resolveria (`127.0.0.11`), joka ei tunne sisäistä DNS-vyöhykettä.

```bash
docker exec myapp cat /etc/resolv.conf
# nameserver 127.0.0.11
```

Ensimmäinen askel on tarkistaa, onko custom DNS konfiguroitu ollenkaan.

## Ratkaisu

**`docker run --dns` tai daemon.json DNS-asetus custom-resolverille.** Docker injektoi oletusresolverin — custom DNS vaatii `--dns` tai daemon-konfigin.

Yksittäinen kontti:

```bash
docker run -d --dns 10.0.0.53 myapp:latest
```

Useampi nameserver:

```bash
docker run -d --dns 10.0.0.53 --dns 10.0.0.54 myapp:latest
```

Kaikille koneen konteille (`/etc/docker/daemon.json`):

```json
{
  "dns": ["10.0.0.53", "10.0.0.54"]
}
```

Käynnistä daemon uudelleen: `sudo systemctl restart docker`.

## Käytännössä

Corporate DNS + embedded DNS (127.0.0.11) voivat olla yhtä aikaa käytössä — testaa `docker exec myapp nslookup payments.corp.internal 10.0.0.53`. Compose:ssa käytä `dns:`-kenttää palvelutasolla. Älä hardkoodaa IP:itä sovellukseen, jos DNS on saatavilla.

[Lue lisää](https://docs.docker.com/config/daemon/)
