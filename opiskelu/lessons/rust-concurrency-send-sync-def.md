# Mikä ero `Send`- ja `Sync`-traitien välillä?

## Tilanne

Closure thread::spawnissa — `Rc<RefCell<T>>` ei kelpaa.

## Ratkaisu

Send: omistajuus siirtyy säieeseen. Sync: useat säieet voivat lainata &T samanaikaisesti. Auto trait impl compiler.

## Käytännössä

async block Send-bound. Raw pointer: !Send !Sync.

[Lue lisää](https://doc.rust-lang.org/book/ch16-04-extensible-concurrency-sync-and-send.html)
