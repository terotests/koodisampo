# Kirjasto buildaa lokaalisti, mutta asennetun paketin käyttäjä saa include-polun `/home/dev/proj/include`. CMakeListsissä: `target_include_directories(mylib PUBLIC ${CMAKE_SOURCE_DIR}/include)`. Mikä puuttuu?

## Tilanne

Kehittäjän koneella build toimii, koska polku `/home/dev/proj/include` on olemassa. Kun kirjasto asennetaan (`cmake --install`) ja toinen projekti tekee `find_package(mylib)`, exported target kantaa edelleen absoluuttisen source-polun. Käyttäjän koneella polkua ei ole → include-virheitä.

Syy on yksi rivi:

```cmake
target_include_directories(mylib PUBLIC ${CMAKE_SOURCE_DIR}/include)
```

## Ratkaisu

Erota build- ja install-ympäristöt generator expressioneilla:

```cmake
target_include_directories(mylib PUBLIC
  $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
  $<INSTALL_INTERFACE:include>
)
```

Buildissa käytetään lähdepuun polkua; asennetussa paketissa suhteellista `include/`-polkua install-prefixiin nähden. Export/install-säännöt (`install(TARGETS ... EXPORT ...)`) kirjoittavat oikean polun `mylibConfig.cmake`-tiedostoon.

## Käytännössä

- Älä koskaan exporttaa `CMAKE_SOURCE_DIR` / absoluuttisia home-polkuja.
- Käytä `CMAKE_CURRENT_SOURCE_DIR` aliprojekteissa (ks. myös `prod-cmake-source-dir-subproject`).
- Testaa install-flow: `cmake --install build --prefix /tmp/prefix` ja kuluttajaprojekti `CMAKE_PREFIX_PATH=/tmp/prefix`.

[Lue lisää](https://cmake.org/cmake/help/latest/manual/cmake-generator-expressions.7.html#genex:BUILD_INTERFACE)
