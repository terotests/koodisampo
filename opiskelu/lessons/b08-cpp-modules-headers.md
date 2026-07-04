# Buildi hidastuu massiivisista include-ketjuista. C++20 ratkaisu uudelle moduulille?

## Tilanne

`#include "Huge.hpp"` jokaisessa `.cpp`:ssä — sama header parsed 500 kertaa. Build 30 min.

## Ratkaisu

**C++20 modules**:

```cpp
// math.cppm
export module math;
export int add(int a, int b);

// app.cpp
import math;
```

Moduuli käännety **kerran** — import kevyt. Vähentää macro/parse-kuormaa.

## Käytännössä

Toolchain-tuki (GCC 13+, Clang 16+, MSVC) vaaditaan. Siirtymä asteittain — modules uusille kirjastoille. PCH/IWYU väliaikaisena. CppBestPractices: modules tulevaisuus.

[Lue lisää](https://en.cppreference.com/w/cpp/language/modules)
