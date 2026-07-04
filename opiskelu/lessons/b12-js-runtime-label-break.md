# Sisäkkäisestä silmukasta ulos kahdesta tasosta. Lähestymistapa?

## Tilanne

Matriisin läpikäynti etsii arvoa ja pitää poistua sekä sisä- että ulkosilmukasta:

```javascript
for (let i = 0; i < rows.length; i++) {
  for (let j = 0; j < rows[i].length; j++) {
    if (rows[i][j] === target) {
      found = { i, j };
      break; // vain sisäsilmukka
    }
  }
}
```

`break` ei riitä ulos kahdesta tasosta ilman flagia.

## Ratkaisu

**Labeled break / refaktoroi funktioksi**:

```javascript
outer: for (let i = 0; i < rows.length; i++) {
  for (let j = 0; j < rows[i].length; j++) {
    if (rows[i][j] === target) {
      found = { i, j };
      break outer;
    }
  }
}

// tai:
function findTarget(rows, target) {
  for (let i = 0; ...) {
    for (let j = 0; ...) {
      if (rows[i][j] === target) return { i, j };
    }
  }
}
```

## Käytännössä

Early return funktiosta on usein luettavampi kuin labeled break. `Array.prototype.findIndex` + `some` välttävät sisäkkäiset breakit. Labeled break on harvinainen tuotantokoodissa — silti hyvä tuntea.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label)
