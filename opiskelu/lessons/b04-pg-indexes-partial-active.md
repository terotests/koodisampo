# 90 % riveistä archived=true — kyselyt vain active=false. Indeksioptimointi?

## Tilanne

Taulussa 10M riviä, joista 9M archived. Sovellus hakee lähes aina `WHERE archived = false` — noin 1M riviä. Täysi indeksi `(archived)` tai `(status)` kaikille riveille on turhan suuri: indeksi sisältää 9M riviä, joita ei koskaan haeta.

Kirjoitus hidastuu — jokainen INSERT/UPDATE päivittää turhaa indeksipintaa.

## Ratkaisu

**Partial index** — indeksoi vain relevantit rivit:

```sql
CREATE INDEX ON documents (status, updated_at)
WHERE archived = false;
```

Indeksi sisältää vain aktiiviset rivit — pienempi koko, nopeampi ylläpito, parempi cache-locality. WHERE-ehdon on vastattava kyselyn ehtoa (tai oltava implisiittisesti tiukempi).

## Taustaa

Partial index on tehokas, kun pieni osa riveistä on "elossa" ja kyselyt rajautuvat siihen. PostgreSQLin dokumentaatio suosittelee tätä archived/soft-delete -malleihin.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-partial.html)
