# Tuotantotauluun uusi indeksi — CREATE INDEX lukitse kirjoitukset. Online-vaihtoehto?

## Tilanne

Tuotantotaulussa on jatkuva INSERT/UPDATE-kuorma. Normaali `CREATE INDEX` ottaa **ShareLock**in ja estää kirjoitukset indeksin rakennusvaiheessa — tunteja kestävä indeksirakennus tarkoittaa käytännössä seisokkia tai hylättyjä transaktioita.

Indeksi tarvitaan kuitenkin heti — odottaminen ei ole vaihtoehto.

## Ratkaisu

```sql
CREATE INDEX CONCURRENTLY idx_orders_status ON orders (status);
```

**CONCURRENTLY** rakentaa indeksin kahdessa vaiheessa ilman pitkää exclusive lockia kirjoituksille. Kirjoitukset jatkuvat; rakennus kestää kauemmin ja vaatii enemmän resursseja kuin normaali CREATE INDEX.

Huom: CONCURRENTLY ei voi ajaa transaktion sisällä. Epäonnistuessa indeksi voi jäädä `INVALID`-tilaan — tarkista `pg_index.indisvalid`.

## Taustaa

CONCURRENTLY on standardi tuotantokäytäntö isojen taulujen indeksointiin. Se ei korvaa testausta stagingissa — vain poistaa pitkän write-lockin.

[Lue lisää](https://www.postgresql.org/docs/current/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY)
