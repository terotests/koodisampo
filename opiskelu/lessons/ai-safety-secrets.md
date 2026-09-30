# Agentin pitää kutsua API:a, joka vaatii salaisen avaimen. Mikä on turvallisin tapa?

## Ratkaisu

Salaisuudet kontekstissa ovat riski: ne päätyvät transkripteihin, lokeihin ja välimuistiin, ja prompt injection voi pyytää niitä. Parempi: työkalun toteutus hakee avaimen ympäristöstä, tai verkkoproxy injektoi Authorization-otsakkeen vain sallittuihin osoitteisiin.

## Käytännössä

Käytä lyhytikäisiä, kapeasti rajattuja tokeneita, jotka on sidottu agentin tehtävään.


[Lue lisää](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
