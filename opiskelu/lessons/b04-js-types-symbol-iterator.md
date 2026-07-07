# Oma luokka pitää käyttäytyä kuten natiivi taulukko for...of-silmukassa ja spreadissa. Mitä well-known symbolia luokka tarvitsee?

## Tilanne

Rakennat oman `Queue`-luokan, joka tallentaa alkioita sisäiseen taulukkoon:

```javascript
class Queue {
  #items = [];
  enqueue(item) { this.#items.push(item); }
  dequeue() { return this.#items.shift(); }
}

const q = new Queue();
q.enqueue(1);
q.enqueue(2);

for (const item of q) { /* TypeError: q is not iterable */ }
[...q]; // TypeError
```

JavaScriptin `for...of` ja spread (`...`) vaativat *iterable*-protokollan — objektin, jolla on `[Symbol.iterator]`-metodi.

## Ratkaisu

**Symbol.iterator metodi joka palauttaa iterator-objektin** tekee luokasta iterable:

```javascript
class Queue {
  #items = [];

  enqueue(item) { this.#items.push(item); }
  dequeue() { return this.#items.shift(); }

  [Symbol.iterator]() {
    let index = 0;
    const items = this.#items;
    return {
      next() {
        if (index < items.length) {
          return { value: items[index++], done: false };
        }
        return { done: true };
      }
    };
  }
}

const q = new Queue();
q.enqueue(1);
q.enqueue(2);

for (const item of q) console.log(item); // 1, 2
console.log([...q]); // [1, 2]
```

Generaattorifunktio on usein siistimpi: `[Symbol.iterator]() { yield* this.#items; }`.

## Käytännössä

Iterable-protokolla on sama, jota Array, Map ja Set käyttävät. `Symbol.iterator` on well-known symbol — MDN Iteration protocols dokumentoi vaatimukset.

Spread ja destructuring toimivat automaattisesti, kun iterable on kunnossa. Tämä on keskeinen osa modernia JavaScript-API-suunnittelua.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
