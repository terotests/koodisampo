# Code reviewissa lambda kaappaa ulkoisen muuttujan viittauksella `[&x]` mutta x muuttuu silmukan jälkeen. Mikä on turvallisin korjaus?

## Tilanne

Sovellus rekisteröi callbackeja (UI-napit, `std::async`, Qt-signaalit, ajastimet) ja ajaa ne vasta myöhemmin. Silmukka luo handlerit, mutta kaappaa muuttujan **viittauksella**:

```cpp
struct Item { int id; /* ... */ };
std::vector<Item> items = fetchItems();

std::vector<std::function<void()>> handlers;
int x = 0;

for (auto& item : items) {
    x = item.id;  // x päivittyy jokaisella kierroksella
    handlers.push_back([&x]() { use(x); });  // BUG: kaikki jakavat saman x:n
}

// Myöhemmin — esim. käyttäjä klikkaa nappeja tai worker käynnistyy:
for (auto& h : handlers) {
    h();  // jokainen kutsuu use() samalla arvolla: viimeinen id
}
```

Vertaa oikeaan tapaan silmukkaindeksillä:

```cpp
for (int i = 0; i < 10; ++i) {
    handlers.push_back([i]() { log(i); });  // OK — jokainen lambda saa oman kopion i:stä
}
```

### Miksi `[&x]` rikkoo

Kaappaus **ei tallenna arvoa** — se tallentaa osoitteen samaan `x`-muuttujaan. Kaikki handlerit näkevät saman muuttujan. Kun ne ajetaan silmukan jälkeen, `x` on jo viimeisen iteraation arvo.

Tämä on C++:n vastine JavaScriptin `var`-silmukka-ansaan: callback elää pidempään kuin silmukan hetkellinen tila, mutta viittauskaappaus sitoo sen **elävään** muuttujaan, ei sen arvoon tietyllä hetkellä.

## Ratkaisu

Kaappaa **arvo**, kun lambda elää pidempään kuin muuttujan merkityksellinen elinkaari:

```cpp
for (auto& item : items) {
    x = item.id;
    handlers.push_back([x]() { use(x); });  // kopio kaappaushetkellä — jokaisella eri arvo
}
```

Tai kaappaa suoraan silmukkamuuttuja, jos se on se mitä tarvitset:

```cpp
for (auto item : items) {  // item on jo kopio jokaisesta alkioista
    handlers.push_back([item]() { use(item.id); });
}
```

C++14+: generalized capture on selkeä myös viittaus-silmukassa:

```cpp
for (const auto& item : items) {
    handlers.push_back([id = item.id]() { use(id); });
}
```

### Miksi ei `[=]`?

`[=]` kopioisi tässä tapauksessa myös `x`:n arvokaappauksella — eli bugi korjaantuisi. Silti code reviewissa suositaan **eksplisiittistä** `[x]` tai `[item]`:

| Capture | Mitä tarkoittaa | Miksi reviewissa |
|---------|-----------------|------------------|
| `[x]` | Kopioi vain `x` | Näkee heti mitä kiinnitetään |
| `[=]` | Kopioi kaikki lambda-rungossa käytetyt ulkoiset | Toimii usein, mutta piilottaa intentin; uusi muuttuja lambdaan kaappautuu automaattisesti |
| `[&x]` | Viittaus `x`:ään | OK vain jos lambda kutsutaan ennen kuin `x` muuttuu tai poistuu |

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
