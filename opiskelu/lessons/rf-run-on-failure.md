# Haluat automaattisen kuvakaappauksen jokaisesta epäonnistuneesta web-testistä debuggausta varten. Miten?

## Tilanne

CI:ssä web-testi epäonnistuu yöllä. Lokissa lukee "Element not found", mutta et tiedä oliko kyseessä login-virhe, tyhjä sivu vai overlay-dialogi. Kehittäjä lisää manuaalisesti `Capture Page Screenshot` jokaisen testin `[Teardown]`-osioon — se toimii, mutta unohtuu uusiin testeihin ja tuottaa turhia kuvia onnistuneista ajoista.

SeleniumLibrary ja Browser Library tarjoavat globaalin koukun joka ajaa valitun avainsanan automaattisesti vain kun testi epäonnistuu.

## Ratkaisu

**Register Keyword To Run On Failure Capture Page Screenshot — ajetaan automaattisesti failissa.**

SeleniumLibrary:

```robot
*** Settings ***
Library    SeleniumLibrary

Suite Setup
    Register Keyword To Run On Failure    Capture Page Screenshot
    Open Browser    ${URL}    chrome
```

Browser Library:

```robot
Register Keyword To Run On Failure    Take Screenshot    filename=FAIL-{index}
```

Kun testi failaa, RF kutsuu rekisteröityä avainsanaa ennen teardownia. Kuva liitetään `log.html`-raporttiin.

## Käytännössä

Screenshot yksin ei aina riitä. Modernissa web-testissä hyödyllisiä debug-artefakteja ovat screenshot, sivun HTML, browser console -logit, network-virheet ja Playwright trace/video. Tavoite: CI-failin syy pitää pystyä päättelemään ilman, että testi ajetaan heti uudelleen paikallisesti.

Aseta rekisteröinti `Suite Setup`issa kerran koko suiteelle. Tallenna artefaktit CI:stä.

[Lue lisää](https://robotframework.org/SeleniumLibrary/SeleniumLibrary.html#Register%20Keyword%20To%20Run%20On%20Failure)
