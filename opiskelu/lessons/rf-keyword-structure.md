# Robot Frameworkissa testi koostuu avainsanoista. Miten oma avainsana (keyword) määritellään .robot-tiedostossa?

## Tilanne

Testitiimi kirjoittaa samoja askeleita toistuvasti: avaa kirjautumissivu, täytä tunnukset, paina Kirjaudu. Jokaisessa testissä kolme riviä copy-pasteta — muutos login-flow'hun vaatii päivityksen kymmeniin tiedostoihin.

Robot Frameworkissa testit koostuvat avainsanoista (keywords), jotka voivat olla valmiita kirjastoista tai tiimin omia. Oma avainsana kapseloi toistuvan sekvenssin yhteen nimettyyn rakenteeseen, jota testit kutsuvat yhdellä rivillä.

## Ratkaisu

*** Keywords *** -otsikon alla: nimi, [Arguments] ja askeleet sisennettynä.

```robot
*** Keywords ***
Kirjaudu sisään
    [Arguments]    ${käyttäjä}    ${salasana}
    Go To    ${LOGIN_URL}
    Input Text    id=username    ${käyttäjä}
    Input Text    id=password    ${salasana}
    Click Button    Kirjaudu

*** Test Cases ***
Onnistunut kirjautuminen
    Kirjaudu sisään    admin    ${PASSWORD}
    Page Should Contain    Tervetuloa
```

## Käytännössä

Pidä avainsanat yhdessä tasossa abstraktiossa — testi kertoo *mitä* testataan, avainsana *miten*. Nimeä selkeästi (`Kirjaudu sisään`, ei `Do Login Stuff`). Kun sama sekvenssi toistuu kolmessa testissä, refaktoroi se avainsanaksi resource-tiedostoon.

Vältä sekoittamasta abstraktiotasoja samassa testissä:

```robot
# Huono: domain ja tekninen UI sekaisin
Kirjaudu sisään    user    pass
Click    css=.btn-primary
${text}=    Get Text    xpath=//div[4]/span
```

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#creating-user-keywords)
