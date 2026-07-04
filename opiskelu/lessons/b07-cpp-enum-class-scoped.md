# Vanha enum Color { Red, Green } törmää toisen headerin Red-vakioiden kanssa. Moderni korjaus?

## Tilanne

Kaksi moduulia:

```cpp
enum Color { Red, Green, Blue };
enum Error { None, Red, Fatal };  // Red törmää
```

Unscoped enum vuotaa nimet globaaliin namespaceen. `Red` on moniselitteinen — kääntäjävirhe tai väärä constant. Lisäksi `Color c = 42;` kääntyy — implisiittinen int-muunnos.

## Ratkaisu

**`enum class Color { Red, Green, Blue };`**:

```cpp
enum class Color { Red, Green, Blue };
enum class Error { None, Alarm, Fatal };

auto c = Color::Red;
// int x = Color::Red;  // EI käännä
```

Scoped enum eristaa nimet ja estää implisiittiset muunnokset. CppCoreGuidelines Enum.3.

## Käytännössä

Refaktoroi header kerrallaan. `-Wenum-conversion` auttaa. Wire format: rajattu `static_cast` export-rajapinnassa.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#enum3)
