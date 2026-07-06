# Liikenne lähteestä 10.10.0.0/24 pitää reitittää VPN-tauluun 100, ei main-tauluun. Mitä konfiguroit?

## Tilanne

Split-tunnel VPN: kaikki liikenne ei mene tunneliin, mutta tietyt lähdeverkot (`10.10.0.0/24`) on ohjattava VPN-reititystauluun. Pelkkä `ip route add ... dev tun0` ei riitä — kernel valitsee reitin lähde-IP:n ja sääntöjen perusteella.

Tarvitaan **policy routing**: `ip rule` + erillinen routing table.

## Ratkaisu

```bash
# table 100 = erillinen reititystaulu (ei main); via = next-hop, dev = ulostulorajapinta
ip route add 10.20.0.0/16 via 10.8.0.1 dev tun0 table 100

# from = lähdeverkko jolle sääntö pätee; lookup 100 = käytä taulua 100
# priority = sääntöjen järjestys (pienempi = tarkistetaan ensin)
ip rule add from 10.10.0.0/24 lookup 100 priority 100
```

Tarkista:

```bash
ip rule list                                              # policy routing -säännöt
ip route show table 100                                   # reitit taulussa 100
ip route get 10.20.0.5 from 10.10.0.5 iif eth0           # simuloi päätös lähde-IP:llä
```

**ip rule + table** ohjaa liikenteen lähde-IP:n mukaan — ip-rule man.

## Käytännössä

Taulun numerot (`100`) täytyy olla `/etc/iproute2/rt_tables`:ssa nimettyinä tuotannossa. WireGuard/OpenVPN lisäävät usein sääntöjä automaattisesti — vertaa `ip rule` ennen ja jälkeen VPN-yhteyden. Virheellinen rule voi ohjata kaiken liikenteen tunneliin tai ohittaa sen kokonaan.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-rule.8.html)
