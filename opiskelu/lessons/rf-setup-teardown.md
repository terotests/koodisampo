# Jokainen testi tarvitsee selaimen avauksen alussa ja sulkemisen lopussa. Mikä Robot Framework -mekanismi?

## Tilanne

Selenium- tai Browser-kirjastolla ajettavat web-testit tarvitsevat selaimen ennen testiä ja siivouksen jälkeen — muuten testit vuotavat prosesseja, portit tukkiutuvat ja seuraava testi epäonnistuu satunnaisesti. Bez setup/teardown jokainen testi alkaisi `Open Browser`-rivillä ja päättyisi `Close Browser`-rivillä, mikä toistuu turhaan ja unohtuu helposti.

Robot Framework tarjoaa mekanismin, joka suorittaa valitut avainsanat automaattisesti ennen ja jälkeen jokaisen testin — myös kun testi epäonnistuu.

## Ratkaisu

**Test Setup ja Test Teardown *** Settings *** -osiossa tai testikohtaisesti [Setup]/[Teardown].**

Suite-tasolla koko tiedoston testeille:

```robot
*** Settings ***
Library    Browser
Suite Setup    New Browser    chromium    headless=true
Suite Teardown    Close Browser

*** Settings ***
Test Setup    Avaa sovellus
Test Teardown    Sulje sovellus
```

Tai yksittäiselle testille:

```robot
Onnistunut tilaus
    [Setup]    Avaa selain ja kirjaudu
    [Teardown]    Capture Page Screenshot    EMBED
    ... testiaskeleet ...
```

Setup/Teardown suoritetaan automaattisesti ennen ja jälkeen testin — varmistavat siivouksen.

## Käytännössä

Käytä `Suite Setup`/`Suite Teardown` kun selain voidaan jakaa testien välillä (nopeampi CI). Käytä `Test Setup`/`Test Teardown` kun jokainen testi tarvitsee puhtaan tilan. `[Teardown]` ajetaan aina — myös failissa — joten siihen kannattaa laittaa screenshot ja selaimen sulkeminen.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#test-setup-and-teardown)
