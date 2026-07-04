# Event handler kutsuu `saveData()` async-funktiota ilman awaitia eikä lisää `.catch()`. Promise hylätään. Mikä riski?

## Tilanne

Tuotantobugi: "Tallenna"-nappi kutsuu `saveData()` async-funktiota suoraan click handlerissa:

```javascript
button.addEventListener("click", () => {
  saveData(formValues); // ei await, ei .catch()
});
```

Kun tallennus failaa, käyttäjä ei saa virheilmoitusta. Yöllä Node-prosessi kaatuu unhandled rejectioniin — virhe jää huomaamatta päivällä.

## Ratkaisu

**Fire-and-forget async vaatii .catch() — muuten unhandled rejection:**

```javascript
button.addEventListener("click", () => {
  saveData(formValues).catch((err) => {
    showToast("Tallennus epäonnistui");
    logger.error(err);
  });
});
```

Parempi: async handler awaitilla:

```javascript
button.addEventListener("click", async () => {
  try {
    await saveData(formValues);
    showToast("Tallennettu");
  } catch (err) {
    showToast("Tallennus epäonnistui");
  }
});
```

## Käytännössä

Event handler + async ilman catch = tuotantoriski. ESLint-sääntö `@typescript-eslint/no-floating-promises` estää tämän. Node unhandledRejection voi kaataa prosessin — älä luota siihen, että "se failaa hiljaa".

[Lue lisää](https://nodejs.org/api/process.html#event-unhandledrejection)
