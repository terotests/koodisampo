# Legacy-moduuli palauttaa `new`-allokoituja olioita kutsujalle. Refaktorointi?

## Tilanne

```cpp
Database* openDb() {
    return new Database();  // kutsujan vastuu delete
}
```

Omistus epäselvä — kuka delete? Poikkeus ennen assignia → leak. Moderni koodi ei käytä raw owning pointereita.

## Ratkaisu

**`std::unique_ptr<Database>`**:

```cpp
std::unique_ptr<Database> openDb() {
    return std::make_unique<Database>();
}
```

Omistus siirtyy selkeästi. RAII automaattisesti. API dokumentoi: "unique ownership."

## Käytännössä

Refaktoroi vaiheittain — wrapper `unique_ptr` vanhan API:n päälle. CppCoreGuidelines R.11. Review: "Ei owning raw pointer."

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-unique_ptr)
