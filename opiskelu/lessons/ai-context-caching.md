# Miksi agentin työkalumäärityksiä tai system promptia ei kannata muuttaa kesken session?

## Ratkaisu

Prompt caching tallentaa käsitellyn etuliitteen, ja seuraava pyyntö samalla etuliitteellä on huomattavasti halvempi ja nopeampi. Agenteissa sama pitkä alku (työkalut, system, aiempi historia) toistuu joka kierroksella, joten välimuistin osumaprosentti ratkaisee kustannukset.

## Käytännössä

Pidä vakaa sisältö alussa ja muuttuva (aikaleima, käyttäjän viesti) lopussa. Seuraa osumaprosenttia (cache_read_input_tokens).


[Lue lisää](https://docs.claude.com/en/docs/build-with-claude/prompt-caching)
