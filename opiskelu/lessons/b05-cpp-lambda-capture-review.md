# Code reviewissa lambda kaappaa ulkoisen muuttujan arvolla `[x]` mutta x muuttuu silmukan jälkeen. Mikä on turvallisin korjaus?

## Tilanne

Silmukka luo callbackeja:

```cpp
std::vector<std::function<void()>> handlers;
for (int i = 0; i < 10; ++i) {
    handlers.push_back([i]() { log(i); });  // OK — kopioi i
}

int x = 0;
for (auto& item : items) {
    handlers.push_back([&x]() { use(x); });  // x muuttuu loopissa!
}
```

Viittauskaappaus `[&x]` jakaa saman muuttujan — kun lambda ajetaan myöhemmin, `x` on viimeinen arvo, ei kaappaushetken arvo. Bugi on klassinen async/callback-ansassa.

## Ratkaisu

Kaappaa **arvo**, kun lambda elää pidempään kuin muuttuja:

```cpp
handlers.push_back([x]() { use(x); });  // kopio kaappaushetkellä

// tai eksplisiittinen kopio loop-muuttujasta:
for (auto item : items) {
    handlers.push_back([item]() { use(item); });
}
```

`[&]` vain kun elinkaari on varma (lambda kutsutaan ennen scope-päättymistä). CppCoreGuidelines F.52: "Prefer capturing by reference in lambdas when safe."

## Käytännössä

Review: "Mikä on lambda:n elinikä?" Default `[=]` kopioi; `[&]` vain lyhyelle eliniälle. `mutable` sallii muutoksen kopioituun kaappaukseen.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Res-capture)
