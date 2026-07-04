# Epic on liian iso estimointiin. Mikä pilkkomistapa leikkaa liiketoiminta-kerroksia pystysuunnassa?

## Tilanne

Epic "Käyttäjähallinta" sisältää kirjautumisen, profiilin, roolit, salasanan vaihdon ja audit-login. Tiimi arvioi: "40 story pointia, emme tiedä mistä aloittaa." Vaakasuuntainen jako ("ensin kaikki backend, sitten kaikki frontend") tuottaa sprinttejä ilman käyttäjälle näkyvää arvoa — mitään ei voi demoata ennen kuin kaikki kerrokset valmiit.

## Ratkaisu

**Vertical slice** — jokainen tarina tuottaa ohuen päästä-häntään -toiminnallisuuden:

| Tarina | Sisältää |
|--------|----------|
| Kirjautuminen | UI-lomake + API + sessio + testit |
| Profiilin katselu | UI + API + tietokanta |

Yksi tarina leikkaa **kerrosten läpi** (UI + API + data), ei yhtä kerrosta kerrallaan. Jokainen tarina on demonnettavissa ja testattavissa itsenäisesti.

## Käytännössä

INVEST-kriteerit: Independent, Negotiable, Valuable, Estimable, Small, Testable. Vertical slice helpottaa arviointia (pienempi yksikkö) ja inkrementtitoimitusta. Vältä "backend-sprintti" ilman käyttöliittymää — se piilottaa integraatio-ongelmat myöhäiseen vaiheeseen.

[Lue lisää](https://github.com/janpetzold/scrum-best-practices)
