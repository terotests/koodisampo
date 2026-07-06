# Funktio palauttaa `Option<T>` mutta kutsuja tarvitsee `Result<T, MyError>`. Mikä metodi auttaa?

## Tilanne

find()-tyyppinen API palauttaa Option mutta REST-handler tarvitsee 404-virheen.

## Ratkaisu

```rust
find_user(id).ok_or(AppError::NotFound)
// tai lazy: .ok_or_else(|| AppError::msg("..."))
```

## Käytännössä

Käänteinen: `Result::ok()` → Option. Ketjuta `.map()`, `.and_then()`.

[Lue lisää](https://doc.rust-lang.org/std/option/enum.Option.html#method.ok_or)
