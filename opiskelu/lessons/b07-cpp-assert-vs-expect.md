# assert() katoaa release-buildissa — ulkoisen syötteen invariantti pitää tarkistaa runtime. Mitä käytät?

## Tilanne

```cpp
void process(Widget* w) {
    assert(w != nullptr);
    w->run();  // release-buildissa assert poistuu — nullptr crash
}
```

`assert` on debug-työkalu: `NDEBUG` määriteltynä se katoaa kokonaan. Käyttäjäsyöte, verkko ja tiedostot vaativat **runtime-validoinnin** — ei pelkkää assertia.

## Ratkaisu

```cpp
void process(Widget* w) {
    if (w == nullptr)
        throw std::invalid_argument("w must not be null");
    w->run();
}
```

Tai palauta `std::expected` / error code. `assert` vain kehityksen sisäisiin oletuksiin, joita ei voi tapahtua oikeassa syötteessä: `assert(idx < size())` kun API on jo validoinut.

## Jaottelu

| Tilanne | Työkalu |
|---------|---------|
| Sisäinen bugi, ei koskaan tuotannossa | `assert` |
| Käyttäjäsyöte, verkko, tiedosto | throw / error code / log |
| Turvallisuuskriittinen | ei pelkkä assert |

Ero `b08-cpp-assert-ndebug`: tässä kysymyksessä painotus on **assert vs runtime input validation** — ei CI/release-testauksesta.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#en7)
