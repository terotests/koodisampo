# Mitä `auto` tekee modernissa C++:ssa?

## Tilanne

Modernissa C++-koodissa näet usein:

```cpp
auto it = map.find(key);
auto result = compute();
```

Kehittäjä, joka tulee vanhasta C++:sta tai Java/C#-maailmasta, saattaa luulla `auto`:n tarkoittavan "dynaamista tyyppiä" kuten `var`/`dynamic`. Se johtaa väärään refaktorointiin — esimerkiksi API:n paluutyyppiä muutetaan turhaan kaikkialla, vaikka `auto` seuraisi muutosta automaattisesti.

Toinen yleinen sudenkuoppa: `auto x = {1, 2, 3};` deduktoidaan `std::initializer_list<int>`:ksi, ei `std::vector<int>`:ksi. Ilman ymmärrystä deduktiosta debuggaus hidastuu.

## Ratkaisu

`auto` on **tyyppipäättely** (type deduction): kääntäjä päättelee tyypin alustuslausekkeesta käännösaikana. Tyyppi on staattinen — sama kuin kirjoittaisit sen eksplisiittisesti.

```cpp
auto count = static_cast<size_t>(vec.size());  // size_t
const auto& name = user.displayName();       // const std::string&
auto widget = std::make_unique<Widget>();    // std::unique_ptr<Widget>
```

`auto` ei hidasta runtimea eikä poista tyyppiturvaa. Se lyhentää toistuvia pitkiä tyyppejä ja pitää koodin refaktoroitavana, kun funktion paluutyyppi muuttuu.

## Käytännössä

Käytä `auto`, kun tyyppi on ilmeinen oikealta puolelta (iterator, `make_unique`, paluuarvo). Vältä `auto` lyhyissä laskentafunktioissa, joissa eksplisiittinen `int`/`double` parantaa luettavuutta.

CppCoreGuidelines ES.11: "Use auto to avoid redundant repetition of type names." Brace-init `auto`:n kanssa: muista `initializer_list`-sääntö — käytä `std::vector<int>{1,2,3}` jos tarkoitus on vektori.

[Lue lisää](https://en.cppreference.com/w/cpp/language/auto)
