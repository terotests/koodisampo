# Turvallisuustiimi löysi OWASP-aukko sprintin jälkeen. Miten DoD estää toistumisen?

## Tilanne

Sprint review meni hyvin — uusi kirjautumisominaisuus demonstroitiin onnistuneesti. Viikkoa myöhemmin turvallisuustiimi raportoi: SQL-injektiomahdollisuus endpointissa, jota tiimi ei testannut threat-mallinnuksen näkökulmasta.

Kehitystiimi vastaa: "Security ei ollut DoD-listalla; se kuuluu erilliselle auditille ennen tuotantoa." Tuote haluaa nopeita julkaisuja, mutta aukko olisi estettävissä jo sprintin aikana.

## Ratkaisu

DoD voidaan laajentaa domain-kohtaisesti — security on osa valmiutta. Lisää relevanteille tarinoille: **security checklist / SAST gate osana DoD:ta**.

Kirjautuminen, maksut, henkilötiedot ja ulkoiset rajapinnat ansaitsevat DoD-kohdan: staattinen analyysi (SAST), riippuvuusskannaus tai tiimin checklist ennen Donea. Näin aukko ei jää "myöhemmän auditin" varaan.

## Käytännössä

- Määrittele DoD:ssa turvallisuusvaatimukset tarinityypeittäin — kaikille tarinoille ei tarvitse samaa auditia.
- Integroi SAST/dependency scan CI-portiksi; punainen skannaus = ei Donea.
- Yhteistyö security-tiimin kanssa: he antavat checklistin, kehitystiimi omistaa DoD-päivityksen retrospektiivissä.

[Lue lisää](https://scrumguides.org/scrum-guide.html#increment)
