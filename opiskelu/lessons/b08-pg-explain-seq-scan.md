# Pieni taulu — planner valitsee Seq Scan vaikka indeksi on. Todennäköisin syy?

## Tilanne

Konfiguraatiotaulussa on 200 riviä. Indeksi `(key)` on olemassa legacy-syistä. `EXPLAIN` näyttää `Seq Scan` — junior kehittäjä haluaa "korjata" poistamalla seq scanin pakottamalla indeksin.

Planner on todennäköisesti oikeassa.

## Ratkaisu

**Taulu on pieni — seq scan on halvempi kuin index random I/O pienellä datamäärällä.**

Muutama sivu dataa luetaan peräkkäin yhdellä tai muutamalla I/O:lla. Indeksi vaatii juurisolmun + leaf-sivujen satunnaisia lukuja — overhead on suurempi kuin koko taulun seq scan.

Tämä on suunniteltu planner-käyttäytymistä, ei virhe. Indeksi pienelle staattiselle taululle on usein turha ylläpito (INSERT/UPDATE hidastuu).

## Taustaa

Kun taulu kasvaa tai selectivity paranee, planner voi siirtyä index scaniin automaattisesti. EXPLAIN cost-arvot muuttuvat ANALYZE:n ja datan kasvun myötä.

[Lue lisää](https://www.postgresql.org/docs/current/planner-optimizer.html)
