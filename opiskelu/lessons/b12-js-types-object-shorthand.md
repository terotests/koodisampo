# Mikä ES6-ominaisuus lyhentää `{ id: id, name: name }` kun muuttujien nimet vastaavat avaimia?

## Tilanne

REST-kutsu tarvitsee JSON-bodyn:

```javascript
const id = 42;
const name = 'Maija';

// Verbose:
const payload = {
  id: id,
  name: name,
};
```

Kun propertyn nimi ja muuttujan nimi ovat samat, ES6 property shorthand lyhentää kirjoittamista merkittävästi — erityisesti suurissa payloadeissa.

## Ratkaisu

**{ id, name } — property shorthand** on ES6:n lyhyt syntaksi:

```javascript
const id = 42;
const name = 'Maija';

const payload = { id, name };
// vastaa { id: id, name: name }

await fetch('/api/users', {
  method: 'POST',
  body: JSON.stringify(payload),
});
```

Toimii myös funktioiden paluuarvoissa: `return { id, name, createdAt: Date.now() };`

## Käytännössä

Shorthand toimii vain kun avain ja muuttujan nimi ovat identtiset. Method shorthand `{ save() { ... } }` lyhentää objektimetodeja samalla tavalla.

MDN object initializer dokumentoi myös computed property names: `{ [dynamicKey]: value }`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
