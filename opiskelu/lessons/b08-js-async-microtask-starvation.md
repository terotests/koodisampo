# while(true) Promise.resolve().then(...) — UI jäätyy mutta ei 100% CPU. Miksi?

## Tilanne

Bugiraportti: sivu jäätyy, mutta CPU ei ole 100 %. Kehittäjä löytää testikoodin:

```javascript
while (true) {
  Promise.resolve().then(() => {
    // "kevyt" callback
  });
}
```

Silmukka ei ole synkroninen while(true), mutta UI ei reagoi — ei scrollausta, ei klikkauksia.

## Ratkaisu

**Microtask starvation — jono tyhjenee ennen macrotask/render-kierrosta.**

```javascript
// VÄÄRIN — infinite microtask loop
while (true) {
  Promise.resolve().then(() => {});
}
// Event loop: microtask-jono ei koskaan tyhjene
// → setTimeout, I/O, render jäävät odottamaan
```

Jokainen Promise.then lisää uuden microtaskin. Event loop tyhjentää microtask-jonon kokonaan ennen seuraavaa macrotaskia — ääretön silmukka estää renderöinnin.

## Käytännössä

Älä rekursiivista queueMicrotask/Promise.then ilman ehtoa. Jos tarvitset jatkuvaa työtä, käytä requestAnimationFrame (UI) tai setImmediate/setTimeout (Node). Performance-ongelmat joissa CPU matala mutta UI jäätynyt → epäile microtask starvationia.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)
