# Admin-nappi piilotetaan frontendissä, mutta API ei tarkista admin-oikeutta. Mikä meni pieleen?

## Tilanne

Admin-toiminto on piilotettu käyttöliittymästä tavallisilta käyttäjiltä. API-endpoint silti suorittaa toiminnon kenelle tahansa, joka osaa kutsua sitä suoraan.

## Riski

Frontend on käyttöliittymä, ei turvaraja. Kaikki valtuutus pitää tarkistaa palvelimella.

## Miksi tämä on vaarallista

Hyökkääjä voi ohittaa UI:n kokonaan: curl, selaimen devtools, oma client tai väärennetty pyyntö. Piilotettu nappi ei estä mitään — se vain piilottaa toiminnon rehelliseltä käyttäjältä.

## Väärä korjaus

"Piilotetaan nappi ja lisätään CSS `display: none`" — ei vaikuta API:in.

"Tarkistetaan rooli vain frontend-routerissa" — client-side guard on UX, ei security control.

## Parempi korjaus

- Tarkista admin-oikeus jokaisessa herkässä API-endpointissa
- Käytä resurssikohtaista policyä, ei pelkkää UI-roolia
- Palauta 403 ilman turhaa tietovuotoa
- Lisää testit suoraan API-tasolle

## Testit

- tavallinen käyttäjä saa 403 admin-endpointiin, vaikka UI ei näytä nappia
- kirjautumaton saa 401
- admin saa onnistuneen vastauksen vain oikeassa kontekstissa

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
