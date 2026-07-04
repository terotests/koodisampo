# Palvelin ei vastaa pingiin — epäilet väärää IP:tä interfacella. Nopein tarkistus?

## Tilanne

Kollega yrittää SSH:ta palvelimelle uuteen IP-osoitteeseen, mutta yhteys timeouttaa. Palvelin on päällä, mutta konfiguraatiossa saattaa olla vanha osoite tai väärä aliaksen maski.

```bash
ping 10.0.5.20
# 100% packet loss
```

Epäilet että palvelin vastaa eri osoitteesta kuin odotettiin.

## Ratkaisu

```bash
ip addr show
# tai tiivis:
ip -br a
```

Esimerkki:

```
eth0    UP    10.0.5.21/24 fe80::...
```

**ip addr näyttää IPv4/IPv6 osoitteet** — moderni korvike `ifconfig`:ille.

Tarkista myös:

```bash
ip route get 10.0.5.20 from 10.0.5.21
```

## Käytännössä

Cloud-ympäristöissä secondary IP:t ja VIP:t lisätään usein erikseen — `ip -br a` ei aina kerro koko tarinaa ilman `ip addr show label`. Muista että ICMP voi olla estetty palomuurissa vaikka IP olisi oikein; testaa SSH:lla tai `curl` health-endpointiin. Infrastructure-as-code -deployissa varmista että `ip addr` vastaa Terraform/Cloud-init -konfigia.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip.8.html)
