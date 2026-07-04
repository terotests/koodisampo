# fetch palauttaa promisen — haluat JSON-objektin. Ensimmäinen then-ketju?

## Tilanne

Junior-kehittäjä yrittää käsitellä fetch-vastauksen:

```javascript
const data = fetch("/api/users");
console.log(data.users); // undefined — data on Promise
```

fetch palauttaa promisen, ei JSON-objektia suoraan.

## Ratkaisu

**.then(res => res.json()) — Response.json() palauttaa promisen:**

```javascript
fetch("/api/users")
  .then((res) => res.json())
  .then((data) => console.log(data.users));
```

Async/await:

```javascript
const res = await fetch("/api/users");
const data = await res.json();
console.log(data.users);
```

## Käytännössä

Tarkista res.ok ennen json(): fetch ei rejectaa HTTP-virheillä. Kaksi awaitia (res, json) on normaali malli. Content-Type ei ole aina JSON — harkitse res.text() tai res.blob().

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/Response/json)
