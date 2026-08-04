# Kirjasto `core` käyttää `fmt`:ää vain `.cpp`-tiedostossa, mutta CMakeListsissä on `target_link_libraries(core PUBLIC fmt::fmt)`. Miksi tämä on ongelma?

## Tilanne

`core` formattoi lokirivejä `fmt`:llä toteutustiedostoissa. Public headerit (`core.hpp`) eivät sisällä `<fmt/...>`. Silti CMakeListsissä:

```cmake
target_link_libraries(core PUBLIC fmt::fmt)
```

Jokainen `core`:n linkkaaja (`app`, testit, muut kirjastot) joutuu linkkaamaan myös `fmt`:n — vaikka ne eivät käytä sitä. Riippuvuusgraafi paisuu, CI hidastuu, ja versionkonfliktit `fmt`:stä leviävät turhaan.

## Ratkaisu

Käytä `PRIVATE`, kun riippuvuus ei näy public API:ssa:

```cmake
target_link_libraries(core PRIVATE fmt::fmt)
```

**Sääntö:** `PUBLIC` = riippuvuus on osa kirjaston julkista rajapintaa (headerit paljastavat tyypit/funktiot). `PRIVATE` = vain toteutuksen sisäinen työkalu. `INTERFACE` = vain header-only / käyttövaatimus ilman omaa linkitystä.

## Käytännössä

- Jos myöhemmin `core.hpp` alkaa palauttaa `fmt::format`in tuloksia tai ottaa `fmt`-tyyppejä parametreina, nosta linkitys `PUBLIC`:ksi.
- Tarkista `cmake --graphviz` tai `target_link_libraries` dokumentaatio: PUBLIC vuotaa transitiivisesti.
- Sama logiikka koskee Boostia, nlohmann/jsonia ja muita: älä vuoda sisäisiä riippuvuuksia.

[Lue lisää](https://cmake.org/cmake/help/latest/command/target_link_libraries.html)
