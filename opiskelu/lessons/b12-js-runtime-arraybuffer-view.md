# Binary data WebSocketista — tyyppi ennen käsittelyä?

## Tilanne

WebSocket vastaanottaa binary frameja:

```javascript
ws.onmessage = (event) => {
  console.log(typeof event.data); // "object"
  // Miten luet tavut?
};
```

Tekstinä käsittely rikkoo binääriprotokollan.

## Ratkaisu

Tyyppi: **ArrayBuffer / Uint8Array view**:

```javascript
ws.onmessage = (event) => {
  const view = new Uint8Array(event.data);
  const opcode = view[0];
  const payload = view.subarray(1);
};
```

## Käytännössä

Aseta `binaryType = "arraybuffer"` WebSocketille. `DataView` moni-byte arvoille (endianness). `Blob` tiedostomaiselle datalle. Node Buffer on Uint8Array-aliluokka.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
