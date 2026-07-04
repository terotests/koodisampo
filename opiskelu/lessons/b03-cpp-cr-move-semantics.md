# Code reviewissa funktio palauttaa suuren `std::vector` arvona ja reviewer ehdottaa `std::move`-paluuta. Miksi?

## Tilanne

Code review kommentti:

```cpp
std::vector<Blob> loadAll() {
    std::vector<Blob> data = readFromDisk();
    return std::move(data);  // "nopeuttaa palautusta"
}
```

Hyvä intention — välttää kopiota. Mutta **`std::move` paikalliseen palautukseen estää NRVO:n**. Kääntäjä olisi voinut eliminoida kopion kokonaan; nyt pakotetaan move, joka voi olla hitaampi kuin optimoitu elision.

## Ratkaisu

**Palauta ilman move:a** — luota RVO:hon:

```cpp
std::vector<Blob> loadAll() {
    std::vector<Blob> data = readFromDisk();
    return data;
}
```

`std::move` paluuarvossa on oikea vain poikkeustapauksissa (esim. palautat funktioparametria `return std::move(param)`).

## Käytännössä

Review-vastaus: "Poista std::move — NRVO hoitaa." CppCoreGuidelines F.21. Jos profileri näyttää kopion, tarkista ensin `-RVO` / copy elision -asetukset ennen move-addictiota.

[Lue lisää](https://en.cppreference.com/w/cpp/language/return)
