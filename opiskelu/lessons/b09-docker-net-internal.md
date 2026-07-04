# Tietokanta-kontti ei saa päästä internetiin — vain app-kontti. Verkko-asetus?

## Tilanne

Turvallisuusvaatimus: PostgreSQL ei saa tehdä ulospäin meneviä yhteyksiä (ei CVE-päivityslatauksia, ei data exfiltration). App-kontti tarvitsee sekä db-yhteyden että ulospäin HTTP:n.

```yaml
services:
  app:
    image: myapp:latest
  db:
    image: postgres:16
```

Molemmat oletusverkossa — db pääsee internetiin yhtä lailla kuin app.

## Ratkaisu

**`internal: true` user-defined network — ei ulkoista reititystä, konttien välinen liikenne OK.** Internal network — Docker compose network internal.

```yaml
services:
  app:
    image: myapp:latest
    networks:
      - internal
      - external
  db:
    image: postgres:16
    networks:
      - internal

networks:
  internal:
    internal: true
  external:
```

`db` on vain internal-verkossa — ei reittiä internetiin. `app` on molemmissa: tavoittaa db:n internal-verkossa ja internetin external-verkon kautta.

## Käytännössä

Internal-verkko ei korvaa salasanoja tai TLS:ää — se rajoittaa vain reititystä. Testaa: `docker compose exec db curl -I https://example.com` pitäisi epäonnistua. Tuotannossa yhdistä palomuurisääntöihin ja network policy -dokumentaatioon.

[Lue lisää](https://docs.docker.com/reference/compose-file/networks/#internal)
