# Object.freeze ei estä nested muutoksia — config objekti mutatoitu. Miten syvä immutability?

## Tilanne

Konfiguraatio "jäädytetään" julkaisua varten:

```javascript
const config = Object.freeze({
  api: { baseUrl: "https://api.example.com", timeout: 5000 },
});
config.api.timeout = 9999; // ei toimi — freeze shallow
config.api.baseUrl = "https://evil.com"; // ONNISTUU!
```

Nested objektit ovat edelleen muokattavissa.

## Ratkaisu

Syvä immutability: **Rekursiivinen freeze tai structured clone + freeze — shallow ei suojaa nested**:

```javascript
function deepFreeze(obj) {
  Object.freeze(obj);
  for (const val of Object.values(obj)) {
    if (val && typeof val === "object") deepFreeze(val);
  }
  return obj;
}
```

## Käytännössä

Tuotantokoodissa Immer tai immutable-päivitysmallit ovat käytännöllisempiä kuin deep freeze. `Object.freeze` on shallow — dokumentoi tämä code reviewissa. TypeScript `readonly` on vain compile-time.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
