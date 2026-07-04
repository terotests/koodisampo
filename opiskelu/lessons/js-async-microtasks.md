# console.log(1); Promise.resolve().then(() => console.log(2)); console.log(3); — missä järjestyksessä?

## Tilanne

Olet debuggaamassa React-sovelluksen init-logiikkaa. Kollega lisäsi kolme console.log-kutsua peräkkäin: synkroninen, Promise.resolve().then, ja taas synkroninen. Hän väittää, että promise-callback ajetaan heti rivin jälkeen.

Tuotannossa spinner piilotetaan promise-callbackissa, mutta käyttäjä näkee hetken välähdyksen vanhaa dataa — ikään kuin DOM päivittyisi kahdesti.

## Ratkaisu

**Tulostusjärjestys: 1, 3, 2.** Synkroninen koodi suoritetaan ensin kokonaan. Promise-callback menee microtask-jonoon, joka tyhjennetään vasta kun nykyinen call stack on tyhjä.

```javascript
console.log(1);
Promise.resolve().then(() => console.log(2));
console.log(3);
// Tulostus: 1, 3, 2
```

Microtaskit (Promise.then, queueMicrotask) ajetaan ennen seuraavaa macrotaskia (setTimeout, I/O).

## Käytännössä

Älä oleta, että `.then()` ajetaan "heti" — se voi ajaa vasta renderin jälkeen. Jos tarvitset DOM-päivityksen ennen seuraavaa macrotaskia, käytä synkronista koodia tai `queueMicrotask`. Event loop -järjestys selittää monet "out-of-order" -bugit.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
