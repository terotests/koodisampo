# Taulussa 10M riviä mutta 99 % archived=true. Indeksi hakuun active riveille?

## Tilanne

Arkistointimalli: 99 % riveistä on `archived = true`, mutta kaikki liikenne kohdistuu ~100 000 aktiiviseen riviin. Täysi indeksi `(status)` kaikille 10M riville on 100× suurempi kuin tarpeen — hidastaa INSERT/UPDATE ja vie cachea.

## Ratkaisu

```sql
CREATE INDEX ON items (status, updated_at)
WHERE archived = false;
```

**Partial index** `WHERE archived = false` indeksoi vain aktiiviset rivit. Indeksi on pieni, nopea ylläpitää, ja sopii täsmälleen sovelluksen kyselykuvioon.

Kyselyissä on oltava yhteensopiva ehto — `WHERE archived = false AND status = 'open'` käyttää indeksiä; pelkkä `status` ilman archived-rajauksia ei välttämättä.

## Taustaa

99/1 -jakauma on ideaali partial index -kandidaatti. Vaihtoehto: erillinen "active"-taulu — mutta partial index on yksinkertaisin migraatio.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-partial.html)
