# Kontti ei resolvdu sisäistä DNS-nimeä custom-verkossa. Mitä docker run -optiota kokeilet?

## Tilanne

Kehityskontti on user-defined verkossa `devnet`, mutta sisäinen hostname `gitlab.corp.local` ei resolvdu:

```bash
docker network create devnet
docker run -it --network devnet --name worker myworker:latest bash
# worker$ curl http://gitlab.corp.local
curl: (6) Could not resolve host: gitlab.corp.local
```

Embedded DNS (`127.0.0.11`) ratkaisee vain saman Docker-verkon konttien nimet — ei yrityksen sisäisiä zoneja. Tarvitset lisäresolverin.

## Ratkaisu

Kokeile **`--dns`**-optiota tai hyödynnä user-defined networkin embedded DNS custom-nimille (vain Docker-verkon konttien nimet).

```bash
docker run -it --network devnet --dns 10.20.0.2 --name worker myworker:latest bash
```

Testaa:

```bash
docker exec worker nslookup gitlab.corp.local
docker exec worker getent hosts gitlab.corp.local
```

User-defined bridge tarjoaa embedded DNS konttien väliseen nimien resolvaukseen; custom `--dns` tarvitaan ulkoisiin zoneihin.

## Käytännössä

Dev-koneilla yritys-VPN voi muuttaa hostin DNS:ää — varmista, että `--dns` osoittaa VPN:n tarjoamaan resolveriin, ei vain hostin `/etc/resolv.conf`:iin. Compose-projektissa sama asetus: `dns: [10.20.0.2]`.

[Lue lisää](https://docs.docker.com/config/containers/container-networking/)
