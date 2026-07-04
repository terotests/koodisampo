# Hakukenttä laukaisee API-kutsun jokaisella näppäinpainalluksella. Optimointi?

## Tilanne

Hakukenttä kutsuu `/api/search?q=` jokaisella `input`-tapahtumalla. Nopea kirjoittaja lähettää 8 pyyntöä sekunnissa — backend valittaa ja vanhat vastaukset saapuvat myöhässä.

## Ratkaisu

**debounce — odota tauko ennen hakua**:

```javascript
let timer;
input.addEventListener("input", (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => search(e.target.value), 300);
});
```

## Käytännössä

Yhdistä debounce + AbortController race conditionin estoon. 200–400 ms on tyypillinen viive. Throttle sopii scroll/resize-tapahtumiin, debounce hakukenttiin. Näytä loading debounce-viiveen aikana.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)
