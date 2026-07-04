# Jaettu kirjasto muuttuu usein — headerin muutos pakottaa koko projektin uudelleenkäännön. Miten?

## Tilanne

```cpp
// Widget.hpp — julkinen API + private jäsenet
class Widget {
    std::string name_;
    Impl* impl_;  // muuttuu usein
};
```

Jokainen impl-muutos → kaikki includerit rebuild. ABI murtoja jos jäsenet näkyvissä.

## Ratkaisu

**Pimpl (pointer to implementation)**:

```cpp
// Widget.hpp
class Widget {
    struct Impl;
    std::unique_ptr<Impl> impl_;
public:
    Widget();
    ~Widget();
};
// Widget.cpp — Impl määritelty täällä
```

Julkinen header pysyy vakaana — vain `.cpp` rebuild impl-muutoksissa.

## Käytännössä

Tradeoff: extra indirektio + allokaatio. Jaetut kirjastot (DLL/SO): Pimpl + export macro. CppCoreGuidelines C.132.

[Lue lisää](https://en.cppreference.com/w/cpp/language/pimpl)
