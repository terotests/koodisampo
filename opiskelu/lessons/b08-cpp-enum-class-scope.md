# Vanha `enum Color { Red, Green }` törmää toisen headerin `Red`-vakion kanssa. Moderni korjaus?

## Tilanne

Header-konflikti:

```cpp
enum Color { Red, Green };
enum Error { Red, Critical };  // Red törmää
```

Unscoped enum vuotaa nimet globaaliin namespaceen. Implisiittinen int-muunnos sekoittaa tyypit.

## Ratkaisu

**`enum class Color { Red, Green };`**

Scoped, vahvasti tyypitetty, ei implisiittistä int:ksi. CppCoreGuidelines Enum.3.

## Käytännössä

Refaktoroi moduuli kerrallaan. `-Wenum-conversion` auttaa. Wire format: rajattu cast export-rajapinnassa.

[Lue lisää](https://en.cppreference.com/w/cpp/language/enum)
