# Bundle on iso vaikka käytät yhtä lodash-funktiota. Import-korjaus?

## Tilanne

Komponentti tarvitsee vain debounce-funktion:

```javascript
// search.js
import _ from 'lodash';
export const onSearch = _.debounce(handleSearch, 300);
```

Bundle-analyysi näyttää koko lodash-kirjaston (~70 KB minified) — bundler ei voi poistaa käyttämättömiä funktioita, koska import on koko namespace.

## Ratkaisu

**Named import** tree-shake-ystävällisestä paketista:

```javascript
// search.js
import { debounce } from 'lodash-es';

export const onSearch = debounce(handleSearch, 300);
```

`lodash-es` on ESM-muoto — staattinen named import antaa bundlerille tiedon, että vain `debounce` tarvitaan.

## Käytännössä

Vaihtoehto: `import debounce from 'lodash/debounce'` (polku-import). Varmista että bundlerin `sideEffects: false` on päällä paketissa. Älä `import * as _` koko kirjastosta.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
