# Koodi tekee `std::optional<BigType> o; o = BigType(args);` — kaksi konstruktiota. Tehokkaampi tapa?

## Tilanne

```cpp
std::optional<Widget> o;
o = Widget(cfg);  // default construct + move assign
```

Turha tyhjä optional ensin — kaksi vaihetta.

## Ratkaisu

**`emplace`** / **`in_place`**:

```cpp
std::optional<Widget> o;
o.emplace(cfg);  // construct in place

// tai konstruktorissa:
std::optional<Widget> o{std::in_place, cfg};
```

Yksi konstruktio suoraan optionalin muistiin.

## Käytännössä

`make_optional` pienille tyypeille. Huomaa: `std::optional` käyttää tagia `std::in_place` (`in_place_t`) — `std::in_place_type` on eri tyyppi, tarkoitettu `std::variant`:lle ja `std::any`:lle valitsemaan alternatiivin tyyppi. CppCoreGuidelines: emplace when expensive.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/in_place)
