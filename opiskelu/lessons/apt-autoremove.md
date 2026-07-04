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
sudo apt autoremove
```

Tai yhdistettynä päivityskierrokseen:

```bash
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y
```

`autoremove` poistaa vain paketit, joita mikään asennettu paketti ei enää tarvitse — se on turvallisempi kuin arvaileva manuaalinen poisto. Konfiguraatiotiedostot (`rc`-tila) vaativat erikseen:

```bash
sudo apt purge <paketti>   # poistaa myös konfiguraation
sudo dpkg --purge $(dpkg -l | awk '/^rc/{print $2}')
```

## Käytännössä

Aja `autoremove` säännöllisesti ylläpitokierroksen lopussa — se pitää levytilan ja pakettilistan siistinä ilman manuaalista työtä. CI/CD-imagen rakentamisessa käytä `--no-install-recommends` ja `autoremove` build-vaiheessa, jotta lopputulos on kevyempi. Tuotannossa älä luota pelkkään autoremoveen vanhentuneiden kernelien poistoon; vanhat kernelit vaativat usein erillisen `apt purge`-käsittelyn.

[Lue lisää](https://manpages.debian.org/bookworm/apt/apt.8.en.html)
