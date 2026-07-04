# Etsi rivit joissa JSON sisältää `"status":"active"`. Operaattori?

## Tilanne

Taulussa `orders` on JSONB-sarake `payload`. Sovellus tallentaa tilan avaimena `status`:

```sql
-- Esimerkkirivi
-- payload: {"status": "active", "customer_id": 42, "items": [...]}
```

Haluat kaikki rivit, joissa status on aktiivinen. Väärä tapa on purkaa arvo merkkijonoksi ja vertailla — se rikkoutuu, jos avain puuttuu tai rakenne vaihtelee. Tarvitset operaattorin, joka tarkistaa **onko osajoukko dokumentissa**.

## Ratkaisu

PostgreSQLin **containment-operaattori** `@>` tarkistaa, sisältääkö vasemmanpuoleinen JSONB oikeanpuoleisen:

```sql
SELECT *
FROM orders
WHERE payload @> '{"status": "active"}'::jsonb;
```

`@>` tarkoittaa: "payload sisältää vähintään nämä avaimet ja arvot". Se toimii myös sisäkkäisille rakenteille:

```sql
WHERE payload @> '{"user": {"tier": "premium"}}'::jsonb;
```

GIN-indeksi JSONB-sarakkeelle nopeuttaa `@>`-kyselyjä merkittävästi suurilla tauluilla.

## Käytännössä

`@>` on oikea valinta, kun haet "dokumentissa on nämä kentät näillä arvoilla". Käänteinen operaattori `<@` tarkistaa, onko dokumentti osajoukko toisesta.

Vältä `payload::text LIKE '%active%'` — se on hidas, ei käytä indeksiä ja osuu väärin osamerkkijonoon. Containment on semanttisesti oikea ja indeksoitavissa GIN:llä.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
