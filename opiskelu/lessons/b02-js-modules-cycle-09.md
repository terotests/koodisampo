# Kaksi moduulia importtaa toisensa — toinen export undefined init aikana. Ratkaisu?

## Tilanne

Event-bus ja logger riippuvat toisistaan:

```javascript
// eventBus.js
import { log } from './logger.js';
export const bus = { emit(e) { log(e); } };

// logger.js
import { bus } from './eventBus.js';
export function log(msg) { bus.emit('log', msg); }
```

Konsolissa: `Cannot read properties of undefined (reading 'emit')`. Moduuli A alkaa evaluoida, importtaa B:n, B yrittää lukea A:n exportin ennen kuin A on valmis.

## Ratkaisu

**Refaktoroi jaettu riippuvuus kolmanteen moduuliin** tai käytä **lazy import** funktion sisällä:

```javascript
// shared/events.js — ei importtaa loggeria
export const bus = createEventBus();

// logger.js
import { bus } from './shared/events.js';
export function log(msg) { console.log(msg); bus.emit('log', msg); }

// eventBus.js → poistetaan, logiikka shared/events.js:ssä
```

Vaihtoehto lazy importille:

```javascript
// logger.js
export function log(msg) {
  import('./eventBus.js').then(({ bus }) => bus.emit('log', msg));
}
```

## Käytännössä

Ensisijainen korjaus on arkkitehtuuri: erota infra (events, config) domain-logiikasta. Lazy import sopii harvoin kutsuttuihin riippuvuuksiin, ei init-polkuun.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
