# Miksi `let r = &vec[0]; vec.push(1);` voi olla kääntäjävirhe?

## Taustaa

**Roikkuva viittaus** (dangling reference) on klassinen bugi: osoitin viittaa muistiosioon, joka on jo vapautettu tai siirretty. C/C++:ssa kääntäjä ei usein estä tätä — ohjelma kaatuu ajonaikaisesti tai turmelee muistia.

Rustin borrow checker estää roikkuvat viittaukset **käännösaikana**. Yksi tärkeimmistä tilanteista liittyy **`Vec`:n kasvattamiseen**: `push` voi siirtää koko puskurin uuteen heap-osoitteeseen (reallokaatio), jolloin aiemmat elementtiviittaukset osoittaisivat vanhaan, invalidiin muistiin.

## Tilanne

Pidät viittauksen vektorin ensimmäiseen elementtiin ja lisäät samalla uusia elementtejä:

```rust
let mut vec = vec![1, 2, 3];
let r = &vec[0];      // lainaus ensimmäiseen elementtiin
vec.push(4);          // KÄÄNTÄJÄVIRHE — cannot borrow `vec` as mutable
println!("{}", r);
```

Miksi `push` on ongelma? `Vec` kasvaa dynaamisesti. Kun kapasiteetti loppuu, se allokoi **uuden**, suuremman puskurin heapissa, kopioi elementit sinne ja vapauttaa vanhan puskurin. Elementtiosoitteet muuttuvat — `r` osoittaisi vanhaan muistipaikkaan. C++:ssa tämä olisi määrittelemätön käytös; Rust kieltää sen.

Sama ongelma koskee **`String`**: merkkiviittaus `&s[0]` invalidoituu, jos `push_str` tai `push` muuttaa puskurin kokoa ja aiheuttaa reallokaation.

## Ratkaisu

Borrow checker pakottaa valitsemaan: joko lainaus elementtiin **tai** muokkaava lainaus vektoriin (`&mut vec`) — ei molempia päällekkäin samassa scope:ssa.

```rust
let mut vec = vec![1, 2, 3];

// Vaihtoehto 1: rajaa lainauksen scope
{
    let r = &vec[0];
    println!("{}", r);
}  // lainaus r päättyy
vec.push(4);  // OK

// Vaihtoehto 2: kopioi arvo ennen pushia (ei viittaus vektoriin)
let first = vec[0];  // i32 on Copy
vec.push(4);

// Vaihtoehto 3: indeksi lainauksen sijaan
let idx = 0;
vec.push(4);
println!("{}", vec[idx]);  // lue pushin jälkeen uudelleen
```

Ydinajatus: älä pidä elementtiviittauksia elossa, kun muokkaat konttia joka voi reallokoida. Tämä on sama sääntö kuin C++:n "invalidation rules" `vector`:ille — mutta Rust pakottaa sen noudattamiseen.

## Käytännössä

Jos tarvitset sekä viittauksia elementteihin että dynaamista kasvua, harkitse:

- **`Vec` indeksien kanssa** lainausten sijaan — indeksi invalidoituu vain jos poistat/siirrät elementtejä
- **`LinkedList`** tai muu ei-jatkuva muisti (harvoin suorituskyvyn takia)
- **Kloonaa tarvittava arvo** ennen muokkausta, jos se on halpa (`Copy`-tyyppi)

Sama sääntö koskee `String`-merkkijonon merkkiviittauksia ja `.push_str()`:ää. Iteraattorit (`vec.iter()`) pitävät myös jaetun lainauksen — älä muokkaa vektoria saman scope:n aikana kun iterointi on kesken.

Borrow checkerin virheilmoitus voi tuntua pitkältä, mutta ydin on usein: "sinulla on elossa viittaus dataan, jota olet muuttamassa". Opit lukemaan näitä viestejä ajan myötä — ne suojaavat samoja bugeja, joita C++-koodissa metsästetään debuggerilla.

[Lue lisää](https://doc.rust-lang.org/book/ch08-02-strings.html#indexing-into-strings)
