# Structin käsin kirjoitetut <, == ja > ovat keskenään ristiriidassa, ja std::sort käyttäytyy oudosti. C++20-ratkaisu?

## Tilanne

Structille on kirjoitettu käsin `operator<`, `operator==` ja `operator>`, mutta ne vertailevat eri kenttiä tai eri järjestyksessä — esimerkiksi `a < b` ja `b < a` voivat olla molemmat tosia. `std::sort` vaatii **tiukan heikon järjestyksen** (strict weak ordering); ristiriitainen vertailu antaa väärän järjestyksen tai jopa UB:n (lukua rajojen yli).

Kuusi käsin kirjoitettua operaattoria on helppo saada epäjohdonmukaisiksi, kun structiin lisätään kenttiä. Myöskään `std::stable_sort` ei auta — se vaatii saman johdonmukaisuuden.

## Ratkaisu

C++20 **kolmisuuntainen vertailu** jäsenfunktiona (`operator<=>`, spaceship):

```cpp
struct Item {
    int key;
    std::string name;

    auto operator<=>(const Item&) const = default;
};

std::ranges::sort(items);
```

`default` vertailee jäsenet määrittelyjärjestyksessä ja generoi niistä johdonmukaiset `<`, `<=`, `>`, `>=` (ja defaultattu `<=>` tuo mukanaan myös `==`:n). Tässä paluutyyppi on `std::strong_ordering` — totaalinen järjestys, jossa yhtäsuuruus on määritelty.

Custom bool-comparator (tarvittaessa):

```cpp
auto cmp = [](const Item& a, const Item& b) {
    return a.key < b.key;
};
```

Tai `<=>` comparatorin sisällä:

```cpp
auto cmp = [](const Item& a, const Item& b) {
    return (a.key <=> b.key) < 0;
};
```

## Huomio

`return a.key <=> b.key` ei kelpaa suoraan `std::sort`-comparatoriksi — paluuarvon pitää olla `bool`. Jos käytät vanhaa `bool`-comparatoria, palauta `false` kun `a == b` (ei `true`).

[Lue lisää](https://en.cppreference.com/w/cpp/language/operator_comparison)
