# Switch-case putoaa vahingossa seuraavaan caseen — bugi löytyy vasta tuotannosta. Moderni dokumentointi?

## Tilanne

```cpp
switch (state) {
    case Idle:
        prepare();
    case Running:   // putoaa Idlestä ilman break
        execute();
        break;
}
```

Puuttuva `break` on yleinen kirjoitusvirhe. Toisessa casessa putoaminen on tarkoituksellista — mutta se ei näy lukijalle.

## Ratkaisu

C++17 `[[fallthrough]]` dokumentoi tarkoituksellisen putoamisen:

```cpp
switch (state) {
    case Idle:
        prepare();
        [[fallthrough]];
    case Running:
        execute();
        break;
}
```

Jos putoaminen **ei** ole tarkoitus → lisää `break`. Clang/GCC `-Wimplicit-fallthrough` varoittaa puuttuvasta attribuutista tai breakistä.

## Käytännössä

Refaktoroi monimutkaiset switchit joskus `if`/`enum class` + funktiotaulukko. Fallthrough-dokumentaatio on pakollinen käytäntö tiimissä, joka sallii putoamisen.

[Lue lisää](https://en.cppreference.com/w/cpp/language/attributes/fallthrough)
