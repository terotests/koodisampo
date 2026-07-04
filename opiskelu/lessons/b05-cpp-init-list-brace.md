# Code review: `std::vector<int> v(10, 1)` vs `std::vector<int> v{10, 1}`. Mitä jälkimmäinen tekee?

## Tilanne

Code reviewissa näkyy:

```cpp
std::vector<int> v(10, 1);   // 10 alkiota, arvo 1
std::vector<int> w{10, 1};   // kaksi alkiota: 10 ja 1
```

Sulkeet `()` ja `{}` eivät tee samaa. `(10, 1)` on konstruktori "10 kappaletta arvolla 1". `{10, 1}` on **initializer_list** — kaksi elementtiä. Väärä syntaksi tuottaa väärän datan ilman kääntäjävirhettä.

## Ratkaisu

Ymmärrä uniform initialization:

```cpp
std::vector<int> tenOnes(10, 1);     // [1,1,1,...,1] 10 kpl
std::vector<int> twoValues{10, 1};   // [10, 1]

std::vector<int> emptyThen{1, 2, 3}; // kolme arvoa
std::vector<int> threeZeros(3);      // kolme nollaa
```

Review-kommentti: "Tarkoitusko 10 kopiota vai kaksi arvoa? Käytä selkeää syntaksia."

## Käytännössä

CppBestPractices: `{}` alustuslistalle, `()` koko+oletusarvo -konstruktorille. `auto x = {1,2}` → `initializer_list` — eri kuin vector. Dokumentoi tarkoitus kommentilla epäselvissä tapauksissa.

[Lue lisää](https://en.cppreference.com/w/cpp/language/list_initialization)
