# Sama `src/core.cpp` on listattu sekä `app`-exessä että `tests`-targetissa. Linkitys toimii, mutta ylläpito on kivulias. Parempi malli?

## Tilanne

```cmake
add_executable(app src/main.cpp src/core.cpp src/util.cpp)
add_executable(tests tests/test_core.cpp src/core.cpp src/util.cpp)
```

Jokaiseen uuteen yhteiseen tiedostoon pitää koskea kahta listaa. Riski: testi linkkaa vanhentuneen kopion, tai yksi lista unohtuu. Käännös tehdään kahdesti — hidasta CI:ssä.

## Ratkaisu

Tee yhteisestä koodista kirjasto:

```cmake
add_library(core src/core.cpp src/util.cpp)
target_include_directories(core PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)

add_executable(app src/main.cpp)
target_link_libraries(app PRIVATE core)

add_executable(tests tests/test_core.cpp)
target_link_libraries(tests PRIVATE core)
```

Yksi build-sääntö, yksi paikka includes/options-asetuksille. Testit ja app jakavat saman artefaktin.

## Käytännössä

- Pienissä projekteissa `OBJECT`-kirjasto on vaihtoehto, jos et halua erillistä `.a`-tiedostoa.
- Älä `#include "*.cpp"` testistä — se rikkoo ODR:n ja hidastaa käännöstä.
- Kun core kasvaa, splittaa edelleen (`core_net`, `core_db`) samalla kuviolla.

[Lue lisää](https://cmake.org/cmake/help/latest/command/add_library.html)
