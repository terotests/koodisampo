# Palvelin ei pääse ulos verkon 10.0.0.0/8 ulkopuolelle, mutta pingaa gatewayn. Mikä todennäköisin puuttuu?

## Tilanne

Palvelin on paikallisverkossa `10.0.0.0/8`:ssa. `ping 10.0.0.1` (gateway) toimii. `ping 8.8.8.8` tai `curl https://example.com` epäonnistuu — timeout tai "Network unreachable". Paikallinen verkko on kunnossa, mutta reititys internetiin puuttuu.

## Ratkaisu

Todennäköisin syy: **oletusreitti (default route)** puuttuu:

```bash
ip route show
# ei riviä: default via 10.0.0.1 dev eth0

ip route add default via 10.0.0.1 dev eth0
```

`0.0.0.0/0` kertoo kernelille minne lähettää liikenne, joka ei osu mihinkään tarkempaan reittiin. Ilman sitä vain paikallinen verkko on tavoitettavissa.

## Diagnostiikka

```bash
ip route get 8.8.8.8    # näyttää mitä reittiä käytettäisiin
traceroute 8.8.8.8      # missä ketju katkeaa
```

Pysyvä reitti: netplan, NetworkManager, `/etc/network/interfaces` tai cloud-init — riippuen distrosta. Varmista myös firewall (OUTPUT) ja NAT gatewayn puolella.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-route.8.html)
