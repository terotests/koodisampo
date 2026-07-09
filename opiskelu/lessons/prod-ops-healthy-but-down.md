# Käyttäjä raportoi palvelun alhaalla, mutta container healthcheck on vihreä. Mitä mittaat seuraavaksi?

## Tilanne

Asiakaspalveluun tulee viestejä: checkout ei toimi. Samalla monitorointi näyttää, että kaikki containerit ovat vihreitä ja `/health` palauttaa 200. Load balancer ohjaa liikennettä normaalisti.

Healthcheck vihreä ei tarkoita, että palvelu toimii käyttäjälle. Se voi kertoa vain, että prosessi on käynnissä ja health-endpoint vastaa. Jos readiness tarkistaa vain oman prosessin, load balancer voi lähettää liikennettä instanssille, joka ei oikeasti saa yhteyttä tietokantaan tai jonka connection pool on tukossa.

Sama periaate pätee ympäristöstä riippumatta: container healthcheck, load balancer target health tai serverless-funktion error rate eivät yksin kerro koko käyttäjäkokemusta.

## Ratkaisu

**RED/USE: error rate, latency, throughput, saturation + riippuvuudet — healthcheck voi testata vain prosessia.**

Mittaa seuraavaksi käyttäjäkokemusta kuvaavat signaalit:

- **error rate:** kuinka moni pyyntö epäonnistuu
- **latency:** kuinka kauan onnistuneet ja epäonnistuneet pyynnöt kestävät
- **throughput:** tuleeko liikennettä normaalisti
- **saturation:** ovatko poolit, CPU, muisti, levy, jonot tai threadit täynnä
- **riippuvuudet:** DB, cache, queue, DNS, ulkoiset API:t

Hyvä healthcheck jakautuu usein kahteen:

- **liveness:** prosessi on hengissä
- **readiness:** palvelu on valmis ottamaan liikennettä

## Käytännössä

- Tarkista 5xx-virheet ja p95/p99-latenssi
- Tarkista DB-yhteyspoolin käyttö ja odotusajat
- Tarkista riippuvuuksien virheet ja timeoutit
- Katso onko ongelma kaikilla käyttäjillä vai vain tietyllä endpointilla, tenantilla tai alueella
- Vertaa deploy-ajankohtaan: alkoiko ongelma uuden version jälkeen?

Healthy ≠ käyttäjäkokemus ok. Mittaa liikenne, virheet, saturation ja riippuvuudet — SRE observability.

[Lue lisää](https://opentelemetry.io/docs/concepts/signals/metrics/)
