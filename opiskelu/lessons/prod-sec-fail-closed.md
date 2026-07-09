# Policy service timeouttaa. API ei saa vastausta siitä, onko käyttäjällä oikeus nähdä raportti. Päästetäänkö pyyntö läpi?

## Tilanne

API kysyy erilliseltä policy-palvelulta, saako käyttäjä nähdä raportin. Policy service timeouttaa — vastausta ei tule ajoissa.

## Riski

Epävarmuus valtuutuksessa: jos pyyntö päästetään läpi, käyttäjä voi nähdä dataa ilman varmistettua oikeutta.

## Miksi tämä on vaarallista

Turvakriittisessä valtuutuksessa epävarmuus ei saa antaa pääsyä. Fail open on kätevä käyttökokemuksen kannalta, mutta se on väärä oletus arkaluonteiselle datalle.

## Väärä korjaus

"Päästetään läpi, jotta käyttäjä ei jää jumiin" — availability ei saa voittaa confidentialitya ja authorizationia.

"Cachetaan viimeisin tunnettu päätös ikuisesti" — vanhentunut cache voi antaa pääsyn, kun oikeus on jo poistettu.

## Parempi korjaus

**Fail closed:** jos oikeutta ei voida varmistaa, pyyntö estetään. Käyttökokemus voidaan hoitaa virheilmoituksella ja retryllä, mutta epävarmuus ei saa antaa pääsyä.

Lisäksi:

- lyhyt timeout + rajattu retry
- circuit breaker policy-palvelulle
- audit-loki epäonnistuneista authz-päätöksistä
- selkeä virhe käyttäjälle ("ei voitu tarkistaa oikeutta juuri nyt")

## Tuotantohuomiot

Erota read-heavy cache authz-päätöksestä: cache voi nopeuttaa, mutta sen TTL ja invalidointi pitää suunnitella. Kriittisissä operaatioissa (poisto, export, admin) älä käytä fail open -oletusta.

[Lue lisää](https://owasp.org/Top10/2021/A04_2021-Insecure_Design/)
