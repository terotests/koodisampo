# Wi-Fi profiili jää roikkuun VPN-konfigin jälkeen. Miten NetworkManagerilla palautat yhteyden?

## Tilanne

Muokkasit NetworkManager-profiilia ja lisäsit VPN-kytkennän:

```bash
nmcli connection modify corp-wifi +vpn.data ...
nmcli connection up corp-wifi
```

Yhteys jää tilaan "connecting" tai Wi-Fi näyttää yhdistyneen, mutta DNS ja reitit ovat sekaisin. Uudelleenkäynnistys auttaisi, mutta haluat korjata ilman rebootia.

## Ratkaisu

Palauta yhteys NM:n kautta:

```bash
nmcli connection down corp-wifi
nmcli connection up corp-wifi
```

Tai pakota konfigin uudelleenlataus laitteelle:

```bash
nmcli device reapply wlan0
```

**nmcli hallitsee connection-profiileja — reapply lataa konfigin uudelleen** ilman profiilin poistamista.

Tarkista:

```bash
nmcli connection show corp-wifi
nmcli device status
resolvectl status   # jos systemd-resolved
```

## Käytännössä

VPN-muutosten jälkeen testaa aina `ip route` ja DNS erikseen. `reapply` on kevyempi kuin down/up, mutta jos profiili on korruptoitunut, `nmcli connection reload` tai profiilin uudelleenimport voi olla tarpeen. Dokumentoi VPN-askeleet — manuaaliset muokkaukset ilman backup-profiilia ovat yleinen palautumisen hidaste.

[Lue lisää](https://man7.org/linux/man-pages/man1/nmcli.1.html)
