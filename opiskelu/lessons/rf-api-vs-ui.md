# Tiimi ajaa kaiken checkout-flow'n selaimella. Testit kestävät 45 min ja flakkaavat. Osa testeistä tarkistaa vain tilauksen luonnin. Mitä muutat?

## Tilanne

Tiimi ajaa kaiken end-to-endinä selaimella. Testit kestävät 45 minuuttia ja flakkaavat. Osa testeistä tarkistaa vain, että tilaus voidaan luoda ja status muuttuu oikein — selain ei tuo tähän lisäarvoa.

Moni aloittelija ajattelee "Robot = selainklikkailu", mutta RF sopii myös API-testaukseen.

## Ratkaisu

**Testaa backend-flow API-tasolla (RequestsLibrary/Python-client); käytä selainta vain kriittisiin UI-polkuihin.**

```robot
*** Settings ***
Library    RequestsLibrary

*** Test Cases ***
Tilaus luodaan ja status päivittyy
    ${resp}=    POST On Session    api    /orders    json=${ORDER_BODY}
    Status Should Be    201    ${resp}
    ${status}=    GET Order Status    ${resp.json()}[id]
    Should Be Equal    ${status}    paid
```

## Käytännössä

Hyvä jako:

- **unit/integration:** liiketoimintalogiikka ja rajapinnat
- **API-testit:** backend-flowt, virheet, auth, tilasiirtymät
- **UI/E2E-testit:** kriittiset käyttäjäpolut ja frontend-integraatio

Selaintesti on kallis. Käytä sitä silloin, kun selaimen kautta testaaminen tuo oikeaa lisäarvoa.

[Lue lisää](https://marketsquare.github.io/robotframework-requests/doc/RequestsLibrary.html)
