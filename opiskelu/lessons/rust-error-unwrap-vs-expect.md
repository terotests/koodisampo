# Prototype-koodissa kutsut `.unwrap()` Resultille. Code review mitä suosittelee tuotantoon?

## Tilanne

Palvelu kaatuu asiakkaan virheelliseen syötteeseen — `.unwrap()` config-luvussa.

## Ratkaisu

`?` palauttaa virheen callerille. `expect("msg")` dokumentoi miksi panic on ok (esim. invariant). Prototyypissä ok, tuotannossa ei.

## Käytännössä

main(): `fn main() -> Result<(), Box<dyn Error>>`. Kirjastot: älä koskaan unwrap asiakkaan dataa.

[Lue lisää](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html)
