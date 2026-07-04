# `auto x = {1, 2, 3};` aiheuttaa yllätyksen — x ei ole std::vector. Mikä tyyppi deduktoidaan?

## Tilanne

Kehittäjä odottaa vektoria:

```cpp
auto x = {1, 2, 3};
// x on std::initializer_list<int>, ei std::vector<int>
```

`x.size()` toimii, mutta `x.push_back(4)` ei käännä. Brace-init `auto`:n kanssa deduktoidaan aina `std::initializer_list<T>` — tämä on standardin sääntö, ei kääntäjäbugi.

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
