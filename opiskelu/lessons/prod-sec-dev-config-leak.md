# Stagingissä on DEBUG=true, CORS=* ja testikäyttäjä admin/admin. Mikä riski?

## Tilanne

Jaetussa staging-ympäristössä on kehitysasetukset päällä:

- `DEBUG=true`
- `CORS=*`
- testikäyttäjä `admin` / `admin`

## Riski

Dev-oletukset eivät saa päätyä jaettuihin ympäristöihin. Staging voi sisältää oikeaa dataa tai olla verkossa ulospäin.

## Miksi tämä on vaarallista

`DEBUG=true` voi paljastaa stack traceja, ympäristömuuttujia ja sisäisiä polkuja. `CORS=*` helpottaa selainpohjaisia hyökkäyksiä, jos credentiaaleja käytetään väärin. Tunnettu testitunnus on ensimmäinen, jota kokeillaan skannauksissa.

## Väärä korjaus

"Staging on vain testiä, ei haittaa" — staging usein sisältää tuotantodataa tai on avoin kumppaneille.

"HTTPS riittää" — TLS ei korjaa väärää konfiguraatiota.

## Parempi korjaus

- Käytä turvallisia oletuksia kaikissa ei-kehitysympäristöissä
- Erota ympäristökohtainen konfiguraatio selkeästi (dev / staging / prod)
- Poista tunnetut testitunnukset ja oletussalasanat
- Rajaa CORS tunnettuihin origineihin
- Lisää deploy-tarkistukset, jotka estävät `DEBUG=true` ja `CORS=*` tuotantoon ja jaettuun stagingiin
- Käytä erillisiä salaisuuksia ja käyttäjiä per ympäristö

## Tuotantohuomiot

Secure defaults tarkoittaa, että järjestelmä on turvallinen ilman erityistä muistamista. Jos dev-config vuotaa stagingiin, se on insecure design -ongelma, ei pelkkä "väärä deploy".

[Lue lisää](https://owasp.org/Top10/2021/A04_2021-Insecure_Design/)
