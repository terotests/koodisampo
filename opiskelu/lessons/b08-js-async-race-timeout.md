# fetch ei saa roikkua yli 5 sekuntia — timeout ilman manuaalista flagia?

## Tilanne

Mikropalvelu kutsuu ulkoista geocoding-API:a. SLA vaatii 5 sekunnin timeoutin. Kehittäjä haluaa modernin ratkaisun ilman manuaalista flag-muuttujaa tai erillistä timeout-Promisea.

## Ratkaisu

**AbortSignal.timeout(5000):**

```javascript
try {
  const res = await fetch(geocodeUrl, {
    signal: AbortSignal.timeout(5000),
  });
  return await res.json();
} catch (err) {
  if (err.name === "TimeoutError" || err.name === "AbortError") {
    throw new ServiceUnavailableError("Geocoding timeout");
  }
  throw err;
}
```

Vaihtoehto: `Promise.race([fetch(...), timeoutPromise])` — mutta AbortSignal.timeout peruuttaa pyynnön oikein.

## Käytännössä

AbortSignal.timeout on selkein moderni API. Yhdistä retry-backoffiin 503/timeout-tilanteissa. Aseta timeout gateway-tasolla ja client-tasolla — defense in depth.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)
