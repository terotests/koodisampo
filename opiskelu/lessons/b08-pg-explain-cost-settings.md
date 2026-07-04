# Planner valitsee Seq Scan SSD-palvelimella vaikka indeksi näyttää halvemmalta manuaalisesti. Säädettävä?

## Tilanne

Manuaalisesti lasket "indeksi voittaa" — mutta planner valitsee seq scanin SSD-palvelimella. Oletus **`random_page_cost = 4.0`** on peritty HDD-ajalta: se rankaisee index scanin satunnaista I/O:ta liikaa verrattuna nykyaikaiseen SSD:hen, jossa random read on lähes yhtä nopea kuin sequential.

Cost-malli ei vastaa fyysistä todellisuutta → väärät suunnitelmat.

## Ratkaisu

Säädä **`random_page_cost`** lähemmäs **`seq_page_cost`**:

```ini
random_page_cost = 1.1   # SSD, seq_page_cost = 1.0
```

Testaa `EXPLAIN`:lla ennen/jälkeen. Monilla SSD-palvelimilla myös **`effective_cache_size`** on liian pieni oletuksena — planner aliarvioi cache-osumia ja suosii seq scania.

Nämä ovat GUC-vihjeitä cost-malliin, eivät korvaa puuttuvaa ANALYZE:a tai indeksiä.

## Taustaa

"Indeksi näyttää halvemmalta manuaalisesti" perustuu usein oikeaan intuitioon — PostgreSQLin oletusparametrit eivät aina vastaa laitteistoa. Säätö on standardi SSD-migraatiovaihe.

[Lue lisää](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-RANDOM-PAGE-COST)
