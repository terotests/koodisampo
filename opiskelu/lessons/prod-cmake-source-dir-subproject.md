# Kirjasto toimii yksinään, mutta `add_subdirectory(third_party/lib)` isommassa projektissa antaa väärän include-polun. Libin CMakeLists: `target_include_directories(lib PUBLIC ${CMAKE_SOURCE_DIR}/include)`. Mikä korjaus?

## Tilanne

Kirjasto buildataan yksinään juuresta: `CMAKE_SOURCE_DIR` on kirjaston juuri, joten `${CMAKE_SOURCE_DIR}/include` osuu oikeaan. Kun sama CMakeLists otetaan isompaan monorepoon `add_subdirectory(third_party/lib)`, `CMAKE_SOURCE_DIR` osoittaa **ylimmän** projektin juureen — ei kirjaston kansioon. Include-polku menee väärään paikkaan.

## Ratkaisu

Käytä `CMAKE_CURRENT_SOURCE_DIR` (tai `CMAKE_CURRENT_LIST_DIR`):

```cmake
target_include_directories(lib PUBLIC
  $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
  $<INSTALL_INTERFACE:include>
)
```

`CMAKE_CURRENT_SOURCE_DIR` on aina sen `CMakeLists.txt`:n hakemisto, jota juuri käsitellään — myös subdirectory-tilassa.

## Käytännössä

| Muuttuja | Merkitys subdirectoryssä |
|----------|--------------------------|
| `CMAKE_SOURCE_DIR` | Juuriprojektin lähdejuuri |
| `CMAKE_CURRENT_SOURCE_DIR` | Nykyisen CMakeListsin kansio |
| `CMAKE_BINARY_DIR` | Juuriprojektin build-juuri |
| `CMAKE_CURRENT_BINARY_DIR` | Nykyisen targetin build-kansio |

Kirjastojen CMakeLists pitää toimia sekä standalone että `add_subdirectory` / FetchContent -tilassa. Testaa molemmat.

[Lue lisää](https://cmake.org/cmake/help/latest/variable/CMAKE_CURRENT_SOURCE_DIR.html)
