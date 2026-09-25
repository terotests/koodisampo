# API palauttaa `nullptr` kun arvoa ei löydy — kutsujat unohtavat tarkistaa. Miten ilmaiset puuttuvan arvon tyypitetysti?

## Tilanne

```cpp
User* findUser(int id) {
    auto it = users.find(id);
    return it == users.end() ? nullptr : &it->second;
}
process(findUser(42)->name);  // crash jos null
```

Null pointer on helppo unohtaa tarkistaa — erillinen virhe vs validi data ei erotu tyypistä.

## Ratkaisu

**`std::optional<User>`** (C++17). Huom: `std::optional<User&>` ei ole sallittu ennen C++26:ta — viittauksille käytä esim. `std::optional<std::reference_wrapper<User>>` tai palauta arvo:

```cpp
std::optional<User> findUser(int id) {
    auto it = users.find(id);
    if (it == users.end()) return std::nullopt;
    return it->second;
}

if (auto u = findUser(42)) {
    process(u->name);
}
```

Ei magic sentinel — tyhjä tapaus näkyy jo tyypissä. Optional ei kuitenkaan pakota tarkistusta: `*opt` tyhjälle optionalille on UB, joten käytä `if (opt)`, `value_or()` tai `value()` (heittää `bad_optional_access`).

## Käytännössä

C++23 `expected` virhekoodeille. Review: korvaa nullable pointer optionalilla. CppCoreGuidelines I.11.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/optional)
