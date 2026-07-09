# Checkout-testi sisältää 80 riviä Click/Input Text -askeleita. UI-muutos rikkoo kymmeniä testejä. Mikä rakenne on parempi?

## Tilanne

Checkout-testi sisältää 80 riviä selaintoimintoja: `Click`, `Input Text`, `Wait`, `Get Text`. Kun UI muuttuu, kymmenet testit hajoavat. Sama ongelma toistuu login-, profiili- ja admin-testeissä.

Ongelma ei ole Robot Framework itse vaan se, että tekniset UI-askeleet ja liiketoimintaflow on sekoitettu samaan abstraktiotasoon.

## Ratkaisu

**Nosta tekniset UI-askeleet domain-tason keywordeiksi — testi kertoo liiketoimintaflow'n.**

Huono testi:

```robot
Input Text    id=email    user@example.com
Input Text    id=password    secret
Click    css=.login-button
Wait Until Page Contains    Dashboard
Click    css=[data-testid=add-to-cart]
```

Parempi testi:

```robot
Kirjaudu sisään    user@example.com    ${PASSWORD}
Lisää tuote ostoskoriin    Tuote A
Maksa tilaus
Tilauksen pitäisi näkyä historiassa
```

Testitapauksen pitäisi kertoa liiketoimintaflow. Resource-tiedostoissa keywordit voivat sisältää tekniset selectorit ja waitit.

## Käytännössä

Jaa resurssit kahteen kerrokseen: `resources/pages/` teknisille UI-askeleille (`Klikkaa lisää ostoskoriin`) ja `resources/keywords/` domain-tason keywordeille (`Lisää tuote ostoskoriin`). Kun nappi muuttaa selectorin, päivität yhden page-keywordin — ei kaikkia testejä.

[Lue lisää](https://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#creating-user-keywords)
