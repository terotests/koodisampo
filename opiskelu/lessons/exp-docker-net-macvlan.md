# Legacy-laite vaatii kontille oman MAC-osoitteen LANissa. Mikä network driver?

## Tilanne

Tehdasautomaatiossa PLC odottaa Modbus-yhteyttä tietyltä MAC-osoitteelta. Ajat protokollatestin kontissa:

```bash
docker run -d --name modbus-test mymodbus:latest
```

Switchin MAC-taulussa näkyy vain Docker-hostin MAC — kontti ei ole erillinen L2-laite. Legacy-laite hylkää yhteyden, koska se odottaa tunnistettavaa laitetta verkossa.

## Ratkaisu

**macvlan** antaa kontille oman MAC-osoitteen ja LAN-osoitteen. macvlan liittää konttia suoraan physical segmenttiin.

```bash
docker network create -d macvlan \
  --subnet=192.168.10.0/24 \
  --gateway=192.168.10.1 \
  -o parent=eth0 \
  factory_lan

docker run -d --name modbus-test --network factory_lan mymodbus:latest
```

Tarkista MAC:

```bash
docker exec modbus-test ip link show eth0
```

## Käytännössä

Tehdasverkoissa koordinoi IP-osoitteet automaation tiimin kanssa — DHCP-reservointi macvlan-kontille estää konfliktit. Dokumentoi parent-NIC (eth0 vs vlan-alaliittymä). macvlan ei toimi kaikilla pilvi-VM:illä ilman promiscuous mode -tukea.

[Lue lisää](https://docs.docker.com/network/macvlan/)
