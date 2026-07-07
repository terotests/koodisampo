# Sorttaus comparator palauttaa `<` ja `>` mutta unohtaa yhtäsuuruuden — epävakaa sort. C++20 ratkaisu?

## Tilanne

Custom comparator palauttaa vain `<` ja `>` — kun `a == b`, palautusarvo on epämääräinen tai aina `false`. `std::sort` vaatii **tiukan heikomman järjestyksen** (strict weak ordering). Virheellinen comparator voi jättää järjestyksen epävakaaksi tai antaa UB:n.

Vanha ratkaisu: palauta `-1/0/1` kolmesta arvosta — helppo sekoittaa `bool`-paluuarvoon.

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

`default` generoi `std::strong_ordering` — totaalinen järjestys, jossa yhtäsuuruus on määritelty.

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
