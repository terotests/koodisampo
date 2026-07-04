# Useat .robot-testitiedostot tarvitsevat samoja avainsanoja. Miten jaat ne ilman kopiointia?

## Tilanne

Testiprojektissa on kymmenen `.robot`-tiedostoa: login, checkout, admin, raportit. Kaikki tarvitsevat samat avainsanat (`Kirjaudu sisään`, `Tyhjennä ostoskori`) ja muuttujat (`${BASE_URL}`). Copy-paste resurssitiedostoihin synnyttää driftin: login-flow päivitetään yhteen tiedostoon, muut jäävät vanhoiksi.

Robot Frameworkin arkkitehtuuri erottaa testitapaukset ja jaetun logiikan. Resource-tiedosto on tarkoitettu juuri tähän — se ei sisällä testejä vaan avainsanoja ja muuttujia, joita muut tiedostot tuovat.

## Ratkaisu

**Luo resource-tiedosto (.resource/.robot) ja tuo se Resource-asetuksella *** Settings ***-osiossa.**

Jaettu `common.resource`:

```robot
*** Settings ***
Library    Browser

*** Variables ***
${BASE_URL}    https://staging.example.com

*** Keywords ***
Kirjaudu sisään
    [Arguments]    ${user}    ${pass}
    Go To    ${BASE_URL}/login
    ...
```

Testitiedosto tuo sen:

```robot
*** Settings ***
Resource    ../resources/common.resource

*** Test Cases ***
Admin näkee dashboardin
    Kirjaudu sisään    admin    secret
```

Resource-tiedostot jakavat avainsanoja ja muuttujia testisuittien välillä.

## Käytännössä

Järjestä resurssit domainin mukaan (`login.resource`, `checkout.resource`) ja yhteinen `common.resource` pohjalle. `.resource`-pääte on suositeltu uusissa projekteissa — se erottaa selkeästi testeistä. Vältä syviä import-ketjuja; yksi `common` + domain-kohtaiset resurssit riittää useimmiten.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#resource-files)
