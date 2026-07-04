# Hakukenttä laukaisee API-kutsun jokaisella näppäimellä — palvelin ylikuormittuu. Ratkaisu?

## Tilanne

Autocomplete-komponentti lähettää POST-pyynnön jokaisella näppäimellä. Käyttäjä kirjoittaa nopeasti "helsinki" — kahdeksan pyyntöä, palvelin vastaa 503. Vanhemmat vastaukset saapuvat myöhässä ja näyttävät väärät ehdotukset.

## Ratkaisu

**Debounce — odota tauko ennen kutsua:**

```javascript
function debounce(fn, ms) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}

const fetchSuggestions = debounce(async (term) => {
  const res = await fetch("/api/suggest", {
    method: "POST",
    body: JSON.stringify({ term }),
  });
  setSuggestions(await res.json());
}, 250);
```

Kutsu laukeaa vasta kun käyttäjä on pysähtynyt 250 ms.

## Käytännössä

React: useMemo/useCallback debounced funktiolle. Yhdistä debounce + AbortController race conditionin estoon. Näytä "Haetaan..." debounce-viiveen jälkeen, ei heti.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)
