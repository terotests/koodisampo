# Rajapinta on DOWN admin-tilassa — et saa edes ARP-vastauksia. Nopein palautus?

## Tilanne

```bash
ip link show eth0
2: eth0: <BROADCAST,MULTICAST> mtu 1500 qdisc fq state DOWN
```

Rajapinta on administratiivisesti alas — ei IP-osoitetta, ei ARP:ia, ei liikennettä. Reitityksen tai palveluiden uudelleenkäynnistys ei auta jos linkki on DOWN.

## Ratkaisu

```bash
# link set = muuta rajapinnan admin-tilaa (ei IP-osoitetta)
# up = nosta rajapinta ylös (DOWN → UP); vasta sitten IP/reitit toimivat
ip link set eth0 up
```

Tarkista:

```bash
ip link show eth0          # admin-tila (UP/DOWN) ja MAC
ip -br addr show eth0      # -br = tiivis; IP-osoitteet rajapinnalla
```

**ip link set up** nostaa admin-tilan — vasta sitten IP ja reitit toimivat.

## Käytännössä

Jos `up` epäonnistuu, tarkista kaapeli (`ethtool eth0`), ajuri (`dmesg | tail`) ja `rfkill` langattomille. `systemctl restart networking` on raskas ja ei korvaa linkkitason ongelmaa. Automatisoi `ip link set` vasta kun fyysinen linkki on varmistettu.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-link.8.html)
