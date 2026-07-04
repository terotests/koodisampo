# Konfiguraatiossa `#define MAX_CONNECTIONS 100`. Miksi cpp-best-practices suosittelee `constexpr`?

## Tilanne

Header:

```cpp
#define MAX_CONNECTIONS 100
#define TIMEOUT_MS 5000
```

Ongelmia: makro **ei noudata namespacea** — `#define DEBUG` voi törmätä muualle. Ei tyyppiä — `MAX_CONNECTIONS` on preprocessor-token, ei `int`. Debuggeri ei näe arvoa selkeästi. Makro-funktiot (`#define MAX(a,b) ...`) aiheuttavat yllätyksiä sivuvaikutuksilla.

## Ratkaisu

**`constexpr`** vakiot:

```cpp
inline constexpr int MAX_CONNECTIONS = 100;
inline constexpr int TIMEOUT_MS = 5000;
```

Tyypitetty, namespace-suojattu, käytettävissä compile-time kontekstissa. C++17 `inline` muuttujat headerissa ilman ODR-ongelmaa.

## Käytännössä

Refaktoroi `#define` vakio → `constexpr`. Makro-funktiot → `constexpr` funktiot tai templates. Jätä makrot vain include guard / platform glue -käyttöön. CppCoreGuidelines ES.31.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md)
