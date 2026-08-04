# Header-only-kirjastossa ei ole `.cpp`-tiedostoja. Miten mallinnat sen modernissa CMakessa?

## Tilanne

Kirjasto koostuu pelkistä headereista: `include/mylib/*.hpp`. Ei ole mitään käännettävää `.cpp`-tiedostoa, mutta käyttäjien pitää silti saada include-polku, C++-standardi ja mahdolliset compile-definitionit oikein. Vanha tapa on `include_directories(...)` juuressa tai tyhjä `STATIC`-kirjasto dummy-lähteellä — molemmat sotkevat riippuvuusgraafin.

Header-only-kirjasto ei tuota `.a`/`.so`-artefaktia. Se on joukko **käyttövaatimuksia**, jotka siirtyvät linkkaajalle. Moderni CMake mallintaa tämän INTERFACE-targetilla.

## Ratkaisu

```cmake
add_library(mylib INTERFACE)
target_include_directories(mylib INTERFACE
  $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
  $<INSTALL_INTERFACE:include>
)
target_compile_features(mylib INTERFACE cxx_std_20)
```

`INTERFACE`-scope tarkoittaa: "vaatimukset kuuluvat kaikille, jotka linkkaavat `mylib`:n". Ei ole `PRIVATE`-koodia, koska ei ole buildattavaa käännösyksikköä. Kuluttaja tekee:

```cmake
target_link_libraries(app PRIVATE mylib)
```

ja saa include-polut sekä C++20-vaatimuksen automaattisesti.

## Käytännössä

- Älä luo tyhjää `STATIC`-kirjastoa vain CMakea varten — se pakottaa linkityksen ja sekoittaa installin.
- Jos kirjasto myöhemmin saa `.cpp`-toteutuksen, vaihda `INTERFACE` → `STATIC`/`SHARED` ja siirrä osa asetuksista `PUBLIC`/`PRIVATE`-scopeihin.
- Asennetussa paketissa käytä `BUILD_INTERFACE` / `INSTALL_INTERFACE` -generoituja polkuja, jotta lähdepuun absoluuttiset polut eivät vuoda käyttäjälle.

[Lue lisää](https://cmake.org/cmake/help/latest/command/add_library.html#interface-libraries)
