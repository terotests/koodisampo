# Esimerkkikoodi ///-doc-kommentissa pitää pysyä oikeana. Miten ajat doc testit?

## Taustaa

Rust-dokumentaatio (`rustdoc`) tukee **documentation testejä**: `///`-kommenttien markdown-koodiblokit kääntyy ja ajetaan testeinä. Näin API-esimerkit pysyvät ajan tasalla — jos funktion signatuuri muuttuu, doc-testi failaa CI:ssä ennen kuin vanha esimerkki harhaanjohtaa käyttäjiä.

Doc-testit ovat osa `cargo test` -ajoa. Ne ajetaan erillisenä vaiheena jokaiselle julkiselle API:lle. Koodiblokit voivat olla täysiä testejä (`assert_eq!`), suoritettavia esimerkkejä tai merkitty `no_run` / `ignore` jos eivät ole itsenäisiä.

## Tilanne

Kirjaston `add`-funktiolla on doc-esimerkki:

```rust
/// Laskee summan.
/// ```
/// assert_eq!(mylib::add(2, 2), 4);
/// ```
pub fn add(a: i32, b: i32) -> i32 { a + b }
```

Refaktoroit funktion nimeksi `sum` — yksikkötestit päivittyvät, mutta doc-esimerkki viittaa edelleen `add`-funktioon. CI doc-test failaa — tai huonommassa tapauksessa vanha esimerkki jää dokumentaatioon virheellisenä.

## Ratkaisu

Doc-testit ajetaan automaattisesti:

```bash
cargo test              # sisältää doc-testit
cargo test --doc        # vain doc-testit (nopeampi)
```

Esimerkki oikealla rakenteella:

```rust
/// Palauttaa kahden luvun summan.
///
/// # Examples
///
/// ```
/// use mylib::sum;
///
/// assert_eq!(sum(2, 2), 4);
/// assert_eq!(sum(-1, 1), 0);
/// ```
pub fn sum(a: i32, b: i32) -> i32 {
    a + b
}
```

Attribuutit erikoistapauksiin:

```rust
/// ```
/// # fn main() -> Result<(), Box<dyn std::error::Error>> {
/// let f = std::fs::File::open("missing.txt")?;  // no_run — ei ajeta
/// # Ok(()) }
/// ```
```

`ignore` ohittaa testin; `should_panic` odottaa paniikkia doc-blokissa.

## Käytännössä

Doc-testit ovat paras tapa pitää README- ja API-esimerkit synkassa. `#`-rivit (`# hidden line`) piilottavat boilerplatea (importit, main-wrapper) näyttämättä dokumentaatiossa.

`cargo doc --open` generoi HTML-dokumentaation; `cargo test --doc` varmistaa esimerkit. Monimutkaisissa esimerkeissä jaa testattava logiikka yksikkötesteihin ja pidä doc-esimerkki minimaalisena. Workspace-monorepossa `cargo test -p mycrate --doc` kohdentaa yhteen crateen.

[Lue lisää](https://doc.rust-lang.org/rustdoc/write-documentation/documentation-tests.html)
