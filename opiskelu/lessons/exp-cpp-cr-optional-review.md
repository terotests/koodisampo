# Code reviewissa kollega palauttaa `T*` joka voi olla null. Mikä moderni tyyppi tekee tyhjän arvon eksplisiittiseksi ilman raw-osoitinta?

## Tilanne

Lookup API:

```cpp
User* findUser(int id) {
    auto it = users.find(id);
    if (it == users.end()) return nullptr;
    return &it->second;
}

void process(int id) {
    User* u = findUser(id);
    u->activate();  // null → crash
}
```

Raw pointer + null on C-idiomi — kutsuja voi unohtaa tarkistuksen. `nullptr` on parempi kuin magic sentinel, mutta omistus ja tyhjä arvo eivät ole tyypin osa.

## Ratkaisu

**`std::optional<User>`** (tai `optional<User&>` / `reference_wrapper`):

```cpp
std::optional<User> findUser(int id) {
    auto it = users.find(id);
    if (it == users.end()) return std::nullopt;
    return it->second;
}

if (auto u = findUser(id)) {
    u->activate();
}
```

Tyhjä optional on eksplisiittinen — ei osoitinta, ei omistussekoilua (palauta kopio tai `optional` + indeksi).

## Käytännössä

Review: "Korvaa T* optionalilla tai reference wrapperilla." CppCoreGuidelines I.11: never transfer ownership raw pointerilla. `optional` lookup-tuloksille.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Res-type)
