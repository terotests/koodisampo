# Parse HTML string turvallisesti ilman innerHTML suoraa?

## Tilanne

Käyttäjän syöttämä HTML fragmentti pitää renderöidä esikatseluun. Kehittäjä käyttää:

```javascript
preview.innerHTML = userHtml; // XSS-riski
```

Tarvitset turvallisemman parsinnan ennen sanitointia.

## Ratkaisu

**DOMParser.parseFromString + sanitize policy**:

```javascript
const doc = new DOMParser().parseFromString(userHtml, "text/html");
const clean = DOMPurify.sanitize(doc.body.innerHTML);
preview.innerHTML = clean;
```

## Käytännössä

DOMParser ei sanitoi — se vain parsii. DOMPurify tai Trusted Types pakollisia user HTML:lle. `text/html` vs `application/xml` valinta vaikuttaa virheenkäsittelyyn. CSP `script-src` estää inline-skriptit.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser)
