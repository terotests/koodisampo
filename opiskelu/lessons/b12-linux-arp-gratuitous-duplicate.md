# Kaksi konetta väittää omistavansa saman IP:n — epäilet ARP-konfliktia. Nopein varmistus lähiverkossa?

## Tilanne

Palvelimelle konfiguroitiin IP `10.0.0.50`, mutta yhteys on epävakaa. Ping toimii ajoittain, ARP-taulussa outoja merkintöjä. Epäilet toista konetta samalla osoitteella.

IP-konflikti näkyy usein vasta ARP-tasolla — ping ei aina paljasta duplikaattia luotettavasti.

## Ratkaisu

```bash
arping -D -I eth0 10.0.0.50
```

`-D` (Duplicate Address Detection) lähettää **ARP-proben**, jonka lähettäjän IP on 0.0.0.0. Jos toinen laite omistaa osoitteen, se vastaa ja `-D` raportoi konfliktin. (Gratuitous ARP on eri asia: `-U`/`-A` ilmoittaa omasta osoitteesta muille.)

Vaihtoehto kaappaus:

```bash
sudo tcpdump -i eth0 arp and host 10.0.0.50
```

**ARP-probe (DAD) paljastaa duplikaatti-IP:n** lähiverkossa.

## Käytännössä

DHCP-poolin päällekkäisyys ja manuaaliset staattiset IP:t ovat yleisiä syitä. Korjaa konfiguraatio ennen kuin jatkat vianetsintää reitityksessä. dmesg voi näyttää `IPv4: martian source` tai duplicate-ilmoituksia riippuen kernelistä.

[Lue lisää](https://man7.org/linux/man-pages/man8/arping.8.html)
