# Date.parse('01/02/2023') tulos vaihtelee locale:sta. Miten vältät?

## Tilanne

Käyttäjä syöttää päivämäärän lomakkeeseen ja backend odottaa UNIX-aikaleimaa:

```javascript
const input = '01/02/2023';
const timestamp = Date.parse(input);
```

US-locale tulkitsee tämän tammikuu 2, 2023 — EU-locale helmikuu 1, 2023. Sama koodi tuottaa eri aikaleiman riippuen selaimen kielestä, palvelimen timezone-asetuksesta ja `Date.parse`-implementaatiosta. Tuotannossa käyttäjät raportoivat "väärän päivän" satunnaisesti.

## Ratkaisu

**ISO 8601 YYYY-MM-DD tai Temporal API — välttää locale-riippuvaisen parsauksen:**

```javascript
// Suositus: ISO 8601
const input = '2023-02-01'; // aina 1.2.2023
const date = new Date(input + 'T00:00:00'); // tai Date.parse(input)

// Validoi formaatti regexillä ennen parsausta
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
if (!ISO_DATE.test(input)) throw new Error('Käytä muotoa VVVV-KK-PP');

// Moderni: Temporal API (tuettu modernissa Node/selaimissa)
const plain = Temporal.PlainDate.from('2023-02-01');
```

Älä koskaan parsaa `DD/MM/YYYY` tai `MM/DD/YYYY` ilman eksplisiittistä formaattia.

## Käytännössä

Näytä käyttäjälle selkeä formaatti ja validoi syöte. `Intl.DateTimeFormat` hoitaa näytön lokalisoinnin — erottele parsaus (ISO) ja esitys (locale).

MDN varoittaa `Date.parse`-epädeterminismistä. Temporal korvaa ajan kanssa monia Date-objektin ongelmia.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
