# Lisäät `src/foo.cpp`:n, mutta build ei linkitä sitä ennen kuin ajat `cmake` uudelleen. CMakeLists: `file(GLOB SOURCES src/*.cpp)`. Mikä on ongelma?

## Tilanne

```cmake
file(GLOB SOURCES src/*.cpp)
add_library(core ${SOURCES})
```

Lisäät uuden tiedoston, ajat `cmake --build`, ja linkkeri ei näe `foo.cpp`:tä. Vasta kun ajat configure-vaiheen uudelleen (`cmake -S . -B build`), GLOB päivittyy. CI:ssä tämä näyttää satunnaiselta "unohtuiko commit?" -bugilta.

## Ratkaisu

Listaa lähteet eksplisiittisesti:

```cmake
add_library(core
  src/a.cpp
  src/b.cpp
  src/foo.cpp
)
```

Tai jos GLOB on pakko, käytä `CONFIGURE_DEPENDS` (CMake ≥ 3.12), jotta generaattori tarkistaa globin uudelleen:

```cmake
file(GLOB SOURCES CONFIGURE_DEPENDS src/*.cpp)
```

Eksplisiittinen lista on silti suositellumpi: se näkyy code review'ssa ja on toistettava kaikilla generaattoreilla.

## Käytännössä

- CMake dokumentoi, että GLOB ilman `CONFIGURE_DEPENDS` ei seuraa tiedostojärjestelmää build-aikana.
- Monorepossa eksplisiittinen lista estää vahingossa mukaan tulevat backup-tiedostot (`*~`, `*_test.cpp`).
- Generoi listaa skriptillä tarvittaessa, mutta commitoi tulos — älä luota hiljaiseen GLOBiin.

[Lue lisää](https://cmake.org/cmake/help/latest/command/file.html#glob)
