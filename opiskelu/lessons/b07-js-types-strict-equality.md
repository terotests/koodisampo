# Bug: `if (!userId)` hylkää validin arvon `0`. Mikä tarkistus on turvallisempi?

## Tilanne

Admin-paneeli hakee käyttäjän ID:llä URL-parametrista:

```javascript
const userId = parseInt(params.id, 10);

if (!userId) {
  return redirect('/users'); // "ei validia ID:tä"
}
```

Järjestelmän ensimmäisellä käyttäjällä ID on `0` (tai testiympäristössä). `!0` on `true`, joten pyyntö ohjataan pois — vaikka ID on täysin validi.

Falsy-tarkistus sekoittaa "puuttuvan arvon", "nollan" ja "NaN:n" keskenään.

## Ratkaisu

**Eksplisiittinen null/undefined-tarkistus — 0 on validi id, !userId hylkää sen:**

```javascript
const userId = parseInt(params.id, 10);

if (params.id == null || Number.isNaN(userId)) {
  return redirect('/users');
}

// userId voi olla 0 — se on OK
fetchUser(userId);
```

Tai tarkemmin merkkijonotasolla ennen parsausta:

```javascript
if (typeof params.id !== 'string' || params.id.trim() === '') {
  return redirect('/users');
}
```

## Käytännössä

Älä käytä `if (!id)` numeerisille tunnisteille. Tarkista `null`/`undefined` erikseen ja validoi parsauksen tulos `Number.isNaN`:lla.

MDN truthy/falsy: `0`, `''`, `false`, `null`, `undefined`, `NaN` ovat falsy — mutta vain `null` ja `undefined` tarkoittavat "puuttuvaa arvoa".

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality)
