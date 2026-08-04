# HEALTHCHECK testaa DB-yhteyttä ja tietokanta on hetkellisesti alhaalla. Mitä healthcheckin pitäisi tehdä?

## Tilanne

Kontin `HEALTHCHECK` ajaa skriptin, joka `pg_isready` / TCP-checkkaa tietokantaa. Kun DB on hetken alhaalla (failover, maintenance), kontti merkitään unhealthyksi. Orchestrator (Docker Swarm / riippuva restart-politiikka) restartaa sovelluskonttia uudelleen ja uudelleen — vaikka prosessi itse on elossa ja toipuisi kun DB palaa.

## Ratkaisu

Erottele **liveness** ja **readiness**:

- **Liveness:** prosessi / HTTP `/healthz` — "oleeko tämä kontti kuollut ja restartattava?"
- **Readiness:** "voiko siihen ohjata liikennettä?" — sisältää riippuvuudet (DB, cache)

Dockerfile `HEALTHCHECK` on usein liveness-tyylinen. Älä tee siitä tiukkaa DB-riippuvuutta, jos restart ei korjaa tilannetta. Kubernetesissa: `livenessProbe` kevyt, `readinessProbe` voi tarkistaa DB:n.

## Käytännössä

- Sovellus voi vastata 503 readinessissä kun DB on alhaalla — ilman että kontti restartataan.
- Circuit breaker / retry sovelluksessa + readiness erottaa "odota" ja "tapa prosessi".
- Dokumentoi mitä HEALTHCHECK mittaa; älä sekoita riippuvuuden tilaa prosessin elämään.

[Lue lisää](https://docs.docker.com/reference/dockerfile/#healthcheck)
