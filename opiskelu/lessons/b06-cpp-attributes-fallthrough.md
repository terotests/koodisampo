# Switch-case putoaa vahingossa seuraavaan caseen — bugi löytyy viiveellä. Miten dokumentoit tarkoituksellinen putoaminen?

## Tilanne

Switch ilman break:ia:

```cpp
switch (state) {
    case Idle:
        prepare();
    case Running:  // BUG — putoaa Idle:stä ilman break
        execute();
        break;
}
```

C++:ssa case "putoaa" seuraavaan ilman `break`:ia. Tarkoituksellinen fall-through on harvinaista — usein bugi. `-Wimplicit-fallthrough` varoittaa, mutta tarkoituksellinen putoaminen pitää dokumentoida.

## Ratkaisu

**`[[fallthrough]]`** attribuutti (C++17):

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

Attribuutti kertoo kääntäjälle ja lukijalle: putoaminen on tarkoituksellista. Vahingossa puuttuva `break` jää edelleen varoitukseksi.

## Käytännössä

Prefer erilliset case:t tai funktiokutsu — fall-through vain kun DRY on selkeä hyöty. `-Wimplicit-fallthrough` päälle. CppCoreGuidelines ES.78.

[Lue lisää](https://en.cppreference.com/w/cpp/language/attributes/fallthrough)
