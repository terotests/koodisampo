# Kaikki array-instanssit saivat uuden metodin forEachin jälkeen — mitä teit?

## Tilanne

Tiimin utility-tiedosto "parantaa" Array-prototyyppiä:

```javascript
Array.prototype.last = function () {
  return this[this.length - 1];
};
```

Myöhemmin kolmannen osapuolen kirjasto ylikirjoittaa saman nimen, ja vanha koodi käyttäytyy eri tavalla riippuen latausjärjestyksestä.

## Ratkaisu

Teit: **Array.prototype muokattu — vältä, käytä erillistä utility-funktiota**:

```javascript
function last(arr) {
  return arr[arr.length - 1];
}
// tai arr.at(-1) natiivisti
```

## Käytännössä

Native prototype -muokkaus rikkoo for...in-looppeja, odottamattomia iterointeja ja muistuttaa prototype pollutionia. ESLint `no-extend-native` estää tämän. Polyfillit kuuluvat erillisiin paketteihin.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)
