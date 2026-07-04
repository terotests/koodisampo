# 7 päivän liukuva keskiarvo. Frame-määrittely?

## Tilanne

Aikasarjadata: päivittäinen arvo. Raportti tarvitsee **7 päivän liukuvan keskiarvon** — jokaiselle päivälle keskiarvo siitä päivästä ja kuudesta edellisestä. Yksittäinen AVG() ilman framea ei rajaa ikkunaa.

## Ratkaisu

**ROWS BETWEEN 6 PRECEDING AND CURRENT ROW** — seitsemän rivin ikkuna:

```sql
SELECT
  day,
  value,
  AVG(value) OVER (
    ORDER BY day
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7d
FROM daily_metrics;
```

6 preceding + current row = 7 päivää. Ensimmäisillä riveillä ikkuna on lyhyempi (alle 7 riviä saatavilla) — AVG laskee saatavilla olevista.

Huom: `RANGE BETWEEN INTERVAL '6 days' PRECEDING` eroaa ROWS:sta, jos päivissä on aukkoja — RANGE käyttää arvoavaruutta, ROWS rivimäärää.

## Taustaa

Liukuva keskiarvo on standardi finanssi- ja metrics-raportoinnissa. Valitse ROWS vs RANGE datan tiheyden mukaan.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
