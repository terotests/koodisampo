# parseInt('08') vanhassa JS:ssä — miksi radix 10 on pakollinen?

## Tilanne

Legacy-koodi parsii käyttäjän syöttämän numeron:

```javascript
const month = parseInt('08'); // vanhassa JS: 0 (oktaali!)
const month = parseInt('08', 10); // 8 — oikein
```

ES3-aikana `parseInt` tulkitsi etunollalla alkavat merkkijonot oktaali (kanta-8) -lukuina. `'08'` → `0`, koska 8 ei ole validi oktaalinumero. Vaikka modernit selaimet ovat korjanneet tämän, radixin jättäminen pois on edelleen code review -virhe.

## Ratkaisu

**Ilman radixia etunolla voi tulkita oktaaliksi historiallisesti** — aina anna radix eksplisiittisesti:

```javascript
parseInt('08', 10);  // 8 — desimaali
parseInt('0x10', 16); // 16 — heksadesimaali
parseInt('1010', 2);  // 10 — binääri

// Desimaaliparsinta oletuksena:
const n = parseInt(input, 10);
if (Number.isNaN(n)) {
  throw new Error('Ei kelvollinen kokonaisluku');
}
```

Moderni vaihtoehto: `Number.parseInt('08', 10)` — sama kuin globaali `parseInt`.

## Käytännössä

ESLint-sääntö `radix` vaatii radix-parametrin. Desimaaliparsintaan aina `10`. Hex-kentissä `16`. Desimaaliluvuille `Number()` tai `parseFloat` sopii paremmin.

MDN: `parseInt` leikkaa desimaalit pois — `parseInt('3.14', 10)` → `3`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)
