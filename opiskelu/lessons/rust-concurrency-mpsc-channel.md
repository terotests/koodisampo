# Worker-säikeet lähettävät tuloksia pääsäikeelle. Mikä std-primitiivi sopii?

## Tilanne

Pool worker-säikeitä — tulokset kerätään yhteen ilman data raceja.

## Ratkaisu

```rust
let (tx, rx) = mpsc::channel();
thread::spawn(move || { tx.send(42).unwrap(); });
println!("{}", rx.recv().unwrap());
```

## Käytännössä

crossbeam/epoll tuotantoon. mpsc riittää opetteluun ja moniin työkaluihin.

[Lue lisää](https://doc.rust-lang.org/book/ch16-02-message-passing.html)
