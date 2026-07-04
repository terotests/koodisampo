# Mitä `constexpr` funktio mahdollistaa C++11:ssä?

## Tilanne

Konfiguraatiovakio lasketaan runtime:

```cpp
int tableSize(int n) { return n * n; }
const int LOOKUP_SIZE = tableSize(16);  // runtime — ei compile-time vakio
```

Lookup-taulukon koko pitäisi olla tunnettu käännösaikana — esim. staattinen array tai template-parametri. Runtime-laskenta hidastaa käynnistystä ja estää optimoinnit (constexpr context).

## Ratkaisu

**`constexpr`** funktio voi laskea arvon **käännösaikana**, kun argumentit ovat vakioita:

```cpp
constexpr int tableSize(int n) { return n * n; }

constexpr int LOOKUP_SIZE = tableSize(16);  // 256 käännösaikana
std::array<int, LOOKUP_SIZE> table{};

// C++14+: monimutkaisempi logiikka constexpr-funktiossa
constexpr int hash(int x) {
    return x * 2654435761u;
}
```

C++20: `consteval` pakottaa compile-time evaluoinnin; `constinit` staattisille muuttujille.

## Käytännössä

Käytä `constexpr` vakioille, template-rajoille ja compile-time tarkistuksille (`static_assert`). C++20 std-algorithms constexpr-tuella. CppCoreGuidelines: "Use constexpr where you need compile-time evaluation."

[Lue lisää](https://en.cppreference.com/w/cpp/language/constexpr)
