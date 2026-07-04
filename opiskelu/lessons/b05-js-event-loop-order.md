# console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C')); Tulostusjärjestys?

## Tilanne

Konsoli-testi haastattelussa:

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
```

Haastattelija kysyy tulostusjärjestystä. Ehdokas vastaa A, B, C — väärin.

## Ratkaisu

**Tulostus: A, C, B**

```javascript
console.log("A");                                    // 1. synkroninen
setTimeout(() => console.log("B"), 0);               // 3. macrotask
Promise.resolve().then(() => console.log("C"));      // 2. microtask
```

Event loop: synkroninen koodi → microtask-jono (C) → macrotask-jono (B).

## Käytännössä

Tämä on klassinen event loop -kysymys — osaa selittää miksi. Käytännössä: älä sekoita setTimeout(0) "heti ajoon" -oletukseen. React setState batching hyödyntää microtask-jonoa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
