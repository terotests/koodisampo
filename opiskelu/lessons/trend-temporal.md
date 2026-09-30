# Mitä JavaScriptin Temporal-API korjaa verrattuna Date-olioon?

## Ratkaisu

Date-olion ongelmat: muuttuvuus (setMonth muuttaa oliota), kuukaudet nollasta, ei aikavyöhyketukea paikallisen lisäksi. Temporal: `Temporal.PlainDate` (päivä ilman kellonaikaa), `Temporal.Instant` (hetki), `Temporal.ZonedDateTime` (hetki + IANA-vyöhyke), `Temporal.Duration`. Tuki on tullut selaimiin vuosina 2025–2026.

## Käytännössä

Tallenna hetket Instantina/UTC:nä ja muunna ZonedDateTimeksi vasta näytettäessä. Tarkista selaintuki tai käytä polyfilliä.


[Lue lisää](https://tc39.es/proposal-temporal/docs/)
