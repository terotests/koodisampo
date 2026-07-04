# Kontti tarvitsee oman MAC-osoitteen ja LAN-IP:n reitittimeltä. Mikä driver?

## Tilanne

Tehdasverkossa legacy-laite odottaa SNMP-pollauksia tietyltä MAC-osoitteelta. Bridge + NAT ei kelpaa: laitteet LANissa eivät näe konttia oikeana verkkolaitteena, vaan liikenne näkyy hostin MAC:in kautta.

```bash
docker run -d --name snmp-bridge mysnmp:latest
# LAN-laitteet eivät tunnista konttia — kaikki liikenne NAT:ataan hostin kautta
```

Tarvitset, että kontti saa oman MAC-osoitteen ja IP:n suoraan reitittimeltä DHCP:llä tai staattisesti, kuin fyysinen palvelin kaapissa.

## Ratkaisu

**macvlan**-driver liittää kontit fyysisen verkon segmenttiin omalla MAC:illa.

```bash
docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  lan_net

docker run -d --name snmp --network lan_net mysnmp:latest
```

Kontti näkyy LANissa omana laitteenaan omalla MAC-osoitteellaan. macvlan liittää konttia suoraan physical segmenttiin.

## Käytännössä

macvlan vaatii tietoisen subnet-suunnittelun — host ei voi suoraan kommunikoida macvlan-kontin kanssa ilman erillistä macvlan-shim -liittymää. Tuotannossa dokumentoi parent-interface ja varmista, ettei IP-alue päällekkäin host-verkon kanssa. IPvlan on vaihtoehto, jos MAC-osoitteita on rajattu määrä.

[Lue lisää](https://docs.docker.com/network/drivers/macvlan/)
