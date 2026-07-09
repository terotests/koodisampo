# Web-testi epäonnistuu koska elementti ei ole vielä näkyvissä sivun latauduttua. Miten korjaat?

## Tilanne

Testi klikkaa "Tilaa"-painiketta heti `Go To`-komennon jälkeen. Paikallisesti testi menee läpi; CI:ssä se epäonnistuu satunnaisesti: "Element not visible". Sivu on latautunut HTML:n tasolla, mutta React renderöi painikkeen asynkronisesti API-vastauksen jälkeen.

Kiinteä `Sleep 3s` hidastaa kaikkia testejä ja flakkaa edelleen hitailla koneilla. Tarvitaan odotus joka odottaa *ehdon* täyttymistä, ei arvattua aikaa.

## Ratkaisu

**Wait Until Element Is Visible tai Wait Until Keyword Succeeds odottaa dynaamisesti.**

```robot
Go To    ${CHECKOUT_URL}
Wait Until Element Is Visible    css=[data-testid=order-button]    timeout=10s
Click    css=[data-testid=order-button]
```

Tai yleisempi retry-malli epävakaalle operaatiolle:

```robot
Wait Until Keyword Succeeds    10s    0.5s    Element Should Be Visible    css=[data-testid=order-button]
```

## Käytännössä

Browser Library tekee auto-waitia monissa operaatioissa. SeleniumLibraryssa lisää wait eksplisiittisesti asynkronisten UI-elementtien eteen. `Sleep` on lähinnä debug-käyttöön.

`Wait Until Keyword Succeeds` ei saa olla yleinen laastari huonosti ymmärretylle flakylle testille. Huono: `Wait Until Keyword Succeeds    60s    1s    Koko checkout toimii`. Parempi: odota tarkkaa tilaa (`Wait Until Element Contains    css=[data-testid=status]    Paid`).

[Lue lisää](https://robotframework.org/SeleniumLibrary/SeleniumLibrary.html#Wait%20Until%20Element%20Is%20Visible)
