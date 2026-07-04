# API palauttaa virheessä koko PostgreSQL-virheilmoituksen asiakkaalle. Ongelma?

## Tilanne

Sovellus käsittelee tietokantavirheet näin:

```javascript
try {
  await pool.query('SELECT * FROM users WHERE id = $1', [id]);
} catch (err) {
  res.status(500).json({ error: err.message });
}
```

Käyttäjä näkee vastauksessa:

```json
{
  "error": "relation \"secret_payroll\" does not exist at character 15"
}
```

tai:

```json
{
  "error": "duplicate key value violates unique constraint \"users_email_key\""
}
```

Virhe paljastaa **taulujen nimet**, **sarakkeet**, **rajoitteet** ja joskus osan kyselystä — tiedustelutietoa hyökkääjälle, joka kartoittaa skeemaa.

## Ratkaisu

Palauta asiakkaalle **geneerinen viesti**; lokita täydellinen virhe vain palvelimelle:

```javascript
} catch (err) {
  logger.error({ err, userId: req.user?.id, query: 'users_by_id' });
  res.status(500).json({ error: 'Pyyntöä ei voitu käsitellä. Yritä myöhemmin uudelleen.' });
}
```

PostgreSQL-puolella `log_min_messages` ja sovellusloki keräävät diagnostiikan. Kehitysympäristössä voit näyttää yksityiskohtia — tuotannossa ei koskaan.

## Käytännössä

Virheviestit ovat OWASP:n "Security Misconfiguration" - ja "Information Exposure" -luokkaa. Sama koskee stack traceja JSON-vastauksissa.

Erottele virhetyypit sisäisesti (constraint, timeout, connection) — mutta ulospäin yksi turvallinen viesti. Monitoroi virhemääriä (Sentry, Prometheus), jotta et menetä debuggauksen kykyä piilottamalla viestit käyttäjältä.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
