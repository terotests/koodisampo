# Testit ajetaan devissä, stagingissä ja tuotannossa. Miten ympäristökohtaiset URLit ja salaisuudet hallitaan?

## Tilanne

Testeissä on kovakoodattuna:

```robot
${BASE_URL}    https://staging.example.com
${USER}        admin
${PASSWORD}    salasana123
```

Kun sama testi halutaan ajaa toisessa ympäristössä, tiedostoja muokataan käsin. Salasanat päätyvät versionhallintaan ja CI-artefakteihin.

## Ratkaisu

**Muuttujatiedostot tai --variable/--variablefile ajossa; salaisuudet CI:n secret storesta.**

```bash
robot --variablefile variables/staging.yaml tests/
robot --variable BASE_URL:https://staging.example.com tests/
```

`variables/staging.yaml`:

```yaml
BASE_URL: https://staging.example.com
USER: test-admin
```

Salasana CI:ssä:

```bash
robot --variable PASSWORD:${CI_SECRET_PASSWORD} tests/
```

## Käytännössä

Hyvä käytäntö:

- älä kovakoodaa ympäristöä testitiedostoon
- älä committaa salasanoja
- lue salaisuudet CI:n secret storesta / env-muuttujista
- pidä testidata ja ympäristöconfig erillään testilogiikasta
- varmista, että prodia vasten ajettavat testit ovat turvallisia ja rajattuja

Muuttujatyypit (`${}`, `@{}`, `&{}`) ovat hyödyllisiä, mutta tuotannossa tärkeämpää on erottaa config testilogiikasta.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#variable-files)
