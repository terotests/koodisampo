# Miksi agentin kontekstia ei kannata täyttää kaikella mahdollisella tiedolla?

## Ratkaisu

**Context engineering** = sen päättäminen, mitä mallin kontekstissa on kullakin hetkellä. Transformerin huomiomekanismi jakautuu kaikkien tokenien kesken, joten epäolennainen sisältö heikentää olennaisen löytämistä, vaikka ikkunaan mahtuisi paljon.

## Käytännössä

Kysy jokaisesta kontekstiin lisättävästä asiasta: tarvitaanko tätä juuri nyt? Jos ei, anna agentin hakea se tarvittaessa.


[Lue lisää](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
