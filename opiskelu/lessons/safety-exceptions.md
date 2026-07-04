# Miksi poikkeus voi olla parempi kuin virhekoodi joka voidaan ignoroida?

## Tilanne

API palauttaa virhekoodin:

```cpp
int parseConfig(const char* path, Config& out) {
    if (!fileExists(path)) return -1;
    if (!parse(out)) return -2;
    return 0;
}

// kutsuja:
Config cfg;
parseConfig(path, cfg);  // paluuarvo ignoroitu — bugi
```

C-tyylinen `int`/`bool`/`optional`-virhe on **helppo ohittaa**. Tuotannossa konfiguraatio jää oletusarvoihin ja vika paljastuu vasta myöhemmin. Code review ei pakota tarkistamaan paluuarvoa.

## Ratkaisu

**Poikkeus** keskeyttää normaalin kontrollivuon — sitä ei voi "unohtaa" hiljaa samalla tavalla:

```cpp
Config parseConfig(const std::string& path) {
    if (!fileExists(path))
        throw std::runtime_error("config missing: " + path);
    Config cfg;
    if (!parseFile(path, cfg))
        throw std::runtime_error("config parse failed: " + path);
    return cfg;
}

auto cfg = parseConfig(path);  // poikkeus leviää — ei hiljaista epäonnistumista
```

Virheet, joita kutsujan **täytyy** käsitellä, voidaan ilmaista `std::expected` (C++23) tai palautustyypillä — mutta silloinkin `[[nodiscard]]` pakottaa huomion.

## Käytännössä

Poikkeukset sopivat poikkeuksellisiin tiloihin (ei hot loopiin). Rajapinnoissa, joissa virhe on normaali (`findUser` → ei löydy): `std::optional`. CppCoreGuidelines E.2: "Throw an exception to signal that a function can't perform its designated task."

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md)
