# Hidas API — haluat timeoutin 5s jälkeen AbortError. Oikea yhdistelmä?

## Tilanne

Maksun vahvistus kutsuu hitaalle pankki-API:lle. Jos vastaus kestää yli 5 sekuntia, käyttäjälle näytetään virhe ja retry-nappi. Nykyinen koodi ei peruuta roikkuvaa pyyntöä — se voi valmistua myöhemmin ja aiheuttaa duplikaattimaksun.

## Ratkaisu

**AbortController + setTimeout:**

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch("/api/payment/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
    signal: controller.signal,
  });
  if (!res.ok) throw new Error("Maksu epäonnistui");
  return await res.json();
} catch (err) {
  if (err.name === "AbortError") {
    throw new Error("Maksu timeout — yritä uudelleen");
  }
  throw err;
} finally {
  clearTimeout(timeoutId);
}
```

## Käytännössä

AbortError ≠ network error — erottele käyttäjäviestit. Idempotentti retry maksuissa. Harkitse AbortSignal.timeout(5000) lyhyempään syntaksiin. Lokita timeoutit erikseen SLA-seurantaa varten.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
