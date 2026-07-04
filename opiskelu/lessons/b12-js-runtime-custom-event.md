# Komponentit kommunikoivat ilman props-ketjua. DOM-ratkaisu?

## Tilanne

Web Components -pohjainen widget (datepicker) pitää ilmoittaa vanhemmalle React-sovellukselle valitusta päivästä ilman props-ketjua läpi DOM-puun.

## Ratkaisu

**new CustomEvent('name', { detail }) + dispatchEvent**:

```javascript
// web component
this.dispatchEvent(new CustomEvent("date-selected", {
  bubbles: true,
  detail: { date: selected },
}));

// React wrapper
ref.current.addEventListener("date-selected", (e) => {
  onChange(e.detail.date);
});
```

## Käytännössä

`bubbles: true` mahdollistaa delegationin. `composed: true` Shadow DOM:n läpi. React 17+ synteettiset eventit eroavat natiiveista — wrapper-elementti on usein tarpeen custom elementeille.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
