# Maksupalvelu lähettää saman webhookin kahdesti verkkohäiriön jälkeen. Miten vältät tuplakirjauksen?

## Tilanne

Verkkokauppa integroituu maksupalveluun, joka ilmoittaa maksun onnistumisesta webhookilla. Asiakas maksaa tilauksen; palvelu vastaa HTTP 200, mutta vastaus ei ehdi perille ennen kuin yhteys katkeaa. Maksupalvelu tulkitsee toimituksen epäonnistuneeksi ja lähettää saman webhookin uudelleen — sama `payment_id`, sama summa, sama tilaus.

Ilman suojaa backend käsittelee molemmat webhookit erillisinä tapahtumina: tilaus merkitään maksetuksi kahdesti, varasto vähenee tuplasti tai kirjanpito saa kaksi identtistä merkintää. Asiakas saa yhden maksun, mutta järjestelmässä näkyy kaksi vahvistusta. Korjaus vaatii manuaalista selvitystä ja luottamus maksupalvelun uudelleentoimitukseen heikkenee.

Tämä ei ole harvinainen edge case — verkkohäiriöt, timeoutit ja palvelimen uudelleenkäynnistykset ovat normaalia tuotannossa. Webhook-käsittelyn on oltava turvallista uudelleentoimitukselle.

## Ratkaisu

**Tallenna idempotency key ennen sivuvaikutusta ja hylkää duplikaatit.**

Jokaisella webhookilla on yksilöllinen tunniste (esim. `event_id` tai `Idempotency-Key`-header). Ennen kuin päivität tilauksen tai kirjaat maksun, tarkista onko tämä avain jo käsitelty:

```sql
INSERT INTO processed_webhooks (event_id, processed_at)
VALUES ('evt_abc123', now())
ON CONFLICT (event_id) DO NOTHING
RETURNING event_id;
```

Jos `INSERT` ei palauta riviä, webhook on jo käsitelty — vastaa 200 OK ilman uudelleenkäsittelyä. Idempotentti käsittely sallii turvallisen uudelleentoimituksen — Stripe/API best practices.

## Käytännössä

Tallenna idempotency key samassa transaktiossa kuin varsinaiset sivuvaikutukset, tai käytä unique constraintia taulussa joka estää duplikaatin atomisesti. Vastaa aina 2xx onnistuneesta duplikaatista, jotta lähettäjä ei jää retry-loopiin. Code reviewissa varmista: "Voiko tämä endpoint saada saman pyynnön kahdesti turvallisesti?"

[Lue lisää](https://docs.stripe.com/api/idempotent_requests)
