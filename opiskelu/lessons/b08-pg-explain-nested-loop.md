# Nested Loop + Seq Scan sisäpuolella miljoona riviä — hidas join. Milloin NL on OK?

## Tilanne

Nested loop herättää hälytyksen: sisäpuolen seq scan miljoonalla rivillä on katastrofi. Mutta nested loop *itsessään* ei ole huono algoritmi — se on väärin vain ilman indeksiä tai väärällä join-järjestyksellä.

Haluat tietää, milloin nested loop on oikea valinta eikä korjattava "pois päältä".

## Ratkaisu

**Nested Loop on OK, kun ulkokehä on pieni ja sisäpuolella on indeksi join-sarakkeessa.**

Esimerkki hyvästä suunnitelmasta:

```
Nested Loop
  -> Index Scan on orders (pk) — 1 rivi
  -> Index Scan on line_items (order_id) — muutama rivi per order
```

Tässä sisäpuoli ei skannaa miljoonaa riviä — se hakee indeksistä vain matching-rivit. Cost pysyy alhaisena.

Huono yhdistelmä (korjattava):

```
Nested Loop
  -> Seq Scan orders — 10k riviä
  -> Seq Scan line_items — 1M riviä, loops=10000
```

## Taustaa

Planner valitsee nested loopin, kun se arvioi sen halvimmaksi pienelle ulkokehälle. Korjaus on indeksi tai join-järjestyksen/t statsien korjaus — ei `enable_nestloop=off`.

[Lue lisää](https://www.postgresql.org/docs/current/planner-optimizer.html)
