# Muutit nginx unit-tiedoston ExecStart-rivin. Mitä teet ennen kuin uusi konfiguraatio on voimassa?

## Tilanne

Päivität `/etc/systemd/system/nginx.service` -tiedostoa — vaihdat `ExecStart`-polun uuteen binääriin tai lisäät `-c`-parametrin:

```ini
[Service]
ExecStart=/usr/sbin/nginx -g 'daemon off;'
# muutettu → ExecStart=/usr/sbin/nginx -c /etc/nginx/custom.conf -g 'daemon off;'
```

Suora `systemctl restart nginx` ilman reloadia systemd-tasolla antaa virheen tai käyttää vanhaa unit-määrittelyä:

```bash
systemctl restart nginx
# Warning: unit file changed on disk
```

Systemd lukee unit-tiedostot muistista — levyn muutos ei ole voimassa ennen `daemon-reload`.

## Ratkaisu

Aja **`systemctl daemon-reload && systemctl restart nginx`**.

```bash
sudo systemctl daemon-reload
sudo systemctl restart nginx
sudo systemctl status nginx
```

**Unit-tiedoston muutos vaatii daemon-reload ennen restartia.** `daemon-reload` lukee unit-tiedostot uudelleen; `restart` käynnistää palvelun uudella määrittelyllä.

Huom: Tämä on eri asia kuin sovelluksen sisäinen reload (`nginx -s reload` / `ExecReload=`). Unit-tiedoston muutos = systemd-tason reload.

## Käytännössä

Automatisoiduissa deployeissa aina `daemon-reload` kun unit- tai drop-in -tiedostot muuttuvat. Ansible/systemd-moduuli hoitaa tämän usein automaattisesti — käsin tehtäessä helppo unohtaa.

Jos muutat vain drop-in override -tiedostoa (`systemctl edit`), sama sääntö pätee. Varmista myös `nginx -t` ennen restartia — systemd käynnistää prosessin, mutta virheellinen sovellusconfig kaataa sen silti.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
