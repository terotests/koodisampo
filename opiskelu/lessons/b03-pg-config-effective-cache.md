# Planner valitsee seq scanin vaikka data mahtuu muistiin — SSD-palvelin 64 GB RAM. GUC?

## Tilanne

64 GB RAM -palvelimella ja SSD-levyllä odotat plannerin suosivan index scania, kun suuri osa taulusta on jo muistissa (PostgreSQLin `shared_buffers` + OS page cache). Silti `EXPLAIN` näyttää `Seq Scan` ja kysely on hitaampi kuin odotit.

Planner ei tiedä fyysistä RAM-määrää suoraan. Se käyttää parametria `effective_cache_size`: arvio siitä, kuinka paljon levyä vastaavaa dataa on käytettävissä cachesta (PG + OS). Oletusarvo (usein 4 GB) on pieni 64 GB koneella — planner *aliarvioi* cache-osumien todennäköisyyttä ja valitsee seq scanin, koska se näyttää halvemmalta kuin satunnaiset index-luvut.

Ongelma on suunnitteluvirhe, ei välttämättä puuttuva indeksi. Säädettävä parametri on planner-hint, ei muistin varaus.

## Ratkaisu

**effective_cache_size ≈ OS cache + shared_buffers arvio** on oikea GUC. Tyypillinen arvio dedikoituun DB-palvelimessa: `shared_buffers` + suurin osa jäljellä olevasta RAM:ista OS page cachelle (esim. 48 GB–56 GB 64 GB koneessa, riippuen workloadista).

```ini
shared_buffers = 16GB
effective_cache_size = 48GB
```

`effective_cache_size` **ei varaa muistia** — se on vain luku cost-mallissa. Väärä arvo vääristää index vs seq scan -päätöksiä molempiin suuntiin: liian pieni suosii seq scania, liian suuri voi suosia index scania turhaan.

## Taustaa

Säädä yhdessä SSD-parametrien kanssa: `random_page_cost` alas (esim. 1.1), `seq_page_cost` = 1.0. Mittaa `EXPLAIN`-suunnitelmien muutos ennen tuotantoa.

Muista ANALYZE ajan tasalla — vanhentuneet tilastot voivat myös suosia seq scania riippumatta GUC:sta.
