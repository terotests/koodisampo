# Lista kategorioista joissa items-array — tarvitset yhden tason listan kaikista itemeistä. Metodi?

## Tilanne

Verkkokaupan tuotelista on kategorioittain:

```javascript
const categories = [
  { name: "Kengät", items: ["lenkki", "saappaat"] },
  { name: "Lakit", items: ["pipot", "lippalakit"] },
];
```

Tarvitset yhden taulukon kaikista tuotenimistä ilman sisäkkäisiä taulukoita.

## Ratkaisu

Metodi: **categories.flatMap(c => c.items)**:

```javascript
const allItems = categories.flatMap(c => c.items);
// ["lenkki", "saappaat", "pipot", "lippalakit"]
```

`flatMap` on `map` + yhden tason `flat(1)` yhdistettynä.

## Käytännössä

Jos callback palauttaa ei-taulukon, se käsitellään yksittäisenä elementtinä. Syvempään litistykseen `flat(Infinity)`. `flatMap` on selkeämpi kuin `reduce` yksinkertaisissa tapauksissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
