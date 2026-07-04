# Code review: `merge(userInput, defaults)` kopioi avaimet rekursiivisesti ilman __proto__ suojaa. Riski?

## Tilanne

Utility-funktio yhdistää käyttäjän asetukset oletuksiin:

```javascript
function merge(target, source) {
  for (const key of Object.keys(source)) {
    if (typeof source[key] === "object") {
      target[key] = merge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

merge(defaults, userInput);
```

Code reviewissa huomaat, ettei `__proto__`, `constructor` tai `prototype` suodateta pois.

## Ratkaisu

Riski on **prototype pollution — Object.prototype saastuu userInput-avaimilla**. Hyökkääjä voi lähettää `{"__proto__": {"isAdmin": true}}` ja muuttaa kaikkien objektien prototyyppiä.

```javascript
const safe = Object.assign(Object.create(null), defaults);
// tai käytä Mapia, tai kirjastoa joka estää proto-avaimet
```

## Käytännössä

Käytä `Object.create(null)` sanakirja-objekteille. Validoi avaimet allowlistilla. OWASP mainitsee prototype pollutionin yleisenä JSON-merge-haavoittuvuutena. `structuredClone` ei korvaa validointia.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
