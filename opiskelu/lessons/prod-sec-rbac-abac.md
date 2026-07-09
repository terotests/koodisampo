# Globaali role == admin ei skaalaudu: projektin omistaja saa poistaa projektinsa, org-admin vain oman organisaationsa projektit. Mikä lähestymistapa?

## Tilanne

Globaali `role == "admin"` ei skaalaudu: projektin omistaja saa poistaa projektin, org-admin vain oman organisaationsa projektit.

## Riski

Globaali rooli ei erota org-rajoja eikä resurssikohtaista omistajuutta.

## Miksi tämä on vaarallista

Kirjautuminen tai globaali admin-rooli ei kerro, saako käyttäjä poistaa tietyn projektin. Uudet roolit tai puuttuvat tiedot eivät saa vahingossa antaa pääsyä.

## Väärä korjaus

"Lisää rooli super-admin joka voi kaiken" — ei skaalaudu eikä rajaa org-rajoja.

"Tallenna rooli JWT:hen — se riittää kaikkiin päätöksiin" — token ei korvaa resurssikohtaista policyä.

## Parempi korjaus

Tarvitaan resurssikohtainen policy: `canDeleteProject(user, project)`. Policy-funktion pitää palauttaa oletuksena false.

```ts
function canDeleteProject(user, project) {
  if (!user || !project) return false;
  return project.ownerId === user.id ||
    user.organizations.some(org =>
      org.id === project.orgId && org.role === "admin"
    );
}
```

## Testit

Testaa vähintään:

- omistaja saa poistaa
- saman organisaation admin saa poistaa
- toisen organisaation admin ei saa poistaa
- tavallinen jäsen ei saa poistaa
- kirjautumaton ei saa poistaa
- poistettu/deaktivoitu käyttäjä ei saa poistaa

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
