# Indeksoitu `created_at`-sarake. Mikä WHERE estää indeksin käytön tyypillisesti?

## Tilanne

`events`-taulussa on B-tree-indeksi sarakkeelle `created_at`. Sovellus näyttää "tämän päivän tapahtumat" -näkymän, ja kyselyä ajetaan minuutin välein. Tuotannossa kysely hidastuu, vaikka indeksi on olemassa.

Kehittäjä kirjoittaa luontevasti:

```sql
SELECT id, event_type, payload
FROM events
WHERE DATE(created_at) = CURRENT_DATE;
```

`DATE()`-funktio muuttaa jokaisen rivin `created_at`-arvon ennen vertailua. Indeksi on rakennettu alkuperäiselle `timestamp`-sarakkeelle, ei funktion tulokselle — ellei erillistä funktio-indeksiä ole. Suunnitelma näyttää usein `Seq Scan on events`, koska ehto ei ole *sargable* (Search ARGument ABLE).

## Ratkaisu

**Kirjoita ehto ilman funktiota indeksoidulla sarakkeella — käytä range-vertailua:**

```sql
SELECT id, event_type, payload
FROM events
WHERE created_at >= CURRENT_DATE
  AND created_at < CURRENT_DATE + interval '1 day';
```

Tämä muoto säilyttää sargabilityn: PostgreSQL voi käyttää indeksiä `created_at >= ... AND created_at < ...` -ehdolla. Funktio sarakkeella (`DATE(created_at)`, `created_at::date`, `extract(year FROM created_at)`) rikkoo tämän tyypillisesti.

Jos funktio on pakollinen, harkitse expression indexiä:

```sql
CREATE INDEX ON events ((created_at::date));
```

mutta range-ehto on yleensä parempi ja yleisempi ratkaisu.

## Käytännössä

Code reviewssa etsi funktioita WHERE-ehdoissa indeksoitujen sarakkeiden ympärillä. `EXPLAIN`-tulosteessa `Index Scan` vs `Seq Scan` kertoo heti, onko ehto optimoijalle käyttökelpoinen.

Aikavyöhykkeet: `CURRENT_DATE` on session aikavyöhykkeessä. Tuotantosovelluksissa käytä eksplisiittistä `timestamptz`-vertailua UTC:hen, jotta indeksikäyttö ja liiketoimintalogiikka pysyvät linjassa.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
