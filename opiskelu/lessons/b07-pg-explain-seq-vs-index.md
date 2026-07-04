# Planner valitsee Seq Scan vaikka indeksi on olemassa. Yleisin syy pienellä taululla?

## Tilanne

Lookup-taulussa on 500 riviä ja indeksi `(code)`. Silti `EXPLAIN` näyttää `Seq Scan on small_lookup`. Kehittäjä epäilee indeksin olevan "rikki", vaikka planner tekee tarkoituksellisen valinnan.

Pienillä tauluilla sequential scan voi lukea koko taulun muutamasta sivusta yhdellä I/O-passilla — halvempaa kuin indeksipuun juureen + leaf-sivujen satunnainen haku.

## Ratkaisu

**Taulu on pieni — seq scan on halvempi kuin index random I/O.**

PostgreSQLin `seq_page_cost` vs `random_page_cost` -mallissa pieni taulu mahtuu usein muistiin yhtenä blokkina. Indeksi säästää I/O:ta vasta, kun taulu kasvaa tai selectivity on korkea.

Älä pakota indeksiä poistamalla seq scan -mahdollisuutta. Jos taulu pysyy pienenä (< muutama sata riviä), seq scan on normaali.

## Taustaa

`EXPLAIN` cost-arvot heijastavat tätä logiikkaa. Kun taulu kasvaa, sama kysely voi yllättäen siirtyä index scaniin ilman indeksimuutoksia — ANALYZE päivittää arvion.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-intro.html)
