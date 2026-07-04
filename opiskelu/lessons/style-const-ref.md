# Miten vältät turhan `std::string`-kopioinnin funktioparametrissa?

## Tilanne

Funktio ottaa merkkijonon parametrina:

```cpp
void logMessage(std::string msg) {
    logger.write(msg);
}
```

Jokainen kutsu kopioi merkkijonon — vaikka kutsuja välittäisi literaalin `"ready"` tai olemassa olevan `std::string`:in. Hot pathissa (logitus, parsinta, API-kutsut) turhat allokaatiot näkyvät profiloijassa.

Jos parametri on `const std::string&`, literaali `"ready"` aiheuttaa edelleen väliaikaisen `std::string`-objektin sidontaa varten — parempi kuin kopio, mutta ei optimaalinen.

## Ratkaisu

**`const std::string&`** on peruskäytäntö funktioille, jotka **lukivat** merkkijonoa eivätkä omista sitä:

```cpp
void logMessage(const std::string& msg) {
    logger.write(msg);
}
```

Viittaus ei kopioi merkkijonon sisältöä. Funktio sitoutuu siihen, ettei muuta parametria. C++17+: **`std::string_view`** on usein parempi rajapintaan, joka hyväksyy literaalit, `std::string`:it ja `const char*`:t ilman väliaikaista allokaatiota:

```cpp
void logMessage(std::string_view msg) {
    logger.write(msg);
}
```

## Käytännössä

Pass-by-value (`std::string msg`) kannattaa vain, kun funktio **omistaa** kopion (esim. tallentaa jäseneksi). Pienet trivial-tyypit (`int`, `double`) passataan arvona — älä käytä `const int&`.

CppBestPractices Style: "Pass cheap-to-copy types by value, others by const reference (or string_view)."

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md)
