# Recursive funktio RangeError Maximum call stack. Syy?

## Tilanne

Rekursiivinen hakupuu ilman pohjatapausta:

```javascript
function walk(node) {
  for (const child of node.children) {
    walk(child); // ei base casea tyhjälle lehdelle oikein
  }
  if (node.parent) walk(node.parent); // sykli!
}
```

Selain heittää `RangeError: Maximum call stack size exceeded`.

## Ratkaisu

Syy: **Call stack overflow — liian syvä rekursio**:

```javascript
function walk(node, visited = new Set()) {
  if (visited.has(node)) return;
  visited.add(node);
  for (const child of node.children) walk(child, visited);
}
```

Tai käytä iteratiivista pinotun tietorakenteen ratkaisua.

## Käytännössä

JavaScript-engineillä stack depth on rajallinen (~10k–50k riippuen enginestä). Syvälle puille: iteratiivinen BFS/DFS. Tail call optimization ei ole luotettava JS:ssä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)
