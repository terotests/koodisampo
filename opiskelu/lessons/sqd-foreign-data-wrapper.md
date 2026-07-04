# Data lake -tiedostot S3:ssa, analytiikka SQL:llä PostgreSQListä. Integraatio?

## Tilanne

Data-tiimi tallentaa Parquet- tai CSV-tiedostot Amazon S3:een — vuosien tapahtumadata, logit, feature store. Data scientists haluavat kysellä dataa SQL:llä ilman, että kaikki kopioidaan ensin PostgreSQL-tauluun:

```
s3://analytics-lake/events/year=2024/month=06/*.parquet
```

Perinteinen ETL (lataa S3 → INSERT) on hidas, vie levytilaa ja vanhenee heti kun lake päivittyy. Tarvitset tavan **kysellä ulkoista lähdettä** suoraan PostgreSQListä.

## Ratkaisu

**Foreign Data Wrapper (FDW)** yhdistää PostgreSQLin ulkoiseen dataan. Ulkoinen taulu näyttää normaalilta SQL-taululta, mutta rivit haetaan lähteestä kyselyn ajaksi:

```sql
-- Esimerkki: postgres_fdw toiseen PG-instanssiin
CREATE EXTENSION postgres_fdw;

CREATE SERVER remote_warehouse
  FOREIGN DATA WRAPPER postgres_fdw
  OPTIONS (host 'warehouse.internal', dbname 'analytics');

CREATE FOREIGN TABLE lake_events (
  event_id   bigint,
  event_type text,
  payload    jsonb
)
SERVER remote_warehouse
OPTIONS (schema_name 'public', table_name 'events');
```

S3/Parquet-lakeen käytetään erikoistuneita wrappereita (esim. `parquet_fdw`, `aws_s3` + custom FDW). Periaate on sama:

```sql
SELECT event_type, count(*)
FROM s3_parquet_events
WHERE event_date >= '2024-06-01'
GROUP BY event_type;
```

PostgreSQL suunnittelee kyselyn; FDW hakee tarvittavat tiedostot/rivit lähteestä.

## Käytännössä

FDW sopii analytiikkaan, ad hoc -kyselyihin ja moderniin data estate -arkkitehtuuriin — lake pysyy totuuden lähteenä, PostgreSQL on kyselykerros. Huomioi latenssi: jokainen FDW-kysely voi olla hitaampi kuin paikallinen taulu.

Tuotantokäytössä rajoita oikeudet (`GRANT` vain foreign tableen), seuraa kustannuksia (S3 GET) ja harkitse materialisoitu näkymä tai cache usein toistuviin raportteihin. Valitse FDW lake-formaatin mukaan (Parquet, CSV, Iceberg).

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
