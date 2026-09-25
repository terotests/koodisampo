# Funktio `tick()` kutsuu lopuksi `queueMicrotask(tick)`. Synkronista silmukkaa ei ole, mutta UI jäätyy. Miksi?

## Tilanne

Testisovellus jäätyy, vaikka koodissa ei ole synkronista silmukkaa. Syy löytyy:

```javascript
function tick() {
  updateCounter();
  queueMicrotask(tick); // ajasta itsensä uudelleen
}
tick();
```

Jokainen `tick`-kutsu päättyy, mutta selain ei renderöi eikä reagoi tapahtumiin.

## Ratkaisu

**Microtask-jono tyhjennetään ennen renderiä — loputon ketju estää paintin:**

```javascript
// Event loop jää jumiin microtask-jonoon
function tick() {
  updateCounter();
  queueMicrotask(tick);
}
// setTimeout, requestAnimationFrame, input — kaikki odottavat

// Korjaus: anna selaimelle vuoro
function tick() {
  updateCounter();
  requestAnimationFrame(tick);
}
```

Event loop tyhjentää microtask-jonon kokonaan ennen seuraavaa macrotaskia tai renderöintiä. Kun jokainen microtask lisää uuden, jono ei tyhjene koskaan = starvation.

(`while (true) { queueMicrotask(...) }` olisi eri bugi: synkroninen silmukka jäädyttää sivun itse, eikä yksikään microtask ehdi ajautua.)

## Käytännössä

Diagnostiikka: UI jäätyy, mutta synkronista silmukkaa ei löydy → epäile itseään ajastavaa microtask-ketjua. Korjaus: käytä `setTimeout`/`requestAnimationFrame` (tai Nodessa `setImmediate`) tahdistukseen. Älä kutsu queueMicrotaskia rekursiivisesti ilman lopetusehtoa. Performance-profiler näyttää pitkän microtask-jakson.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
