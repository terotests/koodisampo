# Tuotannossa hidas query tuntematon — haluat top 10 CPU-kuluttajaa historiasta. Laajennus?

## Tilanne

Tuotantopalvelimella jokin kysely hidastaa järjestelmää, mutta et tiedä mikä. `pg_stat_activity` näyttää vain juuri nyt suoritettavat kyselyt — kun hitaus on jo ohi, jälki on kadonnut. Yksittäinen hidas tapahtuma logeissa ei kerro, onko kyseessä satunnainen poikkeus vai jokin query, jota ajetaan tuhansia kertoja päivässä.

Tarvitset aggregoitua historiaa: normalisoitu query-teksti, kuinka monta kertaa se on ajettu, kokonaisaika, keskimääräinen kesto ja rivimäärät. Ilman tätä optimointi on arvaamista — EXPLAIN yhdelle satunnaiselle suoritukselle ei vastaa kysymykseen "mikä syö eniten CPU:a viime viikkojen aikana".

PostgreSQL tarjoaa tähän virallisen laajennuksen. Se ei korvaa `EXPLAIN ANALYZE`-profilointia yksittäiselle suoritukselle, mutta se vastaa juuri kysymykseen: mitkä query-patternit ovat kalleimpia koko instanssin elinkaaren aikana.

## Ratkaisu: pg_stat_statements

**pg_stat_statements** kerää suoritustilastot muistiin ja tarjoaa ne `pg_stat_statements`-näkymän kautta. Jokainen rivi on normalisoitu query (literaalit korvattu `$n`-paikkamerkeillä), joten `SELECT ... WHERE id = 1` ja `WHERE id = 2` lasketaan samaan bucketiin.

Näkymästä saat mm. `calls`, `total_exec_time`, `mean_exec_time`, `rows` ja uudemmissa versioissa myös I/O- ja WAL-metriikoita, kun ne on otettu käyttöön. Top 10 CPU-kuluttajaa haetaan järjestämällä `total_exec_time` tai `total_plan_time + total_exec_time` mukaan — riippuen siitä, haluatko painottaa suunnittelua vai suoritusta.

Laajennus on PostgreSQLin ylläpitämä ja dokumentoitu osa ekosysteemiä. Se on tarkoitettu juuri tällaiseen tuotanto-monitorointiin, ei vain kehitysympäristöihin.

## Käyttöönotto

Laajennus ladataan instanssin käynnistyksessä — pelkkä `CREATE EXTENSION` ei riitä ilman preload-asetusta.

1. Lisää `postgresql.conf`-tiedostoon (tai `ALTER SYSTEM`):

```ini
shared_preload_libraries = 'pg_stat_statements'
```

2. Käynnistä PostgreSQL uudelleen. `shared_preload_libraries` vaatii restartin; `reload` ei riitä.

3. Luo laajennus tietokantaan, jossa sitä käytetään (tai `postgres`-kannassa koko klusterin seurantaan):

```sql
CREATE EXTENSION pg_stat_statements;
```

4. Valinnaiset GUC:t ennen restartia, esim. `pg_stat_statements.max` (montako eri query-patternia muistissa) ja `pg_stat_statements.track = all` jos haluat seurata myös superuser-kyselyjä. Oletus `top` riittää useimmiten.

Stats kertyvät instanssin elinajan ajaksi tai kunnes ajat `SELECT pg_stat_statements_reset();` — esimerkiksi deployn jälkeen vertailua varten.

## Top 10 CPU-kuluttajaa

Kun laajennus on käynnissä, top-lista on suora SQL-kysely näkymästä:

```sql
SELECT
  calls,
  round(total_exec_time::numeric, 2) AS total_ms,
  round(mean_exec_time::numeric, 2) AS mean_ms,
  rows,
  left(query, 120) AS query_preview
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

`total_exec_time` on kumulatiivinen — yksi harvinainen mutta äärimmäisen hidas query voi jäädä listan ulkopuolelle, vaikka `mean_exec_time` olisi korkea. Siksi kannattaa tarkastella molempia: `total_exec_time` löytää "vuotavat hanat" (paljon toistuvia keskinkertaisia kyselyjä), `mean_exec_time` korostaa yksittäisen suorituksen kalleutta.

Kun löydät epäillyn patternin, kopioi `query`-teksti ja aja siihen `EXPLAIN (ANALYZE, BUFFERS)` edustavalla parametriarvolla. `pg_stat_statements` kertoo *mikä* on kallista; `EXPLAIN` kertoo *miksi*.

## Tuotannossa huomioitavaa

Stats ovat klusteritason muistissa — ne eivät selviä pelkästä backupista. Jos instanssi restartataan, historia nollautuu (ellei ulkoista keruuta ole). Siksi tuotannossa yhdistetään usein `pg_stat_statements` + Prometheus/`postgres_exporter` tai cloud-providerin Query Insights.

`pg_stat_statements`-näkymä vaatii `pg_read_all_stats`-oikeudet tai superuserin. Rajaa pääsyä — query-tekstit voivat sisältää arkaluonteisia literal-arvoja ennen normalisointia vanhemmissa versioissa.

`log_statement = all` tai jokaisen kyselyn EXPLAIN cronilla ei skaalaudu: logitus on I/O-raskasta eikä aggregoi, ja EXPLAIN ilman oikeaa dataa antaa vääriä suunnitelmia. `pg_stat_activity` on tilannekuva, ei historia. Oikea työkalu tähän tehtävään on `pg_stat_statements` preload + `CREATE EXTENSION`.
