# Hälytys soi yöllä: maksut epäonnistuvat. Mistä aloitat?

## Tilanne

On-call saa alertin: `payment_success_rate` putosi alle normaalin. Kukaan ei muista ulkoa kaikkia tarkistuksia. Slack täyttyy arvauksista, rollbackista ja "onko Stripe alhaalla?" -kysymyksistä.

Ilman runbookia incident venyy: jokainen debuggaa eri tavalla, kriittiset askeleet unohtuvat ja käyttäjävaikutus kasvaa.

## Ratkaisu

**Runbook: lyhyt toimintalista — dashboard, riippuvuudet, rollback ja eskalointi.**

Tarvitaan runbook: lyhyt ohje, joka auttaa palauttamaan palvelun. Runbookissa pitäisi olla:

- mitä alert tarkoittaa
- mistä dashboardista aloitetaan
- mitkä riippuvuudet tarkistetaan (maksu-API, DB, webhook-jono)
- miten rollback tehdään
- miten feature flag suljetaan
- kuka eskaloidaan
- miten käyttäjävaikutus arvioidaan
- miten incident kirjataan

Runbook ei ole pitkä dokumentaatio, vaan toimintalista stressitilanteeseen.

## Käytännössä

Pidä runbook lyhyenä (1–2 sivua) ja linkitä se alerttiin. Testaa runbookia harjoituksissa. Päivitä se jokaisen incidentin jälkeen. Yhdistä runbook deploy/rollback- ja alert-käytäntöihin: ensin palauta palvelu, sitten juurisyy.

[Lue lisää](https://sre.google/workbook/on-call/)
