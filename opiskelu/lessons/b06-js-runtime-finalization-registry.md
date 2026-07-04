# WeakRef ei takaa cleanup — tarvitset callback kun objekti GC:ttä. Mitä API?

## Tilanne

Käytät WeakRef:iä isojen canvas-buffereiden cacheen. Kun objekti GC:tään, haluat vapauttaa WebGL-resurssin ja kirjata metriikan — mutta WeakRef.deref() voi palauttaa `undefined` ilman varoitusta.

## Ratkaisu

API: **FinalizationRegistry — cleanup-callback kun objekti on GC:tty**:

```javascript
const registry = new FinalizationRegistry((heldValue) => {
  releaseWebGLResource(heldValue);
});

registry.register(canvasWrapper, glTextureId, canvasWrapper);
// callback ajetaan kun canvasWrapper on kerätty (ei taattu ajankohta)
```

## Käytännössä

FinalizationRegistry ei korvaa explicit cleanupia (dispose/unmount). GC voi viivästyä — älä luota siihen resurssien vapauttamiseen reaaliajassa. Node ja selaimet tukevat API:a; testaa ympäristössäsi.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry)
