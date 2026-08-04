# `core`:n public headerit käyttävät zlib-API:a, mutta `app` linkkaa vain `core`:a ja saa linkkerivirheen `undefined reference to deflate`. `core` linkkaa `ZLIB::ZLIB` PRIVATElla. Korjaus?

## Tilanne

```cpp
// core/include/core/compress.hpp
#include <zlib.h>
void compress_buffer(...);  // käyttää z_stream / deflate
```

```cmake
target_link_libraries(core PRIVATE ZLIB::ZLIB)
target_link_libraries(app PRIVATE core)
```

`app` kääntyy headereiden varassa, mutta linkitys epäonnistuu: `deflate` ei löydy. `PRIVATE` piilotti zlibin transitiivisen linkityksen, vaikka public API paljastaa zlib-tyypit/funktiot.

## Ratkaisu

Jos riippuvuus näkyy public headereissa, linkkaa `PUBLIC`:

```cmake
find_package(ZLIB REQUIRED)
target_link_libraries(core PUBLIC ZLIB::ZLIB)
```

Silloin `app` saa zlib-linkityksen automaattisesti `core`:n kautta.

## Käytännössä

- **PRIVATE:** riippuvuus vain `.cpp`-toteutuksessa.
- **PUBLIC:** riippuvuus public headereissa tai osa vakaata ABI:a.
- Parempi API-design: piilota zlib PIMPL/abstraktion taakse → voit pitää linkityksen `PRIVATE`:na.
- Sama kuvio `fmt`, Boost, OpenSSL: scope seuraa header-näkyvyyttä.

[Lue lisää](https://cmake.org/cmake/help/latest/command/target_link_libraries.html)
