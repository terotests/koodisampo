# apt upgrade ilmoittaa 'held back packages'. Mikä komento asentaa myös nämä?

## Tilanne

Säännöllinen ylläpitokierros näyttää hyvältä — kunnes APT ilmoittaa:

```bash
sudo apt update && sudo apt upgrade -y
# ...
# The following packages have been kept back:
#   nginx  postgresql-15  libc6-dev
# 0 upgraded, 0 newly installed, 0 to remove and 3 not upgraded.
```

"Kept back" tarkoittaa, että uudempi versio on repossa, mutta `apt upgrade` ei voi asentaa sitä ilman muita muutoksia: uusi versio vaatii uuden riippuvuuden, vanhan poistamisen tai paketin vaihtamisen toiseen (transitional package). Tavallinen `upgrade` ei tee näitä muutoksia turvallisuussyistä.

Ongelma toistuu joka kierroksella, ja paketit jäävät vanhoille versioille — mukana mahdollisia tietoturvakorjauksia.

```bash
apt list --upgradable
# nginx/jammy-updates 1.24.0-1 amd64 [upgradable from: 1.18.0-6ubuntu14]
# → mutta upgrade ei asenna sitä
```

## Ratkaisu

Käytä `full-upgrade`, joka sallii tarvittaessa pakettien poistamisen ja uusien riippuvuuksien asennuksen:

```bash
sudo apt full-upgrade -y
```

Vanhempi synonyymi (yhteensopiva):

```bash
sudo apt-get dist-upgrade -y
```

`full-upgrade` / `dist-upgrade` ratkaisee monimutkaiset riippuvuusmuutokset, joita tavallinen `upgrade` jättää tekemättä. Se voi poistaa paketteja tai asentaa uusia — siksi sitä ei ajeta sokeasti tuotannossa ilman tarkistusta.

Ennen ajoa katso mitä muuttuisi:

```bash
sudo apt full-upgrade --dry-run
```

## Käytännössä

Aja `full-upgrade` harvemmin kuin tavallista `upgrade` — esimerkiksi neljännesvuosittain tai major-päivityksen yhteydessä. Staging-ympäristössä ensin, tuotannossa vasta kun muutokset on tarkistettu. Jos paketit pidetään tarkoituksella vanhalla versiolla, käytä `apt-mark hold` ja dokumentoi syy — "held back" voi olla myös tarkoituksellinen tila, ei aina ongelma.

[Lue lisää](https://manpages.debian.org/bookworm/apt/apt.8.en.html)
