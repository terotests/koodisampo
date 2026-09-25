# Logitus käyttää sprintf-puskuria — satunnainen overflow tuotannossa. Korvaava C++20-ratkaisu?

## Tilanne

```cpp
char buf[128];
sprintf(buf, "user=%s size=%d", name, size);  // pitkä nimi ylittää puskurin
```

Kiinteä puskuri ja tyypitön muotoilumerkkijono: pitkä syöte ylittää puskurin, ja väärä `%`-määre (esim. `%d` 64-bittiselle luvulle) on määrittelemätöntä käytöstä. Bugi näkyy vain harvinaisella syötteellä.

## Ratkaisu

**`std::format`** (C++20, otsake `<format>`):

```cpp
#include <format>

auto msg = std::format("user={} size={}", name, size);
logger.write(msg);
```

- Tulos on `std::string`, joka kasvaa tarpeen mukaan — kiinteää puskuria ei ole.
- Argumenttien tyypit tunnetaan, ja muotoilumerkkijono tarkistetaan käännösaikana (`"{:d}"` merkkijonolle on käännösvirhe).
- Jos kohde on valmis puskuri, `std::format_to_n` kirjoittaa enintään annetun määrän merkkejä.

## Käytännössä

- **C++23** lisää `std::print` / `std::println`, jotka muotoilevat ja tulostavat suoraan.
- Ennen C++20-standardikirjastoa sama API on **{fmt}**-kirjastossa, josta `std::format` on standardoitu.
- Kääntäjätuki: GCC 13+, Clang/libc++ 17+, MSVC 19.29+ (VS 2019 16.10).
- `std::ostringstream` on myös turvallinen, mutta hitaampi ja kömpelömpi muotoilussa (tarkkuus, leveys).
- `snprintf` isommalla puskurilla vain siirtää rajaa, ja `std::to_chars` muuntaa vain yksittäisiä lukuja.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/format/format)
