# Palvelimelle tarvitaan toinen IPv4 samaan rajapintaan (VIP). Linux-komento — ei Windows ipconfig?

## Tilanne

Load balancer tai keepalived tarvitsee virtuaalisen IP:n (`10.0.0.99`) samalle rajapinnalle kuin pääosoite. Windowsissa käytettäisiin `ipconfig` — Linuxissa vastaava on iproute2.

Vanha `ifconfig eth0:1` toimii joissain distrossa, mutta iproute2 on moderni standardi.

## Ratkaisu

```bash
# addr add = lisää IP-osoite rajapintaan (secondary/VIP)
# 10.0.0.99/24 = osoite ja prefix; dev eth0 = kohderajapinta
ip addr add 10.0.0.99/24 dev eth0
```

Tarkista:

```bash
ip -br addr show eth0      # -br = tiivis; kaikki osoitteet rajapinnalla
```

Poista:

```bash
ip addr del 10.0.0.99/24 dev eth0   # del = poista tietty osoite
```

**ip addr add** liittää secondary-osoitteen kernelille — ip-address man.

## Käytännössä

`/etc/hosts` ei lisää osoitetta verkkopinnoille — se vain nimeää isäntän. Pysyvään konfiguraatioon käytä keepalived, NetworkManager `+ipv4.addresses` tai cloud-init. Muista ARP-gratuitous uuden VIP:n jälkeen jotta switch oppii MAC-IP-parin.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-address.8.html)
