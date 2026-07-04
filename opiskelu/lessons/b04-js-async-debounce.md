# Hakukenttä laukaisee API-kutsun joka näppäimellä — palvelin ylikuormittuu. Ratkaisu?

## Tilanne

Tuotesuodatin lähettää API-kutsun jokaisella sliderin liikkeellä. Käyttäjä säätää hintaa nopeasti — kymmeniä pyyntöjä sekunnissa. Palvelin CPU 95 % ja muut endpointit hidastuvat.

Ei rate limitingiä gateway-tasolla — korjaus pitää tehdä frontendissä.

## Ratkaisu

**Debounce — odota tauko ennen fetchiä:**

```javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const search = debounce(async (query) => {
  const res = await fetch(`/api/products?q=${query}`);
  render(await res.json());
}, 300);

input.addEventListener("input", (e) => search(e.target.value));
```

Kutsu laukeaa vasta 300 ms sen jälkeen, kun käyttäjä lopetti kirjoittamisen.

## Käytännössä

Lodash debounce tai omat hookit (useDebouncedCallback) Reactissa. Debounce vs throttle: debounce odottaa tauon, throttle rajoittaa taajuutta tasaisesti. Suodattimissa debounce, scroll-eventeissä throttle.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)
