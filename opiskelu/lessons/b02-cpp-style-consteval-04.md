# Konfiguraatiovakio pitää laskea compile-time — runtime-laskenta hidastaa käynnistystä. C++20-vaihtoehto constexpr:lle?

## Tilanne

```cpp
constexpr int hash(const char* s) { /* ... */ }  // ok
int runtimeHash() { /* same logic */ }
const int SEED = runtimeHash();  // ei compile-time
```

`constexpr` voi fall back runtimeen jos ei evaluoidu käännösaikana — lookup-taulukko ei mahdu `std::array`-kokoon.

## Ratkaisu

**`consteval`** pakottaa compile-time evaluoinnin:

```cpp
consteval int hash(const char* s) { /* ... */ }
constexpr int SEED = hash("app");  // virhe jos ei compile-time
```

Funktio **ei voi** kutsua runtime-arvoilla — kääntäjävirhe heti.

## Käytännössä

Lookup-taulukot, CRC-taulut, vakiokonfig. C++20 `consteval` vs `constexpr` — consteval on tiukempi. CppCoreGuidelines: compile-time when possible.

[Lue lisää](https://en.cppreference.com/w/cpp/language/consteval)
