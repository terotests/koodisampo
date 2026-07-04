# VPN-yhteys on päällä mutta vain osa aliverkoista menee tunneliin. Mikä komento näyttää reititystaulun?

## Tilanne

WireGuard-tunneli on aktiivinen, mutta vain `10.0.0.0/24` on tavoitettavissa — `10.0.1.0/24` menee edelleen oletusreittiä pitkin internetiin. VPN-clientin logi näyttää "connected", mutta reititys on puutteellinen.

```bash
ping 10.0.0.5    # OK via wg0
ping 10.0.1.5    # timeout — väärä reitti
```

## Ratkaisu

```bash
ip route show
# tai lyhyesti:
ip r
```

Etsi VPN-verkon reitit:

```
10.0.0.0/24 dev wg0 scope link
10.0.1.0/24 dev wg0 scope link   # puuttuu?
default via 192.168.1.1 dev eth0
```

**ip route from iproute2 — moderni korvike route-komennolle.**

Täydennys: `ip route get 10.0.1.5` näyttää valitun polun.

## Käytännössä

WireGuardissa `AllowedIPs` määrittää mitkä prefixit reititetään tunneliin — puuttuva prefix näkyy heti `ip route show`:ssa. OpenVPN pushaa reittejä erikseen. Dokumentoi odotetut CIDR:t ja vertaa VPN-serverin konfigiin ennen kuin epäilet palomuuri- tai DNS-ongelmia.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-route.8.html)
