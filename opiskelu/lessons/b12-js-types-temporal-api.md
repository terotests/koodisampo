# Date on mutatoitava ja timezone-bugeja. Moderni ES-proposal korvaajaksi?

## Tilanne

Varausjärjestelmä laskee majoituksen keston:

```javascript
const checkIn = new Date('2024-03-01');
checkIn.setDate(checkIn.getDate() + 7);
// checkIn on nyt muuttunut — alkuperäinen menetetty!

// Timezone-bugi:
new Date('2024-03-01'); // UTC vs paikallinen — riippuu formaatista
date.getMonth(); // paikallinen
date.getUTCMonth(); // UTC — helposti sekaisin
```

`Date`-objekti on mutable — metodit kuten `setDate` muuttavat sitä paikan päällä. Aikavyöhyke- ja kesäaika-bugit ovat yksi yleisimmistä tuotantoon päätyvistä aikabugeista.

## Ratkaisu

**Temporal API (stage 3) — immutable datetime** tarjoaa erilliset, muuttumattomat tyypit:

```javascript
const checkIn = Temporal.PlainDate.from('2024-03-01');
const checkOut = checkIn.add({ days: 7 });
// checkIn on edelleen '2024-03-01' — ei mutatoitu

const meeting = Temporal.ZonedDateTime.from('2024-03-01T10:00[Europe/Helsinki]');
meeting.toPlainDate(); // selkeä timezone-käsittely
```

Temporal erottaa päivämäärän (`PlainDate`), kellonajan (`PlainTime`) ja aikavyöhykkeen (`ZonedDateTime`).

## Käytännössä

Temporal on saatavilla modernissa Node.js:ssä ja selaimissa (polyfill npm `@js-temporal/polyfill`). Uudessa koodissa preferoi Temporalia Date:n sijaan — erityisesti lokalisoiduissa sovelluksissa.

MDN Temporal-dokumentaatio kattaa migraation Date:stä. ISO 8601 -merkkijonot ovat edelleen paras rajapinta API:en välillä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
