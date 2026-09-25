# Laskujen summat tallennetaan `double precision` -sarakkeeseen, ja kuukausisumma heittää sentin verran. Mikä tyyppi rahalle?

## Tilanne

Laskutustaulun `amount` on `double precision`. Kuukauden 40 000 laskun summa poikkeaa kirjanpidon luvusta muutamalla sentillä, ja joidenkin laskujen verot pyöristyvät väärin.

## Ratkaisu

Tallenna rahasummat tarkkana desimaalilukuna:

```sql
ALTER TABLE invoices
  ALTER COLUMN amount TYPE numeric(12,2);
```

Vaihtoehto on kokonaisluku pienimmässä yksikössä (`amount_cents bigint`), mikä on yleinen tapa myös sovelluskoodissa.

## Taustaa

Liukuluku (`real`, `double precision`) esittää luvut binäärimurtolukuina, eikä esimerkiksi 0,10 ole esitettävissä tarkasti. Pienet virheet kasautuvat summissa ja vertailuissa (`0.1 + 0.2 <> 0.3`).

`numeric` laskee desimaalit tarkasti, ja `numeric(12,2)` rajaa lisäksi tarkkuuden kahteen desimaaliin. PostgreSQL:n `money`-tyyppiä ei yleensä suositella: sen muotoilu riippuu `lc_monetary`-asetuksesta, eikä se tallenna valuuttaa. Monivaluuttajärjestelmässä valuutta on oma sarakkeensa.

[Lue lisää](https://www.postgresql.org/docs/current/datatype-numeric.html)
