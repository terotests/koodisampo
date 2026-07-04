# Sovellus sanoo portti 8080 varattu — mikä komento näyttää prosessin joka kuuntelee?

## Tilanne

Spring Boot -sovellus käynnistyy palvelimella:

```
Web server failed to start. Port 8080 was already in use.
```

Et tiedä, onko kyseessä vanha deployment, debug-prosessi vai toinen palvelu samalla koneella. Tarvit nopean komennon ilman lisäasennuksia.

## Ratkaisu

```bash
ss -tlnp | grep 8080
```

UDP-palvelulle:

```bash
ss -ulnp | grep 8080
```

**ss korvaa netstatin — näyttää listen socketit ja prosessit.**

Esimerkki:

```
LISTEN 0 4096 *:8080 *:* users:(("node",pid=8832,fd=18))
```

## Käytännössä

Jos prosessi on kontissa, aja `ss` hostilla ja tarkista `docker ps` / `podman ps` — porttimapping voi peittää oikean omistajan. CI-ympäristöissä orphaned-prosessit ovat yleisiä; harkitse systemd-Unitin `ExecStop`-komentoa varmistamaan socketin vapautus.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)
