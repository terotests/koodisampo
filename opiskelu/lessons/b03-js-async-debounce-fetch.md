# Hakukenttä laukaisee fetch-jokaisella näppäimellä — API rate limit. Korjaus?

## Tilanne

Hakukenttä lähettää GET-pyynnön jokaisella näppäimellä. Käyttäjä kirjoittaa "javascript" — seitsemän pyyntöä sekunnissa. API palauttaa 429 Too Many Requests ja hakutulokset sekoittuvat, koska vanhemmat vastaukset saapuvat myöhässä.

Backend-tiimi pyytää frontend-korjausta ennen rate limit -nostoa.

## Ratkaisu

**Debounce + AbortController:**

```javascript
let timer;
let controller;

input.addEventListener("input", (e) => {
  clearTimeout(timer);
  controller?.abort();
  controller = new AbortController();

  timer = setTimeout(async () => {
    try {
      const res = await fetch(`/api/search?q=${e.target.value}`, {
        signal: controller.signal,
      });
      renderResults(await res.json());
    } catch (err) {
      if (err.name !== "AbortError") console.error(err);
    }
  }, 300);
});
```

Debounce odottaa 300 ms tauon; abort peruuttaa edellisen pyynnön.

## Käytännössä

Debounce-viive 200–400 ms on tyypillinen hakukentissä. AbortController estää race conditionin. Harkitse myös throttlea reaaliaikaisissa suodattimissa. Näytä loading-indikaattori debounce-viiveen aikana.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
