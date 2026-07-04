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

## Ratkaisu

C++20 kolmisuuntainen vertailu antaa selkeän yhtäsuuruuden:

```cpp
struct Item {
    int rank;
    auto operator<=>(const Item&) const = default;
};

std::ranges::sort(items);  // käyttää <=>
```

Tai comparatorissa: `return a.rank <=> b.rank;` → `std::strong_ordering`. Kun arvot ovat yhtäsuuret, `<=>` palauttaa `equal` — ei epämääräistä `true`/`false`-sekoilua.

## Vanha korjaus

Jos pysyt `bool`-comparatorissa: palauta `false` kun `a == b` (eli `!(a < b) && !(b < a)`).

[Lue lisää](https://en.cppreference.com/w/cpp/language/operator_comparison)
