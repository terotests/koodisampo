# Robot Frameworkissa on lista URL-osoitteita joita käytetään testissä. Mikä muuttujatyyppi?

## Tilanne

Regressiotestit ajetaan useassa ympäristössä: dev, staging, tuotanto. Testissä on lista endpoint-URL:eja joita käydään läpi — etusivu, tuotelista, ostoskori. Kehittäjä määrittelee ne eri tavoin:

```robot
${URL1}    https://example.com/
${URL2}    https://example.com/products
${URL3}    https://example.com/cart
```

Loopissa tarvitaan indeksointi ja iteraatio. Robot Frameworkissa on erilliset syntaksit skalaarille, listalle ja sanakirjalle — väärä tyyppi aiheuttaa virheilmoituksia kuten "Variable '${URLS}' not found" tai odottamattoman käyttäytymisen `FOR`-loopissa.

## Ratkaisu

**@{URLS} listmuuttuja — viittaus @{URLS} tai yksittäinen ${URLS}[0].**

Listamuuttuja määritellään `@{}`-etuliitteellä:

```robot
*** Variables ***
@{URLS}    https://example.com/    https://example.com/products    https://example.com/cart

*** Test Cases ***
Kaikki sivut latautuvat
    FOR    ${url}    IN    @{URLS}
        Go To    ${url}
        Page Should Contain Element    body
    END
```

Yksittäinen alkio: `${URLS}[0]`. `@{}` on listamuuttuja, `${}` on skalaari, `&{}` on sanakirja Robot Frameworkissa.

## Käytännössä

Käytä `@{LIST}` kun tarvitset iteraation tai useita arvoja samassa muuttujassa. Käytä `${SCALAR}` yksittäisille arvoille. Käytä `&{DICT}` avain-arvo-pareille (esim. API-credentials). Muuttujat voi myös lukea YAML/JSON-tiedostosta `Variables`-asetuksella.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#variable-types)
