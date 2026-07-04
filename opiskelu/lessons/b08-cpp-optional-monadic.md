# Ketju: optional palauttaa arvon, seuraava funktio ottaa arvon — if-linnoja tulee liikaa. C++23-tyylinen tapa?

## Tilanne

```cpp
auto o = parse(input);
if (!o) return;
auto v = transform(*o);
if (!v) return;
use(*v);
```

Optional-ketju toistaa if-pesäkkeitä — lukija hukkuu.

## Ratkaisu

**Monadic operations** (C++23):

```cpp
parse(input)
    .and_then(transform)
    .transform(format)
    .or_else(handleError);
```

`and_then` / `transform` ketjuttavat ilman eksplisiittisiä if:ejä. Ennen C++23: manual chain tai kirjasto.

## Käytännössä

Rust-tyylinen ergonomia optionalille. C++23 `std::optional::and_then`. Review: vähennä nested if optional-ketjuissa.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/optional/and_then)
