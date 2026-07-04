# Planner valitsee Index Scan vaikka covering index voisi riittää. Ehto Index Only Scan?

## Tilanne

Sinulla on indeksi, joka sisältää kaikki WHERE- ja SELECT-sarakkeet (tai `INCLUDE`-sarakkeet). Silti `EXPLAIN` näyttää `Index Scan` ja `Heap Fetches` jokaiselle riville — yhtä paljon satunnaista I/O:ta kuin ilman covering-indeksiä.

Index Only Scan välttää heap-käynnin, kun PostgreSQL voi luottaa **visibility map**iin: se kertoo, ovatko kaikki rivit tietyillä sivuilla näkyvissä kaikille transaktioille ilman heap-tarkistusta.

## Ratkaisu

Index Only Scan vaatii kaksi ehtoa:

1. **Indeksi sisältää kaikki tarvittavat sarakkeet** (avain + INCLUDE tai pelkkä avain, jos SELECT on suppea).
2. **Visibility map on ajan tasalla** — autovacuum / VACUUM pitää sen päivitettynä. Vanhentunut map pakottaa "lossy index-only scan" -tilanteen ja heap fetchit.

Tarkista:

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT id, email FROM users WHERE status = 'active';
-- Toivottu: Index Only Scan, Heap Fetches: 0 (tai hyvin pieni)
```

Jos map on vanha, `VACUUM users;` ja mittaa uudelleen.

## Taustaa

Index Only Scan on edelleen "index scan", mutta ilman heap-vaihetta. Planner valitsee tavallisen Index Scanin, jos se epäilee visibility mapin tarkkuutta tai indeksi ei kata kaikkia sarakkeita.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)
