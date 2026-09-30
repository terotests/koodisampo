# Miten varmistetaan parhaiten, että malli tuottaa skeeman mukaista JSONia?

## Ratkaisu

Structured outputs rajoittaa tokenien valintaa niin, että tuotos on aina skeeman mukainen (JSON-vastaukset tai työkalujen `strict`-tila). Syntaksi on silloin kunnossa. Arvojen järkevyys (onko päivämäärä tulevaisuudessa, onko id olemassa) tarkistetaan edelleen koodissa.

## Käytännössä

Pidä skeemat yksinkertaisina. Kaikkia JSON Scheman ominaisuuksia ei tueta rajoitetussa dekoodauksessa.


[Lue lisää](https://docs.claude.com/en/docs/build-with-claude/structured-outputs)
