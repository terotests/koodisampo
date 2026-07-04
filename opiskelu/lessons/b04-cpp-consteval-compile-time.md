# Lookup-taulukko pitää laskea käännösaikana — runtime-laskenta hidastaa bootia. C++20 tapa?

## Tilanne

Boot lukee lookup-taulukon:

```cpp
const int* table = buildTable();  // runtime allokaatio + laskenta
```

Halutaan staattinen `std::array` compile-time täytettynä — nopea käynnistys, ei dynaamista allokaatiota.

## Ratkaisu

**`consteval`** funktio:

```cpp
consteval std::array<int, 256> buildTable() { /* ... */ }
constexpr auto table = buildTable();
```

Pakotettu compile-time evaluointi — virhe jos ei onnistu käännösaikana.

## Käytännössä

Yhdistä `constexpr` helper-funktioihin. C++20 consteval vs constexpr. Boot-critical data compile-timeen.

[Lue lisää](https://en.cppreference.com/w/cpp/language/consteval)
