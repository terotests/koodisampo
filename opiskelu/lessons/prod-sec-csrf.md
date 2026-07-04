# Selain lähettää session-cookien automaattisesti myös haitalliselta sivulta tulevaan POST-pyyntöön. Mikä suoja?

**Ratkaisu:** CSRF-token + `SameSite`-cookie (`Lax`/`Strict`). Lisäksi `Origin`/`Referer`-tarkistus tilallisiin muutoksiin.
