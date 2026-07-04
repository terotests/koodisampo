# Binääriprotokolla lukee uint32:n verkosta — arvo väärä ARM:llä. Miten C++20 auttaa?

## Tilanne

Protokolla määrittelee kentät big-endian -järjestyksessä (verkko-byte order). Kehityskone on little-endian (x86, ARM tyypillisesti LE). Suora memcpy structiin ja `header.length` -luku antaa väärän arvon — bugi näkyy vain toisella alustalla tai integraatiotestissä.

Manuaalinen bswap jokaisessa kentässä on virhealtista ja vaikeaa ylläpitää.

## Ratkaisu

C++20 tarjoaa `std::endian` ja `std::byteswap`:

```cpp
#include <bit>
#include <cstdint>

uint32_t read_u32_be(std::span<const std::byte> wire) {
    uint32_t raw;
    std::memcpy(&raw, wire.data(), 4);
    if (std::endian::native != std::endian::big)
        raw = std::byteswap(raw);
    return raw;
}
```

Tarkista protokolladokumentaatio: big-endian vs little-endian. Kiinteän levyisyyden tyypit (`uint32_t`) + eksplisiittinen endian-muunnos tekevät serialisoinnista portable.

## Käytännössä

Vanhemmassa C++:ssa: `htonl`/`ntohl` (POSIX) tai kirjastot kuten Boost.Endian. Struct `#pragma pack` + suora memcpy on edelleen riski endianin ja paddingin takia — serialisoi kentät eksplisiittisesti.

[Lue lisää](https://en.cppreference.com/w/cpp/numeric/endian)
