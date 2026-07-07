# Sorttaus comparator palauttaa `true` kun a==b — std::sort käyttäytyy oudosti. Mikä C++20 auttaa?

## Tilanne

Comparator palauttaa `bool`:

```cpp
auto cmp = [](const Item& a, const Item& b) {
    if (a.rank < b.rank) return true;
    if (b.rank < a.rank) return false;
    return true;  // BUG kun a.rank == b.rank
};
```

Kun `a == b`, palautus `true` rikkoo strict weak ordering -vaatimuksen. `std::sort` voi järjestää epävakaasti tai käyttäytyä odottamattomasti.

Huom: sortin comparatorin pitää palauttaa totuusarvo (“onko a ennen b”), ei `std::strong_ordering`.

## Ratkaisu

C++20 kolmisuuntainen vertailu jäsenfunktiona + oletussortti:

```cpp
struct Item {
    int rank;
    auto operator<=>(const Item&) const = default;
};

std::ranges::sort(items);  // käyttää generoitua vertailua
```

Custom bool-comparator:

```cpp
auto cmp = [](const Item& a, const Item& b) {
    return a.rank < b.rank;
};
```

Jos haluat käyttää `<=>`:ää comparatorin sisällä:

```cpp
auto cmp = [](const Item& a, const Item& b) {
    return (a.rank <=> b.rank) < 0;
};
```

Älä palauta suoraan `a.rank <=> b.rank` — se on `std::strong_ordering`, ei `bool`.

## Vanha korjaus

Jos pysyt `bool`-comparatorissa: palauta `false` kun `a == b` (eli `!(a < b) && !(b < a)`).

[Lue lisää](https://en.cppreference.com/w/cpp/language/operator_comparison)
