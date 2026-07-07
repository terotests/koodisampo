# Kaksi riippumatonta peruutuslähdettä (esim. käyttäjän navigointi ja timeout) — fetch pitää keskeytyä jos kumpi tahansa laukeaa. Mikä standardi-API yhdistää signaalit?

## Tilanne

Fetch pitää peruuntua joko timeoutin tai käyttäjän peruutusnapin takia. Kaksi erillistä AbortControlleria — timeout-controller ja user-controller. Miten yhdistät signaalit yhteen fetchiin?

## Ratkaisu

**AbortSignal.any([signal1, signal2]):**

```javascript
const userController = new AbortController();
const timeoutSignal = AbortSignal.timeout(5000);

const res = await fetch(url, {
  signal: AbortSignal.any([userController.signal, timeoutSignal]),
});

cancelButton.onclick = () => userController.abort();
```

Fetch aborttaa kun jompikumpi signaali aborttaa.

## Käytännössä

AbortSignal.any on ES2024 — tarkista browser-tuki. Vanhempi: manual listener joka aborttaa yhteisen controllerin. AbortSignal.timeout + user abort on yleisin yhdistelmä. Lokita abort-syy erottelua varten.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/any_static)
