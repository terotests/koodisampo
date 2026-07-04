# ReadableStream data async iterable. Silmukka?

## Tilanne

Web API palauttaa ReadableStreamin (esim. SSE tai file upload). Kehittäjä yrittää:

```javascript
for (const chunk of stream) { ... } // TypeError
```

Stream on async iterable — tarvitaan for await.

## Ratkaisu

**for await (const chunk of stream):**

```javascript
const reader = response.body;
for await (const chunk of reader) {
  const text = new TextDecoder().decode(chunk);
  processChunk(text);
}
```

Tai Web Streams API:

```javascript
for await (const chunk of stream.values()) {
  handleChunk(chunk);
}
```

## Käytännössä

for await vaatii async-funktion. Muista break — se kutsuu iterator.return(). Node streams: `pipeline` + transform on usein parempi kuin manuaalinen loop. Backpressure: älä lue nopeammin kuin käsittelet.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
