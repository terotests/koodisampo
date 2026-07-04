# Code review ehdottaa `std::move` jokaiselle parametrille funktiossa. Milloin move on järkevä?

## Tilanne

```cpp
void handle(std::string name, std::vector<int> data) {
    std::move(name);  // tulos heitetään pois — ei tee mitään!
    store(std::move(name));
}
```

`std::move` ilman käyttöä on tyhjä. Move jokaiselle parametrille "varmuuden vuoksi" on virhe.

## Ratkaisu

Move **kun lähde ei enää tarvita**:

```cpp
void handle(std::string name, std::vector<int> data) {
    store(std::move(name));   // name kuolee tässä
    process(std::move(data)); // viimeinen käyttö
}
```

Pass-by-value + move sisään = "sink" pattern. Älä move parametria, jota luetaan myöhemmin.

## Käytännössä

Review: "Move vain viimeisessä käytössä." CppCoreGuidelines F.18. `[[maybe_unused]]` ei korvaa oikeaa movea.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/move)
