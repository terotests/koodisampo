# PR lisää yksirivisen if:n ilman aaltosulkuja ennen toista riviä. Miksi cpp-best-practices vaatii sulut?

## Tilanne

```cpp
if (ready)
    process();
    log("done");  // EI if:n sisällä — aina suoritetaan!
```

Ilman aaltosulkuja vain **yksi lause** kuuluu if:ään. Toinen rivi näyttää visuaalisesti sisällä — klassinen bugi. Refaktorointi lisää rivin "if-lohkoon" vahingossa.

## Ratkaisu

**Aaltosulut aina** — myös yksirivisille:

```cpp
if (ready) {
    process();
}
```

`-Wmisleading-indentation` (GCC) varoittaa. Tiimin `.clang-format` voi pakottaa AlwaysBraces.

## Käytännössä

CppBestPractices Style: braces required. Poikkeus: tiimi voi sallia yksirivisen `if (x) return;` — mutta yhdenmukaisuus voittaa. Review: "Lisää sulut."

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md)
