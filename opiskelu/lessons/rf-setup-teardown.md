# Jokainen testi tarvitsee selaimen avauksen alussa ja sulkemisen lopussa. Mikä Robot Framework -mekanismi?

## Tilanne

Selenium- tai Browser-kirjastolla ajettavat web-testit tarvitsevat selaimen ennen testiä ja siivouksen jälkeen — muuten testit vuotavat prosesseja, portit tukkiutuvat ja seuraava testi epäonnistuu satunnaisesti. Ilman setup/teardownia jokainen testi alkaisi `Open Browser`-rivillä ja päättyisi `Close Browser`-rivillä, mikä toistuu turhaan ja unohtuu helposti.

Robot Framework tarjoaa mekanismin, joka suorittaa valitut avainsanat automaattisesti ennen ja jälkeen jokaisen testin — myös kun testi epäonnistuu.

## Ratkaisu

**Test Setup ja Test Teardown *** Settings *** -osiossa tai testikohtaisesti [Setup]/[Teardown].**

```robot
*** Settings ***
Library           Browser
Suite Setup       Avaa selain
Suite Teardown    Sulje selain
Test Setup        Avaa uusi sivu
Test Teardown     Tallenna debug-tiedot jos testi epäonnistui

*** Keywords ***
Avaa selain
    New Browser    chromium    headless=true

Sulje selain
    Close Browser

Avaa uusi sivu
    New Page    ${BASE_URL}
```

Yksittäiselle testille voit käyttää `[Setup]` ja `[Teardown]` suoraan testitapauksessa. `[Teardown]` ajetaan aina — myös failissa — joten siihen kannattaa laittaa screenshot ja siivous.

## Käytännössä

`Suite Setup`/`Suite Teardown` sopii raskaaseen yhteiseen alustukseen (esim. selaimen käynnistys). `Test Setup`/`Test Teardown` sopii testikohtaiseen puhtaaseen tilaan. Älä jaa kirjautunutta selaintilaa testien välillä, jos testit voivat vaikuttaa toisiinsa — nopeus vs. eristys on tietoinen valinta.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#test-setup-and-teardown)
