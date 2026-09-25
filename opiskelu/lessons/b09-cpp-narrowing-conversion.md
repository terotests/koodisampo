# Laskenta `int64_t` → `int32_t` hiljaa truncaa arvon. Miten estät käännösaikana?

## Tilanne

API rajaa arvon 32-bittiseen tunnisteeseen, mutta lähdedata on `int64_t` (tietokanta, JSON, laskenta). Hiljainen cast:

```cpp
int32_t id = static_cast<int32_t>(big_id);
```

truncaa yläbitit ilman virhettä — väärä tunniste tuotannossa, vaikea jäljittää. Myös kopio-alustus `int32_t id = big_id;` kääntyy yleensä hiljaa; varoitus tulee vain esim. `-Wconversion`-lipulla.

## Ratkaisu

**Brace-init** tekee kavennuksesta käännösaikaisen virheen:

```cpp
int32_t id{big_id};  // virhe (tai vähintään varoitus): narrowing int64_t → int32_t
```

List initialization kieltää supistavat muunnokset, joten hiljainen truncaus jää kiinni jo käännöksessä. Kun kavennus on oikeasti tarkoitus, tee se eksplisiittisesti ja tarkista arvoalue:

```cpp
#include <utility>  // C++20

int64_t big = loadId();
if (!std::in_range<int32_t>(big))
    throw std::overflow_error("id out of int32 range");
int32_t safe = static_cast<int32_t>(big);
```

Vaihtoehdot: GSL `gsl::narrow<int32_t>(big)` (heittää), oma helper, tai kääntäjävaroitukset `-Wconversion` / `-Wnarrowing`. Tavoite: **virhe näkyy kehityksessä**, ei tuotannossa satunnaisena vääränä datana.

## Käytännössä

Kavennus on yleinen bugi protokollissa ja API-rajapinnoissa. Sama koskee `size_t` → `int`. CI:ssä pidä conversion-varoitukset päällä ja käsittele ne virheinä kriittisessä koodissa.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/in_range)
