# Lisäät riippuvuuden `add_subdirectory(third_party/somelib)` ja yhtäkkiä pääprojektiin ilmestyy uusia install-targetteja ja testejä. Miten rajaat vuodon?

## Tilanne

Vendored-projektin CMakeLists rekisteröi omat testinsä (`enable_testing` / `add_test`), examplensa ja `install(TARGETS ...)` -säännöt. Kun se otetaan `add_subdirectory`:llä, `cmake --build` / `cmake --install` / CTest näkee myös nämä. Pääprojektin `all`-target kasvaa, install pakkaa turhia binäärejä, ja CI ajaa väärät testit.

## Ratkaisu

Rajaa subdirectory ennen ja sen yhteydessä:

```cmake
set(SOMELIB_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(SOMELIB_INSTALL OFF CACHE BOOL "" FORCE)
add_subdirectory(third_party/somelib EXCLUDE_FROM_ALL)
```

`EXCLUDE_FROM_ALL` jättää vendored-targetit pois oletus-`all`-buildista — linkkaat eksplisiittisesti tarvitsemasi targetin. Optionien `FORCE` ennen subdirectoryä estää niiden ON-oletukset vuotamasta.

## Käytännössä

- Lue vendorin `option()`-lista ennen integraatiota.
- FetchContent: sama kuvio `FetchContent_Declare` + muuttujat ennen `MakeAvailable`.
- Jos vendor ei tarjoa OFF-optiota, harkitse `find_package` / erillistä superbuildia.

[Lue lisää](https://cmake.org/cmake/help/latest/command/add_subdirectory.html)
