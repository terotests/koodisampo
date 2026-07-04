# Konfiguraatiovakiot lasketaan build-ajassa. Mikä avainsana varmistaa että laskenta tapahtuu käännösaikana?

## Tilanne

```cpp
int tableSize() { return 1024 * 16; }
const int SIZE = tableSize();  // runtime
std::array<int, SIZE> buf;     // EI käännä — SIZE ei compile-time constant
```

Template-parametrit ja `std::array` koko vaativat **compile-time constantin**. Runtime-laskenta hidastaa käynnistystä lookup-tauluissa.

## Ratkaisu

**`constexpr`** funktio ja vakio:

```cpp
constexpr int tableSize() { return 1024 * 16; }
constexpr int SIZE = tableSize();
std::array<int, SIZE> buf{};
```

C++14+: constexpr-funktioissa monimutkaisempi logiikka. C++20 `consteval` pakottaa compile-time evaluoinnin.

## Käytännössä

`constexpr` lookup-taulut, hash-vakiot, buffer-koot. `static_assert(SIZE > 0)`. CppCoreGuidelines: use constexpr for compile-time values.

[Lue lisää](https://en.cppreference.com/w/cpp/language/constexpr)
