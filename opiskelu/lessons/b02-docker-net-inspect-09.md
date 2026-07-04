# Container ei saa IP:tä custom networkista — diagnostiikka?

## Tilanne

Liität kontin custom-verkkoon, mutta se ei saa IP-osoitetta:

```bash
docker network create appnet --subnet 172.28.0.0/16
docker run -d --name worker --network appnet myworker:latest
docker inspect worker --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}: {{$v.IPAddress}}{{end}}'
# appnet: 
```

Sovellus ei saa verkkoyhteyttä. IPAM-ongelma, täysi subnet tai virheellinen liitos ovat tyypillisiä syitä.

## Ratkaisu

**`docker network inspect netname`** — tarkista Containers ja IPAM. network inspect näyttää liitetyt containerit.

```bash
docker network inspect appnet
```

Tarkista:

- `IPAM.Config` — onko subnet oikein ja vapaata tilaa?
- `Containers` — näkyykö `worker` listassa IP:llä?
- `Driver` ja `Options` — custom-asetukset

Jos kontti puuttuu:

```bash
docker network disconnect appnet worker 2>/dev/null
docker network connect appnet worker
```

Jos subnet on täynnä, laajenna verkko tai luo uusi IPAM-alue.

## Käytännössä

Dynamiikka IPAM-konflikteissa: toinen verkko samalla subnetilla voi aiheuttaa ongelmia. Automatisoidussa deployssa loggaa `docker network inspect` ennen rollbackia. Swarm overlay-verkoissa tarkista myös `--attachable`-flag.

[Lue lisää](https://docs.docker.com/reference/cli/docker/network/inspect/)
