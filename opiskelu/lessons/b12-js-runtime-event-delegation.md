# Lista renderöi 500 riviä — jokaiselle riville oma click-listener. Suorituskykyongelma. Korjaus?

## Tilanne

Tuotelista renderöi 500 `<li>`-riviä, joista jokaiselle lisätään `click`-listener. Lista päivittyy usein — vanhoja listenereita jää roikkumaan ja mount-aika kasvaa.

## Ratkaisu

**Event delegation — yksi listener parentille, event.target tarkistus**:

```javascript
list.addEventListener("click", (e) => {
  const row = e.target.closest("[data-id]");
  if (!row) return;
  handleRowClick(row.dataset.id);
});
```

## Käytännössä

Delegation hyödyntää bubblingia. `pointer-events` ja disabled-napit vaativat huomiota. React 17+ delegoi root-tasolle — mutta custom DOM-koodi tarvitsee saman periaatteen.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)
