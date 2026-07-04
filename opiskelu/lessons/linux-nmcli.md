# NetworkManager hallitsee interfacea. Miten aktivoit profiilin `corp-wifi` CLI:stä?

## Tilanne

Olet toimistolla ja kannettava on jo NetworkManagerin hallinnassa. Wi-Fi-profiili `corp-wifi` on tallennettu aiemmin, mutta laite on juuri herännyt unesta tai olet vaihtanut verkkoa käsin. `nmcli device status` näyttää, että `wlan0` on disconnected tai profiili on inactive.

Yrität korjata asian vanhalla tavalla:

```bash
sudo ifconfig wlan0 up
sudo dhclient wlan0
```

NetworkManager ei reagoi — tai yhteys jää puoliksi konfiguroituksi, koska NM hallitsee profiileja erikseen fyysisestä rajapinnasta.

## Ratkaisu

Aktivoi tallennettu profiili nmcli:llä:

```bash
nmcli connection up corp-wifi
```

Vaihtoehtoisesti voit kohdistaa profiilin tiettyyn laitteeseen:

```bash
nmcli connection up corp-wifi ifname wlan0
```

**nmcli hallitsee NM-profiileja — ei suoraa ifconfigia.** Profiili sisältää SSID:n, salasanan, DNS-asetukset ja mahdolliset VPN-kytkennät. `connection up` lataa koko paketin kerralla.

Tarkista tila:

```bash
nmcli connection show --active
nmcli device status
```

## Käytännössä

Tuotantopalvelimilla ja kannettavilla pidä profiilin nimi dokumentoitu — `nmcli connection show` listaa UUID:t ja nimet. Skripteissä käytä lainausmerkkejä profiilinimissä, joissa on välilyöntejä. Jos `up` epäonnistuu, `nmcli connection show corp-wifi` ja `journalctl -u NetworkManager` paljastavat usein autentikointi- tai sertifikaattiongelmat ennen kuin kosket rajapintakomentoihin.

[Lue lisää](https://networkmanager.dev/docs/api/latest/nmcli.html)
