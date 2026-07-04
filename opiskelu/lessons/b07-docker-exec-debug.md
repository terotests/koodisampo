# Kontti pyörii mutta HTTP ei vastaa — haluat shellin sisälle debugata. Komento?

## Tilanne
Kontti pyörii (`Up`) mutta HTTP ei vastaa. Tarvitset shellin sisälle debugata.

## Ratkaisu
**docker exec -it container_name /bin/sh avaa interaktiivisen shellin elävään konttiin.**

```bash
docker exec -it my-api /bin/sh
curl -v localhost:8080/
netstat -tlnp
```

docker exec runs command in running container — docker exec docs.

## Käytännössä
Distroless: debug-sidecar. Tuotannossa rajoita exec-oikeudet RBAC:lla.

[Lue lisää](https://docs.docker.com/reference/cli/docker/container/exec/)
