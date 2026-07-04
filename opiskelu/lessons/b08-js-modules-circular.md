# a.js importtaa b.js ja b.js importtaa a.js — export undefined initissä. Juurisyy?

## Tilanne

Kaksi moduulia riippuu toisistaan:

```javascript
// a.js
import { bValue } from './b.js';
export const aValue = 'a';
console.log('a sees b:', bValue); // undefined

// b.js
import { aValue } from './a.js';
export const bValue = 'b';
console.log('b sees a:', aValue); // undefined
```

Molemmat logit tulostavat `undefined` — ei syntax-virhettä, mutta data on väärä.

## Ratkaisu

**Circular dependency** — moduuli ei ole fully evaluated export-lukemisen hetkellä:

ESM evaluoi moduulit syklissä, mutta kun B alkaa evaluoida ja importtaa A:n, A:n exportit ovat vielä "live bindings" tilassa TDZ:ssä tai osittain alustettuina. Juurisyy on arkkitehtuurinen — ei parser-bugi.

Korjaus: refaktoroi jaettu koodi kolmanteen moduuliin tai poista toinen suunta importista.

## Käytännössä

Oire: `undefined` tai `ReferenceError` bootissa ilman selkeää stack tracea. Diagnostiikka: piirrä import-grafi (`madge`). Ennaltaehkäisy: domain-logiikka alhaalle, orchestration ylös — ei risti-importteja.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#cyclic-dependencies)
