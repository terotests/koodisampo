# Mikä on turvallinen vaihtoehto omalle C-tyyliselle variadiselle funktiolle?

## Tilanne

Logitusfunktio näyttää C:ltä:

```cpp
void log(const char* fmt, ...) {
    va_list args;
    va_start(args, fmt);
    // format — ei tyyppiturvallisuutta
    va_end(args);
}
```

Variadic C-funktio ei tarkista argumenttien tyyppejä käännösaikana. Väärä formaatti → UB. Oma `log("%s", 42)` kääntyy mutta kaataa. Ylläpito vaikeaa — formaattivirheet löytyvät vasta ajossa.

## Ratkaisu

**Variadic template** tai **`std::format`** (C++20):

```cpp
// C++20
template<typename... Args>
void log(std::format_string<Args...> fmt, Args&&... args) {
    write(std::format(fmt, std::forward<Args>(args)...));
}

log("user={} id={}", name, id);  // tyyppitarkistus käännösaikana

// tai klassinen variadic template (esim. {fmt}-tyyli):
template<typename... Args>
void log(fmt::format_string<Args...> fmt, Args&&... args);
```

Parametrit typitetään — väärä tyyppi on compile error. Ei `va_list`, ei formaattimerkkijonon parsintaa runtime-virheillä.

## Käytännössä

Uudessa koodissa: `std::format` tai `{fmt}`. Legacy `printf`-API: kääri rajattuun moderniin kerrokseen — älä laajenna uusia variadic-C-funktioita. CppCoreGuidelines: type-safe alternatives to C variadics.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/format/format)
