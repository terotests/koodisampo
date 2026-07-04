# Ladattu .deb-paketti ei asennu koska riippuvuudet puuttuvat. Miten korjaat?

## Tilanne

Vendor toimitti sovelluksen suoraan `.deb`-pakettina — sitä ei ole Debian-repossa. Asennusyritys epäonnistuu:

```bash
sudo dpkg -i myapp_1.2.0_amd64.deb
# dpkg: dependency problems prevent configuration of myapp:
#  myapp depends on libssl3 (>= 3.0.0); however:
#   Package libssl3 is not installed.
#  myapp depends on libcurl4; however:
#   Package libcurl4 is not installed.
```

`dpkg` asentaa paketin tiedostot levylle, mutta ei osaa hakea puuttuvia riippuvuuksia reposta. Paketti jää "rikki" -tilaan (`unconfigured`), eikä sovellus käynnisty.

Pelkkä uudelleenasennus ei auta:

```bash
sudo dpkg -i myapp_1.2.0_amd64.deb
# Sama virhe toistuu
```

## Ratkaisu

Asenna `.deb` ensin `dpkg`:llä, korjaa riippuvuudet sitten APT:llä:

```bash
sudo dpkg -i myapp_1.2.0_amd64.deb
sudo apt install -f
```

`-f` (--fix-broken) täyttää puuttuvat riippuvuudet reposta ja viimeistelee kesken jääneen konfiguroinnin. APT ratkaisee riippuvuuspuut puolestasi — sinun ei tarvitse arvailla pakettinimiä.

Vaihtoehto yhdellä komennolla (suositeltu, jos riippuvuudet ovat repossa):

```bash
sudo apt install ./myapp_1.2.0_amd64.deb
```

`apt install ./paketti.deb` hoitaa sekä asennuksen että riippuvuuksien ratkaisun automaattisesti. `dpkg -i` + `apt install -f` on kuitenkin klassinen malli, joka toimii myös vanhemmissa ympäristöissä.

## Käytännössä

Suosi aina repopaketteja tuotannossa — manuaaliset `.deb`-asennukset eivät saa automaattisia tietoturvapäivityksiä. Jos vendor-paketti on pakollinen, dokumentoi asennus Ansible-skriptiin ja tarkista riippuvuudet stagingissä ennen tuotantoon viemistä. `dpkg -l | grep ^..U` listaa rikkinäiset paketit, jos asennus on jäänyt kesken.

[Lue lisää](https://manpages.debian.org/bookworm/dpkg/dpkg.1.en.html)
