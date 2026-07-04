# Kontti saavuttaa hostin mutta ei internetiä — epäilet NAT:ia. Tarkistus?

## Tilanne

Docker-kontti pingaa hostin gatewayn:

```bash
docker exec app ping -c 2 172.17.0.1
# OK
```

Internet ei toimi:

```bash
docker exec app ping -c 2 8.8.8.8
# unreachable / 100% loss
docker exec app curl https://example.com
# timeout
```

Epäilet NAT/forwarding-puutetta hostilla.

## Ratkaisu

Tarkista IP forwarding:

```bash
sysctl net.ipv4.ip_forward
# pitäisi olla 1
```

NAT-säännöt:

```bash
sudo iptables -t nat -L POSTROUTING -n -v
# tai nftables:
sudo nft list chain ip nat postrouting
```

Etsi MASQUERADE docker0:lle:

```
MASQUERADE  all  --  172.17.0.0/16  0.0.0.0/0
```

**iptables/nftables NAT + sysctl net.ipv4.ip_forward — tarkista.**

## Käytännössä

Custom firewall voi poistaa Dockerin `-A POSTROUTING -j MASQUERADE` -säännön. `firewalld` zone `docker` vaatii oikean konfiguroinnin. IPv6:lla vastaava on forwarding + NDP/proxy-NDP. Dokumentoi hostin NAT-asetukset — konttiverkon ongelmat ovat usein host-tason, ei sovellus-bugeja.

[Lue lisää](https://man7.org/linux/man-pages/man8/iptables.8.html)
