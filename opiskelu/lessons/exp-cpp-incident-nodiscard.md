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

`[[nodiscard]]` saa kääntäjän varoittamaan, jos paluuarvo ohitetaan:

```cpp
[[nodiscard]] bool parseConfig(const std::string& path);

startup();
parseConfig("app.conf");  // varoitus: result discarded
```

C++17-attribuutti. Se tuottaa **varoituksen**, ei käännösvirhettä — CI:ssä `-Werror` (tai `/WX`) tekee siitä virheen. Voi käyttää myös `[[nodiscard]]`-structia tai enum class -virhekoodeja. Parempi API: `std::expected<Config, Error>` (C++23) — virhe kulkee tyypissä, ja `[[nodiscard]]` varoittaa, jos tulos ohitetaan.

## Käytännössä

Merkitse `nodiscard` kaikille funktioille, joiden paluuarvo on aina tarkistettava: parse, open, lock, allocate.

[Lue lisää](https://en.cppreference.com/w/cpp/language/attributes/nodiscard)
