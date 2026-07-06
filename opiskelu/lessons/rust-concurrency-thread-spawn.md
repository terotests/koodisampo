# Miten käynnistät uuden OS-säikeen std-kirjastolla?

## Tilanne

Raskas laskenta blokkaa UI-säikeen — siirrä taustalle.

## Ratkaisu

```rust
let handle = thread::spawn(|| { heavy_compute() });
let result = handle.join().unwrap();
```

## Käytännössä

Closure tarvitsee `'static` + Send jos siirtää dataa. Kanavat vähentävät jaettua tilaa.

[Lue lisää](https://doc.rust-lang.org/book/ch16-01-threads.html)
