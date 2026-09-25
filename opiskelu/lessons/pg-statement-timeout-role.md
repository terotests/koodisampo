# BI-työkalun ad hoc -kyselyt pyörivät välillä tunteja ja vievät tuotantokannan resurssit. Miten rajaat vain niiden keston?

## Tilanne

Analyytikot yhdistävät BI-työkalunsa suoraan tuotantokannan lukureplikaan (tai pahimmillaan pääkantaan). Välillä joku tekee kyselyn, joka yhdistää viisi isoa taulua ilman rajauksia ja pyörii tunteja, varaa muistia ja levy-I/O:ta.

## Ratkaisu

Anna BI-käyttäjälle oma rooli ja roolikohtainen aikaraja:

```sql
ALTER ROLE bi_reader SET statement_timeout = '5min';
ALTER ROLE bi_reader SET idle_in_transaction_session_timeout = '10min';
```

Asetus tulee voimaan uusissa yhteyksissä. Yksittäinen istunto voi tarvittaessa asettaa oman arvonsa (`SET statement_timeout = ...`), mikä kannattaa estää, jos rooli on jaettu.

## Taustaa

`statement_timeout` keskeyttää lauseen, joka on kestänyt annetun ajan, ja kirjaa virheen `canceling statement due to statement timeout`. Roolikohtainen asetus koskee vain kyseistä käyttäjää, joten sovelluksen oikeat pitkät työt (migraatiot, raportit) eivät katkea.

`max_connections` rajaa yhteyksien määrää, ei kestoa, ja `work_mem` vain ohjaa muistinkäyttöä. Globaali lyhyt aikaraja katkaisisi kaiken muunkin. Raskaalle analytiikalle oma replikaatti tai erillinen analytiikkakanta on usein pitkän aikavälin ratkaisu.

[Lue lisää](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-STATEMENT-TIMEOUT)
