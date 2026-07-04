# export default function App() — import?

## Tilanne

React-komponentti exportataan defaultina:

```javascript
// App.js
export default function App() {
  return <h1>Hello</h1>;
}
```

Uusi kehittäjä yrittää named importia:

```javascript
import { App } from './App.js'; // App on undefined
```

Default ja named export ovat eri asioita — aaltosulkeet vs ilman.

## Ratkaisu

**Default import** ilman aaltosulkeita:

```javascript
import App from './App.js';
```

Tai mielivaltaisella nimellä:

```javascript
import MyApp from './App.js';
```

Default export = yksi "pääexportti" moduulista — importin nimi on vapaasti valittavissa.

## Käytännössä

Frameworkit (React lazy: `lazy(() => import('./App.js'))`) odottavat usein defaultia. Named export on parempi util-funktioille — default sopii komponentin pääentryyn jos tiimi on yksimielinen.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
