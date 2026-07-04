# EXPLAIN näyttää Seq Scan isolla taululla vaikka indeksi on. Tyypillisin syy?

## Tilanne

5–10 miljoonan rivin taulussa on btree-indeksi WHERE-ehdon sarakkeelle, mutta `EXPLAIN` näyttää silti `Seq Scan`. Kehittäjä olettaa indeksin rikkinäiseksi ja ehdottaa `REINDEX DATABASE` — usein turhaan.

Planner valitsee suunnitelman *kustannusmallin* perusteella, ei indeksin olemassaolon perusteella. Kun kysely palauttaa suuren osan taulun riveistä (matala selektiivisyys), sequential read voi olla halvempi kuin satunnaiset index + heap -haut jokaiselle riville.

## Ratkaisu

**Tyypillisin syy: suuri osa taulusta haetaan — seq scan on halvempi kuin indeksi.**

Tarkista `EXPLAIN`-rivillä `rows` (tai `actual rows` ANALYZElla): jos arvio on esim. 40–80 % taulusta, seq scan on usein oikea valinta. Indeksi auttaa, kun haetaan pieni osa riveistä (korkea selektiivisyys).

Muut yleiset syyt (harvemmat kuin matala selektiivisyys):

- Vanhentuneet tilastot → väärä `rows estimate` → `ANALYZE`
- Funktio WHERE:ssä ilman expression indexiä
- `effective_cache_size` / `random_page_cost` vääristää cost-arvoja

## Taustaa

Seq scan ei ole automaattisesti bugi isolla taululla. Optimointi alkaa kysymyksestä: paljonko riveistä todella tarvitaan? Jos vastaus on "lähes kaikki", indeksin pakottaminen hidastaa usein kyselyä.

[Lue lisää](https://www.postgresql.org/docs/current/performance-tips.html)
