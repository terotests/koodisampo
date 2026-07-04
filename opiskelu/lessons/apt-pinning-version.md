# Tuotantopalvelimella tietty paketti pitää lukita versioon 2.4.1 estäen automaattiset päivitykset. Miten?

## Tilanne

Tuotantopalvelimella pyörii sovellus, joka on testattu tarkalleen `libfoo2`-kirjaston versiolla 2.4.1. Seuraavassa `apt upgrade` -ajossa reposta tulee versio 2.5.0, jossa on tunnettu regressio API:ssa. Et halua estää koko palvelimen päivityksiä — vain yhden paketin automaattisen nousun.

Pelkkä versionumeron muistaminen ei riitä: `apt upgrade` yrittää silti päivittää kaikki paketit, joilla on uudempi versio repossa. Ilman eksplisiittistä lukitusta paketti nousee seuraavalla ylläpitokierroksella.

```bash
apt policy libfoo2
#  Installed: 2.4.1
#  Candidate: 2.5.0   ← upgrade ottaisi tämän

sudo apt upgrade -y
# libfoo2 päivittyisi automaattisesti
```

## Ratkaisu

Lukitse paketti `apt-mark hold` -komennolla:

```bash
sudo apt-mark hold libfoo2
```

Tarkista lukitus:

```bash
apt-mark showhold
# libfoo2
```

`apt-mark hold` estää paketin päivittymisen `apt upgrade` -komennolla — paketti pysyy versiossa 2.4.1, kunnes kumoat lukituksen:

```bash
sudo apt-mark unhold libfoo2
```

Hold lukitsee paketin nykyiseen asennettuun versioon; se ei pakota tiettyä versiota reposta, vaan estää automaattisen päivityksen. Jos tarvitset tarkemman versionhallinnan (esim. tietty repo tai versio), käytä lisäksi APT pinning -tiedostoa `/etc/apt/preferences.d/`-hakemistossa.

## Käytännössä

Dokumentoi holdatut paketit infrastruktuurirepoon — unohdettu hold aiheuttaa yllätyksiä vuosia myöhemmin, kun joku poistaa lukituksen tietämättä miksi se oli olemassa. Ansible/Chef voi hallita hold-tilaa idempotentisti. Muista poistaa hold ennen tarkoituksellista versiopäivitystä ja testaa uusi versio stagingissä ennen tuotantoon viemistä.

[Lue lisää](https://manpages.debian.org/bookworm/apt/apt-mark.8.en.html)
