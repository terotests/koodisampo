# Linux-dev ajaa `cmake -S . -B build && cmake --build build` ilman build typea. Ohjelma on hidas eikä gdb näytä selkeitä rivejä. Mitä puuttuu?

## Tilanne

Ninja- ja Unix Makefiles -generaattorit ovat **single-config**: build type valitaan configure-vaiheessa muuttujalla `CMAKE_BUILD_TYPE`. Jos sitä ei anneta, arvo on usein tyhjä tai `Release`-tyylinen oletus — ei debug-symboleja (`-g`), mahdollisesti optimoinnit päällä. GDB näyttää `??`, ja ohjelma tuntuu "hitaalta" tai "väärältä" verrattuna odotettuun Debug-buildiin.

Multi-config-generaattorit (Visual Studio, Xcode) valitsevat typen `cmake --build --config Debug` -lipulla. Linux-devin Ninja ei toimi näin.

## Ratkaisu

Anna build type configure-vaiheessa:

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build
```

Release-profilointiin: `-DCMAKE_BUILD_TYPE=RelWithDebInfo` (optimoitu + symbolit) tai `Release`.

## Käytännössä

- Dokumentoi README:hen oletus: `Debug` paikallisesti, `Release` CI:ssä.
- Voit asettaa oletuksen CMakeListsissä vain jos muuttuja on tyhjä:

```cmake
if(NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
  set(CMAKE_BUILD_TYPE Debug CACHE STRING "Build type" FORCE)
endif()
```

- Älä sekoita: `--config` ei aseta `CMAKE_BUILD_TYPE`:ä Makefiles/Ninja-generaattorilla.

[Lue lisää](https://cmake.org/cmake/help/latest/variable/CMAKE_BUILD_TYPE.html)
