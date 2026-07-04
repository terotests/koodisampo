# Tuotantokoodi käyttää `new Widget()` suoraan. Ensimmäinen turvallisuusparannus?

## Tilanne

Widget luodaan suoraan pinossa:

```cpp
void setup() {
    Widget* w = new Widget(config);
    registry.add(w);
    // ... poikkeus kesken → w vuotaa
}
```

Raaka `new` ei sido elinikää scopeen. Poikkeus ennen `registry.add`:ia vuotaa olion. Jos `registry` ei omista selkeästi, kuka `delete`:aa? Tuotantobugi: muistivuoto hitaasti kasvavassa palvelussa.

Ensimmäinen turvallisuusparannus ei vaadi koko arkkitehtuurin uudelleenkirjoitusta — vain omistusmallin modernisointi.

## Ratkaisu

**`std::make_unique<Widget>(config)`**:

```cpp
void setup() {
    auto w = std::make_unique<Widget>(config);
    registry.add(std::move(w));
}
```

`make_unique` on **exception-safe**: jos konstruktio tai myöhempi kutsu heittää, destruktori vapauttaa jo luodun osan. Yksi allokaatio, ei erillistä `new`/`delete`-paria. Omistus siirtyy selkeästi `unique_ptr`:llä.

## Käytännössä

CppCoreGuidelines R.11: "Avoid naked new/delete." Seuraava askel: varmista että `registry` ottaa `unique_ptr` tai `shared_ptr`, ei raakaa osoitinta. Custom deleter harvoin: `unique_ptr<Widget, Deleter>`.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-make_unique)
