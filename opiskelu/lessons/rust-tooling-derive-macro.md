# Mitä `#[derive(Clone, PartialEq)]` tekee käännöksen aikana?

## Tilanne

Boilerplate Clone + Eq impl 20-kenttäiseen structiin.

## Ratkaisu

```rust
#[derive(Clone, PartialEq, Eq, Debug)]
struct Event { id: u64, name: String }
```

## Käytännössä

serde derive serialisointiin. custom derive omalla crate:llä (proc-macro).

[Lue lisää](https://doc.rust-lang.org/book/appendix-03-derivable-traits.html)
