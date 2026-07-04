# API palauttaa JSON-stringin — eval(data) parseen. Turvallinen tapa?

## Tilanne

Vanha koodi parsii API-vastauksen:

```javascript
const data = eval("(" + responseText + ")");
```

Turvallisuusauditissa todetaan, että vastaus voi sisältää mielivaltaista JavaScriptiä, ei pelkkää JSONia.

## Ratkaisu

Turvallinen tapa: **JSON.parse(data) — parsii datan ilman koodin suorittamista**:

```javascript
const data = JSON.parse(responseText);
```

JSON.parse hyväksyy vain JSON-grammatiikan — ei funktiokutsuja eikä lauseita.

## Käytännössä

`eval` on XSS-vektori, jos data on attacker-kontrolloitua. `JSON.parse` heittää virheen virheellisestä syötteestä. Validoi skeema (Zod) parse jälkeen. Älä sekoita JSON5:een ilman tarkoituksenmukaista tarvetta.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
