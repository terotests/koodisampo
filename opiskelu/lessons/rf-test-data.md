# Testi luo käyttäjän test@example.com. Ensimmäinen ajo onnistuu, toinen kaatuu koska käyttäjä on jo olemassa. Miten hallitset testidatan?

## Tilanne

Testi luo käyttäjän `test@example.com`. Ensimmäinen ajo onnistuu, toinen kaatuu koska käyttäjä on jo olemassa. Jaetussa staging-ympäristössä sama toistuu usein — flakiness johtuu usein datasta, ei Robotista.

## Ratkaisu

**Uniikki tunniste (timestamp/build id), teardown-siivous tai kertakäyttöinen testitenantti.**

```robot
*** Test Cases ***
Luo käyttäjä ja kirjaudu
    ${email}=    Set Variable    test-${BUILD_ID}-${RANDOM}@example.test
    Luo käyttäjä APIlla    ${email}    ${PASSWORD}
    Kirjaudu sisään    ${email}    ${PASSWORD}
    [Teardown]    Poista käyttäjä jos luotu    ${email}
```

## Käytännössä

Hyvä käytäntö:

- luo testidataan uniikki tunniste, esim. timestamp/build id
- siivoa data teardownissa, jos se on turvallista
- tai käytä kertakäyttöistä testitenanttia/testikäyttäjää
- älä oleta, että ympäristö on tyhjä
- älä aja destruktiivisia testejä jaetussa stagingissä ilman merkintää (`destructive`-tagi)
- pidä testidata ja testilogiikka erillään

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#test-setup-and-teardown)
