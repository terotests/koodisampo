# WebAssembly moduuli ESM:ssä?

## Tilanne

Raskas laskenta (kuva-filtteri, parseri) on kirjoitettu Rust/C++:lla WASM:ksi. Vanha tapa lataa erillisellä script-tagilla:

```html
<script src="parser.wasm"></script> <!-- ei toimi suoraan -->
```

Haluat integroida WASM-moduulin ESM-sovellukseen modernisti.

## Ratkaisu

**`WebAssembly.instantiateStreaming`** fetch + compile rinnakkain:

```javascript
// wasmLoader.js
const wasmUrl = new URL('./parser.wasm', import.meta.url);

const { instance } = await WebAssembly.instantiateStreaming(
  fetch(wasmUrl),
  { env: { /* imports */ } }
);

export const parse = instance.exports.parse;
```

ESM exporttaa WASM-funktiot muulle sovellukselle. `import.meta.url` resolvaa `.wasm`-polun oikein bundlerissa.

## Käytännössä

Vite tukee `import wasm from './parser.wasm'` bundler-käsittelyllä. Node 20+: `WebAssembly` globaalisti. Muista WASM import object (muisti, funktiot JS:stä). Streaming vaatii `Content-Type: application/wasm`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/WebAssembly)
