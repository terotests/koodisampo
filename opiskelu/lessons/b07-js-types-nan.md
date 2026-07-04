# parseInt palauttaa NaN — if (x === NaN) ei toimi. Oikea testi?

## Tilanne

Lomakevalidointi muuntaa käyttäjän syötteen numeroksi:

```javascript
const age = parseInt(form.age.value, 10);

if (age === NaN) {
  showError('Syötä numero');
}
// Tämä haara ei koskaan suoritu!
```

`NaN` on JavaScriptin ainoa arvo, joka ei ole yhtä kuin itsensä kanssa — IEEE 754 -standardin mukaisesti. Siksi `=== NaN` on aina `false`, myös `NaN === NaN`.

## Ratkaisu

**Number.isNaN(x) — NaN ei ole === itsensä kanssa JavaScriptissä:**

```javascript
const age = parseInt(form.age.value, 10);

if (Number.isNaN(age)) {
  showError('Syötä kelvollinen numero');
}
```

Huomaa ero globaaliin `isNaN`:iin:

```javascript
isNaN('hello');        // true — pakottaa Number()-muunnoksen
Number.isNaN('hello'); // false — tarkistaa vain NaN-tyypin
Number.isNaN(NaN);     // true
```

## Käytännössä

Validoi syöte ennen parsausta: `const n = Number(value); if (!Number.isFinite(n))`. `Object.is(value, NaN)` toimii myös, mutta `Number.isNaN` on selkeämpi.

MDN suosittelee `Number.isNaN` globaalin `isNaN` sijaan — se ei tee yllättäviä tyyppimuunnoksia.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)
