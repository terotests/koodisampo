# JSONB-kentässä `{"user":{"email":"a@b.c"}}` — hae email merkkijonona.

## Tilanne

Taulussa `accounts` on JSONB-sarake `payload`, jossa käyttäjätiedot ovat sisäkkäisessä rakenteessa:

```sql
SELECT payload FROM accounts LIMIT 1;
-- {"user": {"email": "a@b.c", "name": "Ada"}}
```

Sovellus tarvitsee sähköpostin **tekstinä** (`text`) WHERE-ehtoon, JOINiin tai raporttiin. Operaattori `->` palauttaa JSONB-objektin — ei merkkijonoa. Jos yrität vertailla suoraan, tyyppi ei täsmää odotuksiin.

Tarvitset polun avaimien läpi ja lopputuloksen merkkijonona.

## Ratkaisu

PostgreSQLin JSON-operaattorit `->` ja `->>` eroavat palautustyypissä: `->` palauttaa JSONB:n, `->>` palauttaa **text**-arvon.

Kaksi yleistä tapaa hakea email:

```sql
-- Ketjutettu polku, lopuksi text
SELECT payload->'user'->>'email' AS email
FROM accounts;

-- Polkutaulukko yhdellä operaattorilla (#>>)
SELECT payload #>> '{user,email}' AS email
FROM accounts;
```

`#>>` ottaa polun merkkijonotaulukkona `{user,email}` ja palauttaa text-arvon suoraan. Molemmat ovat oikein; valitse se, joka on luettavampi tiimissäsi.

Esimerkki suodatukseen:

```sql
SELECT id, payload->'user'->>'email' AS email
FROM accounts
WHERE payload->'user'->>'email' = 'a@b.c';
```

## Käytännössä

Käytä `->>` (tai `#>>`) aina kun tarvitset merkkijonon — vertailu, `LIKE`, yhdistäminen tai export CSV:hen. Käytä `->` kun jatkat polkua syvemmälle tai kun haluat JSONB-tyypin (esim. välituloksen toiselle funktiolle).

Indeksointi: pelkkä `payload->'user'->>'email'` WHERE:ssä ei hyödy GIN-indeksistä samalla tavalla kuin `@>`. Jos email haetaan usein, harkitse generated column tai erillinen `email text`-sarake indeksillä.

[Lue lisää](https://www.postgresql.org/docs/current/functions-json.html)
