# API palauttaa `nullptr` kun arvoa ei löydy — kutsujat unohtavat tarkistuksen. Parempi tyyppi?

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

**`std::optional<User>`** (tai `optional<User&>` pattern):

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

Ei magic sentinel — tyhjä optional on eksplisiittinen.

## Käytännössä

C++23 `expected` virhekoodeille. Review: korvaa nullable pointer optionalilla. CppCoreGuidelines I.11.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/optional)
