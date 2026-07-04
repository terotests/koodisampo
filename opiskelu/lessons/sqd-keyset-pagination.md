# API-sivutus OFFSET 500000 hidastuu. Parempi malli suurille tauluille?

## Tilanne

Tuotteen listaus-API palauttaa tuotteet aakkosjärjestyksessä sivuittain. Ensimmäiset sivut toimivat nopeasti:

```sql
SELECT id, name, price
FROM products
ORDER BY id
LIMIT 50 OFFSET 0;
```

Mutta syvemmällä listassa OFFSET kasvaa:

```sql
LIMIT 50 OFFSET 500000;
```

PostgreSQLin täytyy lukea ja heittää pois 500 000 riviä ennen kuin se palauttaa seuraavat 50. Sivunumero kasvaa → viive kasvaa lineaarisesti. Käyttäjät valittavat, että "viimeiset sivut" eivät lataudu ollenkaan.

Tämä on tunnettu OFFSET-ongelma suurissa tauluissa — se ei skaalaudu syvään sivutukseen.

## Ratkaisu

**Keyset pagination (cursor-based): `WHERE id > :last_id ORDER BY id LIMIT 50`**

```sql
SELECT id, name, price
FROM products
WHERE id > :last_seen_id
ORDER BY id
LIMIT 50;
```

Ensimmäisellä sivulla `:last_seen_id` on 0 tai NULL (tai jätä WHERE pois). Jokaisella seuraavalla sivulla API välittää edellisen sivun viimeisen `id`:n. Indeksi `(id)` tai PK riittää — kysely hyppii suoraan oikeaan kohtaan ilman 500k rivin skannausta.

Keyset välttää OFFSET-skanauksen — yleinen query design -kuvio suurille tauluille. Huom: monisarakkeinen järjestys vaatii yhdistelmäavaimen (esim. `(created_at, id)`).

## Käytännössä

Keyset-sivutuksessa et voi hypätä suoraan sivulle 10 000 — vain "seuraava/edellinen". Infinite scroll ja feed-API:t sopivat tähän luontevasti.

Jos tarvitset satunnaisen sivun numeron, harkitse hakukone-indeksiä (Elasticsearch) tai esilaskettua sivutustaulua. OFFSET on ok pienillä sivunumeroilla (< 100), mutta aseta `OFFSET`-raja API:ssa.

Dokumentoi cursor-kenttä (`id` tai `(created_at, id)`) OpenAPI-spesifikaatiossa, jotta asiakasohjelmat eivät riipu OFFSET:ista.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
