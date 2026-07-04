# SPA ei lähetä session-cookiea cross-origin API:lle. fetch-korjaus?

## Tilanne

SPA pyörii `app.example.com`-osoitteessa, API on `api.example.com`-palvelimella. Kirjautuminen onnistuu, mutta seuraavat API-kutsut palauttavat 401 — session-cookiea ei lähetetä cross-origin-pyynnöissä.

Selaimen DevTools näyttää, ettei Cookie-headeria ole mukana fetch-pyynnöissä.

## Ratkaisu

**credentials: 'include' fetchissä + CORS Allow-Credentials palvelimella:**

```javascript
fetch("https://api.example.com/me", {
  credentials: "include",
});
```

Palvelimen vastauksessa:
```
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://app.example.com  // ei *
```

Cookie tarvitsee `SameSite=None; Secure` cross-site -käyttöön.

## Käytännössä

Oletus `credentials: 'same-origin'` — cross-origin vaatii eksplisiittisen include. CORS * + credentials ei toimi. Testaa incognito-tilassa ja eri selaimilla — cookie-asetukset vaihtelevat.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/fetch#credentials)
