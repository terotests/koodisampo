# Release-buildissa assert(ei-null) poistuu — nullptr kaataa myöhemmin. Mitä teet tuotantovalvontaan?

## Tilanne

Kehityksessä `assert(ptr != nullptr)` löytää virheet. Release-build (`-DNDEBUG`) poistaa kaikki assertit — koodi jatkaa `nullptr`:lla ja kaatuu syvemmällä pinossa tai korruptoi dataa.

Tiimi luottaa assertiin "turvallisuustarkistuksena" — väärä olettamus.

## Ratkaisu

Erottele debug- ja tuotantotarkistukset:

```cpp
if (ptr == nullptr) {
    log_error("null pointer in process()");
    return ErrorCode::InvalidInput;
}
```

`assert` vain: "tämä on mahdotonta jos ohjelma on oikein" — esim. sisäinen indeksi juuri validoitu. Ulkoisen syötteen validointi kuuluu aina runtime-polkuun.

## CI

Aja testit myös release-moodissa. Älä testaa vain debug-buildilla, jos tuotanto on release.

[Lue lisää](https://en.cppreference.com/w/cpp/error/assert)
