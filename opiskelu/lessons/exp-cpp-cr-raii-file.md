# Funktio avaa FILE*:n mutta early return ennen fclose:a. Mitä ehdotat code reviewissa?

## Tilanne

Legacy-funktio lukee konfiguraatiota:

```cpp
bool loadConfig(const char* path) {
    FILE* f = fopen(path, "r");
    if (!f) return false;

    if (!parseHeader(f)) return false;  // vuoto — fclose puuttuu
    if (!parseBody(f)) return false;   // vuoto

    fclose(f);
    return true;
}
```

Jokainen early return ennen `fclose`:a vuotaa tiedostokuvauksen. Poikkeus kesken funktion jättää saman tilanteen. Tämä on klassinen resurssivuoto — AddressSanitizer ei aina näytä sitä selvästi, mutta pitkässä ajossa prosessi yltää file descriptor -rajaan.

## Ratkaisu

**RAII** — sidotaan resurssin elinikä scopeen:

```cpp
bool loadConfig(const std::string& path) {
    std::ifstream f(path);
    if (!f) return false;
    if (!parseHeader(f)) return false;
    if (!parseBody(f)) return false;
    return true;
}  // f sulkeutuu automaattisesti
```

Tai C-API:lle custom deleter:

```cpp
using FilePtr = std::unique_ptr<FILE, decltype(&fclose)>;
FilePtr f(fopen(path.c_str(), "r"), &fclose);
if (!f) return false;
```

Destruktori sulkee aina — myös poikkeus- ja return-poluilla.

## Käytännössä

Prefer `std::fstream` / `std::filesystem` uudessa koodissa. CppCoreGuidelines R.1: "Manage resources using RAII." Review-kommentti: "Ei raakaa fopen ilman RAII:ta."

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Re-raii)
