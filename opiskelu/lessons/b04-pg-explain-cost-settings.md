# SSD-levyllä planner suosii seq scaneja liikaa — random_page_cost oletus 4.0. Tyypillinen SSD-säätö?

## Tilanne

PostgreSQL siirrettiin HDD:ltä SSD:lle, mutta planner valitsee edelleen seq scanin tilanteissa, joissa indeksi näyttäisi järkevältä. Oletus **`random_page_cost = 4.0`** on suunniteltu hitaalle satunnaiselle levyluvulle — SSD:llä random read on lähes yhtä nopea kuin sequential.

Planner vertaa `seq_page_cost` (oletus 1.0) ja `random_page_cost` suhteessa: korkea random cost tekee index scanista "kalliin" suunnitelmassa.

## Ratkaisu

Laske **`random_page_cost`** lähemmäs **`seq_page_cost`**:

```ini
seq_page_cost = 1.0
random_page_cost = 1.1
```

Tyypillinen SSD-alue on 1.1–1.5. Säätö on GUC — vaatii `reload` tai uudelleenkäynnistyksen riippuen asetuksesta. Testaa muutos `EXPLAIN`:lla ennen ja jälkeen; odota enemmän index scan -valintoja kohtuullisella selectivityllä.

Yhdistä usein **`effective_cache_size`**-korjaukseen suurella RAM-palvelimella — molemmat vaikuttavat cost-malliin.

## Taustaa

Cost-arvot eivät ole millisekunteja — ne ovat suhteellisia yksiköitä. SSD-säätö korjaa vanhan HDD-oletuksen, ei korvaa puuttuvaa indeksiä tai ANALYZE:a.

[Lue lisää](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-RANDOM-PAGE-COST)
