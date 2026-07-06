# Kaksi Mutex-lukitusta eri järjestyksessä kahdessa säikeessä — riski?

## Tilanne

Säie A: lock(m1)→lock(m2). Säie B: lock(m2)→lock(m1).

## Ratkaisu

Yhtenäinen lukitusjärjestys, `try_lock`, tai yhdistetty `Mutex<(A,B)>`. Arc<Mutex<T>> jakaa lukon.

## Käytännössä

RwLock usealle lukijalle. Deadlock ≠ data race — Rust takaa jälkimmäisen compile-time.

[Lue lisää](https://doc.rust-lang.org/book/ch16-03-shared-state.html)
