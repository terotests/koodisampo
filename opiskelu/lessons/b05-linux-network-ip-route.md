# VPN-yhteys toimii mutta sisäverkon aliverkko on tavoittamaton. Mitä tarkistat ensin?

## Tilanne

VPN-yhteys on aktiivinen ja pääset VPN-serveriin pingillä. Sisäverkon `192.168.50.0/24` ei kuitenkaan vastaa — esim. sisäinen GitLab tai tietokanta.

```bash
ping 192.168.50.10
# no route to host / timeout
```

## Ratkaisu

Tarkista ensin reititystaulu:

```bash
ip route
ip route get 192.168.50.10
```

Etsi rivi muotoa:

```
192.168.50.0/24 via 10.8.0.1 dev tun0
```

**ip route — onko reitti sisäverkkoon oikean gatewayn kautta.** Ilman sitä paketit menevät oletusreittiä tai jäävät kernelin hylkäämiksi.

Jos reitti puuttuu, VPN-clientin konfiguraatio (push route / AllowedIPs) on ensimmäinen korjauskohde.

## Käytännössä

"VPN connected" ≠ kaikki sisäverkot routattu. Dokumentoi jokainen tarvittava CIDR. Split-DNS voi aiheuttaa oireen jossa hostname resolvduu mutta ping IP:llä epäonnistuu — erota reitti- ja DNS-ongelmat `ip route get` vs `dig` -testillä.

[Lue lisää](https://man7.org/linux/man-pages/man8/ip-route.8.html)
