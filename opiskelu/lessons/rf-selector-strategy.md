# Web-testit hajoavat aina kun CSS-luokkia refaktoroidaan. Mitä muutat selectoreissa?

## Tilanne

Testeissä käytetään selectoreita kuten:

```robot
Click    css=.btn.primary.mt-2 > span
Click    xpath=//div[3]/div[2]/button
```

UI toimii, mutta testit hajoavat tyylimuutoksiin. Kehittäjä vaihtaa Bootstrap-luokkia tai siirtää nappia DOM-puussa — testit eivät löydä elementtiä vaikka käyttäjäkokemus on sama.

## Ratkaisu

**Käytä stabiileja testiselektoreita kuten data-testid — vältä tyyliluokkia ja pitkiä XPath-polkuja.**

Parempi:

```robot
Click    css=[data-testid="add-to-cart"]
Click    css=[data-testid="checkout-submit"]
```

## Käytännössä

Hyvä selector:

- kuvaa käyttäjän tai domainin kannalta tärkeää elementtiä
- ei riipu layoutista
- ei riipu CSS-frameworkin luokista
- säilyy refaktoroinnissa

Vältä pitkiä XPath-polkuja, CSS-luokkia jotka ovat vain tyylitystä varten, ja tekstisisältöä selectorina jos sovellus on lokalisoitu. Sovi tiimin kanssa `data-testid`-käytännöstä jo kehitysvaiheessa.

[Lue lisää](https://robotframework-browser.org/)
