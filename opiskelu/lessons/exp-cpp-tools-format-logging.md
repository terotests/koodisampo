# Tiimi korvaa sprintf-loggauksen. Mikä moderni standardikirjasto auttaa turvalliseen merkkijonoon?

## Tilanne

Logitus käyttää C-tyylistä puskuria:

```cpp
char buf[256];
sprintf(buf, "user=%s id=%d score=%f", name, id, score);
logger.write(buf);
```

Ongelmia: pitkä `name` → **buffer overflow**, väärä formaatti → UB, ei tyyppiturvallisuutta. `snprintf` auttaa rajassa, mutta formaattivirheet ja monimutkaisuus jäävät. Tuotannossa satunnainen overflow on vakava turvallisuusaukko.

## Ratkaisu

**C++20 `std::format`** (tai fallback **`std::ostringstream`**):

```cpp
#include <format>

auto msg = std::format("user={} id={} score={:.2f}", name, id, score);
logger.write(msg);

// ennen C++20 / ilman format-kirjastoa:
std::ostringstream oss;
oss << "user=" << name << " id=" << id << " score=" << score;
logger.write(oss.str());
```

`format` tarkistaa argumenttien määrän käännösaikana (C++20), kasvattaa merkkijonoa automaattisesti — ei kiinteää pinopuskuria.

## Käytännössä

C++20: ota `std::format` käyttöön uudessa logituksessa. Vanhempi kääntäjä: `{fmt}`-kirjasto tai `ostringstream`. Poista `sprintf`/`strcpy` kokonaan turvallisuuskriittisistä poluista. `-Wformat` auttaa jäljellä olevassa C-koodissa.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/format/format)
