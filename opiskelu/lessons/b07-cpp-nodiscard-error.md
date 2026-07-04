# Kutsuja ignooraa bool validate() paluuarvon — bugi tuotannossa. Miten pakota tarkistus?

## Tilanne

Validointi:

```cpp
bool validate(const Config& cfg) {
    return cfg.port > 0 && !cfg.host.empty();
}

void setup(const Config& cfg) {
    validate(cfg);  // paluuarvo ignoroitu — jatkaa virheellisellä cfg:llä
    startServer(cfg);
}
```

`bool` paluuarvo on helppo unohtaa — kääntäjä ei varoita. Tuotannossa palvelin käynnistyy virheellisellä konfiguraatiolla.

## Ratkaisu

**`[[nodiscard]]`** pakottaa kääntäjän varoittamaan:

```cpp
[[nodiscard]] bool validate(const Config& cfg);

void setup(const Config& cfg) {
    if (!validate(cfg)) throw std::invalid_argument("bad config");
}
```

C++17 attribuutti: ignoroitu paluuarvo → `-Wunused-result` / error (riippuen flagista). Vakavammissa tapauksissa heitä poikkeus suoraan validointifunktiosta.

## Käytännössä

Merkitse `[[nodiscard]]` kaikille funktioille, joiden paluuarvo **täytyy** tarkistaa: `validate`, `try_lock`, `parse`, error-koodit. CppCoreGuidelines F.6.

[Lue lisää](https://en.cppreference.com/w/cpp/language/attributes/nodiscard)
