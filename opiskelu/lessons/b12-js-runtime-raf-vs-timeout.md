# Animaatio päivittää DOM-elementin sijaintia 60 fps. Parempi kuin setInterval(16)?

## Tilanne

Peli-engine päivittää hahmon sijaintia 60 kertaa sekunnissa `setInterval(fn, 16)`:llä. Frame time vaihtelee ja animaatio ei ole synkassa näytön VSyncin kanssa.

## Ratkaisu

Parempi: **requestAnimationFrame — synkronoituu näytön päivitykseen**:

```javascript
function gameLoop(timestamp) {
  updatePhysics(timestamp);
  render();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
```

## Käytännössä

`timestamp`-parametri antaa deltan edelliseen frameen. Fixed timestep -fysiikka voi ajaa useita askelia yhdessä rAF-kutsussa. `setInterval` sopii ei-visuaalisiin tehtäviin (polling), ei animaatioon.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
