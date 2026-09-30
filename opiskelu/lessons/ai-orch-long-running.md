# Agentti tekee usean tunnin tehtävää, joka ei mahdu yhteen kontekstiin. Miten jatkuvuus varmistetaan?

## Ratkaisu

Pitkäkestoisissa tehtävissä hyväksi todettu rakenne: alustusvaihe kirjoittaa tehtävälistan ja init-skriptin, ja jokainen sessio tekee yhden asian kerrallaan, ajaa testit, committaa ja päivittää edistymistiedoston. Uusi sessio lukee ensin tiedoston ja git login.

## Käytännössä

Pidä tehtävälista koneluettavana (esim. JSON, jossa passes: true/false) ja pyydä agenttia jättämään työ joka session lopussa siistiin, toimivaan tilaan.


[Lue lisää](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
