# Redux-tyylinen store haluaa estää suoran state-mutaation. Shallow-immutability?

## Tilanne

Pieni Redux-tyylinen store haluaa estää vahingossa mutaation:

```javascript
function dispatch(action) {
  state = reducer(state, action);
}
// joku kutsuu suoraan: state.user.name = "x"
```

Kehityksessä haluat kaatua heti, jos joku mutatoi tilaa.

## Ratkaisu

**Object.freeze(state) — shallow; deep freeze erikseen jos tarvitaan**:

```javascript
function dispatch(action) {
  const next = reducer(state, action);
  state = Object.freeze(next);
}
```

## Käytännössä

Freeze on shallow — nested objektit vaativat deep freeze tai Immerin. Tuotannossa freeze on usein pois suorituskyvyn vuoksi. Redux Toolkit + Immer hoitaa immutabilityn kehitysympäristön varoituksilla.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
