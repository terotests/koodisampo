# Tarvitset kolmannen osapuolen PPA:n tai repon lisäämistä Ubuntuun. Mikä on turvallinen tapa?

## Tilanne

Sovellus tarvitsee uuden version kirjastosta, jota ei ole Ubuntun oletusrepoissa. Kollega lähetti ohjeen: "Lisää tämä rivi `/etc/apt/sources.list`-tiedostoon." Rivi näyttää tältä:

```
deb http://vendor.example.com/ubuntu jammy main
```

Ilman GPG-avainta APT varoittaa: *The following signatures couldn't be verified*. Jos varoitus ohitetaan, paketit asentuvat ilman allekirjoituksen tarkistusta — kuka tahansa voi tarjota väärennettyjä `.deb`-tiedostoja samasta URL:sta.

Toinen yleinen virhe on editoida suoraan `/etc/apt/sources.list`-pää tiedostoa kolmannen osapuolen repolle. Silloin erottaminen virallisista ja ulkoisista lähteistä vaikeutuu, ja päivitys tai palautus on hankalaa.

## Ratkaisu

Turvallinen tapa on kaksi osaa: GPG-avain ja erillinen listatiedosto.

1. Tuoda GPG-avain (Debian/Ubuntu):

```bash
curl -fsSL https://vendor.example.com/gpg.key | \
  sudo gpg --dearmor -o /usr/share/keyrings/vendor-archive-keyring.gpg
```

2. Lisää repo erilliseen tiedostoon `/etc/apt/sources.list.d/`:

```bash
echo "deb [signed-by=/usr/share/keyrings/vendor-archive-keyring.gpg] \
  http://vendor.example.com/ubuntu jammy main" | \
  sudo tee /etc/apt/sources.list.d/vendor.list
```

3. Päivitä lista:

```bash
sudo apt update
```

Erillinen `.list`-tiedosto + GPG-avain mahdollistaa helpon hallinnan: repo voidaan poistaa yhdellä `rm`-komennolla ilman että kosket virallisiin lähteisiin. `signed-by`-optio sitoo avaimen tiettyyn repoon.

Ubuntu PPA:issa `add-apt-repository` hoitaa avaimen ja listan automaattisesti, mutta tuotannossa suositaan usein manuaalista mallia, jotta näet tarkalleen mitä lisätään.

## Käytännössä

Luota vain tunnettuihin lähteisiin — kolmannen osapuolen repo on supply chain -riski. Dokumentoi lisätyt repot infrastruktuurikoodissa (Ansible, cloud-init) äläkä käsin palvelimilla. Poista käyttämättömät repot säännöllisesti; vanhentunut repo voi hidastaa `apt update` -ajoa ja aiheuttaa virheitä, kun URL ei enää vastaa.

[Lue lisää](https://wiki.debian.org/SourcesList)
