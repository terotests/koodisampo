# Uusi palvelin — haluat asentaa tuoreimmat tietoturvapäivitykset. Mikä on oikea järjestys?

## Tilanne

Juuri provisioitu Debian-palvelin odottaa ensimmäistä ylläpitokierrosta. Kollega ehdottaa suoraa `apt upgrade`-komentoa, koska "päivitykset pitää vain asentaa". Komennon jälkeen terminaali ilmoittaa: *0 upgraded, 0 newly installed, 0 to remove* — vaikka tiedät, että repossa on CVE-korjauksia viime viikolta.

Syy on yksinkertainen: paikallinen pakettilistaus on vanhentunut. `apt upgrade` asentaa vain sen perusteella, mitä järjestelmä *luulee* repossa olevan. Ilman tuoretta metatietoa se ei näe uusia versioita.

Toinen yleinen virhe on päinvastainen: ajetaan vain `apt update` ja luullaan työn olevan valmis. Lista päivittyy, mutta paketit eivät asennu — palvelin jää haavoittuvaksi.

```bash
# Vain upgrade — ei näe uusia versioita
sudo apt upgrade -y
# 0 upgraded...

# Vain update — lista tuore, paketit vanhalla versiolla
sudo apt update
```

## Ratkaisu

Oikea järjestys on kaksi vaihetta:

```bash
sudo apt update
sudo apt upgrade -y
```

- **`apt update`** hakee repojen metatiedot ja päivittää paikallisen pakettilistauksen (`/var/lib/apt/lists/`).
- **`apt upgrade`** asentaa saatavilla olevat päivitykset nykyisiin paketteihin ilman poistoja tai uusia riippuvuuksia.

Molemmat tarvitaan: `update` kertoo *mitä* on saatavilla, `upgrade` *asentaa* sen. Tietoturvapäivityksissä riittää useimmiten `upgrade`; `full-upgrade` tarvitaan vasta kun riippuvuudet vaativat pakettien poistamista tai vaihtamista.

## Käytännössä

Automatisoi järjestys skriptissä tai Ansible-tehtävässä: aina `update` ennen `upgrade`. Tuotannossa aja ensin staging-ympäristössä ja tarkista, ettei palvelu-uudelleenkäynnistys katkaise liikennettä kesken päivityksen. `unattended-upgrades` hoitaa saman logiikan automaattisesti, mutta manuaalisessa ylläpidossa järjestys on perusta kaikelle muulle.

[Lue lisää](https://manpages.debian.org/bookworm/apt/apt.8.en.html)
