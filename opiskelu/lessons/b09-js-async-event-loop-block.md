# Express-endpoint jäädyttää koko palvelimen 30 sekunniksi raskaalla JSON-parsinnalla. Juurisyy?

## Tilanne

Express-endpoint vastaanottaa 50 MB JSON-payloadin ja parsii sen synkronisesti:

```javascript
app.post("/import", (req, res) => {
  const data = JSON.parse(req.body); // 30 sekuntia
  processImport(data);
  res.sendStatus(200);
});
```

Koko palvelin jäätyy 30 sekunniksi — kaikki muut pyynnöt jonottavat. Health check failaa, load balancer poistaa instanssin.

## Ratkaisu

**Synkroninen työ event loop -säieessä — siirrä worker threadiin tai pilko:**

```javascript
import { Worker } from "node:worker_threads";

app.post("/import", async (req, res) => {
  const result = await runInWorker("./parse-import.js", req.body);
  res.json(result);
});
```

Tai streaming parser (stream-json) — ei lataa koko payloadia muistiin kerralla.

## Käytännössä

Node on single-threaded event loop. Synkroninen JSON.parse, crypto, image resize → worker pool. Rajoita body size middlewarella. Mittaa event loop lag -metriikkaa (p99 > 100ms = ongelma).

[Lue lisää](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
