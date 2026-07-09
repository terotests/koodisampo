# Testisuitessa on 200 testiä mutta haluat ajaa vain smoke-testit CI:ssä. Miten valitset?

## Tilanne

Koko regressiopaketti kestää 45 minuuttia. Jokaisella commitilla CI:ssä tarvitaan nopea varmistus (~5 min) että sovellus käynnistyy ja kriittiset polut toimivat — kirjautuminen, yksi osto, yksi admin-toiminto. Kaikkien 200 testin ajaminen jokaisella pushilla hidastaa kehityssilmukkaa.

Robot Frameworkissa testit voidaan merkitä tageilla ja suodattaa ajon yhteydessä ilman erillisiä tiedostoja tai kommentointia.

## Ratkaisu

**Merkitse testit [Tags] smoke ja aja robot --include smoke — ajaa vain merkityt.**

```robot
*** Test Cases ***
Kirjautuminen toimii
    [Tags]    smoke    login
    Kirjaudu sisään    user    pass
    Page Should Contain    Dashboard

Tilauksen historia
    [Tags]    regression    orders
    ...
```

CI-komento:

```bash
robot --include smoke --exclude wip tests/
```

## Käytännössä

Sovi tagien merkitys etukäteen:

- `smoke`: nopea kriittinen polku, jokaisella commitilla
- `regression`: laajempi yöajo / ennen releaseä
- `slow`: pitkäkestoinen, ei tavalliseen PR-putkeen
- `destructive`: muuttaa dataa tai vaatii erillisen ympäristön
- `flaky`: väliaikainen karanteeni, ei pysyvä ratkaisu
- `wip`: ei CI:hin

Älä anna tagien kasvaa vapaaksi taksonomiaksi. Jos jokainen tiimi keksii omat taginsa, CI-valinta muuttuu epäselväksi.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#tagging-test-cases)
