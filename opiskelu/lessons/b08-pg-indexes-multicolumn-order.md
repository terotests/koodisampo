# Indeksi (a,b) — query WHERE b=1 ei käytä indeksiä tehokkaasti. Miksi?

## Tilanne

Composite-indeksi `(a, b)` on olemassa. Kysely `WHERE b = 1` (ilman `a`-ehtoa) ei hyödy indeksistä tehokkaasti — planner voi tehdä index scan koko indeksin läpi (ei paljon parempi kuin seq scan) tai valita seq scanin.

Kehittäjä olettaa indeksin toimivan minkä tahansa sarakkeen kautta.

## Ratkaisu

**B-tree composite-indeksin vasemmanpuoleinen prefix -sääntö:** indeksi `(a, b)` tukee tehokkaasti:

- `WHERE a = ?`
- `WHERE a = ? AND b = ?`
- `WHERE a > ?` (b voi olla mukana tietyissä tapauksissa)

Mutta **ei** pelkkää `WHERE b = ?` — `a` puuttuu prefixistä. Ratkaisu: erillinen indeksi `(b)` tai `(b, a)` riippuen kyselykuvioista.

## Taustaa

Sarakkeiden järjestys CREATE INDEX -lauseessa on kriittinen. Suunnittele indeksi kyselyjen mukaan, ei taulun sarakkejärjestyksen mukaan.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-multicolumn.html)
