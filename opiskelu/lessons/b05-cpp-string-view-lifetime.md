# Funktio palauttaa `std::string_view` paikallisesta `std::string`:stä. Tuotannossa segfault. Mikä on juurisyy?

## Tilanne

```cpp
std::string_view getName() {
    std::string tmp = fetchName();
    return tmp;  // tmp tuhoutuu — view dangling
}
```

`string_view` on osoitin + pituus — ei omistusta. Paluuarvo viittaa vapautettuun muistiin.

## Ratkaisu

Palauta **`std::string`**:

```cpp
std::string getName() {
    return fetchName();
}
```

Tai caller antaa bufferin (`string& out`). CppCoreGuidelines: string_view ei paluuarvona paikallisesta.

## Käytännössä

Sama bugi kuin `const string&` paikallisesta. Review: "Omista data stringillä."

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rf-string-view)
