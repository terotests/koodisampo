# Planner tekee huonoja arvioita bulk INSERTin jälkeen. Mikä ylläpitotoimenpide?

## Tilanne

Bulk INSERT muutti taulun koon merkittävästi. Planner arvioi edelleen vanhat rivimäärät — seq scan, väärät joinit, hitaat kyselyt. Indeksit ovat kunnossa; ongelma on metadata.

## Ratkaisu

```sql
ANALYZE table_name;
```

**ANALYZE päivittää tilastot** plannerin rivimääräarvioita varten (`pg_stats`). Autovacuum voi ajaa ANALYZE:n myöhemmin — bulk loadin jälkeen manuaalinen ajo on best practice.

`VACUUM ANALYZE` jos INSERT tuotti myös dead tupleja (esim. UPSERT).

## Taustaa

Ylläpitotoimenpide ≠ indeksin luonti. ANALYZE on nopea metadata-päivitys verrattuna indeksirakennukseen.

[Lue lisää](https://www.postgresql.org/docs/current/sql-analyze.html)
