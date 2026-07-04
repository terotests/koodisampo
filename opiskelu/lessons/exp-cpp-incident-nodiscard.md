# Tuotantoon meni buildi jossa `parseConfig()` palautusarvo ignoroitiin — virheellinen config jäi käyttöön. Miten estät toistumisen?

## Tilanne

```cpp
bool parseConfig(const std::string& path);

void startup() {
    parseConfig("app.conf");  // paluuarvo ignoroitu
    runWithDefaults();        // ajetaan väärällä configilla
}
```

Kutsuja unohtaa tarkistaa onnistumisen — bugi näkyy vasta tuotannossa kun asetus puuttuu. Bool-paluuarvo on helppo ignoorata vahingossa.

## Ratkaisu

`[[nodiscard]]` pakottaa kääntäjän varoittamaan:

```cpp
[[nodiscard]] bool parseConfig(const std::string& path);

startup();
parseConfig("app.conf");  // varoitus: result discarded
```

C++17 attribuutti. Voi käyttää myös `[[nodiscard]]`-structia tai enum class -virhekoodeja. Parempi API: `std::expected<Config, Error>` — virheellinen tila ei käännä ilman käsittelyä.

## Käytännössä

Merkitse `nodiscard` kaikille funktioille, joiden paluuarvo on aina tarkistettava: parse, open, lock, allocate.

[Lue lisää](https://en.cppreference.com/w/cpp/language/attributes/nodiscard)
