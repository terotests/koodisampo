# MFA: TOTP-secret tallennetaan plaintextinä ja recovery-koodit näytetään uudelleen asetuksissa. Mitä korjaat?

## Tilanne

TOTP-secret plaintextinä tietokannassa. Recovery-koodit näytetään uudelleen asetuksissa.

## Ratkaisu

- Suojaa TOTP-secret levossa (sovellustason salaus)
- Recovery-koodit näytetään kerran
- Tallenna recovery-koodit hashattuina
- Vaadi re-auth herkkien asetusten muutokseen

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html)
