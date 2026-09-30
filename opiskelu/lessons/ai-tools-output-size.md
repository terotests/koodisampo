# Hakutyökalu palauttaa 200 000 merkkiä lokia yhdellä kutsulla. Mikä on parempi suunnittelu?

## Ratkaisu

Jokainen työkalun palauttama merkki kuluttaa kontekstia. Hyvä työkalu palauttaa oletuksena tiiviin, relevantin tuloksen ja tarjoaa parametrit tarkentamiseen (`limit`, `offset`, `filter`). Katkaistessa kerro esim. '(näytetään 50/3120 riviä, käytä offset-parametria)'.

## Käytännössä

Suosi ihmisluettavia tunnisteita (nimet) teknisten UUID-kenttien sijaan ja jätä pois kentät, joita malli ei tarvitse.


[Lue lisää](https://www.anthropic.com/engineering/writing-tools-for-agents)
