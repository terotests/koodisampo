# Globaali role == admin ei skaalaudu: projektin omistaja saa poistaa projektinsa, org-admin vain oman organisaationsa projektit. Mikä lähestymistapa?

## Tilanne

Globaali `role == "admin"` ei skaalaudu: projektin omistaja saa poistaa projektin, org-admin vain oman organisaationsa projektit.

## Ratkaisu

Tarvitaan resurssikohtainen policy: `canDeleteProject(user, project)`.

```ts
function canDeleteProject(user, project) {
  return project.ownerId === user.id ||
    user.organizations.some(org =>
      org.id === project.orgId && org.role === "admin"
    );
}
```

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
