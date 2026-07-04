# Node EventEmitter 'data' listenerit kasaantuvat — MaxListenersExceededWarning. Korjaus?

## Tilanne

Node-palvelin varoittaa:

```
MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
11 data listeners added to [Socket].
```

Jokainen API-pyyntö lisää uuden 'data'-listenerin streamiin, mutta ei poista vanhaa — listenerit kasaantuvat.

## Ratkaisu

**Poista listener removeListener/off:lla tai käytä once:**

```javascript
function handleData(chunk) {
  process(chunk);
}

stream.on("data", handleData);
// kun valmis:
stream.off("data", handleData);

// Tai kertaluontoinen:
stream.once("end", cleanup);
```

once() poistaa listenerin automaattisesti ensimmäisen kutsun jälkeen.

## Käytännössä

Aina cleanup: off/removeListener kun komponentti unmountataan tai pyyntö päättyy. pipeline() ja finished() hoitavat stream-cleanupin. MaxListenersExceededWarning = todennäköinen memory leak — tutki heti.

[Lue lisää](https://nodejs.org/api/events.html)
