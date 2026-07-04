# setTimeout(fn, 0) ei suorita fn heti — miksi?

## Tilanne

Junior-kehittäjä yrittää "siirtää" raskaan laskennan taustalle:

```javascript
console.log("A");
setTimeout(() => heavyComputation(), 0);
console.log("B");
```

Hän odottaa A → B → (tausta) heavyComputation. Sen sijaan B tulostuu, sitten heavyComputation blokkaa UI:n — setTimeout ei siirrä työtä toiseen säieeseen.

## Ratkaisu

**setTimeout(fn, 0) ajoittaa callbackin macrotask-jonoon — ei suorita heti.**

```javascript
console.log("A");                              // synkroninen, heti
setTimeout(() => console.log("C"), 0);         // macrotask, myöhemmin
console.log("B");                              // synkroninen, heti
// Tulostus: A, B, C
```

Callback ajetaan vasta kun nykyinen synkroninen koodi ja microtaskit on käsitelty.

## Käytännössä

setTimeout(0) on "defer to next tick", ei "async thread". Raskas työ tarvitsee Web Workerin tai chunkkauksen. Älä käytä setTimeout(0) suorituskyvyn korjaukseen — se vain siirtää blokin hetken.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
