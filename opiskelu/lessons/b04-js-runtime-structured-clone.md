# JSON.parse(JSON.stringify(obj)) rikkoo Date-objektit ja undefined-kentät. Parempi deep clone?

## Tilanne

Lomakkeen tila kopioidaan ennen "peruuta"-toimintoa:

```javascript
const snapshot = JSON.parse(JSON.stringify(formState));
// formState.meta.createdAt on Date
// formState.tags on Map
console.log(snapshot.meta.createdAt); // ISO-string
console.log(snapshot.tags); // {} eikä Map
```

Palautus rikkoo tyypit ja undefined-kentät katoavat.

## Ratkaisu

Parempi deep clone: **structuredClone(obj) — structured clone algorithm**:

```javascript
const snapshot = structuredClone(formState);
console.log(snapshot.meta.createdAt instanceof Date); // true
console.log(snapshot.tags instanceof Map); // true
```

## Käytännössä

Structured clone on sama algoritmi, jota `postMessage` käyttää. Se ei kloonaa prototyyppiketjua custom-luokille — luokka-instanssit muuttuvat tavallisiksi objekteiksi. Harkitse Immeriä interaktiivisessa UI:ssa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
