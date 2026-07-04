# CI-putki on ollut punaisena kolme päivää ja hidastaa koko tiimiä. Scrum Masterin ensimmäinen tehtävä?

## Tilanne

CI-pipeline on ollut punaisena kolme päivää. Kehittäjät pushaavat koodia mutta eivät saa vihreää buildia — mergejä ei tehdä, regressioita ei huomata. Tiimi mainitsee ongelman dailyssa joka aamu mutta kukaan ei omista korjausta.

Scrum Master istuu retrospektiivissä ja kysyy "miten voimme parantaa?" — CI on yhä rikki.

## Ratkaisu

Scrum Masterin tehtävä on **poistaa impedimentit** tai **eskaloida** ne, jos tiimi ei pysty itse.

- CI on klassinen **organisaatiotason este** — hidastaa koko tiimiä.
- SM ei korjaa putkea itse (ellei ole osaamista), mutta **aktivoi** korjauksen: kuka omistaa, mikä deadline, keneen eskaloidaan.
- Passiivinen odotus ei kuulu SM:lle — servant leader toimii esteiden poistajana.

Ensimmäinen askel: selvitä juurisyy, nimeä omistaja, eskaloi tarvittaessa infra-tiimille tai johdolle samana päivänä.

## Käytännössä

Luo impediment-loki dailyyn: "CI punainen 3 pv — SM eskaloi infra-tiimille, vastaus huomenna." Jos sama este toistuu sprinteittäin, vie retrospektiiviin ja hae pysyvä ratkaisu (parempi monitorointi, omistajuus, SLA). SM:n mittari: este poistettu, ei kuinka monta standupia pidettiin.

[Lue lisää](https://scrumguides.org/scrum-guide.html#scrum-master)
