# Tarvitset muokata arvoa &self-metodissa (interior mutability). Mikä tyyppi auttaa single-threaded -tilanteessa?

## Taustaa

Rustin oletus: jos sinulla on jaettu lainaus (`&self`), et saa muokata dataa. Muokkaus vaatii `&mut self`. Tämä on selkeää struct-metodeille, mutta joskus **API vaatii** immuuttisen rajapinnan — esimerkiksi trait sanoo `fn push(&self, item: T)` — vaikka sisäinen tila oikeasti muuttuu.

Java-kehittäjälle: kuin `final`-viite objektiin, jonka sisäinen tila silti muuttuu (`StringBuilder`). Pythonissa kaikki on käytännössä mutabiliteettia sisäisesti. Rust erottaa **ulkopuolisen** immutabiliteetin (`&self`) ja **sisäisen** mutabiliteetin (interior mutability) — viimeinen vaatii erityistyyppejä.

## Tilanne

Rakennat lokipuskuria, jota useat osat kutsuvat. Trait tai API vaatii metodin, joka ottaa `&self`:

```rust
trait Logger {
    fn add(&self, line: String);
}

// Haluat:
struct Log {
    lines: Vec<String>,
}

impl Logger for Log {
    fn add(&self, s: String) {
        // self.lines.push(s);  // KÄÄNTÄJÄVIRHE — cannot borrow as mutable
    }
}
```

`&self` on jaettu lainaus — et saa kutsua `push`:ia suoraan `Vec`:lle. Mutta lokipuskuri **pitää** kasvaa. Tarvitset tavan muokata dataa jaetun viitteen takaa.

## Ratkaisu

**`RefCell<T>`** tarjoaa **sisäisen mutabiliteetin** single-threaded -tilanteessa. Se siirtää borrow checker -säännöt **ajonaikaan**: `borrow()` ja `borrow_mut()` panettavat runtime-virheen, jos säännöt rikkoutuvat (panic), ei käännösaikaa.

```rust
use std::cell::RefCell;

struct Log {
    lines: RefCell<Vec<String>>,
}

impl Log {
    fn add(&self, s: String) {
        self.lines.borrow_mut().push(s);
    }

    fn len(&self) -> usize {
        self.lines.borrow().len()
    }
}

let log = Log { lines: RefCell::new(Vec::new()) };
log.add("rivi 1".into());
log.add("rivi 2".into());
```

`RefCell` on kuin "sisäinen mutex" ilman säieturvallisuutta. Ulkopuolelta `log` on immuuttinen (`&Log`), mutta sisällä `Vec` muuttuu. Tämä on tarkoituksellista: API pysyy siistinä, mutta vastuu siirtyy sinulle — et saa lainata `borrow()` ja `borrow_mut()` päällekkäin samassa scope:ssa, muuten panic.

## Käytännössä

Valitse oikea sisäisen mutabiliteetin tyyppi:

- **`Cell<T>`** — vain `Copy`-tyypeille (`i32`, `bool`). Ei lainauksia ulos; `get`/`set`.
- **`RefCell<T>`** — ei-Copy data, single-thread. `borrow`/`borrow_mut`.
- **`Mutex<T>` / `RwLock<T>`** — säikeiden välinen jakaminen. Runtime-lukitus, ei panic samalla tavalla RefCellin kanssa säikeissä.
- **`UnsafeCell<T>`** — alin taso; vain `unsafe`-koodissa.

**Älä käytä `RefCell` säikeissä** — käytä `Mutex` tai `RwLock`. `RefCell` ei ole `Sync`; jaettu `Arc<RefCell<T>>` säikeiden kesken johtaa data raceen.

Sisäinen mutabiliteetti on kompromissi: se kiertää staattisen borrow checkerin, joten vastuu siirtyy sinulle. Käytä sitä kun API tai omistajuusmalli vaatii (`Rc<RefCell<T>>` jaetussa graafissa), ei oletuksena kaikkeen muokattavaan dataan.

[Lue lisää](https://doc.rust-lang.org/book/ch15-05-interior-mutability.html)
