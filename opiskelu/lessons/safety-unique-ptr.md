# Mikä korvaa turvallisesti `new`/`delete`-parin yksittäiselle omistajalle?

## Tilanne

Tuotantokoodi hallitsee resurssin raakalla osoittimella:

```cpp
Database* openDb(const Config& cfg) {
    auto* db = new Database(cfg);
    if (!db->connect()) {
        delete db;  // helposti unohtuu toisessa return-polussa
        return nullptr;
    }
    return db;
}
```

Jokainen `return`, poikkeus tai varhainen poistuminen vaatii manuaalisen `delete`:n. Yksi unohtunut polku → memory leak. Kaksi `delete` → double free. Tämä on klassinen C-tyylinen omistusongelma.

## Ratkaisu

**`std::unique_ptr<T>`** ilmaisee yksittäisen omistajan. Destruktori vapauttaa automaattisesti — myös poikkeuspolulla ([RAII](/docs/lyhenteet#raii)):

```cpp
std::unique_ptr<Database> openDb(const Config& cfg) {
    auto db = std::make_unique<Database>(cfg);
    if (!db->connect()) return nullptr;
    return db;
}
```

`make_unique<T>(args)` on suositeltu tapa luoda — exception-safe, ei erillistä `new`:ia. `unique_ptr` ei kopioitu — siirretään `std::move`:lla tai palautetaan arvona.

## Käytännössä

Kun tarvitset jaetun omistuksen, käytä `std::shared_ptr` + `make_shared`. Custom deleter (FILE*, socket): `unique_ptr<FILE, decltype(&fclose)>`. CppCoreGuidelines R.11: "Avoid calling `new` and `delete` explicitly."

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rf-unique_ptr)
