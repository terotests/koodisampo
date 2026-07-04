# Kontti on verkossa mutta ei vastaa. Miten varmistat IP:n ja gatewayn kontissa?

## Tilanne

Mikropalvelu on liitetty custom-verkkoon, mutta `curl`-kutsu toiseen palveluun timeouttaa. `docker ps` näyttää kontin käynnissä olevana, ja verkko on luotu:

```bash
docker network create backend
docker run -d --name api --network backend myapi:latest
```

Epäilet reititysongelmaa tai väärää IP:tä. Pelkkä `docker ps` ei kerro verkkoasetuksia — tarvitset sekä Docker-tason metadatan että kontin sisäisen näkymän.

## Ratkaisu

**`docker inspect` yhdistettynä `docker exec ip route` / `ip addr` -tarkistukseen.** Inspect näyttää network settings; exec varmistaa reitityksen kontissa.

Docker-taso:

```bash
docker inspect api --format '{{json .NetworkSettings.Networks}}' | jq
docker network inspect backend
```

Kontin sisältä:

```bash
docker exec api ip addr show
docker exec api ip route
docker exec api cat /etc/resolv.conf
```

Vertaa gateway-arvoa `docker network inspect` -tuloksen IPAM-kenttään. Jos reitti puuttuu tai IP on odottamaton, irrota ja liitä uudelleen: `docker network disconnect backend api && docker network connect backend api`.

## Käytännössä

Tallenna diagnostiikka incident-tikettiin ennen kontin uudelleenkäynnistystä — IP voi muuttua. CI/CD:ssä automatisoi healthcheck, joka testaa sekä DNS:n että TCP-yhteyden, ei pelkkää pingiä (monet kontit eivät sisällä `ping`-työkalua).

[Lue lisää](https://docs.docker.com/reference/cli/docker/inspect/)
