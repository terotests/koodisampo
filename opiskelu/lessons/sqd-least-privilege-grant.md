# Raporttisovellus lukee vain yhtä näkymää. Miten myönnät oikeudet?

## Tilanne

Uusi raporttisovellus tarvitsee PostgreSQL-yhteyden. DBA ehdottaa:

```sql
GRANT ALL PRIVILEGES ON DATABASE production TO report_app;
-- tai: luodaan käyttäjä SUPERUSER-oikeuksilla "helpottamaan"
```

Sovellus lukee vain näkymän `monthly_sales_summary` — mutta `ALL PRIVILEGES` tai laaja `SELECT` koko skeemaan antaa pääsyn asiakastietoihin, palkkoihin ja konfiguraatioon. Jos sovellus tai sen salasana vuotaa, vahinko on maksimaalinen.

## Ratkaisu

**Least privilege** — myönnä vain tarvittava oikeus tarvittavaan objektiin:

```sql
CREATE ROLE report_app LOGIN PASSWORD '...';

GRANT USAGE ON SCHEMA reporting TO report_app;
GRANT SELECT ON reporting.monthly_sales_summary TO report_app;

-- Ei INSERT, UPDATE, DELETE, TRUNCATE
-- Ei SUPERUSER, CREATEDB, CREATEROLE
```

Jos näkymä perustuu taustatauluihin, riittää `GRANT SELECT ON VIEW` — PostgreSQL tarkistaa taustataulujen oikeudet view ownerin kautta (security invoker vs definer riippuu määrittelystä).

## Käytännössä

Jokaiselle sovellukselle oma rooli — ei jaettua `app_user`-tiliä kaikille palveluille. Dokumentoi, mitä kukin rooli saa tehdä. Tarkista säännöllisesti:

```sql
SELECT grantee, privilege_type, table_name
FROM information_schema.role_table_grants
WHERE grantee = 'report_app';
```

Least privilege rajoittaa SQL-injektion vaikutusta: vaikka hyökkääjä manipuloi kyselyä, hän ei voi kirjoittaa dataa tai lukea muita tauluja kuin mitä rooli sallii.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
