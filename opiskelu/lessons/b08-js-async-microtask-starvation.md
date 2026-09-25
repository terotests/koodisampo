# Funktio `pump()` ajastaa itsensä aina uudelleen: `Promise.resolve().then(pump)`. Synkronista silmukkaa ei ole, mutta UI jäätyy. Miksi?

## Tilanne

Bugiraportti: sivu jäätyy, vaikka koodissa ei ole synkronista silmukkaa. Kehittäjä löytää pollausfunktion:

```javascript
function pump() {
  processQueue(); // "kevyt" työ
  Promise.resolve().then(pump); // ajasta seuraava kierros
}
pump();
```

Jokainen kierros päättyy normaalisti, mutta UI ei reagoi — ei scrollausta, ei klikkauksia, ei uudelleenpiirtoa.

## Ratkaisu

**Microtask starvation — microtask-jono tyhjennetään kokonaan ennen macrotaskeja ja renderöintiä.**

```javascript
// VÄÄRIN — jokainen kierros lisää uuden microtaskin
function pump() {
  processQueue();
  Promise.resolve().then(pump);
}
// Event loop: microtask-jono ei koskaan tyhjene
// → setTimeout, I/O, input ja render jäävät odottamaan

// OIKEIN — seuraava kierros macrotaskina
function pump() {
  processQueue();
  setTimeout(pump, 0);
}
```

Jokainen `Promise.then` lisää uuden microtaskin. Event loop ajaa microtaskeja niin kauan kuin jonossa on niitä, ennen kuin se siirtyy seuraavaan macrotaskiin tai renderöintiin. Itseään uudelleen ajastava microtask-ketju ei siis koskaan päästä selainta eteenpäin.

Huomaa ero: `while (true) { Promise.resolve().then(...) }` jäätyisi jo synkronisen silmukan takia — silloin callbackit eivät ehtisi koskaan edes ajautua.

## Käytännössä

Älä ajasta Promise.then- tai queueMicrotask-kutsua rekursiivisesti ilman lopetusehtoa. Jos tarvitset jatkuvaa työtä, anna selaimelle vuoro: `requestAnimationFrame` (UI), `setTimeout` tai Nodessa `setImmediate`. Jos UI on jäätynyt eikä synkronista silmukkaa löydy, epäile microtask-ketjua — profilerissa se näkyy yhtenä pitkänä microtask-jaksona.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)
