# global regex lastIndex bug loopissa — syy?

## Tilanne

Parsit tokenit silmukassa:

```javascript
const re = /\w+/g;
let match;
while ((match = re.exec(text)) !== null) {
  if (match[0] === "skip") continue;
  tokens.push(match[0]);
}
// joskus silmukka jää ikuiseen looppiin tai ohittaa osumia
```

`lastIndex` muistaa edellisen osuman globaalissa regexissä.

## Ratkaisu

**lastIndex muistaa viimeisen osuman — resetoi tai käytä matchAll**:

```javascript
for (const match of text.matchAll(/\w+/g)) {
  if (match[0] === "skip") continue;
  tokens.push(match[0]);
}

// tai ennen exec-silmukkaa: re.lastIndex = 0;
```

## Käytännössä

`matchAll` palauttaa iteratorin ilman lastIndex-ongelmia. `exec` sama regex-instanssi loopissa vaatii varovaisuutta. Sticky (`y`) ja unicode (`u`) liput vaikuttavat lastIndex-käyttäytymiseen.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)
