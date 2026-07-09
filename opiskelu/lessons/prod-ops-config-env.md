# Staging toimii, tuotanto kaatuu: ympäristömuuttuja puuttuu. Miten estät tämän?

## Tilanne

Backend lukee `PAYMENT_API_URL`-muuttujan käynnistyksessä. Stagingissä se on asetettu, tuotannossa ei. Sovellus käynnistyy silti ja kaatuu vasta ensimmäisessä maksupyynnössä — tuntikausia myöhemmin, kun ensimmäinen oikea maksu yritetään.

Tämä on klassinen "works on my machine / staging" -ongelma: hiljainen oletusarvo tai myöhäinen virhe piilottaa konfiguraatio-aukko deployn aikana. CI vihreä, staging ok, tuotanto rikki.

## Ratkaisu

**Validoi pakolliset env-muuttujat käynnistyksessä — fail fast jos kriittinen config puuttuu.**

Konfiguraatio pitää validoida käynnistyksessä. Hyvä käytäntö:

- määrittele pakolliset env-muuttujat skeemana
- validoi ne startupissa
- fail fast, jos kriittinen config puuttuu
- älä käytä hiljaisia oletuksia tuotantointegraatioille
- logita configin nimet ja tila, ei salaisia arvoja
- pidä dev/staging/prod-konfiguraatiot mahdollisimman samankaltaisina

Parempi kaatua käynnistyksessä kuin ottaa liikennettä vastaan rikkinäisellä maksukonfiguraatiolla.

## Käytännössä

Käytä config-skeemaa (esim. Zod, env-var -validointi) heti sovelluksen käynnistyksessä. Deploy-pipeline voi tarkistaa, että kaikki pakolliset muuttujat on asetettu ennen kuin uusi versio otetaan liikenteeseen. Feature flagit ja salaisuudet erotetaan: salaisuudet secret managerista, ei kovakoodattuna.

[Lue lisää](https://12factor.net/config)
