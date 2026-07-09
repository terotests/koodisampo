# Tarvitset monimutkaista laskentaa jota ei voi tehdä RF-avainsanoilla. Miten laajennat?

## Tilanne

Testissä pitää laskea HMAC-allekirjoitus, parsia monimutkainen JSON-rakenne tai kutsua sisäistä Python-moduulia jossa on liiketoimintalogiikkaa. Robot Frameworkin `Evaluate` ja valmiit avainsanat riittävät yksinkertaisiin laskuihin, mutta 50 rivin logiikka `.robot`-tiedostossa on vaikeaa ylläpitää ja testata.

Robot Framework ei ole hyvä paikka monimutkaiselle algoritmiselle logiikalle. `.robot`-tiedostossa kannattaa kuvata testin intentio ja korkean tason askeleet.

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

## Käytännössä

Hyvä raja:

- **Robot:** testin flow, assertionit, domain-tason keywordit
- **Python-kirjasto:** monimutkainen laskenta, JSON-muunnokset, HMAC, API-clientit
- **pytest:** Python-kirjaston oma logiikka

Huono merkki: pitkät FOR/IF-rakenteet `.robot`-tiedostossa, sama JSON-parsinta kopioituna moneen testiin, tai usean rivin Python `Evaluate`-kutsuissa.

Älä tee Python-kirjastosta piilotettua testimoottoria, jossa kaikki oikea testilogiikka tapahtuu Pythonissa ja Robotissa näkyy vain `Run Big Test`. Robotin vahvuus on luettava testivirta ja raportointi.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#creating-test-libraries)
