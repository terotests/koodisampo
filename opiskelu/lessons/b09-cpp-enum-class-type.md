# Code review: `enum Color { RED, GREEN }` sekoittuu toisen `enum Status { RED, ... }` kanssa. Korjaus?

## Tilanne

Kaksi unscoped enumia samassa translation unitissa — `RED` moniselitteinen. Switch-case voi käyttää väärää arvoa hiljaa.

## Ratkaisu

**`enum class`** molemmille:

```cpp
enum class Color { Red, Green };
enum class Status { Ok, Error };
```

Eri namespace (`Color::Red` vs `Status::Ok`). Kääntäjä estää sekoituksen.

## Käytännössä

CppBestPractices Style: uudessa koodissa vain enum class. Legacy: rename prefix (`ColorRed`) väliaikaisesti ennen refaktorointia.

[Lue lisää](https://en.cppreference.com/w/cpp/language/enum)
