# Palvelimelle on kertynyt turhia riippuvuuspaketteja poistettujen ohjelmien jäljiltä. Miten siivoot?

## Tilanne

Palvelimella on kokeiltu useita työkaluja viime kuukausina: monitorointiagentti, vanha Node.js-build ja testausväline poistettiin `apt remove`-komennolla. Levytila ei kuitenkaan palautunut odotetusti, ja `dpkg -l | wc -l` näyttää satoja paketteja, joita kukaan ei enää käytä.

APT asentaa usein riippuvuuspaketteja automaattisesti. Kun pääpaketti poistetaan, riippuvuudet jäävät "orvoiksi" — ne eivät enää kuulu mihinkään asennettuun pakettiin, mutta eivät poistu itsestään:

```bash
sudo apt remove prometheus-node-exporter -y
# node-exporter poistuu, mutta sen vetämät kirjastot voivat jäädä

dpkg -l | grep '^rc'
# Konfiguraatiotiedostoja jäänyt (rc = removed, config files remain)
```

Manuaalinen `apt remove` jokaiselle epäilyttävälle paketille on riskialtista — saatat poistaa jotain, mitä toinen palvelu tarvitsee.

## Ratkaisu

APT tunnistaa orvot riippuvuudet automaattisesti:

```bash
sudo apt autoremove --purge
```

Tai yhdistettynä päivityskierrokseen:

```bash
sudo apt update
apt list --upgradable
sudo apt upgrade
sudo apt autoremove
```

`autoremove` poistaa vain paketit, joita mikään asennettu paketti ei enää tarvitse — se on turvallisempi kuin arvaileva manuaalinen poisto. Konfiguraatiotiedostot (`rc`-tila) vaativat erikseen:

```bash
sudo apt purge <paketti>   # poistaa myös konfiguraation
sudo dpkg --purge $(dpkg -l | awk '/^rc/{print $2}')
```

## Käytännössä

Aja `autoremove` säännöllisesti ylläpitokierroksen lopussa. Vanhojen kernelien kohdalla tarkista aina mitä poistuu — `apt autoremove --purge` poistaa usein vanhoja automaattisesti asennettuja kernelipaketteja, kunhan niitä ei ole merkitty manuaalisiksi tai holdatuiksi. Älä poista käynnissä olevaa kerneliä; tarkista ensin `uname -r`.

[Lue lisää](https://manpages.debian.org/bookworm/apt/apt.8.en.html)
