# Migraatio `ALTER TABLE orders ADD COLUMN note text` jumittuu, ja samalla kaikki orders-kyselyt jonoutuvat ja API kaatuu. Pitkä raporttikysely oli käynnissä. Miten suojaat migraatiot?

## Tilanne

Deploy ajaa migraation:

```sql
ALTER TABLE orders ADD COLUMN note text;
```

Sarakkeen lisäys on normaalisti millisekuntien metatietomuutos. Nyt se jää odottamaan, ja samalla kaikki orders-taulun kyselyt jumittuvat. Yhteyspooli täyttyy ja API kaatuu. Syy: analyytikon raporttikysely oli lukenut `orders`-taulua 40 minuuttia.

## Ratkaisu

Aseta migraatioille lyhyt **`lock_timeout`** ja yritä uudelleen:

```sql
SET lock_timeout = '3s';
ALTER TABLE orders ADD COLUMN note text;
```

Jos lukkoa ei saada kolmessa sekunnissa, ALTER epäonnistuu nopeasti eikä tuotanto jumitu. Migraatiotyökalu yrittää muutaman kerran uudelleen tauon jälkeen.

## Taustaa

ALTER TABLE tarvitsee `ACCESS EXCLUSIVE` -lukon, joka on ristiriidassa jopa tavallisen SELECTin kanssa. Lukkojono on reilu: kun ALTER odottaa pitkän kyselyn perässä, **kaikki sen jälkeen tulevat kyselyt jonoutuvat ALTERin taakse**, vaikka ne eivät olisi ristiriidassa pitkän kyselyn kanssa. Lyhytkin odottava ALTER voi siksi pysäyttää koko taulun.

Muita suojia: `statement_timeout` raportointikyselyille, migraatiot hiljaiseen aikaan ja pitkien transaktioiden seuranta (`pg_stat_activity`).

[Lue lisää](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-LOCK-TIMEOUT)
