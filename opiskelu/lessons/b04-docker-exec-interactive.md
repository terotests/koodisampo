# Kontissa pitää debugata konfig-tiedostoa interaktiivisesti. Komento?

## Tilanne
Tuotantokontissa epäily väärästä konfiguraatiotiedostosta. Tarvitset interaktiivisen shellin tarkistukseen.

## Ratkaisu
**docker exec -it kontti /bin/sh.**

```bash
docker exec -it my-api /bin/sh
cat /etc/myapp/config.yaml
```

Jos `/bin/sh` puuttuu, kokeile `/bin/bash` tai debug-image sidecarina.

docker exec -it avaa shellin käynnissä olevaan konttiin — docker exec docs.

## Käytännössä
Tuotannossa kirjaa exec-sessiot audit-lokiin. Distroless: käytä `docker debug` (Docker 4.x) tai sidecar-patternia.

[Lue lisää](https://docs.docker.com/reference/cli/docker/container/exec/)
