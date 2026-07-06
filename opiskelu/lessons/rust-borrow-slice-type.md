# Miksi `&Vec<T>` funktioparametrina on usein huono verrattuna `&[T]`:hen?

## Taustaa

Rustissa **slice** (`[T]`) on dynaamisen pituinen näkymä jatkumoon — se ei omista dataa vaan lainaa sitä. **`&[T]`** on lainaus sliceen: yleinen tapa antaa funktiolle pääsy taulukon tai vektorin elementteihin ilman omistajuutta.

`Vec<T>` on omistettu, kasvava puskuri heapissa. **`&Vec<T>`** lainaa koko vektorikonttia — sisältäen kapasiteetin, pituuden ja osoittimen. Useimmat funktiot eivät tarvitse konttimetadataa; ne tarvitsevat vain elementit. Siksi `&[T]` on joustavampi ja idiomaattisempi.

## Tilanne

Kirjoitat funktion, joka laskee lukujen summan. Kutsut sitä sekä vektorilla että kiinteällä taulukolla:

```rust
fn sum(nums: &Vec<i32>) -> i32 {
    nums.iter().sum()
}

let v = vec![1, 2, 3];
sum(&v);           // OK

let arr = [1, 2, 3, 4];
// sum(&arr);       // KÄÄNTÄJÄVIRHE — expected &Vec, found &[i32; 4]
```

Funktio toimii vektorille, mutta ei taulukolle — vaikka molemmat ovat "jono lukuja". Java-kehittäjälle: kuin metodi joka ottaa `ArrayList` mutta ei `int[]` — Rustissa tämä on helppo korjata parametriyyppiä muuttamalla.

## Ratkaisu

**`&[T]`** (slice-lainaus) toimii kaikille jatkumoille:

```rust
fn sum(nums: &[i32]) -> i32 {
    nums.iter().sum()
}

sum(&vec![1, 2, 3]);     // &Vec<i32> → &[i32] automaattisesti (Deref)
sum(&[1, 2, 3, 4]);      // kiinteä taulukko → &[i32]
sum(&v[1..3]);           // osa vektoria — slice
```

`Vec<T>` toteuttaa `Deref`-traitin kohteeseen `[T]`: `&vec` muuntuu automaattisesti `&[T]`:ksi funktiokutsussa. Sinun ei tarvitse kirjoittaa `sum(v.as_slice())` — mutta voit, jos haluat olla eksplisiittinen.

Slice ei tiedä onko taustalla `Vec`, taulukko vai muu puskuri — se näkee vain elementit. Tämä tekee funktiosta uudelleenkäytettävän ja testattavan eri datalähteillä.

## Käytännössä

Sama sääntö merkkijonoissa: **`&str` parametri, ei `&String`**. `&str` hyväksyy literaalit, `String`-lainaukset ja osamerkkijonot; `&String` rajoittaa turhaan.

Milloin `&Vec<T>` voi olla perusteltu? Harvoin — esim. kun funktio tarvitsee vektorin **kapasiteettia** tai kutsuu vektorikohtaisia metodeja jotka eivät ole slice:lla. Yleensä parempi ottaa `&mut Vec<T>` jos muokkaat konttia, tai `&[T]` jos käsittelet elementtejä.

API-suunnittelu yhteenveto:

| Tarve | Parametri |
|-------|-----------|
| Lue elementtejä | `&[T]` tai `&str` |
| Muokkaa elementtejä | `&mut [T]` |
| Muokkaa konttia (push, reserve) | `&mut Vec<T>` |
| Omista data | `Vec<T>` (move) |

Prefer slice/str over owned container references — tämä on yksi Rust-yhteisön yleisimmistä idiomeista ja tekee koodistasi yhteensopivan useampien kutsutapojen kanssa.

[Lue lisää](https://doc.rust-lang.org/book/ch04-03-slices.html)
