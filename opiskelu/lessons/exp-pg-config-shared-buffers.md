# Uusi DB-palvelin 32 GB RAM — junior asettaa shared_buffers = 32GB. Miksi väärin?

## Tilanne

Junior DBA luulee, että koska PostgreSQL on ainoa merkittävä prosessi 32 GB RAM -palvelimella, koko muisti pitäisi antaa `shared_buffers`:ille. Asetus `shared_buffers = 32GB` kuulostaa loogiselta — enemmän cachea, nopeampi DB.

Todellisuudessa PostgreSQL hyötyy myös **Linuxin OS page cachesta**. Kun koko RAM varataan `shared_buffers`:ille, OS:llä ei jää tilaa hot datalle page cachessa. Kaksoiscache-malli (PG buffer + OS cache) menee pieleen, ja suorituskyky voi **heikentyä** verrattuna ~25 % -asetukseen.

## Ratkaisu

**Liian suuri — tyypillisesti ~25 % RAM, OS cache tarvitsee tilaa** on oikea vastaus.

```ini
# Väärin
shared_buffers = 32GB

# Tyypillisesti oikein lähtöön
shared_buffers = 8GB
effective_cache_size = 24GB
```

PostgreSQL tuning -ohjeet: `shared_buffers` ~25 % RAM dedikoituun DB:hen. Loput RAM OS page cachelle — PostgreSQL lukee tiedostoja, jotka OS cachettaa tehokkaasti. `effective_cache_size` kertoo plannerille arvioidun kokonaiscache-kapasiteetista.

`shared_buffers` varaa kiinteää muistia restartissa — se ei ole "vapaa cache" kuten OS page cache.

## Taustaa

Poikkeuksia on (erittäin suuret instanssit, erityiset workloadit), mutta "koko RAM PG:lle" on klassinen virhe. Mittaa hit ratio ja I/O ennen ja jälkeen.

Opeta tiimi: `shared_buffers` + OS cache yhdessä, ei toisiaan korvaavina.
