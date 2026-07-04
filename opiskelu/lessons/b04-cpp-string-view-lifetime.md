# Funktio palauttaa `std::string_view` joka viittaa paikalliseen std::stringiin. Tuotannossa satunnainen data. Mikä on oikea korjaus?

## Tilanne

```cpp
std::string_view makeLabel(int id) {
    std::string s = "item-" + std::to_string(id);
    return s;  // dangling — s tuhoutuu
}
```

Sama kuin dangling reference — `string_view` ei omista dataa.

## Ratkaisu

Palauta **`std::string`** (omistus) tai pidä lähde elossa:

```cpp
std::string makeLabel(int id) {
    return "item-" + std::to_string(id);  // RVO
}
```

Tai caller omistaa bufferin — `string_view` vain parametrina, ei paluuarvona paikallisesta.

## Käytännössä

CppCoreGuidelines F.43: don't return string_view to local string. Review: "Palauta string tai dokumentoi elinikä."

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rf-return-ref)
