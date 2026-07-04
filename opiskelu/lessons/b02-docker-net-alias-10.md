# Yhdellä servicellä pitää olla useita DNS-nimiä samassa verkossa. Miten?

## Tilanne

Legacy-asiakas kutsuu API:a hostnameilla `api`, uudempi palvelu nimellä `gateway`, mutta molemmat osoittavat samaan konttiin. Yksi Compose-palvelu, kaksi eri DNS-nimeä samassa verkossa.

```yaml
services:
  api:
    image: myapi:latest
    # Tarvitaan myös hostname "gateway"
```

Ilman aliaksia vain palvelun nimi `api` resolvduu.

## Ratkaisu

**`network_aliases` Compose:ssa tai `--network-alias` docker run:ssa.** Network aliases lisäävät DNS-nimiä.

Compose:

```yaml
services:
  api:
    image: myapi:latest
    networks:
      backend:
        aliases:
          - gateway
          - legacy-api

networks:
  backend:
```

docker run:

```bash
docker run -d --name api \
  --network mynet \
  --network-alias gateway \
  --network-alias legacy-api \
  myapi:latest
```

Testaa toisesta kontista: `docker exec client getent hosts gateway`.

## Käytännössä

Aliakset ovat verkko-kohtaisia — sama alias eri verkoissa voi osoittaa eri kontteihin. Migraatioissa pidä legacy-alias väliaikaisesti, poista kun kaikki kutsujat on päivitetty. Dokumentoi aliasit README:ssä, jotta debuggaus on helpompaa.

[Lue lisää](https://docs.docker.com/reference/compose-file/services/#network_aliases)
