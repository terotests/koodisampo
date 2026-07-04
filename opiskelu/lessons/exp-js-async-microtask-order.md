# Bugiraportti: `console.log` järjestys on 1, 4, 2, 3 — setTimeout(0), Promise.resolve, sync. Miksi?

## Tilanne

Tiimi debuggaa outoa lokijärjestystä tuotannossa. Koodi näyttää tältä:

```javascript
console.log(1);
Promise.resolve().then(() => console.log(2));
setTimeout(() => console.log(3), 0);
console.log(4);
```

Loki näyttää: **1, 4, 2, 3** — ei synkronista 1-2-3-4-järjestystä eikä timeout ensin.

## Ratkaisu

**Event loop: synkroninen → microtaskit → macrotaskit.**

1. Synkroninen: `1`, `4`
2. Microtask-jono tyhjenee: Promise-callback → `2`
3. Seuraava macrotask: setTimeout → `3`

```javascript
// Tulostus: 1, 4, 2, 3
console.log(1);
Promise.resolve().then(() => console.log(2));
setTimeout(() => console.log(3), 0);
console.log(4);
```

Promise.then on microtask; setTimeout(0) on macrotask — microtaskit ajetaan aina ensin.

## Käytännössä

Tämä selittää monet "miksi callback ajettiin ennen timeoutia" -bugit. Älä luota siihen, että setTimeout(0) ajaa heti synkronisen koodin jälkeen — se odottaa microtask-jonon tyhjentymistä. Testaa event loop -järjestys ennen kuin refaktoroit timing-herkkää koodia.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
