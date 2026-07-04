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

`make_optional` pienille tyypeille. `in_place_type` monimutkaisille. CppCoreGuidelines: emplace when expensive.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/in_place)
