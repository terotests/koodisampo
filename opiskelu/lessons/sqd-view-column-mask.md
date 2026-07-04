# Analyytikot eivät saa nähdä henkilötunnuksia. Ensimmäinen kerros?

## Tilanne

Taulussa `customers` on arkaluontoisia sarakkeita:

```sql
SELECT id, name, email, national_id, revenue
FROM customers;
-- national_id: 010180-123A  (henkilötunnus)
```

BI-työkalu ja analyytikot tarvitsevat `revenue`- ja segmentointidataa — mutta eivät täyttä henkilötunnusta. `GRANT SELECT ON customers` antaa kaiken tai ei mitään, ellei rakenneta välikerrosta.

## Ratkaisu

**Näkymä (VIEW)**, joka palauttaa maskatun tai poistetun sarakkeen — ensimmäinen suojakerros ennen RLS:ää tai erillistä roolia:

```sql
CREATE VIEW analytics.customers_safe AS
SELECT
  id,
  name,
  email,
  substring(national_id from 1 for 6) || '****' AS national_id_masked,
  revenue,
  segment
FROM customers;

GRANT SELECT ON analytics.customers_safe TO analyst_role;
-- Ei GRANTia suoraan customers-tauluun
```

Vaihtoehto: jätä sarake kokonaan pois:

```sql
CREATE VIEW analytics.customers_safe AS
SELECT id, name, revenue, segment FROM customers;
```

Analyytikot yhdistävät vain näkymään — alkuperäinen taulu pysyy eristettynä.

## Käytännössä

Näkymä on nopea ensimmäinen askel; tuotannossa yhdistä least privilege (`GRANT` vain näkymään) ja tarvittaessa RLS. `security_barrier`-näkymä estää optimoijaa vuotamasta arvoja ehtojen ohi.

Dokumentoi, mikä maskaus on riittävä (osittainen vs. poisto). GDPR: pseudonymisointi näkymässä ei poista tarvetta audit-lokeille — se vain rajoittaa BI-käyttöä.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
