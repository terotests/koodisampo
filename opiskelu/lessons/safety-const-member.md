# Miten `const` jäsenmuuttujat auttavat turvallisuudessa?

## Tilanne

Luokka mallintaa muuttumattomaa tunnistetta:

```cpp
class UserId {
public:
    UserId(int id) : id_(id) {}
    void refresh() { id_ = 0; }  // vahingossa — tunniste ei saa muuttua
private:
    int id_;
};
```

Ilman `const`-jäsentä mikä tahansa metodi voi muuttaa tilaa — myös helper, joka "väliaikaisesti nollaa" arvon. Code review ei aina huomaa yksittäistä sijoituslauseketta 200 rivin luokassa. Immuuttinen domain-malli (ID, hash, versio) rikkoutuu hiljaa.

## Ratkaisu

Merkitse muuttumattomat jäsenet **`const`**:

```cpp
class UserId {
public:
    explicit UserId(int id) : id_(id) {}
    int value() const { return id_; }
private:
    const int id_;
};
```

Kääntäjä **estää** `id_ = ...` kaikissa metodeissa. Intentio on API:ssa: "tätä ei saa muuttaa olion elinkaaren aikana". Muu tila (cache, laskuri) jää ei-const-jäseneksi erikseen.

## Käytännössä

Käytä `const` jäsenille, jotka alustetaan konstruktorissa eivätkä koskaan muutu. `mutable` vain poikkeustapauksissa (esim. mutex lazy-cachessa). Yhdistä const-metodeihin: `int value() const`. CppCoreGuidelines: const on puolustuslinja — virheet estetään käännösaikana.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md)
