# POST JSON toiselle domainille — selain lähettää OPTIONS ensin. Miksi?

## Tilanne

Frontend lähettää POST-pyynnön toiseen domainiin JSON-bodylla ja custom headerilla `X-Request-Id`:

```javascript
fetch("https://api.other.com/data", {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Request-Id": uuid },
  body: JSON.stringify(payload),
});
```

Network-välilehdellä näet ensin OPTIONS-pyynnön, vasta sitten POST.

## Ratkaisu

Selain tekee **CORS preflight — selain tarkistaa cross-origin -luvan custom headereille**. OPTIONS kysyy palvelimelta, sallitaanko metodi ja headerit.

```javascript
// Palvelimen vastaus:
// Access-Control-Allow-Origin: https://app.example.com
// Access-Control-Allow-Headers: Content-Type, X-Request-Id
```

## Käytännössä

"Simple request" (GET, tietyt headerit) ei vaadi preflightia. Preflight lisää latenssia — cache `Access-Control-Max-Age`. Varmista, että OPTIONS käsitellään oikein API-gatewayssä.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflighted_requests)
