# PATCH /api/users/me — backend tekee Object.assign(user, req.body) ja save(). Body sisältää displayName, role: admin ja isEmailVerified: true. Mikä riski?

## Tilanne

```http
PATCH /api/users/me
{ "displayName": "Tero", "role": "admin", "isEmailVerified": true }
```

Backend: `Object.assign(user, req.body)` → `user.save()`.

## Ratkaisu

**Mass assignment / overposting.**

- Hyväksy vain whitelistatut kentät
- Erota input DTO ja tietokantamalli
- Älä koskaan bindaa koko request bodyä suoraan domain-objektiin

```ts
const allowed = {
  displayName: req.body.displayName,
  timezone: req.body.timezone,
};
await updateUser(user.id, allowed);
```

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
