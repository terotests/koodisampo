# Haluat newtype-wrapperin `UserId(u64)` estämään sekoittamasta tavalliseen u64:ään. Miten?

## Tilanne

Funktio `fn get_user(id: u64)` kutsutaan vahingossa `order_id`:llä.

## Ratkaisu

```rust
struct UserId(u64);
struct OrderId(u64);
fn get_user(id: UserId) -> User { ... }
```

## Käytännössä

Implementoi Display/Debug/From tarpeen mukaan. Zero-cost abstraction.

[Lue lisää](https://doc.rust-lang.org/book/ch05-01-defining-structs.html#using-tuple-structs-without-named-fields-to-create-different-types)
