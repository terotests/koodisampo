# async funktio heittää — unhandled rejection tuotannossa. Miten käsittelet?

## Tilanne

Tuotantopalvelimessa Node 18 kaataa prosessin yöllä:

```
UnhandledPromiseRejectionWarning: Error: Database connection lost
```

Stack trace osoittaa async-funktioon `syncInventory()`, jota kutsutaan cron-jobista ilman awaitia tai catchia:

```javascript
cron.schedule("0 * * * *", () => {
  syncInventory(); // fire-and-forget
});
```

## Ratkaisu

**try/catch awaitin ympärillä — async heittää rejectionina:**

```javascript
cron.schedule("0 * * * *", async () => {
  try {
    await syncInventory();
  } catch (err) {
    logger.error("Inventory sync failed", err);
    alertOps(err);
  }
});
```

Tai: `syncInventory().catch(logger.error)` — mutta älä jätä ilman käsittelyä.

## Käytännössä

Node 15+: unhandled rejection voi kaataa prosessin. Lisää `process.on('unhandledRejection', ...)` turvaverkkona, mutta korjaa juurisyy. Cron-jobit, event handlerit ja middleware — kaikki async-kutsut tarvitsevat catchin.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
