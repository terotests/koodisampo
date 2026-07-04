# Destructuroit { name, role = 'user' } — role puuttuu. Arvo?

## Tilanne

API-vastaus palauttaa käyttäjän ilman roolikenttää:

```javascript
const user = { name: 'Maija' };
const { name, role = 'user' } = user;

console.log(name); // 'Maija'
console.log(role); // ???
```

Destructuring on yleinen tapa purkaa objektin kentät funktioparametreissa ja API-vastauksissa. Mitä tapahtuu, kun kenttä puuttuu kokonaan — erotuksena `undefined`-arvosta?

## Ratkaisu

**role on 'user' — default destructuringissä** aktivoituu, kun property puuttuu tai arvo on `undefined`:

```javascript
const { name, role = 'user' } = { name: 'Maija' };
console.log(role); // 'user'

// Default EI aktivoidu jos arvo on null (paitsi jos tarkoituksella)
const { role: r1 } = { role: null };
console.log(r1); // null — ei 'user'

const { role: r2 } = { role: undefined };
console.log(r2); // 'user' — undefined laukaisee defaultin
```

Funktioparametreissa sama:

```javascript
function greet({ name, role = 'user' } = {}) {
  return `${name} (${role})`;
}
```

## Käytännössä

Default-arvot destructuringissa ovat tehokas tapa käsitellä puuttuvia API-kenttiä. Yhdistä nullish coalescingiin: `const role = user.role ?? 'user'`.

MDN: destructuring tukee myös uudelleennimeämistä `{ name: displayName }` ja sisäkkäistä purkamista.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
