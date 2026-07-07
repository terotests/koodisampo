# DELETE /api/users/:id — endpoint tarkistaa JWT:n ja löytää käyttäjän, mutta ei tarkista saako tämä käyttäjä poistaa kohdetta. Miksi JWT ei riitä?

## Tilanne

`DELETE /api/users/:id` — JWT tarkistetaan, mutta ei sitä saako tämä käyttäjä poistaa kohdetta.

## Ratkaisu

- **Autentikaatio** kertoo kuka käyttäjä on
- **Valtuutus** kertoo mitä hän saa tehdä

Kirjautunut käyttäjä ei automaattisesti saa poistaa mitä tahansa käyttäjää. Tarkista rooli, omistajuus tai policy.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
