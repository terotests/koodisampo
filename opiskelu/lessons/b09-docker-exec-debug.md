# Kontti pyörii mutta shelliä ei ole imageessa — tarvitset interaktiivisen debug-session. Komento?

## Tilanne
Kontti pyörii, shell-image puuttuu (alpine-minimal). HTTP timeout — tarvitset interaktiivisen session.

## Ratkaisu
**docker exec -it container_name sh avaa shellin elävään konttiin debug-tarkoituksessa.**

```bash
docker exec -it mycontainer sh
# tai bash jos saatavilla
```

Ei shelliä: debug-sidecar tai `docker debug mycontainer`.

docker exec suorittaa komennon running-kontissa — CLI docs.

## Käytännössä
Distroless: netshoot-sidecar samaan network namespaceen. Rajoita exec tuotannossa.

[Lue lisää](https://docs.docker.com/reference/cli/docker/container/exec/)
