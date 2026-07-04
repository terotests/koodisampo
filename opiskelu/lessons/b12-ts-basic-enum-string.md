# Tila voi olla 'draft' | 'published' | 'archived'. Tyypitetty vakiomuoto ilman runtime enumia?

## Tilanne

CMS-artikkelilla on kolme tilaa. Kehittäjä kirjoittaa merkkijonoja suoraan koodiin:

```typescript
function publish(article: { status: string }) {
  article.status = 'published';
}

publish({ status: 'draf' }); // kirjoitusvirhe — kääntäjä ei huomaa
```

Runtime `enum` tuottaa ylimääräistä JavaScript-koodia ja voi yllättää bundlerin tree-shakingissa.

## Ratkaisu

**type Status = 'draft' | 'published' | 'archived'**:

```typescript
type Status = 'draft' | 'published' | 'archived';

interface Article {
  status: Status;
}

function publish(article: Article) {
  article.status = 'published';
}

// article.status = 'draf'; // virhe: Type '"draf"' is not assignable to type 'Status'

const ALLOWED: Status[] = ['draft', 'published', 'archived'];
```

String literal union rajoittaa arvot tarkkoihin merkkijonoihin compile-time ilman erillistä enum-rakennetta runtimeen.

## Käytännössä

`as const`-taulukko + union (`typeof STATUSES[number]`) pitää arvot yhdessä paikassa. Vertaa `enum Status { Draft = 'draft', ... }` — enum on ok kun tarvitset reverse mappingia tai namespacettyjä vakioita. Literal union on kevyempi ja suosittu modernissa TS-koodissa.

[Lue lisää](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)
