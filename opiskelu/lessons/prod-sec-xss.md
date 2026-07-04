# Käyttäjän kommentti renderöidään HTML:ään ilman escapetusta. Mikä riski?

**Riski:** **XSS (Cross-Site Scripting)** — hyökkääjä injektoi `<script>` tai event-handlereita. Selain suorittaa koodin uhrin kontekstissa.

**Ratkaisu:** escapaus kontekstin mukaan (HTML, attribuutti, JS), CSP-header, preferoi textContent DOM:ssa.
