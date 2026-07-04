# Tarvitset monimutkaista laskentaa jota ei voi tehdä RF-avainsanoilla. Miten laajennat?

## Tilanne

Testissä pitää laskea HMAC-allekirjoitus, parsia monimutkainen JSON-rakenne tai kutsua sisäistä Python-moduulia jossa on liiketoimintalogiikkaa. Robot Frameworkin `Evaluate` ja valmiit avainsanat riittävät yksinkertaisiin laskuihin, mutta 50 rivin logiikka `.robot`-tiedostossa on vaikeaa ylläpitää ja testata.

Robot Framework on alun perin rakennettu laajennettavaksi Pythonilla (tai Javalla/.NETillä). Oma kirjasto on oikea paikka monimutkaiselle logiikalle — se pysyy unit-testattavana erillään RF-syntaksista.

## Ratkaisu

**Kirjoita Python-kirjasto (.py) jossa funktiot ovat suoraan RF-avainsanoja — Library MyLib.**

`mylib.py`:

```python
import hmac
import hashlib

def compute_hmac(secret: str, payload: str) -> str:
    return hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
```

`.robot`-tiedosto:

```robot
*** Settings ***
Library    mylib.py

*** Test Cases ***
Webhook allekirjoitus oikein
    ${sig}=    Compute Hmac    ${SECRET}    {"event":"paid"}
    Should Be Equal    ${sig}    abc123...
```

Funktion nimi muunnetaan avainsanaksi (`compute_hmac` → `Compute Hmac`). Python-kirjaston funktiot näkyvät automaattisesti RF-avainsanoina Library-importin jälkeen.

## Käytännössä

Pidä Python-kirjasto puhtaana: ei RF-riippuvuuksia, unit-testaa normaalisti pytestillä. Käytä `@keyword`-dekorattoria jos haluat eri nimen avainsanalle. Suuremmissa projekteissa paketoi kirjasto pip-paketiksi ja asenna CI-ympäristöön.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#creating-test-libraries)
