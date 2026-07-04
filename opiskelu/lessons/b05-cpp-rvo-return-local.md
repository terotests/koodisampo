# Funktio palauttaa `std::string` paikallisesta muuttujasta. Onko turha kopiointi väistämätön?

## Tilanne

Kehittäjä pelkää kopiota:

```cpp
std::string formatReport() {
    std::string result = build();
    return result;  // "varmasti kopioi?"
}
```

Vanha C++-mentaliteetti: paluu arvolla = kopio. C++11+: **move** ja **RVO** muuttavat kuvaa. Lisäksi `return std::move(result)` voi **estää** optimoinnin.

## Ratkaisu

**RVO/NRVO** eliminoi kopion usein kokonaan:

```cpp
std::string formatReport() {
    std::string result = build();
    return result;  // NRVO — ei kopiota, ei movea
}

// tai suoraan:
return build();
```

Kääntäjä rakentaa `result`:in suoraan kutsujan paikkaan. C++17: copy elision on pakollinen tietyissä palautusmuodoissa.

## Käytännössä

Älä `return std::move(local)`. Luota RVO:hon; profiloi jos epäilet. CppCoreGuidelines F.20. Suuret objektit: palautus arvona on idiomaattinen C++11+.

[Lue lisää](https://en.cppreference.com/w/cpp/language/copy_elision)
