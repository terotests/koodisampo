# Testisuitessa on 200 testiä mutta haluat ajaa vain smoke-testit CI:ssä. Miten valitset?

## Tilanne

Koko regressiopaketti kestää 45 minuuttia. Jokaisella commitilla CI:ssä tarvitaan nopea varmistus (~5 min) että sovellus käynnistyy ja kriittiset polut toimivat — kirjautuminen, yksi osto, yksi admin-toiminto. Kaikkien 200 testin ajaminen jokaisella pushilla hidastaa kehityssilmukkaa.

Robot Frameworkissa testit voidaan merkitä tageilla ja suodattaa ajon yhteydessä ilman erillisiä tiedostoja tai kommentointia.

## Ratkaisu

**Merkitse testit [Tags] smoke ja aja robot --include smoke — ajaa vain merkityt.**

Testitapauksessa:

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
robot --include smoke tests/
```

Vain `smoke`-tagilla merkityt testit ajetaan. Voit yhdistää: `--include smoke --exclude slow`. Tagit ovat RF:n ensisijainen mekanismi testien valintaan — --include/--exclude.

## Käytännössä

Sovi tiimin kanssa tagien merkitykset: `smoke` (CI jokaisella pushilla), `regression` (yöajo), `wip` (keskeneräinen). Vältä liian monia päällekkäisiä tageja — selkeä hierarkia helpottaa pipeline-konfiguraatiota. `--exclude wip` CI:ssä estää keskeneräisten testien ajon.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#tagging-test-cases)
