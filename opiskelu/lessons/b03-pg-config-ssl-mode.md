# App yhdistää Postgresiin internetin yli — compliance vaatii salatun yhteyden. Client-parametri?

## Tilanne

Sovelluspalvelin ja PostgreSQL ovat eri verkossa — yhteys kulkee internetin tai julkisen pilverkon yli. Compliance (GDPR, PCI, sisäinen tietoturvapolitiikka) vaatii, ettei tunnuksia, SQL:ää tai result set -dataa kulje plaintextinä.

PostgreSQL tukee SSL/TLS-yhteyksiä libpq:n ja vastaavien driverien kautta. Pelkkä `sslmode=disable` tai oletus ilman SSL:ää altistaa man-in-the-middle -hyökkäyksille ja salasanan sieppaukselle. Palvelinpuolella tarvitset `ssl = on` ja sertifikaatit, mutta kysymys koskee **client-parametria**, joka pakottaa salatun yhteyden ja sertifikaatin tarkistuksen.

## Ratkaisu

**sslmode=verify-full (tai require minimum) connection stringissä** on oikea vastaus. `verify-full` tarkistaa, että palvelimen sertifikaatti on luotettu JA että isäntänimi (CN/SAN) vastaa yhteysosoitetta — vahvin vaihtoehto tuotantoon.

```
postgresql://user:pass@db.example.com:5432/mydb?sslmode=verify-full
```

Minimitaso salatulle yhteydelle on `sslmode=require` (salaa, mutta ei välttämättä validoi serttiä täysin). `prefer` yrittää SSL:ää mutta voi fallbackata plaintextiin — ei riitä complianceen.

Asenna clientille CA-sertifikaatti (esim. `sslrootcert`) kun käytät `verify-full` / `verify-ca`.

## Tuotannossa

Palvelin: `ssl_cert_file`, `ssl_key_file`, `ssl_ca_file` postgresql.confissa. Kierrä sertifikaatit ennen vanhenemista.

Application framework (JDBC, pgx, SQLAlchemy) mapittaa `sslmode`-parametrin connection URI:hin. Testaa yhteys poistamalla SSL — yhteyden pitäisi epäonnistua, jos konfig on oikein.
