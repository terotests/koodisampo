# Kehittäjä lisää `curl -k` tai `verify=False` korjatakseen TLS-virheen. Mikä riski?

## Tilanne

Integraatio epäonnistuu sertifikaattivirheeseen. Kehittäjä lisää `curl -k` tai `verify=False` "väliaikaiseksi korjaukseksi".

## Riski

Man-in-the-middle voi siepata tai muuttaa liikennettä — sertifikaattia ei validoida.

## Miksi tämä on vaarallista

`verify=False` tai `curl -k` ei "korjaa TLS-ongelmaa", vaan poistaa yhden TLS:n tärkeimmistä suojista: varmistuksen siitä, että palvelin on oikea palvelin.

Ilman sertifikaatin validointia hyökkääjä, proxy, väärin konfiguroitu verkko tai haitallinen Wi-Fi voi esiintyä API-palvelimena. Yhteys voi näyttää salatulta, mutta asiakas ei tiedä kenelle se puhuu.

Liikenne ei muutu plaintextiksi — TLS-salaus voi olla päällä, mutta väärälle vastapuolelle.

## Väärä korjaus

"verify=False vaikuttaa vain kehitysympäristöön" — jos se commitataan tai menee tuotantokonfiguraatioon, riski on oikea myös tuotannossa.

"TLS-salaus poistuu kokonaan" — yhteys voi olla edelleen salattu, mutta ilman identiteetin varmistusta.

## Parempi korjaus

Korjaa syy, älä poista validointia:

- asenna oikea CA-ketju
- käytä palvelimen oikeaa hostnamea
- uusi vanhentunut sertifikaatti
- lisää sisäisen CA:n root-sertifikaatti luotettuun storeen
- varmista, että testiympäristössäkin on validi sertifikaatti
- jos käytät pinnausta, hallitse avainkierto

## Tuotantohuomiot

`verify=False` saa olla korkeintaan paikallinen debug-poikkeus, ei commitattu koodiin eikä tuotantokonfiguraatioon. Sertifikaatin validointi estää MITM:n — korjaa CA/sertifikaatti, älä poista validointia.

[Lue lisää](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)
