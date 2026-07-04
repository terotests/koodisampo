# Code reviewissa funktio luo `new Database()` ja palauttaa raakaa osoitinta. Mikä moderni omistusmalli estää vuodon poikkeuspolulla?

## Tilanne

Tehdasfunktio avaa tietokantayhteyden:

```cpp
Database* openConnection(const Config& cfg) {
    auto* db = new Database(cfg);
    if (!db->connect()) {
        delete db;
        return nullptr;
    }
    if (!db->migrate()) {
        return nullptr;  // BUG — delete puuttuu
    }
    return db;
}
```

Raaka `new` + osoitin palautus vaatii **jokaisen** polun huolehtivan `delete`:stä. Poikkeus `connect()`- tai `migrate()`-polussa vuotaa olion. Kutsuja saa osoittimen — omistajuus epäselvä: kuka delete?

## Ratkaisu

**`std::unique_ptr<Database>`** — RAII vapauttaa automaattisesti:

```cpp
std::unique_ptr<Database> openConnection(const Config& cfg) {
    auto db = std::make_unique<Database>(cfg);
    if (!db->connect()) return nullptr;
    if (!db->migrate()) return nullptr;
    return db;
}
```

Poikkeus missä tahansa → destruktori vapauttaa. Omistajuus siirtyy selkeästi `unique_ptr`:llä kutsujalle. Ei `delete` manuaalisesti.

## Käytännössä

CppCoreGuidelines R.11, R.20: älä palauta raakaa `new`:ia. Jos jaettu omistus tarvitaan, `shared_ptr` + `make_shared`. Review: "Kääri unique_ptr:ään ennen mergeä."

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-raii)
