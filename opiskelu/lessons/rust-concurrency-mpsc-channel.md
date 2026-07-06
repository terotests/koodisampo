# Worker-säikeet lähettävät tuloksia pääsäikeelle. Mikä std-primitiivi sopii?

## Taustaa

Rinnakkaisuudessa yksi tapa välttää jaettu muisti on **viestien välittäminen** (message passing): säikeet eivät kirjoita samaan muuttujaan, vaan lähettävät dataa kanavan kautta. Rustin standardikirjasto tarjoaa tähän **mpsc**-kanavan (multiple producer, single consumer).

Lähettäjiä (`Sender`) voi olla useita — esimerkiksi jokaisella worker-säikeellä oma kopio. Vastaanottaja (`Receiver`) on yksi; pääsäie kerää tulokset turvallisesti ilman lukituksia jaettuun tilaan. Kanava siirtää omistajuuden viestin mukana.

## Tilanne

Rakennat worker-poolin: useat säikeet laskevat raskaita tehtäviä ja palauttavat tulokset pääsäikeelle. Jaettu `Vec` + `Mutex` toimisi, mutta viestintä on yksinkertaisempi malli aloittelijalle:

```rust
use std::thread;

// Ilman kanavaa: kaikkien täytyisi odottaa samaa Mutex< Vec<...> >
// Helppompi: jokainen worker lähettää valmiin tuloksen pääsäikeelle
```

Haluat, että workerit eivät koske toistensa dataan — vain lähettävät valmiit luvut tai structit eteenpäin.

## Ratkaisu

Luo `mpsc::channel()` ja jaa `Sender` worker-säikeille:

```rust
use std::sync::mpsc;
use std::thread;

let (tx, rx) = mpsc::channel();

let tx2 = tx.clone();
thread::spawn(move || {
    tx2.send(10).unwrap();
});

thread::spawn(move || {
    tx.send(20).unwrap();
});

drop(tx);  // sulje alkuperäinen lähettäjä, jos ei enää tarvita

let mut results = vec![];
for msg in rx {
    results.push(msg);
}
// results sisältää 10 ja 20 (järjestys voi vaihdella)
```

`recv()` blokkaa, kunnes viesti saapuu. `for msg in rx` iteroi kanavaa, kunnes kaikki lähettäjät on pudotettu (`drop`).

## Käytännössä

`std::sync::mpsc` riittää opetukseen ja moniin CLI-työkaluihin. Tuotannossa `crossbeam-channel` tarjoaa usein paremman suorituskyvyn ja valinnaisia kanavatyyppeja (bounded, select).

Yhdistä kanava + `thread::spawn`: worker saa `move`-kopion lähettäjästä, laskee tuloksen ja `send`-ää sen. Pääsäie ei tarvitse Mutexia tuloslistaan — se kerää viestit yksitellen. Tämä malli skaalautuu hyvin "tuottaja → kuluttaja" -työkuormiin.

[Lue lisää](https://doc.rust-lang.org/book/ch16-02-message-passing.html)
