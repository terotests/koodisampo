# Tuntematon integraatio — tiimi arvioi 13 story pointia arvalla. Miten vähennät epävarmuutta ennen sprinttiä?

## Tilanne

Backlogissa on tarina: "Integraatio kumppanin maksu-API:in." Kukaan ei ole lukenut dokumentaatiota kunnolla, sandbox-yhteyttä ei ole testattu, ja autentikointi on epäselvä. Refinementissa joku ehdottaa: "Annetaan 13, se on iso ja epävarma" — mutta **kukaan ei tiedä, mitä 13 oikeasti tarkoittaa** tässä kontekstissa.

Korkea story point -arvo ilman tutkimusta on arvaus, ei arvio. Sprinttiin sitoutuminen tällaisella tarinalla johtaa kesken sprintin yllätyksiin, keskeneräiseen inkrementtiin ja turhautumiseen.

Ennen isoa sitoutumista epävarmuus pitää **rajata ja tutkia** erillisellä, aikarajatulla työllä.

## Ratkaisu

**Spike refinementissa — rajattu aika epävarmuuden selvittämiseen.**

Spikes reduce uncertainty before committing — scrum-best-practices. Spike on aikarajattu tutkimustehtävä (esim. yksi päivä), jonka tulos on tieto: API toimii, arkkitehtuurivalinta, tai pilkottu backlog. Spike ei tuota shippattavaa tuotetta, mutta mahdollistaa realistisen arvion varsinaiselle tarinalle.

## Käytännössä

Määrittele spikelle selkeä **kysymys ja timebox**: "Selvitä, voimmeko autentikoitua sandboxiin ja tehdä testimaksun." Spike-tulos esitetään seuraavassa refinementissa — vasta sitten arvioidaan varsinainen tarina. Kerro product ownerille, että spike on investointi ennustettavuuteen, ei viivästys. Dokumentoi löydökset, jotta arvio ei perustu yhden henkilön muistiin.

[Lue lisää](https://github.com/janpetzold/scrum-best-practices/blob/main/estimation.md)
