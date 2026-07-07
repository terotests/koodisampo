# Virhetilanteessa logger.error({ body: req.body, headers: req.headers }). Mikä riski?

## Tilanne

`logger.error({ body: req.body, headers: req.headers })`

## Ratkaisu

Lokeihin voi päätyä Authorization-header, session-cookie, henkilötiedot, salasanat, reset-tokenit ja maksutiedot.

- Redaktoi tunnetut kentät
- Älä loggaa raakaa request bodyä oletuksena
- Käytä correlation ID:tä
- Rajoita lokien säilytysaika ja pääsyoikeudet

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
