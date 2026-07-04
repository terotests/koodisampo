# Funktio voi palauttaa käyttäjän tai null jos ei löydy. Paluutyyppi?

## Tilanne

Tietokantahaku palauttaa joko rivin tai tyhjän tuloksen. JavaScriptissä puuttuva tietue on usein `null`:

```typescript
function findUserByEmail(email: string) {
  const row = db.query(email);
  if (!row) return null;
  return { id: row.id, name: row.name };
}

const user = findUserByEmail('missing@example.com');
user.name; // runtime-virhe jos user on null
```

TypeScriptin pitää tietää, että paluuarvo ei ole aina käyttäjäobjekti.

## Ratkaisu

**User | null**:

```typescript
interface User {
  id: string;
  name: string;
}

function findUserByEmail(email: string): User | null {
  const row = db.query(email);
  if (!row) return null;
  return { id: row.id, name: row.name };
}

const user = findUserByEmail('missing@example.com');
if (user !== null) {
  console.log(user.name); // User — turvallista
}
```

Union type `|` yhdistää vaihtoehtoiset tyypit. Kutsujan on käsiteltävä `null`-haara ennen kenttien käyttöä.

## Käytännössä

`strictNullChecks` päällä `null` ja `undefined` eivät kuulu automaattisesti muihin tyyppeihin — union pakottaa tarkistuksen. Harkitse `User | undefined` jos API palauttaa puuttuvan arvon ilman eksplisiittistä `null`:ia. Optional chaining (`user?.name`) lyhentää ketjuja, mutta liiketoimintalogiikassa eksplisiittinen `if` on usein selkeämpi.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
