# Kontti-host ei reachaa 10.20.0.0/16 VPN-verkkoa. ip route näyttää oletusyhteyden mutta ei VPN-reittiä. Mitä tarkistat?

## Tilanne

Dev-koneella VPN on ylhäällä ja selain pääsee sisäverkkoon. Docker-hostilla ajettava CI-runner ei kuitenkaan tavoita `10.20.0.0/16`-verkkoa:

```bash
ping 10.20.5.10        # Network unreachable
ip route show          # default via 192.168.1.1 dev eth0
```

Oletusreitti on kunnossa, mutta VPN:n pushaama reitti puuttuu hostin reititystaulusta — tai liikenne menee väärään suuntaan.

## Ratkaisu

Testaa mihin kernel oikeasti reitittäisi paketin:

```bash
ip route get 10.20.0.1
```

Jos vastaus on `Network unreachable` tai väärä `dev`, reitti puuttuu tai on väärä interface.

Tarkista VPN-rajapinta ja gateway:

```bash
ip link show tun0          # tai wg0, ppp0
ip route show table all
ip route get 10.20.0.1 from $(hostname -I | awk '{print $1}')
```

**ip route get testaa mihin reitti oikeasti menee** — pelkkä `ip route show` ei kerro policy routing -taulujen koko kuvaa.

## Käytännössä

VPN-clientit pushaavat reittejä eri tavoin; varmista että split-tunnel -asetus vastaa odotuksia. Konttiverkossa tarvitaan joskus erillinen reitti hostille tai `extra_hosts`. Dokumentoi sisäverkon CIDR ja oikea gateway VPN-dokumentaatioon — ilman sitä debuggaus alkaa aina alusta.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-route.8.html)
