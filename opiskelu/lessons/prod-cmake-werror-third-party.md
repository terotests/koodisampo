# CI kaatuu kun `add_subdirectory(third_party/somelib)` buildaa vendor-koodin projektin globaalilla `-Werror`:lla. Mitä korjaat?

## Tilanne

Tiimi haluaa nollatoleranssin omille varoituksille: `-Wall -Wextra -Werror`. Liput on asetettu globaalisti `add_compile_options`:lla. Vendor-kirjasto tuottaa innocuous-varoituksia (vanha API, unused parameter) → CI punainen vaikka oma koodi on puhdas.

Forkata jokainen riippuvuus warning-puhtaaksi ei skaalaudu.

## Ratkaisu

1. Siirrä warning-politiikka **omiin** targeteihin `PRIVATE`-scopella.
2. Pidä `-Werror` optionin takana (`option(WERROR "Treat warnings as errors" ON)`).
3. Älä levitä `-Werror` subdirectoryihin.

```cmake
option(WERROR "Warnings as errors" ON)
add_library(project_warnings INTERFACE)
target_compile_options(project_warnings INTERFACE
  -Wall -Wextra
  $<$<BOOL:${WERROR}>:-Werror>
)
target_link_libraries(app PRIVATE project_warnings)
# third_party/ lisätään ilman project_warnings-linkitystä
```

## Käytännössä

- `FetchContent` / `add_subdirectory`: vendor buildataan omana targetinaan ilman teidän warning-INTERFACEA.
- Jos vendor tarjoaa oman `*_BUILD_TESTING` / warning-optionin, pakota se OFF ennen subdirectoryä.
- Tavoite: oma koodi tiukka, riippuvuudet eristettyjä.

[Lue lisää](https://cmake.org/cmake/help/latest/command/target_compile_options.html)
