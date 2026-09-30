# Tuotannossa agentti epäonnistuu satunnaisesti. Mitä harnessin pitäisi tallentaa, jotta vian voi selvittää?

## Ratkaisu

Agentin observability: jokainen kierros spanina (malli, tokenit, välimuistiosumat, viive, stop_reason) ja työkalukutsut lapsispaneina (syöte, tulos, virhe). OpenTelemetryssä on GenAI-semanttiset konventiot, joten jäljet toimivat tavallisissa APM-työkaluissa.

## Käytännössä

Huomioi tietosuoja: promptit ja tulokset voivat sisältää henkilötietoja tai salaisuuksia. Rajaa pääsy ja säilytysaika.


[Lue lisää](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
