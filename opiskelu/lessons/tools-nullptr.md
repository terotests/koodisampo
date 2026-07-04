# Mikä on turvallisin tapa nollata osoitin C++11:ssä?

## Tilanne

Vanha C++-koodi käyttää `NULL` tai `0` osoittimien nollaukseen:

```cpp
void process(int* p) {
    if (p == NULL) return;
}
```

Ongelma: `NULL` on tyypillisesti `#define NULL 0` — se on **integer**, ei osoitintyyppi. Siksi tämä kääntyy:

```cpp
void f(int);
void f(char*);
f(NULL);  // kutsuu f(int) — yllätys!
```

Overload-resoluutio valitsee väärän funktion hiljaa. Tuotannossa bugi voi näkyä vasta harvinaisessa polussa.

## Ratkaisu

C++11 toi **`nullptr`**: tyypitetyn null pointer -literaalin, joka muunnetaan vain osoitintyypeiksi:

```cpp
int* p = nullptr;
if (p == nullptr) { /* ... */ }

void g(int*);
void g(char*);
g(nullptr);  // kutsuu g(char*) — osoitin overload
```

`nullptr` on turvallisin tapa ilmaista "ei osoitinta". Se toimii kaikissa osoitinkonteksteissa: raaka osoitin, `unique_ptr`, funktio-osoitin.

## Käytännössä

Korvaa `NULL` ja `0` osoitinkonteksteissa refaktoroinnissa. `if (ptr)` on idiomaattinen, mutta `ptr == nullptr` on eksplisiittisempi code reviewissa. CppCoreGuidelines ES.42: "use nullptr rather than 0 or NULL".

[Lue lisää](https://en.cppreference.com/w/cpp/language/nullptr)
