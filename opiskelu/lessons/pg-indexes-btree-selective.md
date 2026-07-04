# Taulussa 10M riviä, kysely `WHERE status = 'active'` palauttaa 2 % riveistä. Ensimmäinen optimointi?

## Tilanne

10M rivin taulussa `status = 'active'` osuu noin 200 000 riviin (2 %). Seq scan lukee kaikki 10M riviä — sekunteja per kysely. Indeksi on ensimmäinen ja tehokkain optimointi korkealle selektiivisyydelle.

Ennen GUC-säätöä, partitionointia tai read replica -ratkaisuja: varmista perusindeksi.

## Ratkaisu

```sql
CREATE INDEX ON users (status);
-- tai composite jos muita WHERE-ehtoja: (status, created_at)
```

**B-tree-indeksi** selektiiviseen WHERE-ehtoon. 2 % selectivity on selkeä indeksikandidaatti — planner valitsee index scanin, kun tilastot ovat ajan tasalla (`ANALYZE`).

Tarkista `EXPLAIN (ANALYZE, BUFFERS)`: Index Scan tai Bitmap Index Scan, `actual rows` ~200k.

## Taustaa

"Ensimmäinen optimointi" korostaa järjestystä: indeksi → stats → query-muutos → GUC. Ilman indeksiä muut säätöt eivät auta SELECT-kyselyä merkittävästi.

[Lue lisää](https://www.postgresql.org/docs/current/indexes-intro.html)
