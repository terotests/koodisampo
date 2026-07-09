# Useat .robot-testitiedostot tarvitsevat samoja avainsanoja. Miten jaat ne ilman kopiointia?

## Tilanne

Testiprojektissa on kymmenen `.robot`-tiedostoa: login, checkout, admin, raportit. Kaikki tarvitsevat samat avainsanat (`Kirjaudu sisään`, `Tyhjennä ostoskori`) ja muuttujat (`${BASE_URL}`). Copy-paste resurssitiedostoihin synnyttää driftin: login-flow päivitetään yhteen tiedostoon, muut jäävät vanhoiksi.

Robot Frameworkin arkkitehtuuri erottaa testitapaukset ja jaetun logiikan. Resource-tiedosto on tarkoitettu juuri tähän — se ei sisällä testejä vaan avainsanoja ja muuttujia, joita muut tiedostot tuovat.

## Ratkaisu

**Luo resource-tiedosto (.resource/.robot) ja tuo se Resource-asetuksella *** Settings ***-osiossa.**

Suositeltu projektirakenne:

```text
tests/
  smoke/
    login.robot
    checkout.robot
  regression/
    orders.robot

resources/
  common.resource
  pages/
    login_page.resource
    checkout_page.resource
  keywords/
    auth.resource
    orders.resource

variables/
  dev.yaml
  staging.yaml
  prod.yaml

libraries/
  ApiClient.py
  TestData.py
```

Testitiedosto tuo resurssin:

```robot
*** Settings ***
Resource    ../resources/keywords/auth.resource
Resource    ../resources/pages/login_page.resource
```

## Käytännössä

Pidä testitapaukset ohuina. Pidä domain-keywordit `resources/keywords/`-hakemistossa ja tekniset page/screen-keywordit `resources/pages/`-hakemistossa. Monimutkainen logiikka kuuluu Python-kirjastoihin, ympäristökohtaiset arvot `variables/`-hakemistoon. Vältä syviä import-ketjuja.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#resource-files)
