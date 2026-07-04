# Kaksi konttia samassa default bridge-verkossa — voivatko ne kommunikoida nimellä?

## Tilanne

Opiskelutehtävässä ajetaan kaksi konttia ilman custom-verkkoa:

```bash
docker run -d --name server myserver:latest
docker run -d --name client myclient:latest
```

Client yrittää: `curl http://server:8080` — nimi ei resolvdu. Molemmat ovat teknisesti default bridge -verkossa (`docker network ls` näyttää `bridge`).

## Ratkaisu

**Ei automaattisesti — default bridge ei tarjoa DNS-nimiä; käytä user-defined network.** User-defined bridge tarjoaa DNS-nimet.

```bash
docker network create devnet
docker run -d --name server --network devnet myserver:latest
docker run -d --name client --network devnet myclient:latest
docker exec client curl http://server:8080
```

Default bridgessä kontit voivat kommunikoida IP-osoitteilla (iptables-säännöt sallivat), mutta `--name` ei luo DNS-tietuetta.

## Käytännössä

Tämä on yleisin Docker-verkko-ansoista aloittelijoille. Compose-projektit välttävät ongelman automaattisesti luomalla projektiverkon. `docker run` -skripteissä lisää aina `--network` eksplisiittisesti.

[Lue lisää](https://docs.docker.com/engine/network/drivers/bridge/)
