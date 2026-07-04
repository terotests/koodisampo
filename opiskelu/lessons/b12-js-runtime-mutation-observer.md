# Kolmas osapuoli injektoi DOM-muutoksia — haluat reagoida. API?

## Tilanne

Mainos-skripti tai CMS injektoi DOM-muutoksia sivulle. Haluat havaita, kun tiettyyn containeriin lisätään uusia solmuja, ja ajaa validoinnin.

## Ratkaisu

**MutationObserver callback DOM-muutoksille**:

```javascript
const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.addedNodes.length) sanitize(m.addedNodes);
  }
});
observer.observe(container, { childList: true, subtree: true });
```

## Käytännössä

Observer on async — callback ajetaan microtaskin jälkeen. `disconnect()` cleanupissa. Attribute-muutokset vaativat `attributes: true`. Liian laaja `subtree: true` voi olla kallis — rajaa scope.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
