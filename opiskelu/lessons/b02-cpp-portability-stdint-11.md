# Verkkoprotokolla vaatii tarkalleen 32-bittisen unsigned-arvon. Mikä tyyppi on portable?

## Tilanne

Wire-protokolla määrittelee kentän:

```cpp
struct Header {
    unsigned magic;   // 32-bit? riippuu alustasta
    int payload_len;
};
```

`unsigned` voi olla 16, 32 tai 64 bittiä alustan mukaan. Sama struct serialisoituu eri tavalla x86:lla ja ARM:lla — protokolla rikkoutuu hiljaa. `int` ja `long` ovat vielä epävakaampia. Verkkoprotokollissa koko on osa sopimusta, ei "kääntäjän arvaus".

## Ratkaisu

**`std::uint32_t`** headerista `<cstdint>`:

```cpp
#include <cstdint>

struct Header {
    std::uint32_t magic;
    std::int32_t  payload_len;
};
```

Kiinteän levyisyyden tyypit takaavat saman koon kaikilla alustoilla, joilla kääntäjä tukee niitä (käytännössä kaikki modernit). Serialisoi eksplisiittisesti endian-muunnoksella — tyyppi alone ei ratkaise byte orderia.

## Käytännössä

CppCoreGuidelines: älä luota `int`/`long`/`unsigned` protokollakentissä. Käytä `static_assert(sizeof(Header) == expected)`. C++20: `std::endian`, C++23: `std::byteswap` verkkotavulle.

[Lue lisää](https://en.cppreference.com/w/cpp/types/integer)
