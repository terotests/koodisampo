# Release-buildissa assert poistuu — miten varmistat että testit löytävät virheet myös tuotantokonfiguraatiossa?

## Tilanne

Kehityksessä `assert(ptr != nullptr)` löytää virheet. Release-build (`-DNDEBUG`) poistaa kaikki assertit — koodi jatkaa `nullptr`:lla ja kaatuu syvemmällä pinossa tai korruptoi dataa.

Tiimi testaa vain debug-buildilla, vaikka tuotanto on release.

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

**Aja testit myös release-moodissa.** Älä testaa vain debug-buildilla, jos tuotanto on release.

Ero `b07-cpp-assert-vs-expect`: tässä kysymyksessä painotus on **testaus release-konfiguraatiossa** — ei assert vs throw -valinnassa.

[Lue lisää](https://en.cppreference.com/w/cpp/error/assert)
