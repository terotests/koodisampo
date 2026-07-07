# Haluat rakentaa tervehdyksen muuttujasta `name` ilman `+`-ketjua. Mikä syntaksi?

## Tilanne

Tervehdysviesti rakennetaan käyttäjän nimellä:

```javascript
const name = 'Maija';
const greeting = 'Hei ' + name + '!'; // toimii, mutta kömpelö
const multi = 'Käyttäjä ' + name + ' (id: ' + id + ') kirjautui ' + time;
// pitkä, vaikealukuinen + -ketju
```

Merkkijonojen yhdistäminen `+`-operaattorilla on virhealtista pitkissä lausekkeissa — sulut ja välilyönnit helposti väärin. Moni kieli tarjoaa interpoloinnin; JavaScript ES6:ssa se on template literal.

## Ratkaisu

**Template literal backtick-merkeillä** upottaa lausekkeet suoraan merkkijonoon:

```javascript
const name = 'Maija';
const greeting = `Hei ${name}!`;

const multi = `Käyttäjä ${name} (id: ${id}) kirjautui ${time}`;

// Monirivinen ilman \n-ketjua
const html = `
  <p>Hei ${name},</p>
  <p>Tervetuloa takaisin!</p>
`;
```

Backtick (`) erottaa template literalin tavallisista lainausmerkeistä.

## Käytännössä

Template literaleissa voi käyttää mitä tahansa lauseketta `${}`-sisällä: `Hei ${name.toUpperCase()}`. Tagged template literals (`sql`...`) ovat edistyneempi käyttö ORM-kyselyissä.

MDN: template literals tukevat myös raw-merkkijonoja ja monirivisyyttä natiivisti.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
