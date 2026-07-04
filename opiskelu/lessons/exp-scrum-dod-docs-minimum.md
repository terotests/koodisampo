# Operaatio valittaa puuttuvasta runbookista incidentin jälkeen. Mitä DoD voisi vaatia?

## Tilanne

Tuotantoon meni uusi konfigurointivaihtoehto feature-flagin kautta. Kehitystiimi merkitsi tarinan Done: CI vihreä, feature toimii. Yöllä incident: on-call ei löydä ohjetta flagin nopeaan sammuttamiseen tai rollback-proseduuria.

Post mortemissa selviää, että runbookia ei päivitetty — se ei ollut DoD:ssa. Kehittäjät olettivat, että "dokumentaatio" tarkoitti vain API-speciä, ei operatiivista ohjeistusta.

## Ratkaisu

DoD on tiimin sopimus shippable incrementistä — ops-docs voi kuulua siihen. DoD voisi vaatia: **päivitetty operatiivinen dokumentaatio user-visible muutoksille**.

Kun muutos vaikuttaa käyttäjiin, valvontaan tai incident-vasteen, runbook, alert-kuvaus ja rollback-ohje ovat osa valmista inkrementtiä — ei sprintin jälkeistä "paperityötä".

## Käytännössä

- Erottele DoD:ssa kehittäjädokumentaatio (API, README) ja ops-dokumentaatio (runbook, playbooks).
- Linkitä DoD-kohdan tarkistus CI:hin tai PR-templateen: "Onko runbook päivitetty?"
- Incidentin jälkeen päivitä DoD retrospektiivissä — yksi puuttuva runbook riittää opiksi koko tiimille.

[Lue lisää](https://github.com/janpetzold/scrum-best-practices)
