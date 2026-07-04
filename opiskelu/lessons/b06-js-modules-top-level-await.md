# ESM moduuli tarvitsee async init ennen exporttia. Miten ilman wrapper-funktiota?

## Tilanne

Auth-moduuli hakee julkisen avaimen ennen JWT-validointia:

```javascript
// auth.js — wrapper pakottaa async initin jokaiselle kuluttajalle
let publicKey;

export async function initAuth() {
  publicKey = await fetch('/.well-known/jwks.json').then(r => r.json());
}

export function verify(token) {
  if (!publicKey) throw new Error('call initAuth first');
  // ...
}
```

Jokainen testi ja entrypoint kutsuu `initAuth()` — helppo unohtaa.

## Ratkaisu

**Top-level await** moduulin juuressa — ESM sallii async init ennen exportteja:

```javascript
// auth.js
const publicKey = await fetch('/.well-known/jwks.json').then(r => r.json());

export function verify(token) {
  return jwtVerify(token, publicKey);
}
```

`import { verify } from './auth.js'` odottaa automaattisesti avaimen latauksen.

## Käytännössä

Testeissä mockaa `fetch` ennen moduulin importtia tai käytä dynamic `import()` testin setupissa. Top-level await ei toimi CommonJS-moduuleissa — varmista `"type": "module"`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
