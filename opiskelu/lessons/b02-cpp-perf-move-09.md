# Iso `std::vector<int>` palautetaan funktiosta — reviewer ehdottaa `std::move(returnVec)`. Onko se oikein?

## Tilanne

Funktio palauttaa vektorin:

```cpp
std::vector<int> buildData() {
    std::vector<int> result = compute();
    return std::move(result);  // reviewer ehdottaa tätä
}
```

Luulo: `move` nopeuttaa palautusta. Todellisuus: **`return std::move(local)` estää usein NRVO:n** (Named Return Value Optimization). Kääntäjä olisi voinut rakentaa `result` suoraan kutsujan stackiin — `move` pakottaa move-operaation ja voi hidastaa.

## Ratkaisu

Palauta **suoraan ilman move:a**:

```cpp
std::vector<int> buildData() {
    std::vector<int> result = compute();
    return result;  // NRVO/RVO — kääntäjä eliminoi kopion
}
```

C++17: pronominiaalinen palautus (RVO) on **pakollinen** monissa tapauksissa. `std::move` paluuarvossa paikallisesta muuttujasta on anti-pattern.

## Käytännössä

`return std::move(x)` vain kun palautat **parametria** tai jäsentä, ei paikallista. CppCoreGuidelines F.20, F.21. Profiloi — NRVO näkyy disassemblyssä eliminoituna kopiona.

[Lue lisää](https://en.cppreference.com/w/cpp/language/copy_elision)
