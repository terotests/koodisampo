# Sama testi pitää ajaa kymmenellä eri syöte/tulos -parilla. Miten Robot Frameworkissa?

## Tilanne

Laskentapalvelun API:ta testataan: anna syöte, odota tietty tulos. Sama logiikka toistuu kymmenellä eri numeroparilla — yksittäiset testit (`Testi 1`, `Testi 2`, ...) copy-pastena kasvattavat tiedostoa ja muutokset logiikkaan vaativat päivityksen joka riville.

Data-driven testaus erottaa testilogiikan (avainsana) ja testidatan (rivit). Robot Framework tukee tätä natiivisti ilman ulkoisia datatiedostoja, vaikka CSV/Excel on myös vaihtoehto.

## Ratkaisu

**[Template] avainsana + test cases -taulukossa rivit ovat data-rivejä — data-driven tyyli.**

```robot
*** Test Cases ***
Yhteenlasku
    [Template]    Laske summa
    1    2    3
    10    5    15
    -1    1    0
    0    0    0

*** Keywords ***
Laske summa
    [Arguments]    ${a}    ${b}    ${odotettu}
    ${tulos}=    Evaluate    ${a} + ${b}
    Should Be Equal As Numbers    ${tulos}    ${odotettu}
```

`[Template]`-rivillä määritelty avainsana ajetaan jokaiselle testiriville argumenteilla. Yksi avainsana, monta data-riviä. [Template] mahdollistaa data-driven testauksen — yksi avainsana, monta data-riviä.

## Käytännössä

Käytä `[Template]` kun logiikka on identtinen ja vain syöte/odotus vaihtuu. Suuremmille dataseteille harkitse `Test Template` suite-tasolla tai ulkoista CSV:tä `Test Template`-avainsanalla joka lukee tiedoston. Nimeä template-avainsana kuvaavasti — raportissa jokainen data-rivi näkyy erillisenä testinä.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#data-driven-style)
