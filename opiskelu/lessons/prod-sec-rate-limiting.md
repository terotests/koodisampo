# Login käyttää Argon2id:tä, mutta hyökkääjä yrittää miljoonia salasanoja eri IP:istä. Mitä hashingin lisäksi tarvitaan?

## Tilanne

Login käyttää Argon2id:tä, mutta hyökkääjä yrittää miljoonia salasanoja eri IP-osoitteista.

## Ratkaisu

Hashingin lisäksi tarvitaan:

- Rate limit IP:n ja käyttäjätunnuksen perusteella
- Asteittainen viive / temporary lockout
- MFA tärkeille tileille
- Credential stuffing -havainto
- Audit-logi epäonnistuneista kirjautumisista
- Älä paljasta kumpi meni väärin: käyttäjätunnus vai salasana

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
