# Set säilyttää uniikit — lisäät duplikaatin. Mitä tapahtuu?

## Tilanne

Deduplikoit käyttäjä-ID:t ennen API-kutsua:

```javascript
const ids = new Set();
ids.add(1);
ids.add(2);
ids.add(1);
console.log(ids.size);
```

Opiskelija olettaa size:n kasvavan kolmesta neljään.

## Ratkaisu

**Duplikaatti hylätään — size ei kasva**. Set säilyttää uniikit arvot `SameValueZero`-vertailulla:

```javascript
console.log(ids.size); // 2
console.log(ids.has(1)); // true
```

## Käytännössä

`NaN` on Setissä yksi arvo (toisin kuin Map-avaimena). Object-avaimet vertaillaan referenssillä — kaksi eri `{id:1}` ovat eri. `[...set]` muuntaa taulukoksi.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
