# BaseUser + adminRole — miten laajennat?

## Tilanne

Sovelluksessa on peruskäyttäjätyyppi ja erillinen admin-rooli lisäkentällä. Kehittäjä kopioi kentät uuteen interfaceen:

```typescript
interface BaseUser {
  id: string;
  email: string;
}

interface Admin {
  id: string;
  email: string;
  adminRole: string; // duplikaatio — BaseUser-muutos ei leviä
}
```

DRY rikkoutuu: `BaseUser`:iin lisätty kenttä pitää muistaa kopioida `Admin`:iin.

## Ratkaisu

**interface Admin extends BaseUser { adminRole: string }**:

```typescript
interface BaseUser {
  id: string;
  email: string;
}

interface Admin extends BaseUser {
  adminRole: string;
}

function isAdmin(user: BaseUser): user is Admin {
  return 'adminRole' in user;
}
```

`extends` perii base-tyypin kentät. `Admin` sisältää automaattisesti `id`, `email` ja `adminRole`.

## Käytännössä

Useita tasoja: `interface SuperAdmin extends Admin { permissions: string[] }`. `interface` voi laajentaa useita (`extends A, B`) — harvinaista. Jos tarvitset vain intersection ilman uudelleen avaamista, `type Admin = BaseUser & { adminRole: string }` on vaihtoehto. Valitse `extends` kun mallinnat perintöä selkeästi.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
