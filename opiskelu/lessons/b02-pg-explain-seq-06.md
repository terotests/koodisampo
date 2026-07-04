# EXPLAIN näyttää Seq Scan 5M rivin taulussa — aina huono?

## Tilanne

Code reviewissa joku merkitsee punaisella: "Seq Scan 5M rivin taulussa — lisää indeksi heti." Planner on kuitenkin valinnut seq scanin tarkoituksella, koska kysely palauttaa suuren osan riveistä tai indeksin random I/O olisi kalliimpaa kuin yksi sequential pass.

Seq scan isolla taululla *voi* olla hidas, mutta se ei ole automaattisesti virhe. Väärä indeksi pakottaa plannerin tekemään miljoonia satunnaisia sivulukuja.

## Ratkaisu

**Ei — seq scan ei ole aina huono.** Se on usein halvin, kun:

- Haetaan suuri fraction taulusta (esim. `WHERE status IN (...)` osuu 30 %+ riveistä)
- Taulu on pieni (muutama sivu mahtuu muistiin — yksi seq pass on nopea)
- Indeksi ei kata SELECT-listan sarakkeita eikä covering index ole olemassa

Tarkista `EXPLAIN (ANALYZE, BUFFERS)`: `actual rows` vs taulun koko. Jos alle ~5–10 % riveistä palautuu ja silti seq scan, tutki indeksiä ja tilastoja.

## Taustaa

Planner vertaa seq scanin kustannusta (sequential I/O) index scanin kustannukseen (random I/O + heap fetch). 5M rivin taulussa molemmat voivat olla oikeita riippuen selectivitystä — ei rivimäärästä yksin.

[Lue lisää](https://www.postgresql.org/docs/current/performance-tips.html)
