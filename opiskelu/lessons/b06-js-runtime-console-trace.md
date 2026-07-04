# Debug — tarvitset call stack ilman breakpointia. Mitä console-metodia?

## Tilanne

Bugi ilmenee vain tietyssä käyttäjäpolussa. Et halua jättää breakpointeja tuotantoon, mutta tarvitset call stackin kun virheellinen haara aktivoituu:

```javascript
if (user.role === "guest" && action === "delete") {
  // kuka kutsui tänne?
}
```

## Ratkaisu

**console.trace() — tulostaa call stackin ilman breakpointia**:

```javascript
if (user.role === "guest" && action === "delete") {
  console.trace("Unexpected delete attempt");
}
```

## Käytännössä

Poista trace-kutsut ennen mergeä mainiin tai käytä debug-lippua. `console.trace` on kevyt dev-työkalu; tuotantodiagnostiikkaan Sentry stack capture. `new Error().stack` antaa saman ilman konsolitulostusta.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/console/trace_static)
