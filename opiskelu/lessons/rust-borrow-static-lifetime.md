# Mikä `'static` lifetime tarkoittaa Rustissa?

## Taustaa

Lifetime-merkinnät (`'a`) kuvaavat lainattujen viittausten elinaikaa suhteessa omistajaan. Useimmat lifetimet ovat funktion tai lohkon scope — `'a` voi olla mikä tahansa elinaika, kunhan kääntäjä voi todistaa suhteen turvalliseksi.

**`'static`** on erikoistapaus: se tarkoittaa "elää koko ohjelman ajan". Se on **pitkin** mahdollinen elinaika — mutta sen merkitys riippuu siitä, käytetäänkö sitä viittauksessa (`&'static str`) vai geneerisen tyypin rajoitteessa (`T: 'static`). Aloittelijat sekoittavat nämä usein.

## Tilanne

Kohtaat `'static` monissa paikoissa:

```rust
let msg: &'static str = "Hei maailma";  // string literal

// Thread spawn:
std::thread::spawn(|| { /* ... */ });  // closure vaatii F: 'static

// Any-tyyppi:
fn store<T: 'static>(value: T) { /* ... */ }
```

API vaatii `T: 'static` — mitä se tarkoittaa geneeriselle tyypille? Entä `&'static str`? Voiko tavallinen `String` olla `'static`? Miksi thread vaatii `'static`-closurea?

## Ratkaisu

Kaksi eri merkitystä:

**1. `&'static T` — viittaus dataan, joka elää ohjelman loppuun asti**

String literaalit (`"teksti"`) upotetaan binääriin — ne eivät ole stackissa eivätkä heapissa ohjelman ajon aikana allokoituina. Viittaus niihin on `'static`:

```rust
let s: &'static str = "pysyvä literal";
// s kelpaa koko ohjelman ajan
```

**2. `T: 'static` — tyyppi ei sisällä lainattuja viittauksia lyhyempään elinaikaan**

Tämä **ei** tarkoita "elää ikuisesti". Se tarkoittaa: kaikki lainaukset tyypin sisällä ovat `'static`, tai tyypillä ei ole lainauksia ollenkaan. Esimerkkejä:

```rust
// OK — String omistaa datansa, ei lainaa stack-muuttujaa
fn foo<T: 'static>(t: T) {}

foo(42);                        // i32: 'static
foo(String::from("hei"));       // String: 'static
foo(&'static str);              // viittaus static-dataan: 'static

let local = String::from("temp");
// foo(&local);                  // &str joka viittaa localiin: EI 'static
```

## Käytännössä

**Thread spawn** vaatii `F: 'static`, koska säie voi elää pidempään kuin sen luonut scope. Closure ei saa lainata stack-muuttujia (`&local`), ellei omistajuutta jaeta (`Arc`):

```rust
let data = String::from("turvallinen");
std::thread::spawn(move || {
    println!("{}", data);  // move — data on closuren omistuksessa
}).join();

// VÄÄRIN — local voi kuolla ennen säiettä:
// let local = String::from("vaarallinen");
// std::thread::spawn(|| println!("{}", local));
```

**Channel / `Any` / event loop** usein vaativat `'static`, koska data siirretään tuntemattoman elinaikaiselle vastaanottajalle. Omistettu data (`String`, `Vec`, `i32`) kelpaa; lainaus paikalliseen muuttujaan ei.

Älä luule `'static` = "global constant". Omistettu `String` luotu funktiossa on `'static`-tyyppi — se vain omistaa heap-datansa. `'static`-rajoite sulkee pois viittaukset lyhyempään elinaikaan, ei pakota dataa literal-segmenttiin.

[Lue lisää](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#the-static-lifetime)
