# while(true) { queueMicrotask(() => {}) } — UI jäätyy vaikka ei ole synkronista silmukkaa. Miksi?

## Tilanne

Testisovellus jäätyy ilman 100 % CPU:ta. Syy löytyy:

```javascript
while (true) {
  queueMicrotask(() => {});
}
```

Ei synkronista while(true), mutta selain ei renderöi eikä reagoi tapahtumiin.

## Ratkaisu

**Infinite microtasks estävät macrotaskit ja renderin:**

```javascript
// Event loop jää jumiin microtask-jonoon
while (true) {
  queueMicrotask(() => {});
}
// setTimeout, requestAnimationFrame, input — kaikki odottavat
```

Event loop tyhjentää microtask-jonon kokonaan ennen seuraavaa macrotaskia. Ääretön microtask-syöttö = starvation.

## Käytännössä

Diagnostiikka: UI jäätyy, CPU matala → epäile microtask loopia. Korjaus: käytä setTimeout/setImmediate tahtuun. Älä rekursiivista queueMicrotask ilman exit-ehtoa. Performance-profiler näyttää pitkän microtask-jakson.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
