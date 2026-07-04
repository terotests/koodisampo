# Silmukka lukee offsetHeight ja muuttaa stylea jokaisella kierroksella — UI jäätyy. Ongelma?

## Tilanne

Animaatio mittaa ja muuttaa elementtejä silmukassa:

```javascript
for (const el of elements) {
  const h = el.offsetHeight; // pakottaa layout-luvun
  el.style.height = h + 10 + "px"; // pakottaa reflow'n
}
```

UI jäätyy tuhansien elementtien kanssa — Performance-näkymässä "Layout" kestää sekunteja.

## Ratkaisu

Ongelma: **Layout thrashing — pakottaa reflow jokaisella read-write -parilla**. Batchaa lukemiset ja kirjoitukset:

```javascript
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => {
  el.style.height = heights[i] + 10 + "px";
});
```

## Käytännössä

FastDOM-kirjasto auttaa batchaamaan. `requestAnimationFrame` ryhmittää DOM-muutokset frameen. Vältä geometria-lukuja (`offsetHeight`, `getBoundingClientRect`) heti tyylin muutoksen jälkeen.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Glossary/Reflow)
