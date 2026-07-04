# Miksi `using StringMap = std::map<std::string, int>` on usein parempi kuin typedef?

## Tilanne

Koodipohjassa aliasit määritellään sekä `typedef`:lla että `using`:illa:

```cpp
typedef std::map<std::string, int> StringMap;
typedef std::unique_ptr<Widget> WidgetPtr;

template<typename T>
typedef std::vector<T> Vec;  // VIRHE — typedef ei tue template-aliasia näin
```

Vanha `typedef` syntaksi lukee "oikealta vasemmalle" — pitkissä tyypeissä vaikea erottaa mikä on alias ja mikä alkuperäinen tyyppi. Template-aliasit `typedef`:lla vaativat kömpelön workaroundin (`vector_int` jokaiselle instanssille erikseen).

## Ratkaisu

**`using`-alias** on moderni, luettava syntaksi:

```cpp
using StringMap = std::map<std::string, int>;
using WidgetPtr = std::unique_ptr<Widget>;

template<typename T>
using Vec = std::vector<T>;  // template-alias suoraan
```

Sama semantiikka kuin typedef, mutta template-tuki ja luettavuus parempi — erityisesti pointterit ja funktio-osoittimet: `using Callback = void(*)(int);` vs `typedef void (*Callback)(int);`.

## Käytännössä

Uudessa koodissa prefer `using`. Vanhoja typedefejä ei tarvitse massamuuttaa, mutta uudet aliasit kirjoitetaan `using`:illa. CppCoreGuidelines T.143: "Use using for alias templates." Vältä alias-spamia — yksi selkeä nimi monimutkaiselle tyypille riittää.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#t-alias)
