# Robot Frameworkilla pitää testata modernia SPA-sovellusta. Mikä kirjasto soveltuu parhaiten?

## Tilanne

Tiimi testaa React/Vue-SPA:ta SeleniumLibrarylla. Testit flakkaavat: `Click Button` epäonnistuu koska elementti ei ole vielä interaktiivisessa tilassa, Shadow DOM -komponentit eivät löydy, ja jokainen odotus vaatii manuaalisen `Sleep 2s`. CI:ssä 30 % testeistä menee uudelleenajoon turhaan.

Vanha Selenium-pohjainen stack toimii, mutta modernit SPA:t vaativat auto-waitia, verkon seurantaa ja natiivia JavaScript-tukea. Valinta vaikuttaa suoraan testien luotettavuuteen ja ylläpitokustannuksiin.

## Ratkaisu

**Browser-kirjasto (Playwright-pohjainen) — tukee auto-wait ja modernia JS:ää natiivisti.**

[Browser Library](https://robotframework-browser.org/) rakentuu Playwrightin päälle ja tarjoaa Robot Framework -avainsanat moderniin web-testaukseen:

```robot
*** Settings ***
Library    Browser

*** Test Cases ***
Lisää tuote ostoskoriin
    New Browser    chromium    headless=true
    New Page    ${BASE_URL}/products
    Click    css=[data-testid=add-to-cart]
    Get Text    css=.cart-count    ==    1
```

Auto-wait odottaa elementin näkyvyyttä ja stabiilisuutta ennen interaktiota. Browser Library käyttää Playwrightia — natiivi auto-wait, network-mocking ja moderni API.

## Käytännössä

Uusissa SPA-projekteissa aloita Browser Librarylla; SeleniumLibrary sopii legacy-sovelluksiin. Asenna `rfbrowser init` Playwright-selaimilla CI-ympäristöön. Hyödynnä `data-testid`-attribuutteja selektoreina — ne ovat stabiilimpia kuin CSS-luokat jotka muuttuvat tyylirefaktoroinnissa.

[Lue lisää](https://robotframework-browser.org/)
