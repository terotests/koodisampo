# Luokalle tarvitaan ==, !=, <, <=, >, >= — paljon boilerplatea. C++20 lyhenne?

## Tilanne

Ennen C++20:

```cpp
bool operator==(const Point& o) const { return x == o.x && y == o.y; }
bool operator!=(const Point& o) const { return !(*this == o); }
bool operator<(const Point& o) const { /* ... */ }
// ... vielä 3 operaattoria
```

Paljon toistuvaa koodia. `<=>` yhdistää vertailut.

## Ratkaisu

**`operator<=>` default** (C++20):

```cpp
struct Point {
    int x, y;
    auto operator<=>(const Point&) const = default;
};
```

Generoi `<=>` ja derived `==`, `<`, jne. (strong/partial ordering tyypistä riippuen). `std::ranges::sort` käyttää generoitua vertailua — comparatorissa palauta `bool`, ei suoraan `<=>`-tulosta.

## Käytännössä

`= default` kun jäsenet ovat comparable. Custom `<=>` kun tarvitset domain-järjestyksen. CppCoreGuidelines C.86.

[Lue lisää](https://en.cppreference.com/w/cpp/language/operator_comparison#Three-way_comparison)
