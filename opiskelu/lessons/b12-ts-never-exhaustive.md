# switch union — default: const _x: never = x. Tarkoitus?

## Tilanne

Tilaenum käsitellään switchissä. Uusi tila lisätään myöhemmin, mutta switch jää päivittämättä:

```typescript
type Status = 'draft' | 'published' | 'archived';

function label(status: Status): string {
  switch (status) {
    case 'draft': return 'Luonnos';
    case 'published': return 'Julkaistu';
    // 'archived' unohtui — ei compile-virhettä
    default: return 'Tuntematon';
  }
}
```

Puuttuva haara paljastuu vasta testissä tai tuotannossa.

## Ratkaisu

**null/undefined erotellaan — optional chaining tarpeen**:

```typescript
function label(status: Status): string {
  switch (status) {
    case 'draft': return 'Luonnos';
    case 'published': return 'Julkaistu';
    case 'archived': return 'Arkistoitu';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
```

`never` tarkoittaa "ei arvoa". Jos unioniin lisätään uusi variantti (esim. `'scheduled'`), `status` default-haarassa ei ole enää `never` — kääntäjä antaa virheen. Sama ajatus kuin `strictNullChecks`: pakota käsittelemään kaikki mahdolliset arvot; optional chaining (`obj?.field`) erottaa puuttuvan (`undefined`/`null`) määritellystä arvosta.

## Käytännössä

Nimeä `_exhaustive` tai `_status` — eslint unused-vars sallii alaviivalla. `assertNever(x: never): never` apufunktio keskittää mallin. Return-tyypin sijaan `throw new Error('Unhandled')` defaultissa jos haluat runtime-varmistuksen. Pidä union ja switch samassa PR:ssä kun lisäät variantin.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
