# for-silmukassa 5 nappia — kaikki tulostavat 5. Klassinen bugi. Korjaus?

## Tilanne

Generoidaan viisi nappia silmukassa:

```javascript
for (var i = 0; i < 5; i++) {
  const btn = document.createElement("button");
  btn.textContent = `Nappi ${i}`;
  btn.onclick = () => alert(`Klikattu ${i}`);
  container.appendChild(btn);
}
```

Jokainen nappi näyttää "Klikattu 5" riippumatta numerostaan.

## Ratkaisu

Korjaus: **let i silmukassa tai IIFE/closure joka kaappaa arvon per iteratio**:

```javascript
for (let i = 0; i < 5; i++) {
  btn.onclick = () => alert(`Klikattu ${i}`);
}
```

## Käytännössä

DOM-generoinnissa `data-index`-attribuutti + event delegation on usein skaalautuvampi kuin 500 erillistä handleria. Closure-bugi on yleinen myös `setTimeout`- ja `Promise`-ketjuissa.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
