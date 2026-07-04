# Compose-projektissa palvelut eivät näe toisiaan. Yleisin konfiguraatiovirhe?

## Tilanne
Compose-pinossa API-kontti yrittää yhdistää tietokantaan hostname `db`, mutta saa `could not resolve host` tai yhteys timeouttaa. Molemmat palvelut ovat samassa compose.yml-tiedostossa, mutta joku on määritellyt erilliset verkot:

```yaml
services:
  api:
    networks:
      - frontend
  db:
    networks:
      - backend

networks:
  frontend: {}
  backend: {}
```

Compose luo DNS-nimen vain saman user-defined networkin sisällä. Kun palvelut ovat eri verkoissa, ne eivät näe toisiaan hostname-tasolla — vaikka docker compose ps näyttää molemmat käynnissä.

## Ratkaisu
**Palvelut on liitetty eri verkkoon tai networks-kenttä on väärin määritelty.**

Korjaa niin, että riippuvat palvelut jakavat saman verkon — yleensä Compose-projektin oletusverkko riittää:

```yaml
services:
  api:
    depends_on:
      - db
  db:
    image: postgres:16
# Ei erillisiä networks-kenttiä → sama oletusverkko
```

Tai määritä eksplisiittinen jaettu verkko:

```yaml
services:
  api:
    networks: [appnet]
  db:
    networks: [appnet]

networks:
  appnet:
    driver: bridge
```

Sama user-defined network (tai oletus compose-verkko) yhdistää palvelut DNS-nimillä.

## Käytännössä
Debuggaus: `docker network inspect <projekti>_default` — varmista että molemmat kontit ovat samassa verkossa. Tuotannossa erottele frontend/backend-verkot tarkoituksella, mutta silloinkin proxy ja API tarvitsevat reitit riippuvuuksiin.

[Lue lisää](https://docs.docker.com/compose/networking/)
