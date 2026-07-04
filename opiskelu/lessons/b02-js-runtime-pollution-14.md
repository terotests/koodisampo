# Käyttäjän JSON merge objektiin — `__proto__` payload. Miten estät?

## Tilanne

REST-endpoint yhdistää käyttäjän JSON-asetukset oletusobjektiin:

```javascript
const config = { theme: "light", lang: "fi" };
Object.assign(config, JSON.parse(req.body));
```

Penetraatiotestissä payload `{"__proto__": {"polluted": true}}` tekee `({}).polluted === true` kaikkialla sovelluksessa.

## Ratkaisu

Estä: **Object.create(null) tai Map; vältä deep mergeä ilman avainvalidointia**:

```javascript
const config = Object.assign(Object.create(null), defaults);
const incoming = JSON.parse(req.body);
for (const key of Object.keys(incoming)) {
  if (key === "__proto__" || key === "constructor") continue;
  config[key] = incoming[key];
}
```

## Käytännössä

Node.js 20+ tarjoaa `Object.prototype.__proto__`-suojauksen osissa ympäristöistä, mutta älä luota siihen. Käytä `Map` tai `Object.create(null)` konfiguraatioille. Validoi JSON-schema ennen mergeä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
