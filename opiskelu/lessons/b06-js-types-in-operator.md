# Code review: 'key' in obj vs obj.hasOwnProperty(key). Milloin in on oikea?

## Tilanne

Konfiguraatio-objekti perii oletusasetukset prototyypistä:

```javascript
const defaults = { theme: 'light', lang: 'fi' };
const userConfig = Object.create(defaults);
userConfig.fontSize = 16;

// Tarkistus: onko 'theme' määritelty?
'theme' in userConfig;              // true — peritty prototyypistä
userConfig.hasOwnProperty('theme'); // false — ei oma property
userConfig.hasOwnProperty('fontSize'); // true
```

Jos haluat tietää, onko avain *missä tahansa* objektin ketjussa (oma + peritty), `in` on oikea. Jos haluat vain *oman* propertyn, käytä `hasOwnProperty` tai modernimpaa `Object.hasOwn`.

## Ratkaisu

**in tarkistaa koko prototype-ketjun — hasOwnProperty vain oman propertyn:**

```javascript
// Haluatko tietää onko avain käytettävissä (myös peritty)?
if ('toString' in obj) { /* kaikilla objekteilla */ }

// Haluatko vain oman kentän (esim. serialisointi)?
if (Object.hasOwn(obj, 'theme')) {
  serialize(obj.theme);
}

// Turvallinen iterointi ilman perittyjä avaimia:
for (const [key, value] of Object.entries(obj)) { /* ... */ }
```

## Käytännössä

`for...in` iteroi myös perittyjä avaimia — siksi `Object.keys()` tai `Object.entries()` on turvallisempi. `Object.hasOwn()` (ES2022) korvaa `hasOwnProperty`-kutsun, joka voi olla ylikirjoitettu.

MDN: `in`-operaattori palauttaa boolean riippumatta arvosta — `'key' in { key: undefined }` on `true`.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in)
