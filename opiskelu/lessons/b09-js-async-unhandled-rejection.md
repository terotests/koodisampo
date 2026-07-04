# Tuotannossa `UnhandledPromiseRejection` kaataa Node-prosessin. Miten käsittelet?

## Tilanne

Node-palvelin kaatuu tuotannossa muutaman tunnin välein. Lokissa:

```
UnhandledPromiseRejection: TypeError: Cannot read property 'id' of undefined
```

Virhe tulee async route handlerista, jossa await-ketjussa yksi vaihe palauttaa undefined — catch puuttuu.

## Ratkaisu

**try/catch async-funktioissa + .catch() ketjuissa + process rejection handler:**

```javascript
// Reitti
app.get("/api/item/:id", async (req, res) => {
  try {
    const item = await fetchItem(req.params.id);
    res.json(item);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: "Internal error" });
  }
});

// Turvaverkko
process.on("unhandledRejection", (reason, promise) => {
  logger.fatal("Unhandled rejection", { reason });
  // harkitse graceful shutdown
});
```

## Käytännössä

Node 15+ exit code 1 unhandled rejectionista. Käytä express-async-errors tai wrapperia. Monitoroi unhandled rejection -metriikkaa. Älä nielaise virheitä process handlerissa — lokita ja hälytä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)
