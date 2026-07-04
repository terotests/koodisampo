# async-funktio heittää virheen. Miten käsittelet sen kutsujassa turvallisesti?

## Tilanne

Node-palvelimessa `loadUserProfile(id)` on async-funktio, joka hakee käyttäjän tietokannasta ja ulkoisesta API:sta. Kehittäjä kutsuu sitä ilman virheenkäsittelyä:

```javascript
const profile = await loadUserProfile(req.params.id);
res.json(profile);
```

Kun tietokantayhteys katkeaa, palvelin tulostaa `UnhandledPromiseRejection` ja prosessi kaatuu tuotannossa.

## Ratkaisu

**Käsittele virhe try/catchilla tai .catch():lla.** Async-funktio palauttaa promisen — heitetty virhe hylkää sen.

```javascript
try {
  const profile = await loadUserProfile(req.params.id);
  res.json(profile);
} catch (err) {
  console.error(err);
  res.status(500).json({ error: "Profiilin lataus epäonnistui" });
}
```

Vaihtoehto ilman awaitia: `loadUserProfile(id).catch(handleError)`.

## Käytännössä

Express-reiteissä käytä async wrapperia tai `express-async-errors`-pakettia, jotta unhandled rejectionit eivät kaada prosessia. Lokita virhe, palauta käyttäjälle turvallinen viesti — älä stack tracea.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
