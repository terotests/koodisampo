# Haluat importata JSON-moduulin ESM:llä selaimessa. Moderni syntaksi?

## Tilanne

Staattinen config selaimessa:

```javascript
// config.js
const res = await fetch('/config.json');
export const config = await res.json(); // ylimääräinen async wrapper
```

Haluat importata JSON suoraan moduulina — kuten TypeScriptin `resolveJsonModule`, mutta natiivisti selaimessa.

## Ratkaisu

**Import attributes** — `with { type: 'json' }`:

```javascript
// app.js
import data from './config.json' with { type: 'json' };

console.log(data.apiUrl);
```

Selain ja Node tietävät lukea tiedoston JSON:na — ei suoritettavaa JavaScript-koodia. Turvallisempaa kuin `fetch` + `eval`.

## Käytännössä

Vanhempi `assert { type: 'json' }` korvautuu `with`-lausekkeella. Bundlerit (Vite) voivat inlineata JSON build-aikana. Huomioi: JSON-moduuli on read-only snapshot — ei live-päivityksiä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with)
