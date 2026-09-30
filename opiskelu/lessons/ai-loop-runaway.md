# Agentti yrittää samaa epäonnistuvaa komentoa kymmeniä kertoja. Mikä suoja kuuluu harnessiin?

## Ratkaisu

Agentit voivat jäädä kiertämään: sama komento, sama virhe. Harness pitää kirjaa kierroksista, tokeneista ja kuluista ja pysäyttää tai eskaloi käyttäjälle rajan ylittyessä. Identtisten peräkkäisten kutsujen tunnistus on halpa lisäsuoja.

## Käytännössä

Aseta sekä pehmeä raja (kysy käyttäjältä jatketaanko) että kova raja (pysäytä). Näytä käyttäjälle mihin budjetti kului.


[Lue lisää](https://www.anthropic.com/engineering/building-effective-agents)
