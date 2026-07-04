# BI-työkalu tarvitsee vain luku-oikeuden. Rooli?

## Tilanne

Tableau tai Metabase yhdistää tuotantotietokantaan dashboardeja varten. Tiimi luo käyttäjän:

```sql
CREATE USER bi_tool WITH PASSWORD '...' SUPERUSER;
-- tai: GRANT ALL ON ALL TABLES IN SCHEMA public TO bi_tool;
```

BI-työkalu tarvitsee vain `SELECT`-kyselyitä — mutta laajat oikeudet antavat mahdollisuuden muokata, poistaa tai kaataa dataa vahingossa tai väärinkäytöksessä. Työkalun SQL-editori voi ajaa mitä tahansa, jos rooli sallii.

## Ratkaisu

Erillinen **read-only-rooli** vain tarvittavilla `SELECT`-oikeuksilla:

```sql
CREATE ROLE bi_reader NOLOGIN;

GRANT USAGE ON SCHEMA public TO bi_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO bi_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO bi_reader;

CREATE USER bi_tool LOGIN PASSWORD '...' IN ROLE bi_reader;

-- Ei INSERT, UPDATE, DELETE, TRUNCATE
-- Ei SUPERUSER, CREATEDB, CREATEROLE, REPLICATION
```

Rajaa tarvittaessa vain tiettyihin näkymiin (maskattu data):

```sql
GRANT SELECT ON reporting.dashboard_metrics TO bi_reader;
-- Ei suoraa pääsyä customers-tauluun
```

## Käytännössä

`NOLOGIN`-rooli `bi_reader` on jaettava pohja — useita BI-käyttäjiä samalla roolilla. Uusille tauluille `ALTER DEFAULT PRIVILEGES` välttää manuaalisen GRANTin unohtamisen.

Testaa rooli: `SET ROLE bi_reader; DELETE FROM orders;` — pitää epäonnistua. Read-only rajoittaa myös SQL-injektion vaikutusta, jos BI-työkalu on haavoittuvainen. Replica-read-only -instanssi on vielä turvallisempi vaihtoehto raskaaseen analytiikkaan.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
