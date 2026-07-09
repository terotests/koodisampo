# Kaksi käyttäjää muokkaa samaa riviä ja viimeinen tallennus ylikirjoittaa toisen muutokset huomaamatta. Mikä auttaa?

## Tilanne

Tuotteen hinta ja kuvaus muokataan admin-paneelissa. Käyttäjä A avaa tuotteen klo 10:00 — hinta 29,90 €, kuvaus "Vanha teksti". Käyttäjä B avaa saman tuotteen klo 10:05 ja päivittää hinnan 24,90 €:oon. A ei tiedä B:n muutoksesta ja tallentaa klo 10:10 vain kuvauksen: "Uusi teksti", hinta edelleen 29,90 € näytöllään.

Backend tekee yksinkertaisen päivityksen:

```sql
UPDATE products SET description = 'Uusi teksti', price = 29.90 WHERE id = 7;
```

B:n alennushinta 24,90 € katoaa ilman varoitusta. Asiakas näkee väärän hinnan verkkokaupassa, eikä kumpikaan käyttäjä ymmärrä mitä tapahtui. Tämä on **lost update** -ongelma: viimeinen kirjoittaja voittaa hiljaisesti.

Ilman konfliktinhallintaa yhteismuokkaus tuotannossa johtaa datan ylikirjoitukseen, audit-ongelmiin ja vaikeasti jäljitettäviin virheisiin.

## Ratkaisu

**Optimistic locking: UPDATE vain jos version-kenttä vastaa lukuhetken arvoa.**

Lisää riville versio- tai timestamp-kenttä. Lukuhetkellä klientti saa `version = 3`. Tallennuksessa päivitys onnistuu vain jos versio on yhä sama:

```sql
UPDATE products
SET description = 'Uusi teksti', price = 29.90, version = version + 1
WHERE id = 7 AND version = 3;
```

Jos `UPDATE` ei vaikuta yhteen riviin, joku muu on ehtinyt muuttaa riviä — palauta HTTP 409 Conflict ja tarjoa merge- tai uudelleenlataus-flow. Optimistic lock havaitsee konfliktin — palauta 409 tai merge-flow.

HTTP API:ssa sama idea voidaan toteuttaa myös **ETag / If-Match** -headerilla.

## Käytännössä

Optimistic lock sopii kun konfliktit ovat harvinaisia (useimmat CRUD-näkymät). Pessimistic lock (`SELECT FOR UPDATE`) on parempi tiheästi muokattaville resursseille kuten varastosaldolle. Code reviewissa varmista että `version`-kenttä tulee mukaan sekä SELECTiin että UPDATEen — pelkkä frontendin piilokenttä ei riitä ilman tietokantatason tarkistusta.

[Lue lisää](https://martinfowler.com/eaaCatalog/optimisticOfflineLock.html)
