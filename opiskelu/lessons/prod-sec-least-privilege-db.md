# Backend käyttää tietokantaan superuser-tunnusta. Mikä riski?

## Tilanne

Tuotannon backend yhdistää PostgreSQL:ään `postgres`-superuser-tunnuksella tai vastaavalla täysillä oikeuksilla.

## Riski

Sovellusmurtuma antaa hyökkääjälle saman DB-oikeustason kuin sovelluksella — usein liian laajan.

## Miksi tämä on vaarallista

Jos sovellus murretaan SQL injectionilla, RCE:llä tai haavoittuvalla kirjastolla, hyökkääjä saa kaikki sovelluksen DB-oikeudet. Superuser voi lukea kaiken datan, muuttaa skeemaa, luoda käyttäjiä ja joskus ajaa koodia palvelimella.

## Väärä korjaus

"Superuser on ok, koska vain backend yhdistää" — backend on hyökkäyspinta.

"Salataan connection string" — salaisuuden piilottaminen ei rajaa oikeuksia murtumisen jälkeen.

## Parempi korjaus

Sovelluksen DB-käyttäjällä pitäisi olla vain tarvitut oikeudet:

- erillinen runtime-käyttäjä per sovellus/ympäristö
- vain tarvittavat `SELECT`/`INSERT`/`UPDATE`/`DELETE` oikeudet tarvittaviin tauluihin
- ei `DROP`, `CREATE`, superuser- tai schema-admin-oikeuksia runtime-käyttäjälle
- migraatiot erillisellä käyttäjällä CI/CD:ssä

## Tuotantohuomiot

Least privilege vähentää blast radiusia. Jos yksi palvelu murtuu, hyökkääjä ei saa koko tietokannan hallintaa. Tämä on secure design -päätös, ei vain ops-käytäntö.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html)
