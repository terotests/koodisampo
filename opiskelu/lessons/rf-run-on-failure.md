# Haluat automaattisen kuvakaappauksen jokaisesta epäonnistuneesta web-testistä debuggausta varten. Miten?

## Tilanne

CI:ssä web-testi epäonnistuu yöllä. Lokissa lukee "Element not found", mutta et tiedä oliko kyseessä login-virhe, tyhjä sivu vai overlay-dialogi. Kehittäjä lisää manuaalisesti `Capture Page Screenshot` jokaisen testin `[Teardown]`-osioon — se toimii, mutta unohtuu uusiin testeihin ja tuottaa turhia kuvia onnistuneista ajoista.

SeleniumLibrary tarjoaa globaalin koukun joka ajaa valitun avainsanan automaattisesti vain kun testi epäonnistuu — ilman toistoa jokaisessa testissä.

## Ratkaisu

**Register Keyword To Run On Failure Capture Page Screenshot — ajetaan automaattisesti failissa.**

```robot
*** Settings ***
Library    SeleniumLibrary

*** Keywords ***
Suite Setup With Screenshot On Failure
    Register Keyword To Run On Failure    Capture Page Screenshot
    Open Browser    ${URL}    chrome

*** Test Cases ***
Ostoskori toimii
    Click Element    id=add-to-cart
    Page Should Contain    1 tuote
```

Kun testi failaa, RF kutsuu `Capture Page Screenshot` ennen teardownia. Kuva liitetään `log.html`-raporttiin. Register Keyword To Run On Failure on automaattinen mekanismi joka suoritetaan vain virheissä.

Browser Libraryssä vastaava: `Register Keyword To Run On Failure    Take Screenshot    filename=FAIL-{index}`.

## Käytännössä

Aseta rekisteröinti `Suite Setup`issa kerran koko suiteelle. CI-artefakteina tallenna `log.html` ja screenshots-kansio — ne nopeuttavat debuggausta merkittävästi. Voit rekisteröidä oman avainsanan joka ottaa kuvan ja tallentaa sivun HTML:n.

[Lue lisää](https://robotframework.org/SeleniumLibrary/SeleniumLibrary.html#Register%20Keyword%20To%20Run%20On%20Failure)
