# GET /api/invoices/12345 — käyttäjä vaihtaa URL:ssa ID:n 12346 ja näkee toisen asiakkaan laskun. Kirjautuminen tarkistetaan, omistajuutta ei. Mikä haavoittuvuus?

## Tilanne

```http
GET /api/invoices/12345
```

Käyttäjä muuttaa URL:ssa ID:n `12346`. API palauttaa toisen asiakkaan laskun, koska endpoint tarkistaa vain kirjautumisen — ei omistajuutta.

## Ratkaisu

Tämä on **IDOR / BOLA** (Broken Object Level Authorization).

- Älä luota objektin ID:hen käyttöoikeutena
- Tarkista objektikohtainen omistajuus jokaisessa lukevassa ja muuttavassa endpointissa
- Tee tarkistus palvelinpuolella tietokantakyselyn yhteydessä
- Lisää testit: käyttäjä A ei saa lukea/muuttaa käyttäjä B:n objekteja

```sql
SELECT *
FROM invoices
WHERE id = $1
  AND tenant_id = $2;
```

[Lue lisää](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/)
