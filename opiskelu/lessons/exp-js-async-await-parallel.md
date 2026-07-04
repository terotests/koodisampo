# Code review: kaksi await fetchiä peräkkäin — sivu latautuu hitaasti. Miten nopeutat?

## Tilanne

Code reviewissa huomaat, että sivun lataus kestää 2,4 sekuntia vaikka kaksi API-kutsua vastaa kumpikin ~1,2 sekunnissa. Koodi:

```javascript
const user = await fetchUser(id);
const orders = await fetchOrders(id);
```

Kutsut ovat riippumattomia — toinen ei tarvitse toisen tulosta.

## Ratkaisu

**Rinnakkainen suoritus Promise.all:lla:**

```javascript
const [user, orders] = await Promise.all([
  fetchUser(id),
  fetchOrders(id),
]);
```

Molemmat fetchit alkavat samanaikaisesti. Kokonaisaika ≈ hitaimman kutsun aika (~1,2 s), ei summa (~2,4 s).

## Käytännössä

Etsi code reviewissa peräkkäiset awaitit — ne ovat yleisin helppo optimointi. Huomaa riippuvuudet: jos orders tarvitsee userId:n user-objektista, rinnakkainen suoritus ei onnistu. Mittaa ennen/jälkeen DevTools Network-välilehdellä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
