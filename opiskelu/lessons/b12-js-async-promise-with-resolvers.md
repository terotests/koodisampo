# Rakennat deferred-patternin: ulkopuolinen koodi resolveaa promisen myöhemmin. ES2024+ tapa?

## Tilanne

Rakennat event-pohjaista API:a: ulkopuolinen koodi odottaa promisen, mutta resolve tapahtuu myöhemmin toisessa moduulissa (esim. WebSocket-viestin saapuessa). Vanha deferred-pattern:

```javascript
let resolve;
const promise = new Promise((r) => { resolve = r; });
```

On hankala ja virhealtis.

## Ratkaisu

**Promise.withResolvers() — ES2024+:**

```javascript
const { promise, resolve, reject } = Promise.withResolvers();

socket.on("message", (data) => resolve(data));

return promise;
```

Puhdas API ilman callback-parametrin temppuja.

## Käytännössä

Tarkista target-ympäristön tuki (Node 22+, modernit selaimet). Polyfill: `npm install @ungap/with-resolvers`. Sopii handshake-wait, user confirmation dialog, lazy initialization -kuvioihin.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers)
