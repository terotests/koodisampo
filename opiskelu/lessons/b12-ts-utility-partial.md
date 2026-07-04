# Update DTO sallii osan kentistä. Utility type?

## Tilanne

REST API:n `PATCH /users/:id` hyväksyy osittaisen päivityksen — kaikki kentät eivät ole pakollisia:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
}

function updateUser(id: string, patch: User) {
  // patch vaatii kaikki kentät — liian tiukka
}
```

Kutsujat joutuisivat lähettämään koko objektin tai tekemään duplikaatti-tyypin käsin.

## Ratkaisu

**Partial<User>**:

```typescript
function updateUser(id: string, patch: Partial<User>) {
  return repo.merge(id, patch);
}

updateUser('u1', { email: 'new@example.com' }); // ok — vain yksi kenttä
```

`Partial<T>` muuttaa jokaisen kentän valinnaiseksi (`name?`, `email?`, ...). Sopii päivitys-DTO:ihin ja konfiguraatiopäivityksiin.

## Käytännössä

`Required<T>` on vastakohta. `Partial` ei poista `id`:tä pakollisuudesta jos se oli pakollinen — harkitse `Omit<User, 'id'>` + `Partial` erikseen. Runtime-validoinnissa `Partial` ei takaa mitään — API-kerros validoi silti sallitut kentät.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
