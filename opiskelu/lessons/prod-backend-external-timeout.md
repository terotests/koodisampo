# Ulkoinen API hidastuu ja koko backend alkaa timeoutata. Mikä puuttuu?

## Tilanne

Backend kutsuu toimituspalvelun API:a ilman timeoutia. Kun toimituspalvelu hidastuu, requestit jäävät odottamaan, workerit/threadit täyttyvät ja lopulta myös muut endpointit hidastuvat. CPU ei ole täynnä — palvelu on jumissa odottamassa.

Tämä on klassinen **cascading failure**: yksi hidastuva riippuvuus vie koko palvelun mukanaan. Ongelma ei ole ulkoisessa API:ssa vaan siinä, että backend ei rajoita odotusaikaa eikä käyttäydy hallitusti virhetilanteessa.

## Ratkaisu

**Timeoutit, rajatut retryt ja hallittu virhekäyttäytyminen ulkoisille riippuvuuksille.**

Ulkopuolisille riippuvuuksille tarvitaan timeoutit, rajatut retryt ja fallback-/virhekäyttäytyminen. Hyvä käytäntö:

- aseta lyhyt, tietoinen timeout jokaiseen ulkoiseen kutsuun
- retry vain turvallisille/idempotenteille operaatioille
- käytä exponential backoffia ja jitteriä
- älä retrytä loputtomasti
- älä tee retry stormia, joka pahentaa riippuvuuden kuormaa
- palauta käyttäjälle hallittu virhe tai käytä taustajonoa, jos toimintoa ei tarvitse tehdä synkronisesti

Jos riippuvuus on alhaalla, backendin pitää hajota hallitusti eikä viedä koko palvelua mukanaan. Sama periaate pätee serverless-funktioihin: timeoutit, retry-politiikka ja DLQ tarvitaan sielläkin.

## Käytännössä

Aseta timeout jokaiseen HTTP-client-kutsuun (esim. 2–5 s synkronisille poluille). Mittaa riippuvuuden latency ja error rate erikseen. Jos toimitus ei ole kriittinen checkoutille, siirrä se taustajonoon ja vastaa käyttäjälle heti. Circuit breaker voi auttaa, kun riippuvuus on toistuvasti alhaalla.

[Lue lisää](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_timeouts.html)
