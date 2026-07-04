# Testissä tarvitset käyttöjärjestelmäkomentoja (ls, mkdir). Mikä kirjasto tuo ne Robot Frameworkiin?

## Tilanne

Integraatiotestit valmistelevat testihakemiston, kopioivat fixture-tiedostoja ja tarkistavat että prosessi loi odotetun lokitiedoston. Kehittäjä yrittää kutsua shell-komentoja suoraan Robot-syntaksilla, mutta RF ei tunne `ls` tai `mkdir` ilman kirjastoa.

Robot Framework erottaa testilogiikan ja järjestelmäoperaatiot: valmiit standardikirjastot tarjoavat yleiset operaatiot avainsanoina ilman `Run Process`-käärettä joka vaatii shellin ja on alttiimpi injektiolle.

## Ratkaisu

**OperatingSystem-kirjasto — Library OperatingSystem *** Settings ***-osiossa.**

```robot
*** Settings ***
Library    OperatingSystem

*** Test Cases ***
Luo testihakemisto ja tarkista sisältö
    Create Directory    ${OUTPUT_DIR}/fixtures
    Create File    ${OUTPUT_DIR}/fixtures/data.json    {"ok": true}
    ${files}=    List Files In Directory    ${OUTPUT_DIR}/fixtures
    Length Should Be    ${files}    1
```

OperatingSystem-kirjasto tarjoaa tiedosto- ja hakemisto-operaatiot RF-avainsanoina: `Create Directory`, `Remove File`, `File Should Exist`, `Get File` jne. OperatingSystem-kirjasto tarjoaa tiedosto- ja hakemisto-operaatiot RF-avainsanoina.

## Käytännössä

OperatingSystem on osa Robot Frameworkin standardikirjastoja — ei erillistä asennusta. Käytä sitä tiedosto-operaatioihin; varsinaisiin shell-komentoihin (joita ei ole valmiina avainsanana) käytä `Process`-kirjastoa kontrolloidusti. Pidä polut muuttujissa (`${OUTPUT_DIR}`) jotta testit toimivat eri ympäristöissä.

[Lue lisää](https://robotframework.org/robotframework/latest/libraries/OperatingSystem.html)
