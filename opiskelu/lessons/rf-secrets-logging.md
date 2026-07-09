# Salasana näkyy Robotin log.html-raportissa CI-artefakteissa. Mikä meni pieleen?

## Tilanne

Testi kirjautuu käyttäjällä ja salasanalla. CI-artefakteihin tallennettu `log.html` näyttää keywordin argumentit, mukaan lukien salasanan. Kuka tahansa jolla on pääsy artefakteihin näkee tunnukset.

Robot Frameworkin raportit ovat yksityiskohtaisia — se on hyvä debugille, mutta huono salaisuuksille.

## Ratkaisu

**Salasana välitettiin keyword-argumenttina tai logattiin — lue salaisuudet env/secret storesta ja rajoita loggausta.**

```robot
*** Settings ***
Library    OperatingSystem

*** Variables ***
${PASSWORD}    %{TEST_PASSWORD}

*** Test Cases ***
Kirjautuminen
    Kirjaudu sisään    ${USER}    ${PASSWORD}
```

Python-kirjastossa:

```python
from robot.api.deco import keyword

@keyword('Kirjaudu sisään')
def login(username, password):
    # älä logita passwordia
    ...
```

## Käytännössä

Hyvä käytäntö:

- älä kovakoodaa salasanoja `.robot`-tiedostoihin
- lue salaisuudet CI:n secret storesta tai ympäristömuuttujista (`%{ENV_VAR}`)
- vältä secretien tulostamista logiin
- rajoita CI-artefaktien näkyvyys
- käytä testikäyttäjiä, joilla on rajatut oikeudet

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#environment-variables)
