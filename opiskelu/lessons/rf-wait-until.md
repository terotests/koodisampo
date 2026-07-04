# Web-testi epäonnistuu koska elementti ei ole vielä näkyvissä sivun latauduttua. Miten korjaat?

## Tilanne

Testi klikkaa "Tilaa"-painiketta heti `Go To`-komennon jälkeen. Paikallisesti testi menee läpi; CI:ssä se epäonnistuu satunnaisesti: "Element not visible". Sivu on latautunut HTML:n tasolla, mutta React renderöi painikkeen asynkronisesti API-vastauksen jälkeen.

Kiinteä `Sleep 3s` hidastaa kaikkia testejä ja flakkaa edelleen hitailla koneilla. Tarvitaan odotus joka odottaa *kunnon* täyttymistä, ei arvattua aikaa.

## Ratkaisu

**Wait Until Element Is Visible tai Wait Until Keyword Succeeds odottaa dynaamisesti.**

SeleniumLibrary / Browser Library:

```robot
Go To    ${CHECKOUT_URL}
Wait Until Element Is Visible    id=order-button    timeout=10s
Click Button    id=order-button
```

Tai yleisempi retry-malli epävakaalle operaatiolle:

```robot
Wait Until Keyword Succeeds    10s    0.5s    Element Should Be Visible    css=[data-testid=order-button]
```

Avainsana yrittää uudelleen kunnes onnistuu tai timeout. Eksplisiittiset waitit ovat luotettavampia kuin kiinteät viiveet — odottavat vain tarvittavan ajan.

## Käytännössä

Browser Library tekee auto-waitia monissa operaatioissa — `Click` odottaa elementtiä automaattisesti. SeleniumLibraryssa lisää wait eksplisiittisesti jokaisen asynkronisen UI-elementin eteen. Aseta timeout CI-ympäristön mukaan (10–30 s), mutta älä käytä `Sleep` paitsi debug-tarkoituksessa.

[Lue lisää](https://robotframework.org/SeleniumLibrary/SeleniumLibrary.html#Wait%20Until%20Element%20Is%20Visible)
