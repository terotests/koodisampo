# Custom animaatio pätkii — setInterval 16 ms ei synkronoidu näytön refreshiin. Korjaus?

## Tilanne

Custom slider-animaatio käyttää:

```javascript
setInterval(() => {
  pos += 2;
  thumb.style.left = pos + "px";
}, 16);
```

Animaatio pätkii eri näytöillä, kuluttaa akkua taustalla ja jatkuu välilehden ollessa piilossa.

## Ratkaisu

**requestAnimationFrame synkronoituu näytön refreshiin — sulavampi animaatio**:

```javascript
function tick() {
  pos += 2;
  thumb.style.left = pos + "px";
  if (pos < max) requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```

## Käytännössä

rAF pysähtyy piilotetulla välilehdellä. CSS `transform` + `transition` on usein tehokkaampi kuin JS-animaatio. `cancelAnimationFrame` cleanupissa. 120 Hz näytöillä rAF seuraa oikeaa refreshiä — toisin kuin kiinteä 16 ms.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
