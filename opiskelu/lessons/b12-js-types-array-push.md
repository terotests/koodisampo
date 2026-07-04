# Lista `items = []` — haluat lisätä uuden rivin loppuun. Metodi?

## Tilanne

Ostoskorin tila alkaa tyhjänä taulukkona. Käyttäjä lisää tuotteen:

```javascript
let items = [];

// Väärä tapa: items[items.length] = product — toimii, mutta ei idiomaattinen
// Väärä tapa: items = [...items, product] — turha kopio yksinkertaiseen lisäykseen
```

Taulukon loppuun lisääminen on yksi yleisimmistä operaatioista. JavaScript tarjoaa siihen suoran mutatoivan metodin, joka palauttaa myös uuden pituuden.

## Ratkaisu

**items.push(newItem)** lisää elementin taulukon loppuun:

```javascript
const items = [];
items.push({ id: 1, name: 'Kahvi' });
items.push({ id: 2, name: 'Pulla' });
console.log(items.length); // 2

// Useita kerralla
items.push({ id: 3 }, { id: 4 });
```

`push` muokkaa alkuperäistä taulukkoa — jos tarvitset uuden kopion, käytä spreadia: `[...items, newItem]`.

## Käytännössä

`push` on O(1) amortisoituna. Alkuun lisäämiseen `unshift` (hitaampi isoilla taulukoilla). Poistamiseen lopusta `pop()`, alusta `shift()`.

MDN: `push` palauttaa uuden `length`-arvon — hyödyllinen ketjutuksessa, vaikka harvoin tarvitaan.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
