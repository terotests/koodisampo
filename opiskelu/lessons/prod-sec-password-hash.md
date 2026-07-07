# Salasanat tallennetaan SHA-256-hasheina ilman suolaa. Mikä parempi ratkaisu?

## Tilanne

Tietokannassa salasanat näyttävät tältä:

```
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

Sama salasana → sama hash kaikilla käyttäjillä. SHA-256 on nopea — moderni GPU murtaa miljardit arvauksia sekunnissa. Rainbow-taulut valmiille hasheille toimivat ilman suolaa.

Vuotoriskissä kaikki salasanat paljastuvat kerralla.

## Ratkaisu

Hidas, suolattu **password hashing** -algoritmi:

- **Argon2id** (suositus, OWASP)
- **bcrypt**
- **scrypt**

```python
# esimerkki — käytä valmista kirjastoa
import argon2
ph = argon2.PasswordHasher()
hash = ph.hash("user_password")  # sisältää suolan automaattisesti
```

Suola tekee jokaisesta hashista uniikin. Hidas ja muistia käyttävä algoritmi tekee offline-murrosta huomattavasti kalliimpaa, mutta ei pelasta heikkoja salasanoja yksinään.

## Käytännössä

Älä rullaa omaa. Käytä `libsodium`, `argon2-cffi`, `bcrypt` tai frameworkin sisäänrakennettua. SHA-256/MD5 salasanoille on anti-pattern — ne on tarkoitettu tiedostojen eheydelle, ei salasanojen tallennukseen.

Tuotannossa:

- Käytä algoritmin mukana tallennettavaa formaattia, jossa ovat mukana algoritmi, parametrit ja suola.
- Säädä cost-parametrit oman palvelimen suorituskyvyn mukaan.
- Lisää rate limiting kirjautumiseen.
- Harkitse pepperiä vain, jos sen säilytys hoidetaan erillään tietokannasta.
- Vanhoja SHA-256-hasheja voi migroida käyttäjän seuraavan onnistuneen kirjautumisen yhteydessä.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
