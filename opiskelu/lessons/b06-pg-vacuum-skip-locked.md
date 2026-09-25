# Siivousjob poistaa miljoona vanhaa riviä yhdellä DELETE-lauseella — lukot ja bloat haittaavat tuotantoa. Miten poistat hallitusti?

## Tilanne

`DELETE FROM logs WHERE created_at < '2023-01-01'` poistaa miljoona riviä yhdessä transaktiossa. Lause pitää rivilukot koko ajon ajan, tuottaa kerralla miljoonia dead tupleja, paisuttaa WAL:ia ja hidastaa tuotantoa. Jos se keskeytyy, kaikki perutaan.

PostgreSQL:ssä ei ole `DELETE ... LIMIT` -syntaksia (toisin kuin MySQL:ssä), joten erän koko rajataan alikyselyllä.

## Ratkaisu

**Eräpoisto** pienissä transaktioissa:

```sql
DELETE FROM logs
WHERE id IN (
  SELECT id FROM logs
  WHERE created_at < '2023-01-01'
  LIMIT 10000
);
-- commit ja toista, kunnes DELETE palauttaa 0 riviä
```

Jos poistoa ajaa useampi worker rinnakkain, **`FOR UPDATE SKIP LOCKED`** antaa kunkin ohittaa rivit, jotka toinen jo lukitsi:

```sql
DELETE FROM logs
WHERE id IN (
  SELECT id FROM logs
  WHERE created_at < '2023-01-01'
  LIMIT 5000
  FOR UPDATE SKIP LOCKED
);
```

## Taustaa

Pieni erä pitää lukot lyhyinä, autovacuum ehtii siivota erien välissä ja replikointiviive pysyy kohtuullisena. Jos koko vanha data poistetaan säännöllisesti aikaleiman mukaan, osioitu taulu (`DROP`/`DETACH PARTITION`) on vielä kevyempi ratkaisu.

[Lue lisää](https://www.postgresql.org/docs/current/sql-select.html#SQL-FOR-UPDATE-SHARE)
