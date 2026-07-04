# Miksi `std::vector<int> v{1, 2, 3}` on turvallisempi kuin `vector<int>(3)` kun tarkoitus on kolme arvoa?

## Tilanne

Kehittäjä alustaa vektorin:

```cpp
std::vector<int> v(3);      // kolme nollaa — koko 3
std::vector<int> w{3};      // yksi alkio, arvo 3!
std::vector<int> values{1, 2, 3};  // kolme alkiota
```

Sulkeet `()` ja `{}` eivät tee samaa asiaa. **Most vexing parse** -ongelma: `Widget w();` voi tulkita funktioksi. Lisäksi `{3.9}` `int`-vektoriin aiheuttaa narrowing-varoituksen — `(3.9)` hiljaa truncaa.

Kun tarkoitus on alustaa kolmella arvolla `{1, 2, 3}`, väärä syntaksi `(3)` luo kolme nollaa — logiikka näyttää toimivan testeissä mutta data on väärä.

## Ratkaisu

**Uniform initialization** `{}` ilmaisee alustuslistan:

```cpp
std::vector<int> values{1, 2, 3};   // kolme arvoa
std::vector<int> zeros(3);            // kolme nollaa — eri tarkoitus
std::vector<int> single{3};           // yksi alkio

int x{42};        // selkeä alustus
int y = 3.9;      // narrowing mahdollinen
int z{3.9};       // narrowing — kääntäjävirhe (tai varoitus)
```

Sulkeet `{}` estävät kapeat muunnokset ja tekevet intentista näkyvän: lista arvoista vs koko.

## Käytännössä

CppBestPractices Style: prefer `{}` alustukseen. Poikkeus: `auto x = {1,2,3}` → `initializer_list`, ei vector — ole eksplitiittinen `std::vector<int>{1,2,3}`. Template-konstruktoreissa lue cppreference: `(n, val)` vs `{a,b,c}`.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md)
