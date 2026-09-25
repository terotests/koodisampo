# Käyttäjä painaa Peruuta — käynnissä olevan fetch-pyynnön pitää oikeasti keskeytyä. Mitä käytät?

## Tilanne

Pitkä fetch ja käyttäjän "Peruuta"-nappi. Kun käyttäjä peruuttaa, pyynnön pitää oikeasti katketa verkossa — ei vain lakata odottamasta vastausta.

## Ratkaisu

**AbortController: signal fetchiin ja controller.abort() peruutuksessa:**

```javascript
const controller = new AbortController();

cancelButton.addEventListener("click", () => controller.abort());

try {
  const res = await fetch(url, { signal: controller.signal });
  render(await res.json());
} catch (err) {
  if (err.name === "AbortError") showMessage("Peruutettu");
  else throw err;
}
```

`abort()` katkaisee HTTP-pyynnön ja hylkää fetchin promisen `AbortError`-virheellä.

## Käytännössä

Pelkkä `Promise.race([fetch(url), abortPromise])` ei peruuta mitään: race vain lopettaa odottamisen, ja pyyntö jatkuu taustalla kuluttaen kaistaa ja palvelimen resursseja. Välitä aina signal fetchiin. Timeoutiin `AbortSignal.timeout(ms)` ja useaan peruutuslähteeseen `AbortSignal.any([...])`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
