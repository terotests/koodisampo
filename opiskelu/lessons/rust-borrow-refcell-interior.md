# Tarvitset muokata arvoa &self-metodissa (interior mutability). Mikä tyyppi auttaa single-threaded -tilanteessa?

## Tilanne

Trait vaatii `fn push(&self, item: T)` mutta sisäinen vektori pitää kasvattaa — immutabiliteetti vs tarve muokata.

## Ratkaisu

```rust
use std::cell::RefCell;
struct Log { lines: RefCell<Vec<String>> }
impl Log {
    fn add(&self, s: String) {
        self.lines.borrow_mut().push(s);
    }
}
```

## Käytännössä

Säikeissä: `Mutex<T>` tai `RwLock<T>`, ei RefCell. `Cell<T>` vain Copy-tyypeille.

[Lue lisää](https://doc.rust-lang.org/book/ch15-05-interior-mutability.html)
