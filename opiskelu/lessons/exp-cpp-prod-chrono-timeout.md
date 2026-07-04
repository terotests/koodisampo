# API-kutsu tarvitsee 500 ms timeoutin. Miten ilmaiset ajan modernisti ilman magic-numeroita?

## Tilanne

HTTP-client timeout:

```cpp
const int TIMEOUT = 500;
client.setTimeout(TIMEOUT);  // ms? s? µs?
```

Magic number dokumentaatiossa "500 millisekuntia" — koodi ei kerro yksikköä. Refaktorointi muuttaa arvoa väärin. Eri moduulit käyttävät eri yksiköitä (seconds vs milliseconds).

## Ratkaisu

**`std::chrono::milliseconds(500)`** tai **`500ms`** literal:

```cpp
using namespace std::chrono_literals;
client.setTimeout(500ms);

// tai eksplisiittinen:
auto timeout = std::chrono::milliseconds{500};
```

Tyypitetty aika — API voi ottaa `std::chrono::milliseconds` eikä arvaa yksikköä. Yksikkömuunnos: `1s`, `500ms`, `100us` ovat type-safe.

## Käytännössä

API-design: ota `chrono`-tyyppejä parametreina, ei `int`. `steady_clock` deadline-laskentaan. CppCoreGuidelines: avoid magic numbers for time.

[Lue lisää](https://en.cppreference.com/w/cpp/chrono)
