# `auto x = {1, 2, 3};` aiheuttaa yllätyksen — x ei ole std::vector. Mikä tyyppi deduktoidaan?

## Tilanne

Kehittäjä odottaa vektoria:

```cpp
auto x = {1, 2, 3};
// x on std::initializer_list<int>, ei std::vector<int>
```

`x.size()` toimii, mutta `x.push_back(4)` ei käännä. `auto x = {1, 2, 3}` eli copy-list-initialization dedusoi `std::initializer_list<int>` — eri tapaus kuin esim. `auto x{1};`.

## Ratkaisu

Ole eksplisiittinen tyypistä:

```cpp
std::vector<int> x = {1, 2, 3};
// tai
auto x = std::vector{1, 2, 3};  // CTAD
```

Jos tarvitset initializer_listin (esim. overload-resoluutio), kirjoita tyyppi näkyvästi: `std::initializer_list<int> x = {1, 2, 3};`.

## Taustaa

`auto` + brace-init on harvinaisempi tapaus kuin `auto x = 42`. Code reviewissa epäilyttävä `auto x = { ... }` ansaitsee aina tarkistuksen.

[Lue lisää](https://en.cppreference.com/w/cpp/language/auto)
