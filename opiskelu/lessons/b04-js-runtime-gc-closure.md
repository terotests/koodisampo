# SPA muistin käyttö kasvaa navigoidessa — vanhat DOM-viittaukset closureissa. Miten estät?

## Tilanne

SPA reitittää näkymiä ilman täyttä sivulatausta. Jokaisella näkymällä rekisteröidään listener, joka sulkee yli DOM-elementin:

```javascript
function mountDashboard() {
  const sidebar = document.querySelector(".sidebar");
  document.addEventListener("scroll", () => {
    sidebar.style.top = computeOffset(sidebar);
  });
  // unmount ei poista listeneria eikä nollaa sidebar-viittausta
}
```

Performance-profiilissa muisti kasvaa jokaisen navigoinnin jälkeen.

## Ratkaisu

**Poista event listenerit ja nollaa viittaukset teardownissa; WeakRef/WeakMap tarvittaessa**:

```javascript
function mountDashboard() {
  const sidebar = document.querySelector(".sidebar");
  const onScroll = () => { sidebar.style.top = computeOffset(sidebar); };
  document.addEventListener("scroll", onScroll);
  return () => {
    document.removeEventListener("scroll", onScroll);
  };
}
```

## Käytännössä

React/Vue hoitavat teardownin usein automaattisesti, mutta manuaaliset listenerit vaativat huomion. Chrome DevTools Memory → "Detached nodes" auttaa diagnosoinnissa. AbortController sopii myös fetch-kuuntelijoihin.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)
