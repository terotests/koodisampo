# Tiimi asettaa C++20:n globaalisti: `set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++20")`. Miksi moderni CMake suosii toista tapaa?

## Tilanne

```cmake
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++20")
```

Globaali lippu osuu **kaikkiin** targeteihin: omaan koodiin, vendored-kirjastoihin ja testeihin. Kolmannen osapuolen koodi ei välttämättä käänny C++20:llä, tai MSVC tarvitsee eri lipun (`/std:c++20`). Lisäksi `CMAKE_CXX_FLAGS` ohittaa CMaken abstraktiokerroksen — feature-detection ja transitiiviset vaatimukset katoavat.

## Ratkaisu

Kiinnitä standardi targetille:

```cmake
target_compile_features(app PUBLIC cxx_std_20)
# tai
set_target_properties(app PROPERTIES CXX_STANDARD 20 CXX_STANDARD_REQUIRED YES)
```

`PUBLIC`/`INTERFACE` kantaa vaatimuksen kuluttajille; `PRIVATE` rajoittaa oman käännöksen. CMake valitsee oikean kääntäjäflagin alustalle.

## Käytännössä

- Header-only / kirjasto jonka API vaatii C++20: käytä `PUBLIC` tai `INTERFACE`.
- Sisäinen toteutusdetail: `PRIVATE`.
- Älä sekoita `-std=` manuaalisesti `target_compile_features`-asetukseen — tuplaliput aiheuttavat varoituksia.

[Lue lisää](https://cmake.org/cmake/help/latest/prop_tgt/COMPILE_FEATURES.html)
