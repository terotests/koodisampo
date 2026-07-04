# VPN-yhteys toimii mutta vain internal IP:t eivät routtaudu. Diagnostiikka?

## Tilanne

OpenVPN tai WireGuard näyttää yhdistyneen. Ulkoinen liikenne toimii, mutta sisäverkon `172.16.0.0/12` on tavoittamaton:

```bash
ping 172.16.10.5     # ei vastaa / wrong interface
curl https://google.com  # OK
```

Perus `ip route` näyttää vain oletusreitin — VPN:n split-reitit voivat olla toisessa taulussa.

## Ratkaisu

```bash
ip route show table all
ip rule list
```

Etsi reitti sisäverkkoon oikean `dev tun0` / `wg0` kautta:

```bash
ip route get 172.16.10.5
```

**ip route paljastaa reititystaulun — policy routing voi ohjata liikennettä ilman että päätaulussa näkyy mitään.**

Tarkista myös VPN-clientin pushatut reitit ja firewall (`iptables`/`nftables`) FORWARD/OUTPUT-ketjuissa.

## Käytännössä

Split-tunnel vs full-tunnel riidut usein tässä kohdassa — dokumentoi mikä on tarkoitus. `table all` on pakollinen kun käytössä on `ip rule` (esim. `from all lookup 220`). VPN-palveluntarjoajan ohjeet ja paikallinen `AllowedIPs` / `push "route ..."` pitää olla synkassa.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-route.8.html)
