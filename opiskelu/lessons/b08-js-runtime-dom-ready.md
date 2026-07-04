# Script headissä — document.getElementById palauttaa null. Milloin DOM on valmis?

## Tilanne

Skripti on HTML:n `<head>`:ssä ilman `defer`:

```html
<head>
  <script src="app.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
```

```javascript
// app.js
const el = document.getElementById("root"); // null
```

Elementtiä ei ole vielä parsittu, kun skripti ajetaan.

## Ratkaisu

DOM on valmis **DOMContentLoaded — tai script defer/module body:n lopussa**:

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("root");
});

// tai <script defer src="app.js">
// tai <script type="module"> (defer oletuksena)
```

## Käytännössä

`defer` säilyttää suoritusjärjestyksen. `async` lataa rinnakkain mutta ajaa heti — ei takaa DOM:ia. `load`-event odottaa kuvia; `DOMContentLoaded` riittää useimmiten. Bundlerit (Vite) injektoivat module-skriptit body:n loppuun.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event)
