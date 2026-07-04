# Tarinalla on riippuvuus ulkoiseen API:hin jota ei ole vielä saatavilla. Otetaanko sprinttiin?

## Tilanne

Tarinassa "Integroi kumppanin maksu-API" riippuvuus ulkoiseen API:hin on tunnistettu, mutta API:a ei ole vielä saatavilla — kumppani lupaa julkaisun "jossain vaiheessa Q2:lla". Kehittäjä ehdottaa: "Aloitetaan nyt ja integroidaan kun API valmistuu."

Product Owner painostaa sprinttiin ottoa, koska ominaisuus on myyty asiakkaalle. Tiimi on aiemmin joutunut odottamaan viikkoja ulkoisia riippuvuuksia sprintin keskellä.

Definition of Ready sisältää riippuvuuksien hallinnan — kysymys ei ole vain "tunnista riippuvuus", vaan "onko se ratkaistu".

## Ratkaisu

**Riippuvuus ratkaistava tai mockattava ennen DoR:n täyttymistä.**

Tarinalla on riippuvuus, jota ei ole vielä saatavilla — se ei täytä DoR:ia. Ennen sprinttiin ottoa riippuvuus on joko ratkaistava (API saatavilla, sopimus testattu) tai korvattava mockilla/stubilla, jolla kehitys voi edetä itsenäisesti.

DoR sisältää riippuvuuksien tunnistamisen — scrum-best-practices.

## Käytännössä

Sovi kumppanin kanssa sandbox-ympäristö tai contract test ennen sprinttiä. Dokumentoi mock DoR:n osaksi: mitä se simuloi ja milloin vaihdetaan oikeaan API:in. Jos riippuvuus ei ratkea, tarina jää backlogiin — sprint commitment ei perustu toivoon.

[Lue lisää](https://github.com/janpetzold/scrum-best-practices/blob/main/definition-of-ready.md)
