# Code reviewissa lambda kaappaa paikallisen muuttujan viittauksella `[&x]` ja ajetaan myöhemmin, kun x on jo tuhoutunut. Turvallisin korjaus?

## Tilanne

Sovellus rekisteröi callbackeja (UI-napit, `std::async`, Qt-signaalit, ajastimet) ja ajaa ne vasta myöhemmin. Funktio luo handlerit, mutta kaappaa paikallisen muuttujan **viittauksella**:

```cpp
struct Item { int id; /* ... */ };

void registerHandlers(EventLoop& loop, const std::vector<Item>& items) {
    for (const auto& item : items) {
        int x = item.id;                    // paikallinen muuttuja
        loop.post([&x]() { use(x); });      // BUG: viittaus x:ään
    }   // x tuhoutuu jokaisen kierroksen lopussa
}

// Myöhemmin event loop ajaa lambdat — x:ää ei enää ole:
// jokainen kutsu lukee roikkuvan viittauksen (UB)
```

Vertaa oikeaan tapaan silmukkaindeksillä:

```cpp
for (int i = 0; i < 10; ++i) {
    loop.post([i]() { log(i); });  // OK — jokainen lambda saa oman kopion i:stä
}
```

### Miksi `[&x]` rikkoo

Viittauskaappaus **ei tallenna arvoa** — se tallentaa viittauksen `x`-muuttujaan. Viittaus ei pidennä muuttujan elinikää: kun lambda ajetaan myöhemmin, `x` on jo tuhoutunut ja viittaus roikkuu. Tulos on undefined behavior — ohjelma voi näyttää "vanhan" arvon, roskaa tai kaatua.

Sama pätee `[&]`-kaappaukseen: se kaappaa kaiken viittauksella eikä pidä mitään elossa.

## Ratkaisu

Kaappaa **arvo**, kun lambda elää pidempään kuin muuttujan merkityksellinen elinkaari:

```cpp
for (const auto& item : items) {
    int x = item.id;
    loop.post([x]() { use(x); });  // kopio kaappaushetkellä — elää lambdan mukana
}
```

Tai kaappaa suoraan silmukkamuuttuja, jos se on se mitä tarvitset:

```cpp
for (auto item : items) {  // item on jo kopio kustakin alkiosta
    loop.post([item]() { use(item.id); });
}
```

C++14+: generalized capture on selkeä myös viittaus-silmukassa:

```cpp
for (const auto& item : items) {
    loop.post([id = item.id]() { use(id); });
}
```

### Miksi ei `[=]`?

`[=]` kopioisi tässä tapauksessa myös `x`:n arvokaappauksella — eli bugi korjaantuisi. Silti code reviewissa suositaan **eksplisiittistä** `[x]` tai `[item]`:

| Capture | Mitä tarkoittaa | Miksi reviewissa |
|---------|-----------------|------------------|
| `[x]` | Kopioi vain `x` | Näkee heti mitä kiinnitetään |
| `[=]` | Kopioi kaikki lambda-rungossa käytetyt ulkoiset | Toimii usein, mutta piilottaa intentin; uusi muuttuja lambdaan kaappautuu automaattisesti |
| `[&x]` | Viittaus `x`:ään | OK vain jos lambda kutsutaan ennen kuin `x` tuhoutuu |

`[=]` ei ole "aina turvallisin": se kaappaa `this`-osoittimen jäsenfunktioissa (ei kopioi objektia), eikä se poista elinkaari-ongelmia kaikissa tilanteissa.

### Milloin `[&]` on OK

Viittauskaappaus on oikein, kun lambda **kutsutaan heti** tai varmasti ennen scope-päättymistä:

```cpp
std::for_each(items.begin(), items.end(), [&sum](const Item& item) {
    sum += item.id;  // sum elää koko algoritmin ajan; lambda ei tallennu myöhempää ajoa varten
});
```

CppCoreGuidelines F.52: "Prefer capturing by reference in lambdas when safe."

## Käytännössä

Code review -kysymys: **"Mikä on lambda:n elinikä?"**

- Tallennettu callback (`std::function`, Qt `connect`, thread pool) → kopioi arvo `[x]` / `[item]`
- Paikallinen algoritmi, joka kutsuu lambdan heti → `[&]` voi olla tehokas ja turvallinen
- `mutable` sallii muutoksen kopioituun kaappaukseen lambda-rungossa (ei muuta ulkoista `x`:ää)

Sama ansas Qt:ssa: `connect(..., [&]() { ... })` tallennettuun slottiin voi dangling-viitata paikalliseen muuttujaan.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Res-capture)
