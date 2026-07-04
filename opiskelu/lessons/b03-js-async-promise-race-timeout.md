# fetch ei timeouttaa natiivisti — käyttäjä jää odottamaan ikuisesti. Moderni pattern?

## Tilanne

Tuotantoon mennyt fetch-kutsu ei timeouttaa natiivisti. Kun CDN on alhaalla, selain jää odottamaan ikuisesti — käyttäjät sulkevat välilehden. Vanha koodi käyttää manuaalista flagia:

```javascript
let timedOut = false;
setTimeout(() => { timedOut = true; }, 5000);
```

Flag ei peruuta pyyntöä — resurssit jäävät roikkumaan.

## Ratkaisu

**AbortSignal.timeout(ms) — moderni standarditapa:**

```javascript
const res = await fetch("/api/data", {
  signal: AbortSignal.timeout(5000),
});
```

Vaihtoehto vanhemmille ympäristöille:

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);
try {
  const res = await fetch("/api/data", { signal: controller.signal });
} finally {
  clearTimeout(timeoutId);
}
```

## Käytännössä

AbortSignal.timeout on tuettu modernissa Chromessa, Firefoxissa ja Node 18+. Aseta timeout kaikkiin ulkoisiin kutsuihin — oletus "ei timeoutia" on tuotantoriski. Käsittele AbortError erikseen käyttäjäystävällisellä viestillä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)
