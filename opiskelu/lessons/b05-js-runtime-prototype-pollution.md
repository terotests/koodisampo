# Deep merge user JSON:sta — attacker lähettää `{"__proto__": {"isAdmin": true}}`. Riski?

## Tilanne

Asiakasportaali sallii käyttäjän tuoda JSON-asetuksia. Backend tekee deep mergen:

```javascript
deepMerge(defaults, JSON.parse(userJson));
// userJson: {"__proto__": {"isAdmin": true}}
```

Seuraavaksi `if (user.isAdmin)` voi palautua true jokaiselle objektille, jolla ei ole omaa `isAdmin`-kenttää.

## Ratkaisu

Riski: **Prototype pollution — Object.prototype muttuu kaikille objekteille**:

```javascript
if (Object.prototype.hasOwnProperty.call(obj, "isAdmin")) { ... }
// tai Object.create(null) + avainvalidointi
```

## Käytännössä

Käytä `Object.hasOwn(obj, key)` (ES2022) inherited vs own -erotteluun. npm-paketit kuten `lodash` vanhoissa versioissa olivat alttiita — päivitä ja validoi input. OWASP Prototype Pollution -cheatsheet on hyvä referenssi.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)
