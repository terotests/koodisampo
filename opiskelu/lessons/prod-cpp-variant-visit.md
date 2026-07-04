# Uusi vaihtoehto lisätään `std::variant`-tyyppiin, mutta käsittely unohtuu koodissa. Miten varmistat?

## Tilanne

```cpp
using Value = std::variant<int, std::string>;
Value v = 42;

if (std::holds_alternative<int>(v)) { /* ... */ }
// uusi tyyppi float lisätty — switch unohtuu
```

Manuaaliset if/switch ketjut eivät skaalaa — uusi alternative → compile error puuttuu.

## Ratkaisu

**`std::visit`** exhaustive visitor:

```cpp
std::visit([](auto&& arg) {
    using T = std::decay_t<decltype(arg)>;
    if constexpr (std::is_same_v<T, int>) { /* ... */ }
    else if constexpr (std::is_same_v<T, std::string>) { /* ... */ }
    else { static_assert(!sizeof(T*), "unhandled variant type"); }
}, v);
```

Uusi tyyppi → `static_assert` fail tai compiler varoitus puuttuvasta haarasta.

## Käytännössä

Overload-set visitor (C++20). Review: "Lisää visit-haara uudelle variant-tyypille." CppCoreGuidelines: prefer visit over manual holds_alternative chains.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/variant/visit)
