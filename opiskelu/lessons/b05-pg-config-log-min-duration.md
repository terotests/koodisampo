# Haluat lokittaa vain > 500ms kestävät queryt tuotannossa. Mikä GUC?

## Tilanne

Slow query -diagnostiikka tuotannossa vaatii tasapainon: tarpeeksi dataa ongelmien löytämiseen, mutta ei niin paljon lokia että levy ja lokipipeline tukkeutuvat. Kaikkien statementien lokitus (`log_statement`) on väärä työkalu tähän — se ei erottele nopeita ja hitaita.

Haluat GUC:n, joka lokittaa kyselyn **vasta kun se on kestänyt yli kynnysarvon**. Kynnys ilmaistaan millisekunteina. Esimerkki: 500 ms rajaa pois normaalin OLTP:n ja pitää raportit sekä batch-jobit.

## Ratkaisu

**log_min_duration_statement = 500ms lokittaa vain hitaat kyselyt** — arvo `-1` tarkoittaa pois päältä, positiivinen luku millisekunteina.

```ini
log_min_duration_statement = 500
```

PostgreSQL kirjoittaa lokiin hitaan statementin tekstin automaattisesti. Tämä on runtime-config logging -osion virallinen tapa slow query -seurantaan ilman extensioneja.

Voit yhdistää `log_checkpoints`, `log_lock_waits` ja ulkoisen `pg_stat_statements` -laajennuksen kokonaiskuvaan.

## Tuotannossa

Säädä kynnystä ympäristön mukaan. Devissä 100 ms, tuotannossa 500–1000 ms on yleistä. Jos loki on edelleen suuri, käytä lokien aggregointia tai `pg_stat_statements` + satunnainen `EXPLAIN`.

`log_duration = on` lokittaa keston kaikille kyselyille mutta ei suodata — eri parametri kuin `log_min_duration_statement`.
