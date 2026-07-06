# Tarvitset kaksi itsenäistä kopioita samasta `Vec<i32>`:stä. Mikä on oikea tapa?

## Taustaa

Rustissa oletus on **siirto** (move), ei kopiointi. Kun annat arvon toiselle muuttujalle tai funktiolle, omistajuus siirtyy — alkuperäinen invalidoituu. Tämä on nopeaa ja turvallista, mutta joskus tarvitset kaksi **itsenäistä** kopiota samasta datasta.

Java- ja Python-maailmassa viittaukset jaetaan helposti: kaksi muuttujaa voi osoittaa samaan listaan, ja muutos näkyy molemmissa. Rustissa erilliset omistajat tarkoittavat erillistä dataa — tai lainattua dataa jaettujen viittausten kautta. Kun haluat kaksi omistettua, toisistaan riippumatonta vektoria, tarvitset **syvän kopion**.

## Tilanne

Kaksi funktiota muokkaa "samaa" vektoria erikseen — lainaus (`&Vec<i32>`) ei riitä, koska molemmat tarvitsevat oikeuden muokata omia kopioitaan ilman toisen vaikuttamista. Esimerkiksi simulaatiossa kloonaat pelitilan vertailua varten:

```rust
let original = vec![1, 2, 3];

// Väärin: move — original invalidoituu
// let copy = original;

// Väärin: vain viite — sama data, ei kaksi omistettua kopiota
// let copy_ref = &original;
```

Tässä tarvitaan kaksi erillistä `Vec<i32>`-instanssia heap-muistissa, joilla on samat alkuarvot mutta eri omistajuus.

## Ratkaisu

**`.clone()`** luo syvän kopion: uusi vektori, uusi heap-allokaatio, samat elementit kopioituina. Molemmat muuttujat ovat täysin riippumattomia sen jälkeen.

```rust
let a = vec![1, 2, 3];
let b = a.clone();  // syvä kopio — a ja b ovat erillisiä vektoreita

// Muokkaus ei vaikuta toiseen:
// b.push(4);  → a on yhä [1, 2, 3]

assert_eq!(a, b);  // arvot samat, omistajuus eri
```

`Clone`-trait on tarkoituksellinen: sen kustannus näkyy koodissa. Kääntäjä ei tee piilokopioita — toisin kuin monissa korkean tason kielissä, joissa `=` voi tarkoittaa viittausta tai kopiota kontekstista riippuen. Rustissa `=` on aina move (tai Copy), ja `.clone()` on eksplisiittinen "haluan maksaa kopioinnista".

Huomaa ero **shallow**- ja **deep**-kopioon: `Vec` kloonaa elementit rekursiivisesti. `Vec<SomeStruct>` kloonaa jokaisen structin; jos struct sisältää `String`-kenttiä, nekin kloonataan. Tämä voi olla kallista suurille rakenteille — siksi clonea ei käytetä automaattisesti.

## Käytännössä

Vältä turhaa clonea. Ennen `.clone()`-kutsua kysy: riittäisikö lainaus `&[T]`? Riittäisikö siirto, jos toinen muuttuja ei enää tarvitse dataa? Clone on oikea valinta, kun tarvitset todella erillisen kopion — esimerkiksi undo/redo-pino, haara simulaatiossa tai testidata joka muokataan riippumatta alkuperästä.

Jos clonea tarvitaan usein, harkitse arkkitehtuuria: `Rc`/`Arc` jaettuun omistajuuteen, copy-on-write (`Cow`), tai immuuttiset rakenteet. Mutta aloittelijalle `.clone()` on selkein tapa sanoa "haluan kaksi kopiota" — ja kääntäjä varmistaa, ettei vahingossa jaeta muokattavaa dataa kahden omistajan kesken.

Muista myös `Copy`-tyypit (`i32`, `bool`): niille `let b = a` riittää, koska arvo kopioituu bittitasolla automaattisesti. `Vec` ei ole `Copy` — siksi tarvitaan `.clone()`.

[Lue lisää](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#variables-and-data-interacting-with-clone)
