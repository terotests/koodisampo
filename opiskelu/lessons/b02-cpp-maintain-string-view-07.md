# Funktio ottaa `const std::string&` mutta kutsutaan literaaleilla — turhia allokaatioita. Parempi parametri?

## Tilanne

Apufunktio `void log(const std::string& msg)` kutsutaan satoja kertoja sekunnissa: `log("request started")`, `log(user.name())`, `log(buffer)`. Jokainen string-literaali pakottaa kääntäjän luomaan väliaikaisen `std::string`-olion, koska `const char*` ei sido suoraan `string&`-parametriin ilman implisiittistä konstruktiota.

Profileri näyttää allokaatioita hot pathissa, vaikka funktio vain lukee merkkejä.

## Ratkaisu

Vaihda parametri `std::string_view`:ksi:

```cpp
void log(std::string_view msg) {
    logger.write(msg.data(), msg.size());
}
```

`string_view` hyväksyy literaalit, `std::string`:n ja `const char*`:n ilman omistavaa kopiota. Funktio ilmaisee intentin: vain lukuoikeus, ei muutosta eikä tallennusta.

## Rajoitukset

Älä tallenna `string_view` olion jäseneksi, ellei lähdedatan elinikä ole taattu (esim. staattinen literaali tai samassa scopessa elävä `std::string`). Jos funktio tarvitsee omistetun kopion (muokkaus, async-jono), kopioi sisällä: `std::string owned(msg)`.

[Lue lisää](https://en.cppreference.com/w/cpp/string/basic_string_view)
