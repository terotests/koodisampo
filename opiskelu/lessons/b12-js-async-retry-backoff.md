# API palauttaa 503 — haluat uudelleenyrityksen eksponentiaalisella viiveellä. Rakenne?

## Tilanne

Integraatio ulkoiseen API:in palauttaa satunnaisesti 503 Service Unavailable. Yksittäinen retry ei riitä — palvelu tarvitsee aikaa toipua. Tarvitaan eksponentiaalinen backoff max retries -rajalla.

## Ratkaisu

**Loop: try await, catch, odota delay * 2^n, max retries:**

```javascript
async function fetchWithRetry(url, maxRetries = 5) {
  let delay = 200;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 503) throw new Error("503");
      return res;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }
}
```

Viive: 200ms → 400ms → 800ms → ...

## Käytännössä

Lisää jitter (satunnainen vaihtelu) estämään thundering herd. Retry vain idempotentteihin operaatioihin (GET) tai jos API tukee idempotency keytä. Lokita attempt-numero. AWS/Google suosittelevat exponential backoff + jitter.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/fetch)
