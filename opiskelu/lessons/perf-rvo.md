# Funktio palauttaa suuren `std::vector` arvona. Mikä usein välttää kopion C++17:ssä?

## Tilanne

Data loader:

```cpp
std::vector<Record> loadRecords() {
    std::vector<Record> result;
    // ... täytä result ...
    return result;  // "varmasti kallis kopio?"
}
```

Suuren vektorin palautus näyttää kalliilta — kehittäjä lisää `std::move` tai `shared_ptr` turhaan. C++17 copy elision -säännöt ovat tiukentuneet.

## Ratkaisu

**RVO/NRVO (Return Value Optimization)** — kääntäjä eliminoi kopion:

```cpp
return result;  // NRVO — objekti rakennetaan suoraan kutsujan paikkaan
```

C++17: pronominiaalinen elision on **pakollinen** monissa tapauksissa. Ei tarvetta `std::move`:lle paikallisesta muuttujasta.

## Käytännössä

Älä `return std::move(result)`. Profiloi — optimoitu build näyttää eliminoituna kopiona. CppCoreGuidelines F.20. Suuret kontit: palautus arvona on idiomaattinen.

[Lue lisää](https://en.cppreference.com/w/cpp/language/copy_elision)
