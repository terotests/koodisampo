# JOIN kahdella sarakkeella joissa voi olla NULL. Mikä vertailu on turvallisin?

## Tilanne

Kaksi järjestelmää synkronoidaan ja join tapahtuu ulkoisella avaimella, joka voi olla NULL kun tieto puuttuu:

```sql
SELECT a.id, b.description
FROM staging_a a
JOIN staging_b b
  ON a.external_ref = b.external_ref
 AND a.source_system = b.source_system;
```

SQL:ssä `NULL = NULL` ei ole totta — se on UNKNOWN. Rivit, joissa molemmissa tauluissa `external_ref IS NULL`, eivät matchaa tavallisella `=` -vertailulla, vaikka liiketoiminnallisesti ne voisivat kuulua samaan "tuntematon"-bucketiin.

Kehittäjä yrittää `coalesce(a.external_ref, '') = coalesce(b.external_ref, '')` — se toimii, mutta peittää eron NULL:n ja tyhjän merkkijonon välillä.

## Ratkaisu

**`IS NOT DISTINCT FROM` — NULL-turvallinen yhtäsuuruus:**

```sql
SELECT a.id, b.description
FROM staging_a a
JOIN staging_b b
  ON a.external_ref IS NOT DISTINCT FROM b.external_ref
 AND a.source_system IS NOT DISTINCT FROM b.source_system;
```

`IS NOT DISTINCT FROM` käsittelee NULL=tuntematon oikein: kaksi NULL-arvoa katsotaan "samanlaisiksi" join-ehdossa. Se on PostgreSQLin standardi tapa NULL-turvalliseen vertailuun.

## Käytännössä

Käytä `IS NOT DISTINCT FROM` join-ehdoissa, kun sarakkeet voivat olla NULL ja NULL-arvojen pitää matchata toisiinsa. Käytä tavallista `=` kun NULL tarkoittaa "ei matchia" (oletus SQL:ssä).

Vältä `COALESCE`-työhakkua ilman liiketoimintaperustetta — se muuttaa semantiikkaa (NULL vs '').

Testaa joinin kattavuus: `SELECT count(*) FROM a LEFT JOIN b ... WHERE b.id IS NULL` löytää orvot rivit. Vertaa tulosta ennen/jälkeen IS NOT DISTINCT FROM -muutoksen.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
