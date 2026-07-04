# Analytics beacon sivun unloadissa — fetch katkeaa. Vaihtoehto?

## Tilanne

Analytics haluaa lähettää beacon-tapahtuman kun käyttäjä sulkee välilehden. Tavallinen fetch katkeaa unload-tapahtumassa — data ei saavu palvelimelle. Google Analytics -tyyppinen "viimeinen klikkaus" jää lokitsematta.

## Ratkaisu

**fetch keepalive: true tai navigator.sendBeacon:**

```javascript
// fetch keepalive
fetch("/analytics/event", {
  method: "POST",
  body: JSON.stringify(event),
  keepalive: true,
});

// Tai sendBeacon (yksinkertaisempi)
navigator.sendBeacon("/analytics/event", JSON.stringify(event));
```

Keepalive jatkaa pyyntöä sivun sulkemisen jälkeen. sendBeacon on optimoitu tähän käyttöön.

## Käytännössä

sendBeacon: pienet payloadit, ei custom headereita helposti. keepalive: max 64 KB body. pagehide/unload-eventeissä — älä luota async/awaitiin ilman keepalivea. Testaa DevTools "Preserve log" + no throttling.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/fetch#keepalive)
