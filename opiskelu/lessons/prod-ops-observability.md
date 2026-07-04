# Tuotannossa satunnainen datan korruptio, mutta lokit eivät riitä juurisyyn löytämiseen. Mikä ensimmäinen parannus ennen isoa refaktorointia?

## Tilanne

Kerran viikossa jokin taustaprosessi kirjoittaa virheellisen arvon tauluun — esimerkiksi negatiivinen varastosaldo tai null pakollisessa kentässä. Virhe havaitaan vasta raportoinnissa; lokissa näkyy vain "UPDATE inventory SET qty = -3 WHERE sku = X" ilman kontekstia: kuka kutsui, mistä jobista, mikä HTTP-pyyntö laukaisi ketjun.

Erilliset palvelulokit eivät yhdisty: API-loki, worker-loki ja cron-loki ovat eri tiedostoissa ilman yhteistä tunnistetta. Et voi seurata yhtä tapahtumaketjua alusta loppuun. Refaktorointi koko putkesta tuntuu ainoalta vaihtoehdolta, mutta se vie kuukausia ja riski kasvaa.

Ennen isoa arkkitehtuurimuutosta tarvitaan **näkyvyyttä**: mahdollisuus yhdistää hajallaan olevat signaalit yhdeksi tarinaksi.

## Ratkaisu

**Observability: trace-id, strukturoidut lokit ja invariantit kriittisiin kohtiin.**

Lisää jokaiseen pyyntöön ja taustatyöhön trace-id (esim. OpenTelemetry `trace_id`), joka kulkee HTTP-headerista message queue -viestiin ja worker-lokiin. Strukturoidut lokit (JSON) mahdollistavat haun: `trace_id=abc123` paljastaa koko ketjun. Invariantit kriittisiin kohtiin — esim. `assert qty >= 0` ennen commitia — estävät korruption tai lokittavat poikkeaman heti. Structured logging + trace id yhdistää tapahtumat — OpenTelemetry/Google SRE.

## Käytännössä

Aloita yhdestä kriittisestä polusta (esim. maksu tai varastopäivitys): propagoi `traceparent`-header, logita JSON-muodossa `trace_id`, `span_id`, `service`, `operation`. Lisää metriikat (virhemäärä, latency) samoilla labeleilla. Invariantit kannattaa ajaa sekä sovelluksessa että tietokannassa (`CHECK`-constraint). Tämä antaa juurisyy-analyysin ilman että koko järjestelmä kirjoitetaan uudelleen.

[Lue lisää](https://opentelemetry.io/docs/concepts/observability-primer/)
