# Serialisointi verkossa — struct padding rikkoo protokollaa eri arkkitehtuurilla. Miten tarkistat?

## Tilanne

```cpp
struct Packet {
    uint8_t type;
    uint32_t length;  // padding 3 tavua x86:lla?
};
write(fd, &packet, sizeof(packet));
```

**Struct padding** riippuu arkkitehtuurista ja järjestyksestä — wire format ei saa olla "muistin kuva".

## Ratkaisu

**`alignof`**, **`offsetof`**, **`static_assert`**:

```cpp
static_assert(offsetof(Packet, length) == 4);
static_assert(sizeof(Packet) == 8);
```

Parempi: serialisoi kentät erikseen — ei blind `write(&struct)`.

## Käytännössä

`#pragma pack` vain tietoisesti dokumentoidulla protokollalla. Prefer manual encode/decode. CppBestPractices Portability.

[Lue lisää](https://en.cppreference.com/w/cpp/language/alignof)
