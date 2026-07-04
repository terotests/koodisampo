# Signed integer ylivuoto C++:ssa tuotantokoodissa — mitä standardi sanoo?

## Tilanne

```cpp
int a = INT_MAX;
int b = a + 1;  // signed overflow
```

Kehittäjä odottaa kiertymistä kuten unsignedissa. Signed integer overflow on **undefined behavior** C++:ssa — kääntäjä voi olettaa ettei overflow tapahdu ja optimoida koodi rikki (esim. poistaa "turhia" tarkistuksia).

## Ratkaisu

Älä luota signed overflowiin:

```cpp
#include <numeric>

int a = INT_MAX;
int b;
if (!__builtin_add_overflow(a, 1, &b))  // GCC/Clang
    // tai std::integers::  / oma tarkistus
```

Tai käytä laajempaa tyyppiä ennen laskentaa (`int64_t`), `std::in_range`, tai kirjastoja. Tuotannossa: tarkista ennen laskentaa, älä korjaa overflow jälkeen.

## Käytännössä

UBSan (`-fsanitize=undefined`) löytää nämä testeissä. CppCore Guidelines ES.100: vältä signed overflow -olettamuksia.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#ES.100)
