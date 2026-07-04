# Julkinen API-tyyppi ilman salaisia kenttiä. Kaksi vaihtoehtoa?

## Tilanne

Sisäinen `User`-malli sisältää salasanan hashin, mutta JSON-vastaus asiakkaalle ei saa vuotaa sitä:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

function toJson(user: User) {
  return user; // vuotaa passwordHash — vaarallista
}
```

Tarvitaan julkinen näkymätyyppi ilman ylläpitämistä kahta täysin erillistä mallia.

## Ratkaisu

**Omit<User, 'password'> tai Pick julkisille**:

```typescript
type PublicUser = Omit<User, 'passwordHash'>;

// tai eksplisiittinen valinta:
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

function toJson(user: User): PublicUser {
  const { passwordHash, ...publicFields } = user;
  return publicFields;
}
```

`Omit<T, K>` poistaa kentät. `Pick<T, K>` valitsee vain halutut. Molemmat johdetaan samasta lähtötyypistä — muutos `User`:iin heijastuu johdettuun tyyppiin.

## Käytännössä

Useita poistettavia kenttiä: `Omit<User, 'passwordHash' | 'internalNotes'>`. `Pick` on selkeämpi kun julkisia kenttiä on vähän; `Omit` kun salaisia kenttiä on vähän. Yhdistä: `Pick<User, 'id' | 'name'> & { avatarUrl: string }`.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
