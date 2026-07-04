# Junior yrittää `const x = 1; x = 2;` — linter valittaa. Miksi?

## Tilanne

Uusi kehittäjä refaktoroi laskentafunktiota ja yrittää päivittää vakiota:

```javascript
const maxRetries = 3;
// ... myöhemmin samassa funktiossa ...
maxRetries = 5; // SyntaxError / TypeError: Assignment to constant variable
```

ESLint ja TypeScript merkitsevät rivin virheeksi. `const` ei tarkoita "muuttumaton arvo" vaan "muuttujaa ei voi uudelleensijoittaa" — se sitoo identiteetin, ei välttämättä sisältöä.

## Ratkaisu

**const estää uudelleensijoituksen — arvo ei voi vaihtua** tarkoittaa, että muuttujaa ei voi sitoa uudelleen:

```javascript
const maxRetries = 3;
// maxRetries = 5; // virhe

// Ratkaisu: käytä let, jos arvo muuttuu
let retries = 3;
retries = 5; // OK

// const objektin kanssa: viite pysyy, sisältö voi muuttua
const config = { retries: 3 };
config.retries = 5; // OK — objektin kenttä, ei uudelleensijoitus
```

## Käytännössä

Käytä `const` oletuksena — se tekee koodista helpommin luettavaa ja estää vahingossa uudelleensijoituksen. Käytä `let`, kun arvo todella muuttuu. Vältä `var` uudessa koodissa.

MDN: `const` on block-scoped kuten `let`. Objektien ja taulukoiden sisältö voi muuttua — vain muuttujan uudelleensijoitus on estetty.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)
