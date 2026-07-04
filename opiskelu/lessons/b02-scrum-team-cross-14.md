# Tiimissä vain yksi henkilö osaa deployata — bottleneck joka sprintti. Scrum-ratkaisu?

## Tilanne

Joka sprintin lopussa kaikki odottavat DevOps-gurua, joka on ainoa joka osaa deployata tuotantoon. Hän on lomalla sprintin viimeisenä päivänä — inkrementti jää testiympäristöön. Tiimi sanoo: "Deploy ei kuulu kehittäjille."

Pullonkaula toistuu sprinteittäin, mutta kukaan ei jaa osaamista.

## Ratkaisu

Scrum-ratkaisu: **cross-functional tiimi jakaa taidot** — kuka tahansa tiimissä voi edistää inkrementtiä kohti Done-tilaa.

- Deploy-osaaminen kuuluu tiimin kapasiteettiin, ei yhden henkilön salaisuuteen.
- Pairing, dokumentointi, jaetut runbookit ja automaatio vähentävät riippuvuutta.
- DoD vaatii deploy-valmiutta — jos vain yksi osaa, tiimi ei ole cross-functional.

Tavoite: deploy ei ole yhden ihmisen gate vaan tiimin yhteinen kyvykkyys.

## Käytännössä

Varaa sprintistä kapasiteettia "deploy-osaamisen jakamiseen": guru pari-ohjelmoi, CI/CD-dokumentaatio päivitetään, smoke-testit automatisoitu. Seuraavassa sprintissä toinen kehittäjä tekee deployn valvonnan alla. Bottleneck häviää kun taito on tiimissä, ei yhdessä päässä.

[Lue lisää](https://scrumguides.org/scrum-guide.html#scrum-team)
