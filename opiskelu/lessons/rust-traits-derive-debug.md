# Haluat tulostaa structin debug-lokitukseen ilman manuaalista fmt-koodia. Mikä on nopein tapa?

## Tilanne

Kehitysvaiheessa tarvitset nopeasti structin sisällön lokiin.

## Ratkaisu

```rust
#[derive(Debug)]
struct Config { host: String, port: u16 }
println!("{:?}", cfg);
// {:#?} pretty-print
```

## Käytännössä

Myös Clone, Copy, PartialEq yleisiä derivejä. custom Debug impl kun tarvitaan salaus.

[Lue lisää](https://doc.rust-lang.org/book/appendix-03-derivable-traits.html)
