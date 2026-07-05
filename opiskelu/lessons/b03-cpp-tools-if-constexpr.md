# Template-funktio tarvitsee eri haaran integraalisille vs float-tyypeille compile-time. Mitä käytät?

## Tilanne

Template eri tyypeille:

```cpp
template<typename T>
T square(T x) {
    if (std::is_integral_v<T>) {
        // integraali-haara
    } else {
        // float-haara — molemmat instanssoidaan aina?
    }
}
```

Vanha `if` template-funktiossa: **molemmat haarat** täytyy kääntää kaikille `T`:ille — `int`-instanssi ei käännä float-koodia, mutta SFINAE/if trick on kömpelö.

## Ratkaisu

**`if constexpr`** (C++17):

```cpp
#include <cmath>

template<typename T>
T square(T x) {
    if constexpr (std::is_integral_v<T>) {
        return x * x;
    } else {
        return std::pow(x, 2);  // liukuluvuille
    }
}
```

Ei-instantioitu haara **poistuu** käännöksessä — virheellinen haara ei estä toista tyyppiä.

## Käytännössä

Korvaa SFINAE/`enable_if` monissa tapauksissa. C++20 concepts vielä selkeämpää rajapintaan. CppCoreGuidelines: prefer if constexpr over tag dispatch when simple.

[Lue lisää](https://en.cppreference.com/w/cpp/language/if constexpr)
