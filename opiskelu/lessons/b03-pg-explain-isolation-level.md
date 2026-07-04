# Raportti lukee saman rivin kahdesti saman transactionin aikana — toinen transaction commitoi välissä. Taso?

## Tilanne

Sovellus ajaa raportin yhdessä transaktiossa: ensimmäinen SELECT palauttaa saldon 100 €, toinen SELECT samalle riville hetken kuluttua palauttaa 150 € — välissä toinen istunto on commitoinut päivityksen. Raportti näyttää epäjohdonmukaiselta, vaikka kumpikin SELECT on "oikein" omalla hetkellään.

Tämä ei ole EXPLAIN-ongelma vaan **eristystason (isolation level)** ilmiö: non-repeatable read.

## Ratkaisu

PostgreSQLin oletus **`READ COMMITTED`** sallii, että sama SELECT näkee eri arvon saman transaktion aikana, jos toinen transaktio commitoi välissä. Jos raportti vaatii vakaata näkymää riville transaktion keston ajan, nosta taso:

```sql
BEGIN ISOLATION LEVEL REPEATABLE READ;
-- tai SERIALIZABLE tiukempaan johdonmukaisuuteen
```

`REPEATABLE READ` pitää snapshotin transaktion alusta — toistettava luku samalle riville. Valitse taso liiketoimintavaatimuksen mukaan; tiukempi taso voi aiheuttaa enemmän serialisaatiovirheitä.

## Taustaa

EXPLAIN ei näytä eristystasoa. Debugatessa vertaa `pg_stat_activity`-rivin `transaction_isolation` ja varmista, että sovellus ei yllättäen jaa connectionia eri tasojen välillä.

[Lue lisää](https://www.postgresql.org/docs/current/transaction-iso.html)
