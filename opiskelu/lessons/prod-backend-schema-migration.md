# Tuotantoon lisätään NOT NULL -sarake isoon tauluun ja deploy jäätyy. Mikä meni pieleen?

## Tilanne

Taulussa `orders` on 20 miljoonaa riviä. Deploy lisää uuden sarakkeen:

```sql
ALTER TABLE orders ADD COLUMN status TEXT NOT NULL DEFAULT 'new';
```

Deploy kestää pitkään, kirjoitukset hidastuvat ja API alkaa timeoutata. Taulu on lukittuna tai kirjoitukset jonoutuvat. Rollback on vaikea, koska sovelluskoodi ja skeemamuutos on yhdistetty yhdeksi peruuttamattomaksi deployksi.

Iso skeemamuutos voi lukita taulun, hidastaa kirjoituksia tai tehdä deploysta riskialttiin — erityisesti kun NOT NULL ja DEFAULT yhdistetään isoon tauluun yhdellä komennolla.

## Ratkaisu

**Iso skeemamuutos yhdessä deployssa — käytä expand-and-contract -mallia erillisissä vaiheissa.**

Turvallisempi malli on expand-and-contract:

1. Lisää uusi sarake ensin nullable-muodossa
2. Deployaa sovellus, joka osaa kirjoittaa sekä vanhaa että uutta mallia
3. Backfillaa vanhat rivit erissä
4. Lisää constraint vasta kun data on kunnossa
5. Poista vanha kenttä/koodi myöhemmässä deployssa

Älä yhdistä isoa datamigraatiota ja sovelluskoodin muutosta yhdeksi peruuttamattomaksi deployksi.

## Käytännössä

Jokainen vaihe on itsenäisesti deployattavissa ja rollbackattavissa. Backfill ajetaan erillisessä batch-jobissa, ei deployn yhteydessä. PostgreSQLissä `ADD COLUMN ... DEFAULT` on nykyään nopeampi kuin ennen, mutta NOT NULL -constraint ja indeksit isoon tauluun vaativat silti suunnittelua. Testaa migraatio tuotantokokoisella datalla stagingissa.

[Lue lisää](https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern)
