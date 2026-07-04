# Milloin `std::string_view` on hyödyllinen?

## Tilanne

Funktio lukee merkkijonoa — vertaa prefixiä, parsii tokenin, tulostaa lokissa — mutta ei tarvitse omistaa dataa eikä muokata sitä. Parametri `const std::string&` pakottaa literaalikutsujat luomaan väliaikaisen `std::string`-olion (allokaatio). `const char*` toimii literaaleille, mutta ei hyväksy `std::string`:iä ilman `.c_str()`-kutsua.

Tarvitaan yksi parametrityyppi, joka hyväksyy literaalit, `std::string`:n ja `const char*`:n ilman turhaa kopiota.

## Ratkaisu

`std::string_view` on non-owning näkymä merkkijonoon. Käytä sitä funktioparametrina, kun tarvitset vain **lukuoikeuden** ja elinikä on selkeä:

```cpp
bool starts_with(std::string_view s, std::string_view prefix) {
    return s.size() >= prefix.size() &&
           s.substr(0, prefix.size()) == prefix;
}
```

Kutsu toimii: `starts_with("hello", "he")`, `starts_with(std::string("x"), "x")`, `starts_with(buf, "key")` kun `buf` on `string_view`-yhteensopiva.

## Milloin ei

Älä tallenna `string_view` jäsenmuuttujaksi tai palauta sitä paikallisesta `std::string`:stä — näkymä vanhenee kun lähde tuhoutuu. Omistettava data → `std::string`. Binääridata ilman NUL-päätettä → `std::span<const char>`.

[Lue lisää](https://en.cppreference.com/w/cpp/string/basic_string_view)
