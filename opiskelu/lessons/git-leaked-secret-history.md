# API-avain commitoitiin vahingossa ja pushattiin julkiseen repoon tunti sitten. Mikä on ensimmäinen toimenpide?

## Tilanne

Kehittäjä commitoi `.env`-tiedoston, jossa on maksupalvelun tuotantoavain, ja pushasi sen julkiseen GitHub-repoon. Asia huomataan tuntia myöhemmin.

## Ratkaisu

1. **Mitätöi ja vaihda avain heti** palvelun hallintapaneelissa, ja tarkista palvelun lokeista, onko avainta käytetty.
2. Päivitä uusi avain salaisuuksien hallintaan (CI-secret, vault), ei koodiin.
3. Siivoa historia vasta tämän jälkeen, esim. `git filter-repo`:

```bash
git filter-repo --path .env --invert-paths
git push --force --all
```

4. Lisää `.env` `.gitignore`-tiedostoon ja ota käyttöön salaisuuksien skannaus (esim. GitHubin push protection, gitleaks pre-commit).

## Taustaa

Julkisia repoja skannataan automaattisesti, ja vuotanut avain voidaan löytää minuuteissa. Kun avain on kerran ollut julkisena, se on voitu kopioida forkkeihin, klooneihin ja välimuisteihin, joita historian siivous ei tavoita. Siksi ainoa varma korjaus on avaimen mitätöinti.

Uusi commit, joka poistaa tiedoston, jättää avaimen historiaan. `--amend` ja force push muuttavat vain omaa haaraa. Repon muuttaminen yksityiseksi ei peru jo tapahtunutta vuotoa.

[Lue lisää](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
